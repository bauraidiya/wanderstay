const express = require("express");
const app = express();
const mongoose= require("mongoose");
const Listing = require("./models/listing.js");
const path= require("path");
const methodOverride = require("method-override");
const ejsMate= require("ejs-mate"); 
const ExpressError = require("./utils/ExpressError.js")
const wrapAsync = require("./utils/wrapAsync.js");
const {listingSchema} = require("./schema.js")

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
    res.redirect("/listing");
});

app.get("/listing", wrapAsync(async(req,res)=>{
   const allListings = await  Listing.find({});
   res.render("./listings/index.ejs", {allListings});
})
);

const validateListing = ((req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error);
    }else{
        next();
    }
});

app.get("/listing/new", (req,res)=>{
    res.render("./listings/new.ejs");
});

// Create ROUTE
app.post("/listing", validateListing , wrapAsync(async(req,res,next)=>{
    const newListing = new Listing(req.body.Listing);
    await newListing.save();
    res.redirect("/listing");
   
})
);

app.get("/listing/:id",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    const allData = await Listing.findById(id);
    res.render("./listings/show.ejs", {allData});
})
);

// EDIT ROUTE
app.get("/listing/:id/edit", wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let allListing = await Listing.findById(id);
    res.render("./listings/edit.ejs", {allListing});
})
);

// UPDATE ROUTE
app.put("/listing/:id", validateListing , wrapAsync(async(req,res)=>{
   let {id}= req.params;
   await Listing.findByIdAndUpdate(id, {...req.body.Listing});
   res.redirect(`/listing/${id}`);
}
));

// DELETE ROUTE
app.delete("/listing/:id",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let deleteData = await Listing.findByIdAndDelete(id);
    console.log(deleteData);
    res.redirect("/listing");
})
);

app.use((req,res,next)=>{
    next(new ExpressError(404, "OOPS Page not found!"));
});

app.use((err,req,res,next)=>{
    let {status=500, message="something went wrong!"}= err;
    res.status(status).render("error.ejs", {message});
    // res.status(status).send(message);
});
app.listen(8080,()=>{
    console.log("Server is listening to port 8080");
});