const express = require("express");
const app = express();
const mongoose= require("mongoose");
const Listing = require("./models/listing.js");
const path= require("path");
const methodOverride = require("method-override");
const ejsMate= require("ejs-mate"); 
main()
    .then((res)=>{
    console.log("connected to DB");
    })
    .catch((err)=>{ console.log(err)});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.get("/", (req,res)=>{
    res.send("Get is woking");
});

app.get("/listing", async(req,res)=>{
   const allListings = await  Listing.find({});
   res.render("./listings/index.ejs", {allListings});
});

app.get("/listing/new", (req,res)=>{
    res.render("./listings/new.ejs");
});

app.post("/listing", async(req,res)=>{
    // let {title, description, image, price, location, country} = req.body;
    const newListing = new Listing(req.body.Listing);
    await newListing.save();
    res.redirect("/listing");
});

app.get("/listing/:id", async(req,res)=>{
    let {id}= req.params;
    const allData = await Listing.findById(id);
    res.render("./listings/show.ejs", {allData});
});

app.get("/listing/:id/edit", async(req,res)=>{
    let {id}= req.params;
    let allListing = await Listing.findById(id);
    res.render("./listings/edit.ejs", {allListing});
});

app.put("/listing/:id", async(req,res)=>{
   let {id}= req.params;
   await Listing.findByIdAndUpdate(id, {...req.body.Listing});
   res.redirect(`/listing/${id}`);
});

app.delete("/listing/:id", async(req,res)=>{
    let {id}= req.params;
    let deleteData = await Listing.findByIdAndDelete(id);
    console.log(deleteData);
    res.redirect("/listing");
});
app.listen(8080,()=>{
    console.log("Server is listening to port 8080");
});