const express = require("express");
const router= express.Router();
const User = require("../models/user.js");
var methodOverride = require("method-override");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const passport = require("passport");
const Joi = require('joi');
const { redirectURLSaved } = require('../middleware.js');
const userController = require("../controllers/users.js");


router.route('/signup')
.get( userController.signUpRoute)
.post(wrapAsync(userController.signUpPostRoute));

router.route("/login")
.get(userController.logInRoute)
.post( redirectURLSaved,
    passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash : true
} ) , userController.logInPostRoute);

router.get('/logout', userController.logOutRoute);

module.exports= router;