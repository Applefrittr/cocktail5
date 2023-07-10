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
  body("description", "Liquor must contain a description")
    .trim()
    .isLength({ min: 1 })
    .escape(),
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

exports.liquor_delete_get = asyncHandler(async (req, res, next) => {
  const liquor = await Liquor.findOne({
    name: req.params.name,
  })
    .populate("drinks")
    .exec();

  res.render("liquor-delete", { liquor });
});

exports.liquor_delete_post = asyncHandler(async (req, res, next) => {
  await Liquor.findByIdAndRemove(req.body.id);

  res.redirect("/liquors");
});

exports.liquor_update_get = asyncHandler(async (req, res, next) => {
  const liquor = await Liquor.findOne({ name: req.params.name }).exec();

  res.render("liquor-update", { liquor });
});

exports.liquor_update_post = [
  body("name", "Liquor name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description", "Liquor must contain a description")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const liquor = await Liquor.findOne({ name: req.params.name }).exec();

    if (!errors.isEmpty()) {
      res.render("liquor-update", {
        liquor,
        errors: errors.array(),
      });
      return;
    } else {
      liquor.name = req.body.name;
      liquor.description = req.body.description;
      await liquor.save();
      res.redirect(liquor.url);
    }
  }),
];
