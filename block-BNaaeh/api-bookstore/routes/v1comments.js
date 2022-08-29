const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const Book = require("../models/Book");

router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const comment = await Comment.findByIdAndUpdate(id, req.body);
    res.status(200).json(comment);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const comment = await Comment.findByIdAndDelete(id);
    const book = await Book.findByIdAndUpdate(comment.bookId, {
      $pull: { comments: id },
    });
    res.status(200).json(comment);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
