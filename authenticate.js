const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

//for providing authentication for local strategy
exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //from passport-local-mongoose
passport.deserializeUser(User.deserializeUser());
