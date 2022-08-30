const express = require("express");
const Book = require("../models/Book");
const Category = require("../models/Category");
const router = express.Router();

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await Category.findByIdAndDelete(id);
    const books = await Book.updateMany(
      { categories: category.id },
      { $pull: { categories: category.id } }
    );
    res.json(category);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await Category.findByIdAndUpdate(id, req.body);
    res.json(category);
  } catch (err) {
    res.status.json(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/:id/books", async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await Category.findById(id).populate("books");
    res.json(category.books);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/count", async (req, res, next) => {
  try {
    const countCategory = await Category.aggregate([
      { $group: { _id: "$name", count: { $sum: 1 } } },
    ]);
    res.json(countCategory);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
