const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stateSchema = new Schema({
  name: { type: String, required: true, unique: true },
  country: { type: Schema.Types.ObjectId, ref: "Country", required: true },
  population: { type: Number, default: 0 },
  area: { type: Number, default: 0 },
  neighbouring_states: [{ type: Schema.Types.ObjectId, ref: "State" }],
});

module.exports = mongoose.model("State", stateSchema);
