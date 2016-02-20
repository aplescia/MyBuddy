
//Set up request variable
var request = require('request');

request('http://mybuddy.azurewebsites.net', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body)
  }
})