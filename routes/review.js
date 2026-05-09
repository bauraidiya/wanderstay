const express= require("express");
const router = express.Router({mergeParams: true}); 
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {reviewSchema} = require("../schema.js");
const Review= require("../models/reviews.js");
const {validateReview, isLoggedIn, isReviewAuthor}= require("../middleware.js");

router.post("/", validateReview, isLoggedIn, wrapAsync(async(req,res)=>{
 let listing = await Listing.findById(req.params.id);
 let newReview =  new Review(req.body.review);
 newReview.author = req.user._id;
 listing.reviews.push(newReview._id);
 await newReview.save();
 await listing.save();
 req.flash("success", "New Review created successfully!");
 console.log("newReview saved");
  res.redirect(`/listing/${req.params.id}`);
}
));

//delete route for review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(async(req,res)=>{
    let {id, reviewId}= req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
     req.flash("success", "review deleted!");
    res.redirect(`/listing/${id}`);
}));

module.exports  = router;