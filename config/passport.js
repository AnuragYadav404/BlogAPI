const passport = require("passport");
// import local starategy
const LocalStrategy = require("passport-local").Strategy;
// import connection
const connection = require("./db_connection");
// import user model
const user = require("../models/user");
// import validate password function
const validPassword = require("../lib/passwordUtils").validPassword;

// we are gonna use strategy, so first we need to set it up

// TODO: passport.use();
// here we will define the configuration for passport

// we can here modify username and password namespace for verifyCallback passport

const customFields = {
  usernameField: "username",
  passwordField: "password",
};

// verify callback is responsible for checking validity of login credentials
const verifyCallback = async function (username, password, done) {
  // here we can do any implementation of verifycallback
  // we just have to conform to use of done() -> this is what passport cares for
  user
    .findOne({ username: username })
    .then((userEle) => {
      if (!userEle) {
        //the user is not found in the db
        return done(null, false);
      }
      const isValidLogin = validPassword(password, userEle.hash, userEle.salt);
      if (isValidLogin) {
        //valid login credentials
        return done(null, userEle);
      } else {
        return done(null, false);
      }
    })
    .catch((err) => {
      done(err);
    });
};

const strategy = new LocalStrategy(customFields, verifyCallback); // here we will pass it a callback
passport.use(strategy);

passport.serializeUser((userEle, done) => {
  // passport plays with the session
  // this is the magic, this on passing the verifyCallback will pass in the user
  // passport will now attach field `passport: {user: user.id}` to the session
  // of the particular session token
  done(null, userEle.id);
});

// deserialize is responsible for taking userid from session.passport.user
// and then populates req.user with the result

passport.deserializeUser((userId, done) => {
  user
    .findById(userId)
    .then((userEle) => {
      done(null, userEle);
    })
    .catch((err) => done(err));
});
