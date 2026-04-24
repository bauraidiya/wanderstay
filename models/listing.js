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
        url: { type: String, default: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511' }
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
 });

 listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id :{$in: listing.reviews}});
    }
    
 });
 const Listing = mongoose.model("Listing", listingSchema);

 module.exports= Listing;