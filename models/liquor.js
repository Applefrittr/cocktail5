const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const LiquorSchema = new Schema({
  name: { type: String, required: true, minLength: 2, maxLength: 20 },
  drinks: [{ type: Schema.Types.ObjectId, ref: "Cocktail" }],
});

LiquorSchema.virtual("url").get(function () {
  return `/liquors/${this.name}`;
});

module.exports = mongoose.model("Liquor", LiquorSchema);
