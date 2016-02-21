var request = require('request')
var underScore = require('underscore');
var hotels = [];


function getJSON(latitudeCoordinates, longitudeCoordinates) {
    var tripAdvisorURL = 'http://api.tripadvisor.com/api/partner/2.0/map/' + latitudeCoordinates + longitudeCoordinates + '/hotels?key=33C9422BFBA246AE8D4A81AD08919253';
    request(tripAdvisorURL  , function(error,response,body){
        if (!error && response.statusCode == 200){
            hotels = _.max(body,function(rank){
                return parseInt(body.ranking_data.ranking);
            });
        }
    });
}
