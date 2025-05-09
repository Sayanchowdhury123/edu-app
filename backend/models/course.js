const mongoose = require("mongoose");

const courseschema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    category: String,
    instructor: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
    thumbnail: String,
    videos: [
        {
            title: String,
            url: String,
            duration: String
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model("Course", courseschema)