const mongoose= require ("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");

 const listingSchema = new Schema({
    title:{
        type: String,
    },
    description:{
        type: String,
    },
    image: {
        filename: { type: String, default: 'listingimage' },
        url: { type: String, default: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop" }
    },
    price:{
        type:Number,
    },
    location:{
        type: String,
    },
    country:{
        type: String,
    },
    reviews:[{
        type: Schema.Types.ObjectId,
        ref: "Review",
    },
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
 });

 listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id :{$in: listing.reviews}});
    }
    
 });
 const Listing = mongoose.model("Listing", listingSchema);

 module.exports= Listing;