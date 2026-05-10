const express= require("express");
const router = express.Router({mergeParams: true}); 
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {reviewSchema} = require("../schema.js");
const Review= require("../models/reviews.js");
const {validateReview, isLoggedIn, isReviewAuthor}= require("../middleware.js");
const reviewController = require("../controllers/reviewCont.js");

router.post("/", validateReview, isLoggedIn, wrapAsync(reviewController.createReview));

//delete route for review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports  = router;