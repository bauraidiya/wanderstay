const express = require("express");
const app = express();
const mongoose= require("mongoose");
const path= require("path");
const methodOverride = require("method-override");
const ejsMate= require("ejs-mate"); 
const ExpressError = require("./utils/ExpressError.js");

const listing =  require("./routes/listing.js");
const reviews =  require("./routes/review.js");

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

app.use("/listing", listing);
app.use("/listing/:id/reviews", reviews);

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