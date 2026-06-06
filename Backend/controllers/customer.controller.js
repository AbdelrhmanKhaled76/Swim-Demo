import customerModel from "../models/customer.model.js";
import orderModel from "../models/order.model.js";
import { createCustomerValidator } from "../utils/validators.js";

const createCustomer = async (req, res, next) => {
  try {
    const { error } = createCustomerValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const customer = await customerModel.create(req.body);

    res.status(201).json({ // 201 Created
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await customerModel.find({ isActive: true });

    res.status(200).json({
      data: customers,
    });
  } catch (error) {
    next(error);
  }
};

const getCustomerById = async (req, res, next) => {
  try {
    const customer = await customerModel.findOne({ _id: req.params.id, isActive: true });

    return customer
      ? res.status(200).json({ data: customer })
      : res.status(404).json({ // 404 Not Found
          message: "customer not found",
        });
  } catch (error) {
    next(error);
  }
};

const getCustomerOrders = async (req, res, next) => {
  try {
    const orders = await orderModel
      .find({ customerId: req.params.id })
      .populate("items.itemId");

    return res.status(200).json({
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export { createCustomer, getAllCustomers, getCustomerById, getCustomerOrders };
