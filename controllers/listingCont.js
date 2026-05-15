const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async(req,res)=>{
   const allListings = await  Listing.find({});
   res.render("./listings/index.ejs", {allListings});
};
module.exports.renderNewForm = (req,res)=>{
    res.render("./listings/new.ejs");
};

module.exports.newListing = async(req,res,next)=>{
    try {
        console.log("newListing request body:", req.body);
        console.log("newListing file:", req.file);

        if (!req.file) {
        req.flash("error", "Image upload failed or no file selected.");
        return res.redirect("/listing/new");
        }

        const location = req.body.location;

        const response = await Promise.race([
            geocodingClient.forwardGeocode({
                query: location,
                limit: 1,
            }).send(),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Geocoding service timed out. Please try again.")), 15000))
        ]);

        if (!response.body.features || !response.body.features.length) {
            req.flash("error", "Location not found. Please enter a valid location.");
            return res.redirect("/listing/new");
        }

        const { path: url, filename } = req.file;
        const newListing = new Listing(req.body);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        newListing.geometry = response.body.features[0].geometry;

        const savedListing = await newListing.save();
        console.log("Saved listing:", savedListing);
        req.flash("success", "New listing created successfully!");
        res.redirect("/listing");
    } catch (err) {
        console.error("Error creating listing:", err);
        req.flash("error", err.message || "Could not create listing.");
        res.redirect("/listing/new");
    }
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
    res.render("./listings/show.ejs", {allData, mapToken: process.env.MAP_TOKEN});
};

module.exports.editListing = async(req,res)=>{
    let {id}= req.params;
    let allListing = await Listing.findById(id);
    if(!allListing){
       req.flash("error", "You must be logged in!"); 
       res.redirect("/listing");
    }
    let orignalUrl= allListing.image.url;
    orignalUrl = orignalUrl.replace("/upload","/upload/h_200,w_250");
    res.render("./listings/edit.ejs", {allListing, orignalUrl});
};

module.exports.updateListing = async(req,res)=>{
   let {id}= req.params;
   let listing = await Listing.findByIdAndUpdate(id, req.body);
   
   if(typeof req.file!=="undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
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