import orderModel from "../models/order.model.js";
import { createOrderValidator } from "../utils/validators.js";

const createOrder = async (req, res, next) => {
  try {
    const { error } = createOrderValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const order = await orderModel.create(req.body);

    res.status(201).json({ data: order }); // 201 Created
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderModel
      .find()
      .populate("customerId")
      .populate("storeId")
      .populate("items.itemId");

    res.status(200).json({ data: orders });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
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
    next(error);
  }
};

export { createOrder, getAllOrders, getOrderById };
