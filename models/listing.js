const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews.js');



const listingSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true,
        maxLength: 255
    },
    image:{
       url : String,
       filename : String
    },
    price:{
        type: Number,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    },
    reviews:[{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    owner:{
       type: Schema.Types.ObjectId,
        ref: "User"
    }
});


//Delete Middleware For Listing

listingSchema.post("findOneAndDelete", async (listing)=>{
    if(listing.reviews.length){
let res = await Review.deleteMany({_id:{$in: listing.reviews}});
 console.log(res);   
}
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports= Listing;