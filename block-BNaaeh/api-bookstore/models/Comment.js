const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: { type: String, required: true },
  author: String,
  bookId: { type: Schema.Types.ObjectId, ref: "Book" },
});

module.exports = mongoose.model("Comment", commentSchema);
