const User = require("../models/user.js");
module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.newUserSignup = async(req, res)=>{
    try{
        let {username, email, password}=  req.body;
        const newUser = await new User({email, username});
        const registedUser= await User.register(newUser, password);
        console.log(registedUser);
        req.login(registedUser, (err, next)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to WanderStay");
             res.redirect("/listing");
        });
    } catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
    
};

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async(req,res)=>{
    req.flash("success", "Welcome to WanderStay. You are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success", "You are logged out successfully!");
        res.redirect("/listing");
    })
};