import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
} from "../controllers/order.controller.js";

const orderRouter = express.Router();

orderRouter.post("/", createOrder);
orderRouter.get("/", getAllOrders);
orderRouter.get("/:id", getOrderById);

export default orderRouter;
