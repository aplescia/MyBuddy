var express = require('express');
var router = express.Router();

/* GET Express Page */
router.get('/chat', function(req, res, next) {
  res.render('chat', { title: 'Bunkr' });
});

/* GET Express Page */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Bunkr' });
});


module.exports = router;
