var request = require('request')
var _ = require('underscore');


function getJSON(latitudeCoordinates, longitudeCoordinates) {
    var tripAdvisorURL = 'http://api.tripadvisor.com/api/partner/2.0/map/' + '42.33141,-71.099396' + '/hotels?key=33C9422BFBA246AE8D4A81AD08919253';
    console.log(tripAdvisorURL);
    request(tripAdvisorURL  , function(error,response,body){
        if (!error && response.statusCode == 200){
            //console.log(body);
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

console.log(getJSON('45.1','71.1'));

