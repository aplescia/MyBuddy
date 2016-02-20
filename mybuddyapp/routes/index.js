var express = require('express');
var router = express.Router();

/* GET Express Page */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page */
router.get('/homepage', function(req,res){
    res.render('homepage', { title: 'Homepage'});
});

module.exports = router;
