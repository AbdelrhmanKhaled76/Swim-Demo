import itemModel from "../models/item.model.js";

const createItem = async (req, res) => {
  try {
    const item = await itemModel.create(req.body);
    res.status(200).json({ data: item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllItems = async (req, res) => {
  try {
    const items = await itemModel.find();
    res.status(200).json({ data: items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getItemById = async (req, res) => {
  try {
    const item = await itemModel.findById(req.params.id);

    return item
      ? res.status(200).json({ data: item })
      : res.status(400).json({ message: "item not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const item = await itemModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      data: item,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    await itemModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "item deleted succesffully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createItem, getAllItems, getItemById, updateItem, deleteItem };
