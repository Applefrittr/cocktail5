const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Liquor = require("../models/liquor");

exports.liquor_list = asyncHandler(async (req, res, next) => {
  const liquors = await Liquor.find().populate("drinks").exec();

  res.render("liquor-list", { liquors });
});

exports.liquor_detail = asyncHandler(async (req, res, next) => {
  const liquor = await Liquor.findOne({ name: req.params.name })
    .populate("drinks")
    .exec();
  res.render("liquor-detail", { liquor });
});

exports.liquor_create_get = asyncHandler(async (req, res, next) => {
  res.render("liquor-create");
});

exports.liquor_create_post = [
  body("name", "Liquor name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description").trim().escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const liquor = new Liquor({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      res.render("liquor-create", {
        liquor,
        errors: errors.array(),
      });
      return;
    } else {
      const liquorExists = await Liquor.findOne({ name: req.body.name }).exec();

      if (liquorExists) res.redirect(liquorExists.url);
      else {
        await liquor.save();
        res.redirect("/liquors");
      }
    }
  }),
];
