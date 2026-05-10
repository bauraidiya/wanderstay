const Listing = require("../models/listing.js");

module.exports.index = async(req,res)=>{
   const allListings = await  Listing.find({});
   res.render("./listings/index.ejs", {allListings});
};
module.exports.renderNewForm = (req,res)=>{
    res.render("./listings/new.ejs");
};

module.exports.newListing = async(req,res,next)=>{
    if(req.body.listing.image.url.trim() === ""){
        req.body.listing.image.url =
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop";
    }
    const newListing = new Listing(req.body.listing);
    newListing.owner= req.user._id;
    await newListing.save();
    req.flash("success", "New listing created successfully!");
    res.redirect("/listing");
   
};

module.exports.showListing = async(req,res)=>{
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
};

module.exports.editListing = async(req,res)=>{
    let {id}= req.params;
    let allListing = await Listing.findById(id);
    if(!allListing){
       req.flash("error", "You must be logged in!"); 
       res.redirect("/listing");
    }
    res.render("./listings/edit.ejs", {allListing});
};

module.exports.updateListing = async(req,res)=>{
   let {id}= req.params;
   await Listing.findByIdAndUpdate(id, req.body.listing);
   if (!req.body.listing.image) {
        req.body.listing.image = listing.image;
    }
    req.flash("success", "Listing updated successfully!");
   res.redirect(`/listing/${id}`);
};

module.exports.deleteListing= async(req,res)=>{
    let {id}= req.params;
    let deleteData = await Listing.findByIdAndDelete(id);
    console.log(deleteData);
    req.flash("success", "Listing Deleted successfully!");
    res.redirect("/listing");
};