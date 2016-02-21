// grab the things we need
/*var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/test');
// create a schema
var userSchema = new Schema({
  name: String,
  email: String,
  destination: String,
  datein: Date,
  dateout: Date,
  price: Number,
  numberofpeople: Number,
});

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;

// create a new user called chris
/*var chris = new User({
  name: 'Chris',
  username: 'sevilayha',
  password: 'password' 
});

chris.save(function(err) {
  if (err) throw err;

  console.log('User saved successfully!');
});
*/
/*User.findOne({ name: 'Chris' }, function(err, thor) {
  thor.remove();
  console.log(thor);
});*/

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request'); //request package

var routes = require('./routes/index');
var users = require('./routes/users');

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


/*app.post('/signup', function(request, response){
  var user = new User({
    name: request.body.name,
    email: request.body.email,
    destination: request.body.destination,
    datein: request.body.date[0],
    dateout: request.body.date[1],
    price: request.body.price,
    numberofpeople: request.body.numberofpeople,
  });
  console.log(request.body);
    user.save(function(err){
     if (err) throw err;
     console.log('User saved successfully!');
   });
  User.find({ destination: request.body.destination,
    datein: request.body.date[0],numberofpeople: request.body.numberofpeople,
    }, function(err, thor) {
    console.log(thor);
  });
});*/

// var mailer = require("nodemailer");

// // Use Smtp Protocol to send Email
// var smtpTransport = mailer.createTransport("SMTP",{
//     service: "Gmail",
//     auth: {
//         user: "gmail_id@gmail.com",
//         pass: "gmail_password"
//     }
// });

// var mail = {
//     from: "Yashwant Chavan <from@gmail.com>",
//     to: "to@gmail.com",
//     subject: "Send Email Using Node.js",
//     text: "Node.js New world for me",
//     html: "<b>Node.js New world for me</b>"
// }

// smtpTransport.sendMail(mail, function(error, response){
//     if(error){
//         console.log(error);
//     }else{
//         console.log("Message sent: " + response.message);
//     }
//     smtpTransport.close();
// });





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
