const express = require("express");
const router = express.Router();
const path = require('path');

const liquor_controller = require("../controllers/liquor-controllers");
const cocktail_controller = require("../controllers/cocktail-controllers");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("home", { title: "Cocktail5" });
});

// router.get("/images/:path", (req, res, next) => {
//   res.sendFile(path.join(__dirname, '..', 'public', 'images', 'bar.jpg'))
// })

// Liquor routes
router.get("/liquors", liquor_controller.liquor_list);

router.get("/liquors/create", liquor_controller.liquor_create_get);

router.post("/liquors/create", liquor_controller.liquor_create_post);

router.get("/liquors/:name", liquor_controller.liquor_detail);

router.get("/liquors/:name/delete", liquor_controller.liquor_delete_get);

router.post("/liquors/:name/delete", liquor_controller.liquor_delete_post);

router.get("/liquors/:name/update", liquor_controller.liquor_update_get);

router.post("/liquors/:name/update", liquor_controller.liquor_update_post);

// Cocktail routes
router.get("/cocktails", cocktail_controller.cocktail_list);

router.get("/cocktails/create", cocktail_controller.cocktail_create_get);

router.post("/cocktails/create", cocktail_controller.cocktail_create_post);

router.get("/cocktails/:name", cocktail_controller.cocktail_detail);

router.get("/cocktails/:name/delete", cocktail_controller.cocktail_delete_get);

router.post(
  "/cocktails/:name/delete",
  cocktail_controller.cocktail_delete_post
);

router.get("/cocktails/:name/update", cocktail_controller.cocktail_update_get);

router.post(
  "/cocktails/:name/update",
  cocktail_controller.cocktail_update_post
);

// router.get("/public/images/:path", (req, res, next) => {
//   console.log("requesting image");
//   res.sendFile(`public/images/bar.jpg`);
//   res.end();
// });
module.exports = router;
