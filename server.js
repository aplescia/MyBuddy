
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var User = new Schema({
    Name: ObjectId,
    Age: Number,
    Destination: String,
    DateRange: { type: Date, default: Date.now },
    PriceRange:Number
});

module.exports = mongoose.model('Post', postSchema);


var http = require('http')
var port = process.env.PORT || 1337;
http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello Azuregreahgr\n');
}).listen(port);
