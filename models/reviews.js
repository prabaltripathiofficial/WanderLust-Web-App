const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment:{
        type: String,
        maxLength: 150
    },
rating:{
    type: Number,
    min:1,
    max:5
},
craetedAt:{
    type: Date,
    default: Date.now()
},
author:{
    type: Schema.Types.ObjectId,
        ref: "User"
}
});

const Review= mongoose.model('Review', reviewSchema);

module.exports = Review;