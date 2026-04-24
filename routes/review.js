const express= require("express");
const router = express.Router({mergeParams: true}); 
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {reviewSchema} = require("../schema.js");
const Review= require("../models/reviews.js");

const validateReview = ((req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details[0].message;
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
});

router.post("/", validateReview, wrapAsync(async(req,res)=>{
 let listing = await Listing.findById(req.params.id);
 let newReview =  new Review(req.body.review);

 listing.reviews.push(newReview._id);
 await newReview.save();
 await listing.save();

 console.log("newReview saved");
  res.redirect(`/listing/${req.params.id}`);
}
));

//delete route for review
router.delete("/:reviewId", wrapAsync(async(req,res)=>{
    let {id, reviewId}= req.params;
  
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}`);
}));

module.exports  = router;