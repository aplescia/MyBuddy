// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/test');
// create a schema
var userSchema = new Schema({
  matched: Boolean,
  name: String,
  email: String,
  destination: String,
  datein: Date,
  dateout: Date,
})

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;


var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request'); //request package

var routes = require('./routes/index');
var users = require('./routes/users');
var geocoder = require('./routes/geocoder');
var nodemailer = require('nodemailer');
var app = express();

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
    matched: false,
  });

  var userdatelength = Math.ceil(Math.abs(user.dateout.getTime() - user.datein.getTime())/(1000 * 3600 * 24));
  var dateincheck = false;
  var datoutcheck = false;
  User.find({ destination: request.body.destination,
     datein: {'$gte': user.datein}, matched: false,
     }, function(err, matchedusers) {
      var matcheduser = null;
       for(var j = 0; j < matchedusers.length; j++){
        console.log(matchedusers[j]);
       }
       for (var j = 0; j < matchedusers.length; j++){
          matcheduser = matchedusers[j];
          var matcheddatelength = Math.ceil(Math.abs(matcheduser.dateout.getTime() - matcheduser.datein.getTime())/(1000 * 3600 * 24));
          var overlap = 0;
          if(matcheduser.dateout < user.dateout){
            overlap = matcheddatelength;
          } else{
            overlap = Math.ceil(Math.abs(user.dateout.getTime() - matcheduser.datein.getTime())/(1000 * 3600 * 24));
          }
          if(overlap/userdatelength > 0.7 && overlap/matcheddatelength > 0.7){
            matcheduser = matchedusers[j];
            console.log(matchedusers[j].matched);
            matcheduser.matched = true;
            matcheduser.save(function(err){
               if (err) throw err;
               console.log('Matcheduser saved successfully!');
             });
            break;
          }
          matcheduser = null;
       }
       if(!(matcheduser == null)){
          dateincheck = true;
          sendemail(user.email + matcheduser.email,2,request.body.name,true); 
          var redirectlink = 'http://localhost:3000/chat/';
          redirectlink += request.body.name;
          response.redirect(redirectlink);
          user.matched = true;
          user.save(function(err){
             if (err) throw err;
             console.log(user);
             console.log('tttttUser saved successfully!');
           });
       } else{
         User.find({ destination: request.body.destination,
         dateout: {'$lte': user.dateout}, matched: false,
         }, function(err, matchedusers) {
          var matcheduser = null;
           for(var j = 0; j < matchedusers.length; j++){
            console.log(matchedusers[j]);
           }
           for (var j = 0; j < matchedusers.length; j++){
              matcheduser = matchedusers[j];
              var matcheddatelength = Math.ceil(Math.abs(matcheduser.dateout.getTime() - matcheduser.datein.getTime())/(1000 * 3600 * 24));
              var overlap = 0;
              if(matcheduser.datein > user.datein){
                overlap = matcheddatelength;
              } else{
                overlap = Math.ceil(Math.abs(matcheduser.dateout.getTime() - user.datein.getTime())/(1000 * 3600 * 24));
              }
              if(overlap/userdatelength > 0.7 && overlap/matcheddatelength > 0.7){
                matcheduser = matchedusers[j];
                console.log(matchedusers[j].matched);
                matcheduser.matched = true;
                matcheduser.save(function(err){
                   if (err) throw err;
                   console.log('Matcheduser saved successfully!');
                 });
                break;
              }
              matcheduser = null;
           }
           if(matcheduser == null){
              sendemail(user.email,1,request.body.name,false); 
              var redirectlink = 'http://localhost:3000/nomatch/';
              response.redirect(redirectlink);
              user.save(function(err){
                 if (err) throw err;
                 console.log(user);
                 //console.log('ffffUser saved successfully!');
               });
           } else{
              sendemail(user.email + matcheduser.email,2,request.body.name,true); 
              var redirectlink = 'http://localhost:3000/chat/';
              redirectlink += request.body.name;
              response.redirect(redirectlink);
              user.matched = true;
              user.save(function(err){
                 if (err) throw err;
                 console.log(user);
                 console.log('tttttUser saved successfully!');
               });
           }
         });
       }
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
