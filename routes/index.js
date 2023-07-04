const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("home", { title: "Cocktail5" });
});

// Liquor routes
router.get(
  "/liquors",
  asyncHandler(async (req, res, next) => {
    res.render("liquor-list");
  })
);

router.get(
  "/liquors/create",
  asyncHandler(async (req, res, next) => {
    res.render("liquor-create");
  })
);

router.post(
  "/liquors/create",
  asyncHandler(async (req, res, next) => {
    res.render("liquor-create");
  })
);

// Cocktail routes
router.get(
  "/cocktails",
  asyncHandler(async (req, res, next) => {
    res.render("cocktail-list");
  })
);

router.get(
  "/cocktails/create",
  asyncHandler(async (req, res, next) => {
    res.render("cocktail-create");
  })
);

router.post(
  "/cocktails/create",
  asyncHandler(async (req, res, next) => {
    res.render("cocktail-create");
  })
);
module.exports = router;
