const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");

const liquor_controller = require("../controllers/liquor-controllers");
const cocktail_controller = require("../controllers/cocktail-controllers");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("home", { title: "Cocktail5" });
});

// Liquor routes
router.get("/liquors", liquor_controller.liquor_list);

router.get("/liquors/create", liquor_controller.liquor_create_get);

router.post("/liquors/create", liquor_controller.liquor_create_post);

// Cocktail routes
router.get("/cocktails", cocktail_controller.cocktail_list);

router.get("/cocktails/create", cocktail_controller.cocktail_create_get);

router.post("/cocktails/create", cocktail_controller.cocktail_create_post);

module.exports = router;
