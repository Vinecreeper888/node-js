const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const config = require('./config');

//for providing authentication for local strategy
exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //from passport-local-mongoose
passport.deserializeUser(User.deserializeUser());


exports.getToken = (user) => {
  //to create the jwt
  return jwt.sign(user,config.secretKey,{
    expiresIn: 7200
  });
};

//options for jwt strategy
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwt_payload,done) => {
  console.log("JWT payload: ",jwt_payload);
  User.findOne({_id: jwt_payload._id},(err,user) => {
    if(err) {
      return done(err,false);
      //done is the callback passport passes
    }
    else if(user) {
      return done(null,user);
    }
    else {
      //could not find the user
      return done(null,false);
    }
  });
}));

//to verify an incoming user
exports.verifyUser = passport.authenticate('jwt',{session: false});
