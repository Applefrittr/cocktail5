const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const LiquorSchema = new Schema({
  name: { type: String, required: true, minLength: 2, maxLength: 20 },
  drinks: [{ type: Schema.Types.ObjectId, ref: "Cocktail" }],
  description: { type: String, minLength: 5, maxLength: 200 }
});

LiquorSchema.virtual("url").get(function () {
  return `/liquors/${this.name}`;
});

module.exports = mongoose.model("Liquor", LiquorSchema);
