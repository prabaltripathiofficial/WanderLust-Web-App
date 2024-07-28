const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const passport = require('passport');



module.exports.postReviewRoute = async (req, res) =>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review); 
    newReview.author = req.user._id;
   listing.reviews.push(newReview);
   
   await newReview.save();
   await listing.save();
   
   res.redirect(`/listings/${listing._id}`);
   };


   module.exports.deleteReviewRoute= async (req,res) =>{
    let {id, reviewId} = req.params;
    
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId }});
    await Review.findByIdAndDelete(reviewId)
    
    res.redirect(`/listings/${id}`);
    
    };
