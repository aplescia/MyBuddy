var express = require('express');
var router = express.Router();

/* GET Express Page */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MyBuddy' });
});

/* GET home page */
router.get('/homepage', function(req,res){
    res.render('homepage', { title: 'MyBuddy'});
});

module.exports = router;
