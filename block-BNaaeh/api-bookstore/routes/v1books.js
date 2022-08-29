const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

router.post("/", async (req, res, next) => {
  try {
    const book = await Book.create(req.body);
    if (!book) {
      throw new Error("no book was created");
    }
    res.status(200).json(book);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const books = await Book.find({});
    if (!books) {
      throw new Error("there are no books");
    }
    res.status(200).send(books);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const book = await Book.findById(id);
    res.status(200).json(book);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const book = await Book.findByIdAndUpdate(id, req.body);
    res.status(200).json(book);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const book = await Book.findByIdAndDelete(id);
    res.status(200).json(book);
  } catch (err) {
    res.status(400).json(err);
  }
});
module.exports = router;
