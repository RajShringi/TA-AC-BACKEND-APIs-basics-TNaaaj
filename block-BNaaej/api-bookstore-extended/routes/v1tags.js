const express = require("express");
const Tag = require("../models/Tag");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { sort } = req.query;
    const tags = await Tag.find({}).sort({ name: sort });
    res.json(tags);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/:id/books", async (req, res, next) => {
  try {
    const id = req.params.id;
    const tag = await Tag.findById(id);
    const thisTagBooks = await tag.populate("books");
    res.json(thisTagBooks.books);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/count", async (req, res, next) => {
  try {
    let eachTagBooks = await Tag.aggregate([
      { $unwind: "$books" },
      { $group: { _id: "$name", noOfBooks: { $sum: 1 } } },
    ]);
    console.log(eachTagBooks);
    res.json(eachTagBooks);
  } catch (err) {
    res.status(400).json(err);
  }
});
module.exports = router;
