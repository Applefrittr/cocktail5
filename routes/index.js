const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Cocktail5' });
});

// Liquor routes
router.get('/liquors', (req, res, next) => {
  res.render('liquor-list')
})


//Cocktail routes
router.get('/cocktails', (req, res, next) => {
  res.render('cocktail-list')
})
module.exports = router;
