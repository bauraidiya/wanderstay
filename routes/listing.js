const express= require("express");
const router = express.Router(); //object
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");

const validateListing = ((req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details[0].message;
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
});

router.get("/", wrapAsync(async(req,res)=>{
   const allListings = await  Listing.find({});
   res.render("./listings/index.ejs", {allListings});
})
);

router.get("/new", (req,res)=>{
    res.render("./listings/new.ejs");
});

router.post("/", validateListing , wrapAsync(async(req,res,next)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New listing created successfully!");
    res.redirect("/listing");
   
})
);

router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    const allData = await Listing.findById(id).populate("reviews");
    if(!allData){
       req.flash("error", "Listing you requested for does not exist!"); 
       res.redirect("/listing");
    }
    res.render("./listings/show.ejs", {allData});
})
);

// EDIT ROUTE
router.get("/:id/edit", wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let allListing = await Listing.findById(id);
    if(!allListng){
       req.flash("error", "Listing you requested for does not exist!"); 
       res.redirect("/listing");
    }
    res.render("./listings/edit.ejs", {allListing});
})
);


// UPDATE ROUTE
router.put("/:id", validateListing , wrapAsync(async(req,res)=>{
   let {id}= req.params;
   await Listing.findByIdAndUpdate(id, {...req.body.listing});
   if (!req.body.listing.image) {
        req.body.listing.image = listing.image;
    }
    req.flash("success", "Listing updated successfully!");
   res.redirect(`/listing/${id}`);
}
));

// DELETE ROUTE
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let deleteData = await Listing.findByIdAndDelete(id);
    console.log(deleteData);
    req.flash("success", "Listing Deleted successfully!");
    res.redirect("/listing");
})
);
module.exports = router;