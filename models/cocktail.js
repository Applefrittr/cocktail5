const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CocktailSchema = new Schema({
  name: { type: String, required: true, minLength: 2, maxLength: 20 },
  liquor: { type: Schema.Types.ObjectId, ref: "Liquor" },
  description: { type: String },
  imageURL: { type: String }
});

CocktailSchema.virtual("url").get(function () {
  const name = this.name.replaceAll(" ", "-");
  return `/cocktails/${name}`;
});

module.exports = mongoose.model("Cocktail", CocktailSchema);
