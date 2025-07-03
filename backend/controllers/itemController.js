import itemModel from "../models/itemModel.js";

export const createItem = async (req, res, next) => {
  try {
    const { name, description, category, price, rating, hearts } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const total = Number(price) * 1;

    const newItem = new itemModel({
      name,
      description,
      category,
      price,
      rating,
      hearts,
      imageUrl,
      total,
    });

    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Item name already exists" });
    }
  }
};

//GET FUNCTION TO GET ALL ITEMS

export const getItems = async (_req, res, next) => {
  try {
    const items = await itemModel.find().sort({ createdAt: -1 });
    const host = `${_req.protocol}://${_req.get("host")}`;

    const withFullUrl = items.map((i) => ({
      ...i.toObject(),
      imageUrl: i.imageUrl ? host + i.imageUrl : "",
    }));
    res.json(withFullUrl);
  } catch (error) {
    next(error);
  }
};

//DELETE FUNCTION TO DELETE ITEMS
export const deleteItem = async (req, res, next) => {
  try {
    const removed = await itemModel.findByIdAndDelete(req.params.id);
    if (!removed) {
      return res.status(404).json({ message: "Item not found" });
    } else {
      res.status(204).end();
    }
  } catch (error) {
    next(error);
  }
};
