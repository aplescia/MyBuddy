var express = require('express');
var router = express.Router();

/* GET Express Page */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Bunkr' });
});

module.exports = router;
