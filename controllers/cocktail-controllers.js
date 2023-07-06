const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Liquor = require("../models/liquor");
const Cocktail = require("../models/cocktail");

exports.cocktail_list = asyncHandler(async (req, res, next) => {
  const cocktails = await Cocktail.find().populate("liquor").exec();

  res.render("cocktail-list", { cocktails });
});

exports.cocktail_detail = asyncHandler(async (req, res, next) => {
  const nameFix = req.params.name.replaceAll("-", " ");
  const cocktail = await Cocktail.findOne({ name: nameFix })
    .populate("liquor")
    .exec();
  res.render("cocktail-detail", { cocktail });
});

exports.cocktail_create_get = asyncHandler(async (req, res, next) => {
  const liquors = await Liquor.find().exec();

  res.render("cocktail-create", { liquors });
});

exports.cocktail_create_post = [
  body("name", "Cocktail name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("base").escape(),
  body("description").trim().escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const cocktail = new Cocktail({
      name: req.body.name,
      liquor: req.body.base,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      const liquors = await Liquor.find().exec();

      res.render("cocktail-create", {
        liquors,
        cocktail,
        errors: errors.array(),
      });
    } else {
      const cocktailExists = await Cocktail.findOne({
        name: req.body.name,
      }).exec();

      if (cocktailExists) res.redirect(cocktailExists.url);
      else {
        await cocktail.save();
        const liquor = await Liquor.findById(req.body.base).exec();
        console.log(req.body.base, liquor);
        liquor.drinks.push(cocktail._id);
        await liquor.save();
        res.redirect("/cocktails");
      }
    }
  }),
];
