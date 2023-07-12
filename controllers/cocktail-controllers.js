const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Liquor = require("../models/liquor");
const Cocktail = require("../models/cocktail");
const adminPassword = require("../admin");
const multer = require("multer");
const upload = multer({ dest: "./public/images" });
const helpers = require("../public/javascripts/functions");

exports.cocktail_list = asyncHandler(async (req, res, next) => {
  const cocktails = await Cocktail.find().populate("liquor").exec();

  res.render("cocktail-list", { cocktails, title: "Cocktail List" });
});

exports.cocktail_detail = asyncHandler(async (req, res, next) => {
  const nameFix = req.params.name.replaceAll("-", " ");
  const cocktail = await Cocktail.findOne({ name: nameFix })
    .populate("liquor")
    .exec();
  res.render("cocktail-detail", { cocktail, title: `${nameFix} Detail` });
});

exports.cocktail_create_get = asyncHandler(async (req, res, next) => {
  const liquors = await Liquor.find().exec();

  res.render("cocktail-create", { liquors, title: "Create Cocktail" });
});

exports.cocktail_create_post = [
  upload.single("image"),
  body("name", "Cocktail name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("base").escape(),
  body("description").trim().escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    console.log(req.body, req.file);
    const cocktail = new Cocktail({
      name: req.body.name,
      liquor: req.body.base,
      description: req.body.description,
      imageURL: `/images/${req.file.filename}`,
    });

    console.log(cocktail);

    // From validation fails
    if (!errors.isEmpty()) {
      const liquors = await Liquor.find().exec();
      helpers.deleteFile(req.file.path); // Call deleteFile helper function to delete uploaded image
      res.render("cocktail-create", {
        liquors,
        cocktail,
        errors: errors.array(),
        title: "Create Cocktail",
      });
    } else {
      const cocktailExists = await Cocktail.findOne({
        name: req.body.name,
      }).exec();

      if (cocktailExists) {
        helpers.deleteFile(req.file.path);
        res.redirect(cocktailExists.url);
      }
      else {
        await cocktail.save();
        const liquor = await Liquor.findById(req.body.base).exec();
        liquor.drinks.push(cocktail._id);
        await liquor.save();
        res.redirect("/cocktails");
      }
    }
  }),
];

exports.cocktail_delete_get = asyncHandler(async (req, res, next) => {
  const nameFix = req.params.name.replaceAll("-", " ");
  const cocktail = await Cocktail.findOne({
    name: nameFix,
  }).exec();

  res.render("cocktail-delete", { cocktail, title: `Delete ${nameFix}` });
});

exports.cocktail_delete_post = asyncHandler(async (req, res, next) => {
  if (req.body.password != adminPassword) {
    const nameFix = req.params.name.replaceAll("-", " ");
    const cocktail = await Cocktail.findOne({
      name: nameFix,
    }).exec();
    res.render("cocktail-delete", { cocktail, error: "Incorrect Password" });
  } else {
    const removed = await Cocktail.findByIdAndRemove(req.body.id);
    helpers.deleteFile(`public${removed.imageURL}`) // delete removed cocktail's image from server
    res.redirect("/cocktails");
  }
});

exports.cocktail_update_get = asyncHandler(async (req, res, next) => {
  const nameFix = req.params.name.replaceAll("-", " ");
  const cocktail = await Cocktail.findOne({ name: nameFix })
    .populate("liquor")
    .exec();
  const liquors = await Liquor.find().exec();

  res.render("cocktail-update", {
    cocktail,
    liquors,
    title: `Update ${nameFix}`,
  });
});

exports.cocktail_update_post = [
  body("name", "Cocktail name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description", "Cocktail must contain a description")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const nameFix = req.params.name.replaceAll("-", " ");
    const cocktail = await Cocktail.findOne({ name: nameFix }).exec();

    const liquors = await Liquor.find().exec();

    if (!errors.isEmpty()) {
      res.render("cocktail-update", {
        cocktail,
        errors: errors.array(),
        liquors,
      });
      return;
    } else if (req.body.password != adminPassword) {
      res.render("cocktail-update", {
        cocktail,
        password: "Incorrect Password",
        liquors,
      });
      return;
    } else {
      cocktail.name = req.body.name;
      cocktail.description = req.body.description;
      await cocktail.save();
      res.redirect(cocktail.url);
    }
  }),
];
