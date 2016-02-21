/*
Requires
*/
var express = require('express');
var request = require('request');
var geocoder = require('./geocoder')
var _ = require('underscore');

var router = express.Router();

/*GET results*/
function getJSON(latitudeCoordinates, longitudeCoordinates) {
    var tripAdvisorURL = 'http://api.tripadvisor.com/api/partner/2.0/map/' + latitudeCoordinates + ',' + longitudeCoordinates + '/hotels?key=33C9422BFBA246AE8D4A81AD08919253';
    console.log(tripAdvisorURL);
    request(tripAdvisorURL  , function(error,response,body){
        if (!error && response.statusCode == 200){
            var results = JSON.parse(body);
            var hotels = _.min(results.data, function(location) {
                var rankingData = location.ranking_data;
                if (!rankingData) {
                    return 999999999
                } else {
                    return parseInt(rankingData.ranking);
                }
            });
            console.log(hotels);
            return hotels;
        }
    });
}

module.exports = router;