const mongoose = require("mongoose");

const commentschema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
    text:{type: String, required: true},
    createdAt: {type: Date, default: Date.now}
})


const discussionschema = new mongoose.Schema({
    course: {type: mongoose.Schema.Types.ObjectId, ref:"course"},
    title: {type: String, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
    question: {type:  String, required: true},
    comment: [commentschema],
    isresolved: {type: Boolean, default: false},
     createdAt: {type: Date, default: Date.now},
     likes: [String],
    dislikes: [String],

})

module.exports = mongoose.model("Discussion", discussionschema)