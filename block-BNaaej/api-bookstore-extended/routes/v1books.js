const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const Category = require("../models/Category");
const Tag = require("../models/Tag");

router.post("/", async (req, res, next) => {
  try {
    categoriesArr = req.body.categories.split(",");
    tagsArr = req.body.tags.split(",");
    req.body.categories = [];
    req.body.tags = [];
    let categories = await createCategory(categoriesArr);
    let tags = await createTag(tagsArr);
    const book = await Book.create(req.body);
    await addCategoriesToBook(categories, book);
    await addTagsToBook(tags, book);
    await addBooksToCategory(categories, book);
    await addBooksToTag(tags, book);
    res.status(200).json(book);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    let filter;
    const { author } = req.query;
    if (author) {
      filter = { author };
    } else {
      filter = {};
    }
    const books = await Book.find(filter);
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
    const bookWithComments = await book.populate("comments");
    res.status(200).json(bookWithComments);
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

router.post("/:id/comments", async (req, res, next) => {
  try {
    const id = req.params.id;
    req.body.bookId = id;
    const comment = await Comment.create(req.body);
    const book = await Book.findByIdAndUpdate(id, {
      $push: { comments: comment.id },
    });
    res.status(200).json(comment);
  } catch (err) {
    res.status(400).json(err);
  }
});

const createCategory = async (categories) => {
  const allCategories = [];
  for (let category of categories) {
    let findCategory = await Category.findOne({ name: category });
    if (!findCategory) {
      let newCategory = await Category.create({ name: category });
      allCategories.push(newCategory);
    } else {
      allCategories.push(findCategory);
    }
  }
  console.log(allCategories);
  return allCategories;
};

const addCategoriesToBook = async (categories, book) => {
  for (let category of categories) {
    console.log(category.name);
    const updatedBook = await Book.findByIdAndUpdate(book.id, {
      $push: { categories: category.id },
    });
    console.log(updatedBook);
  }
};

const addBooksToCategory = async (categories, book) => {
  for (let category of categories) {
    await Category.findByIdAndUpdate(category.id, {
      $push: { books: book.id },
    });
  }
};

const createTag = async (tags) => {
  const allTags = [];
  for (let tag of tags) {
    let findTag = await Tag.findOne({ name: tag });
    if (!findTag) {
      let newTag = await Tag.create({ name: tag });
      allTags.push(newTag);
    } else {
      allTags.push(findTag);
    }
  }
  return allTags;
};

const addTagsToBook = async (tags, book) => {
  for (let tag of tags) {
    const updatedBook = await Book.findByIdAndUpdate(book.id, {
      $push: { tags: tag.id },
    });
    console.log(updatedBook);
  }
};

const addBooksToTag = async (tags, book) => {
  for (let tag of tags) {
    await Tag.findByIdAndUpdate(tag.id, {
      $push: { books: book.id },
    });
  }
};

module.exports = router;
