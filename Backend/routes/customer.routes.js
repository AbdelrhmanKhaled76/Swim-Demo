import express from "express";
import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  getCustomerOrders,
} from "../controllers/customer.controller.js";

const customerRouter = express.Router();

customerRouter.post("/", createCustomer);
customerRouter.get("/", getAllCustomers);
customerRouter.get("/:id", getCustomerById);
customerRouter.get("/customer-orders/:id", getCustomerOrders);

export default customerRouter;
