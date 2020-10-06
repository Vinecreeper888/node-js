var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');

var app = express();

const mongoose = require('mongoose');
const Dishes = require('./models/dishes');
const Promos = require('./models/promos');
const Leaders = require('./models/leaders');
const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);
connect.then((db) => {
  console.log('Connected correctly to the server');
}, (err) => {console.log(err)});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('12345-67890')); //signed cookie

const auth = (req,res,next) => {
  console.log(req.signedCookies);

  if(!req.signedCookies.user) {
    //authenticate self
    var authHeader = req.headers.authorization;

    if(!authHeader) {
      var err = new Error('Yu are not authenticated!');
      res.setHeader('www-Authenticate','Basic');
      err.status = 401;
      return next(err); //goto the error handler
    }

    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];

    if(username === 'admin' && password === 'password') {
      res.cookie('user','admin',{signed: true})
      next(); //to proceed forward
    }
    else {
      //error
      var err = new Error('You are not authenticated!');

      res.setHeader('WWW-Authenticate','Basic');
      err.status = 401;
      return next(err);
    }
  } else {
    if(req.signedCookies.user === 'admin') {
      //contains correct info
      next();
    } else {
      //this cookie is not valid
      var err = new Error("You are not authenticated!");
      err.status = 401;
      return next(err);
    }
  }

}




app.use(auth);


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/promos',promoRouter);
app.use('/leaders',leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
