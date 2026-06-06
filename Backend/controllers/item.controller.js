import itemModel from "../models/item.model.js";
import { createItemValidator } from "../utils/validators.js";

const createItem = async (req, res, next) => {
  try {
    const { error } = createItemValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const item = await itemModel.create(req.body);
    res.status(201).json({ data: item }); // 201 Created
  } catch (error) {
    next(error);
  }
};

const getAllItems = async (req, res, next) => {
  try {
    const items = await itemModel.find({ isActive: true });
    res.status(200).json({ data: items });
  } catch (error) {
    next(error);
  }
};

const getItemById = async (req, res, next) => {
  try {
    const item = await itemModel.findOne({ _id: req.params.id, isActive: true });

    return item
      ? res.status(200).json({ data: item })
      : res.status(404).json({ message: "item not found" }); // 404 Not Found
  } catch (error) {
    next(error);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const item = await itemModel.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      req.body,
      { new: true, runValidators: true }
    );

    return item
      ? res.status(200).json({ data: item })
      : res.status(404).json({ message: "item not found" });
  } catch (error) {
    next(error);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    // Soft-delete: set isActive=false to preserve ObjectId references in orders/inventory
    const item = await itemModel.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    return item
      ? res.status(200).json({ message: "Item deactivated successfully" })
      : res.status(404).json({ message: "item not found" });
  } catch (error) {
    next(error);
  }
};

export { createItem, getAllItems, getItemById, updateItem, deleteItem };
