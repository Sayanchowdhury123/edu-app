const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const userschema = new mongoose.Schema({
    name: {type: String},
    avatar: {type: String},
    email: {type: String, unique: true},
    password: String,
    role: {type: String, enum: ["student", "instructor"], default: "student"},
    wishlist: [
        {
          type: mongoose.Schema.Types.ObjectId, ref: "Course"
        }
    ],

    
    
})

module.exports = mongoose.model("User", userschema)