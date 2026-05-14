require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

const express = require("express");
const app = express();
const mongoose= require("mongoose");
const path= require("path");
const methodOverride = require("method-override");
const ejsMate= require("ejs-mate"); 
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter =  require("./routes/listing.js");
const reviewsRouter =  require("./routes/review.js");
const userRouter =  require("./routes/Users.js");

const dbUrl = process.env.ATLASDB_URL;
const secret = process.env.SECRET || "thisshouldbeabettersecret!";
console.log(dbUrl);

main()
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log("MongoDB ERROR:");
    console.log(err);
  });

async function main() {
    await mongoose.connect(dbUrl, {
        serverSelectionTimeoutMS: 30000,
        family: 4,
        bufferTimeoutMS: 30000,
        maxPoolSize: 10,
    });
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err)=>{
    console.log("ERROR IN MONGO-SESSION STORE", err);
});

const sessionOptions={
    store,
    secret,
    resave: false,
    saveUninitialized: true, 
    cookie:{
        expires: Date.now()+7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    },
};

sessionOptions.store = store;
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

app.use("/listing", listingRouter);
app.use("/listing/:id/reviews", reviewsRouter);
app.use("/", userRouter);


app.use((req,res,next)=>{
    next(new ExpressError(404, "OOPS Page not found!"));
});

app.use((err,req,res,next)=>{
    let {status=500, message="something went wrong!"}= err;
    res.status(status).render("error.ejs", {message});
    // res.status(status).send(message);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT,()=>{
    console.log(`Server is listening on port ${PORT}`);
});