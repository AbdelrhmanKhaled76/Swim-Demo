import customerModel from "../models/customer.model.js";
import orderModel from "../models/order.model.js";

const createCustomer = async (req, res) => {
  try {
    const customer = await customerModel.create(req.body);

    res.status(201).json({ // 201 Created
      data: customer,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const customers = await customerModel.find();

    res.status(200).json({
      data: customers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const customer = await customerModel.findById(req.params.id);

    return customer
      ? res.status(200).json({ data: customer })
      : res.status(404).json({ // 404 Not Found
          message: "customer not found",
        });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getCustomerOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ customerId: req.params.id })
      .populate("items.itemId");

    return res.status(200).json({
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export { createCustomer, getAllCustomers, getCustomerById, getCustomerOrders };
