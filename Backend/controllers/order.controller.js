import orderModel from "../models/order.model.js";

const createOrder = async (req, res) => {
  try {
    const order = await orderModel.create(req.body);

    res.status(200).json({ data: order });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
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
      : res.status(400).json({ message: "order not found" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export { createOrder, getAllOrders, getOrderById };
