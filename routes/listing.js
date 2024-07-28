const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
var methodOverride = require("method-override");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const newListingSchema = require("../Schemas/schema.js");
const { isLoggedIn } = require("../middleware.js");
const Joi = require("joi");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const listingControllers = require("../controllers/listings.js");
const {storage} = require("../cloudconfig.js");
const multer  = require('multer')
const upload = multer({storage});


//Listing Server Side Validations
const validateListing = (req, res, next) => {
  const { error } = newListingSchema.validate(req.body);
  if (error) {
    const errmsg = error.details.map((el) => el.message).join(",");
    return next(new ExpressError(400, errmsg));
  }
  next();
};

//Index Route and Post Request for create
router
  .route("/")
  .get(listingControllers.index)
  .post(upload.single('image'), listingControllers.createPostRoute , validateListing);

//Create Route// SPECIFIC ROUTE
router.get("/new", isLoggedIn, listingControllers.newRoute);

// for edit push route, delete route and show route// Generic Route ( Generic because it can serve many purposes as already stated)
router
  .route("/:id")
  .put(upload.single('image'), validateListing, listingControllers.editRoutePush)
  .delete(isLoggedIn, listingControllers.deleteRoute)
  .get(listingControllers.showRouteGet);

//Edit Route
router.get("/:id/edit", isLoggedIn, listingControllers.editRouteGet);

module.exports = router;
