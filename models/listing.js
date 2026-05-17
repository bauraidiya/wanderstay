const mongoose= require ("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");
const { required } = require("joi");

 const listingSchema = new Schema({
    title:{
        type: String,
    },
    description:{
        type: String,
    },
    image: {
        url: String,
        filename: String,
    },
    category:{
        type: String,
        required: true,
        enum: ["Trending", "Rooms", "Iconic cities", "Mountains", "Castle", "Amazing Pools", "Camping", "Farms", "Arctic", "Boats"],
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
    geometry:{
        type:{
            type: String,
            enum: ['Point'],
            required:true
        },
       coordinates:{
            type:[Number],
            required: true
        },
    },
 });

 listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id :{$in: listing.reviews}});
    }
    
 });
 const Listing = mongoose.model("Listing", listingSchema);

 module.exports= Listing;