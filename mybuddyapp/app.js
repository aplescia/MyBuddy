// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


mongoose.connect('mongodb://localhost/test');
// // create a schema
var userSchema = new Schema({
  name: String,
  email: String,
  destination: String,   
  datein: Date,
   dateout: Date,
   price: Number,
   numberofpeople: Number,
 });


 var User = mongoose.model('User', userSchema);

// module.exports = User;

var http = require('http');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request'); //request package

var routes = require('./routes/index');
var users = require('./routes/users');
var geocoder = require('./routes/geocoder')

var app = express();
var nodemailer = require('nodemailer');
// view engine setup


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade'); //tells app to use Jade to render its views



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/geocoder', geocoder);


app.post('/signup', function(request, response){
  var user = new User({
    name: request.body.name,
    email: request.body.email,
    destination: request.body.destination,     
    datein: request.body.datein,
   dateout: request.body.dateout,
     price: request.body.price,
     numberofpeople: request.body.numberofpeople,
   });
   console.log(request.body);
     user.save(function(err){
      if (err) throw err;
      console.log('User saved successfully!');
    });
   User.find({ destination: request.body.destination,
     datein: request.body.datein,numberofpeople: request.body.numberofpeople,
     }, function(err, thor) {
      console.log('User matched!');
      var email = ""
      for (var i=0;i<thor.length;i++){
        if (i==0){
          email+= ""+thor[i].email;
        }else{
          email+= ", "+thor[i].email
        }
      }
      if(thor.length<=1){
        sendemail(email,thor.length,request.body.name,false); 
        var redirectlink = 'http://localhost:3000/nomatch/';
        response.redirect(redirectlink);
      } else{
        sendemail(email,thor.length,request.body.name,true); 
        var redirectlink = 'http://localhost:3000/chat/';
        redirectlink += request.body.name;
        response.redirect(redirectlink);
      }   
     console.log(email);
   });
 });

app.get('/nomatch', function(request, response) {
  response.send("Nomatch");
});
app.get('/chat/:id', function(request, response) {
  response.render('Chat', { title: 'Bunkr',id:request.params.id });
});

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "lam.uong1@gmail.com",
         pass: "Bach95ancut"
     }
 });

function sendemail(email,nofpeople,name,boolean){
  if(boolean){
      var body = "<b>Hi!, We have found ";
    body += nofpeople;
    body += " people with the same preference as you.";
    body +=" Please click on this link to active your";
    body +="chat session <a href=http://localhost:3000/chat/";
    body +=name;
    body +=">Link to Chat </a></b>";
  }else{
    var body = "<b>Hi!, Right now we are unable to match you with anyone." ;
    body+="We will contact you as soon as we find a good match!</b>";
  }
  
 var mailOptions = {
     from: "lam.uong1@gmail.com", // sender address
     to: email, // list of receivers
     subject: "Bunkr: People matching your preference", // Subject line
     text: "Testnewapp", // plaintext body
     html: body, // html body
 }

 smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
         console.log(error);
     }else{
         console.log("Message sent: " + response.message);
     }
 });
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
