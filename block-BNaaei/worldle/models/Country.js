const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const countrySchema = new Schema({
  name: { type: String, required: true },
  states: [{ type: Schema.Types.ObjectId, ref: "State" }],
  continent: String,
  population: { type: Number, default: 0 },
  ethnicity: String,
  neighbouring_countires: [{ type: Schema.Types.ObjectId, ref: "Country" }],
  area: String,
});

module.exports = mongoose.model("Country", countrySchema);
