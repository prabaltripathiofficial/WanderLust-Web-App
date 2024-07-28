if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo'); // Ensure MongoStore is correctly imported
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const ExpressError = require("./utils/ExpressError.js");

const User = require("./models/user.js");
const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/reviews.js');
const userRouter = require('./routes/user.js');

const app = express();
const port = 8080;

// Database connection
const DBURL = process.env.ATLAS_DB_URL;

mongoose.connect(DBURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database connection established");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

// Middleware setup
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const store = MongoStore.create({
  mongoUrl: DBURL,
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (e) => {
  console.log("SESSION STORE ERROR", e);
});

const sessionOptions = {
  store: store, // Ensure the store is included in the session options
  name: 'session',
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false, // Usually set to false to comply with laws that require permission before setting a cookie
  resave: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global middleware to set flash messages and current user
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.currUser = req.user;
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use('/', userRouter);
app.use('/listings', listingRouter);
app.use('/listings/:id/reviews', reviewRouter);

// Page Not Found
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).render('listings/error.ejs', { err: { message: err.message, status: err.status } });
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
