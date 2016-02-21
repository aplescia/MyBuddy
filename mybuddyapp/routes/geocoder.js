var express = require('express');
var _ = require('lodash');
var request = require('request');
var router = express.Router();
var  apiURL = "https://maps.googleapis.com/maps/api/geocode/json?address";
var apiKey = "AIzaSyD4MWJaPnCAoFbuNFerKLkGNH92gUe4Dbo";
var resultsHelper = require('./results');
/* GET users listing. */
router.get('/', function(req, res, next) {
    var userLoc = req.query.location;
    if(_.isEmpty(userLoc)){
    // Not supposed to happen!
    res.sendStatus(400);
    return;
    }
    var apiCallURL = makeApiURL(userLoc);
    //res.send(apiCallURL);
    request.get(apiCallURL,function(error,response,body){
        if (!error && response.statusCode == 200) {
          var results = JSON.parse(body).results;
          if(results.length == 0){
            res.send(400);
            return;
          }
          // Get location information of first result only
          var topResult = results[0];
          var address = topResult.formatted_address;
          var geoLoc = topResult.geometry.location;
          var result = {};
          result.address = address;
          result.location = geoLoc;
          resultsHelper(geoLoc.lat, geoLoc.lng,res);

        }
        else{
          res.sendStatus(400);
        }
    });
});
var makeApiURL = function(location){
  var URL = apiURL+"="+location+"&key="+apiKey;
  return URL;

};
module.exports = router;
