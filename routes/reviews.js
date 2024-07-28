const express = require("express");
const app = express();
const Joi = require("joi");
const newReviewSchema = require("../Schemas/reviewSchema.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/reviews.js");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const session = require("express-session");
const { isLoggedIn } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//Review Server Side Validations
const validateReview = (req, res, next) => {
  const { error } = newReviewSchema.validate(req.body);
  if (error) {
    const errmsg = error.details.map((el) => el.message).join(",");
    return next(new ExpressError(400, errmsg));
  }
  next();
};

//Post Review Route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.postReviewRoute)
);

//Delete Review Route
router.delete("/:reviewId", wrapAsync(reviewController.deleteReviewRoute));

module.exports = router;
