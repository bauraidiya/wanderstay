const express= require("express");
const router = express.Router(); //object
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner}= require("../middleware.js");
const {validateListing} = require("../middleware.js")



router.get("/", wrapAsync(async(req,res)=>{
   const allListings = await  Listing.find({});
   res.render("./listings/index.ejs", {allListings});
})
);

router.get("/new",isLoggedIn, (req,res)=>{
    res.render("./listings/new.ejs");
});

router.post("/", validateListing , isLoggedIn, wrapAsync(async(req,res,next)=>{
    if(req.body.listing.image.url.trim() === ""){
        req.body.listing.image.url =
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop";
    }
    const newListing = new Listing(req.body.listing);
    newListing.owner= req.user._id;
    await newListing.save();
    req.flash("success", "New listing created successfully!");
    res.redirect("/listing");
   
})
);

router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    const allData = await Listing.findById(id)
    .populate({
   path: "reviews",
   populate: {
      path: "author",
   },
})
    .populate("owner");
    if(!allData){
       req.flash("error", "Listing you requested for does not exist!"); 
       res.redirect("/listing");
    }
    console.log(allData);
    res.render("./listings/show.ejs", {allData});
})
);

// EDIT ROUTE
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let allListing = await Listing.findById(id);
    if(!allListing){
       req.flash("error", "You must be logged in!"); 
       res.redirect("/listing");
    }
    res.render("./listings/edit.ejs", {allListing});
})
);


// UPDATE ROUTE
router.put("/:id",isLoggedIn, isOwner, validateListing , wrapAsync(async(req,res)=>{
   let {id}= req.params;
   await Listing.findByIdAndUpdate(id, req.body.listing);
   if (!req.body.listing.image) {
        req.body.listing.image = listing.image;
    }
    req.flash("success", "Listing updated successfully!");
   res.redirect(`/listing/${id}`);
}
));

// DELETE ROUTE
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let deleteData = await Listing.findByIdAndDelete(id);
    console.log(deleteData);
    req.flash("success", "Listing Deleted successfully!");
    res.redirect("/listing");
})
);
module.exports = router;