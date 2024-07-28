const mongoose = require('mongoose');
const initData = require('./data.js');
const Listings= require('../models/listing.js');
const Reviews = require('../models/reviews.js');


const initDB= async () => {
    await Listings.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner: '669dcb70f2296b41e7acd35d'}));
    await Listings.insertMany(initData.data);
    console.log('data was initialized');
}

initDB();
