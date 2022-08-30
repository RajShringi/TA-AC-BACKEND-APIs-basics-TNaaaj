const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: String,
  categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
});

module.exports = mongoose.model("Book", bookSchema);
