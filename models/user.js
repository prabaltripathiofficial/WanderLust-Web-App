const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email:{
        type: 'string',
        required: true
    }
});// yaha humne usename aur password isliye nhi add kiya  kyunki vo passport-local mongoose khud kar deta hai, vo username
//hashed password aur hashing aur salting sab automatically kar deta hai

userSchema.plugin(passportLocalMongoose);

module.exports= mongoose.model('User', userSchema);
