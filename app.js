const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

// import connection
const connection = require("./config/db_connection");
// import MongoStore
const MongoStore = require("connect-mongo");
// import session
const session = require("express-session");
//import passport
const passport = require("passport");

const articleRouter = require("./routes/articleRouter");
const usersRouter = require("./routes/userRouter");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//session setup
/**
 * -------------- SESSION SETUP ----------------
 */

// TODO
// gotta implement the session
// first set up the sessionStore
const sessionStore = MongoStore.create({
  client: connection.getClient(),
  collectionName: "sessions",
});

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, //24 hours age cookie
    },
  })
);

//passport setup
/**
 * -------------- PASSPORT SETUP ----------------
 */

require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

/////
app.use((req, res, next) => {
  console.log(req.cookies);
  next();
});
app.use("/articles", articleRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
