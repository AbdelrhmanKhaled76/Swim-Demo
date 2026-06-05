import orderModel from "../models/order.model.js";

const createOrder = async (req, res) => {
  try {
    const order = await orderModel.create(req.body);

    res.status(201).json({ data: order }); // 201 Created
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const storeId = req.params.id;
    const orders = await orderModel
      .find({ storeId })
      .populate("customerId")
      .populate("storeId")
      .populate("items.itemId");

    res.status(200).json({ data: orders });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await orderModel
      .findById(req.params.id)
      .populate("customerId")
      .populate("storeId")
      .populate("items.itemId");

    return order
      ? res.status(200).json({ data: order })
      : res.status(404).json({ message: "order not found" }); // 404 Not Found
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export { createOrder, getAllOrders, getOrderById };
