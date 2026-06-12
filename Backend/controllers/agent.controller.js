import { GoogleGenerativeAI } from "@google/generative-ai";
import StockRequest from "../models/stockRequest.model.js";
import Location from "../models/location.model.js";
import Inventory from "../models/inventory.model.js";

const handleAgentChat = async (req, res, next) => {
  try {
    const { prompt, message } = req.body;
    const input = prompt || message;
    if (!input) {
      return res.status(400).json({ message: "Prompt or message is required" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent(input);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({
      data: text,
    });
  } catch (error) {
    next(error);
  }
};

const handleProcessRequest = async (req, res, next) => {
  try {
    const {
      currentStoreId,
      currentStoreName,
      sourceWarehouseId,
      sourceWarehouseName,
      itemId,
      itemName,
      requestedQuantity
    } = req.body;

    if (!currentStoreId || !sourceWarehouseId || !itemId || !itemName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const warehouseInv = await Inventory.findOne({
      locationId: sourceWarehouseId,
      itemId: itemId
    });
    const warehouseQuantity = warehouseInv ? warehouseInv.quantity : 0;

  const prompt = `
You are a professional inventory and logistics AI.

Store: ${currentStoreName}
Warehouse: ${sourceWarehouseName} (Available Stock: ${warehouseQuantity})
Item: ${itemName}

Your tasks:
1. Estimate the required quantity for this item based on typical store inventory needs. The quantity MUST NOT exceed the available stock of ${warehouseQuantity} in the warehouse. If the available stock is 0, request 0.
2. Write a logistics note not exceeding 50 words.

Respond ONLY as valid JSON:

{
  "quantity": 0,
  "notes": ""
}

Rules:
- quantity must be a non-negative integer and must not exceed ${warehouseQuantity}.
- notes must be less than 50 words.
- No extra text outside JSON.
`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const models = [
      "gemini-2.5-flash",
      "gemini-1.5-flash-latest",
      "gemini-flash-latest",
      "gemini-1.5-flash"
    ];
    let textResponse = "";
    let lastError = null;

    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: "application/json"
          }
        });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        textResponse = response.text();
        if (textResponse) {
          break;
        }
      } catch (err) {
        lastError = err;
      }
    }

    if (!textResponse) {
      throw lastError || new Error("All Gemini models failed to generate content.");
    }

    let aiParsedData = { quantity: 10, notes: "Automated request created by Gemini Agent." };
    try {
      const parsed = JSON.parse(textResponse);
      if (parsed && typeof parsed === "object") {
        aiParsedData = parsed;
      }
    } catch (e) {
      aiParsedData = { notes: textResponse };
    }

    let quantityToRequest = 10;
    if (aiParsedData && typeof aiParsedData.quantity === "number") {
      quantityToRequest = aiParsedData.quantity;
    } else if (requestedQuantity !== undefined) {
      quantityToRequest = Number(requestedQuantity);
    }

    const stockRequest = await StockRequest.create({
      storeId: currentStoreId,
      warehouseId: sourceWarehouseId,
      requestedBy: req.user._id,
      organizationId: req.user.organizationID,
      items: [{ itemId: itemId, quantity: quantityToRequest }],
      notes: aiParsedData.notes || "Automated request created by Gemini Agent.",
      status: "pending",
    });

    const populated = await stockRequest.populate([
      { path: "storeId", select: "name type" },
      { path: "warehouseId", select: "name type" },
      { path: "requestedBy", select: "fullName email" },
      { path: "items.itemId", select: "name category price" }
    ]);

    // Emit real-time notification via Socket.io
    const io = req.app.get('socketio');
    if (io) {
      io.to(`org_${req.user.organizationID}`).emit('new_stock_request', populated);
    }

    return res.status(201).json({
      success: true,
      message: `Requested ${quantityToRequest} units of ${itemName.toUpperCase()}!`,
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

export { handleAgentChat, handleProcessRequest };