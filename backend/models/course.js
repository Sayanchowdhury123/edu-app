const mongoose = require("mongoose");

const lessonschema = new mongoose.Schema({
  _id: false,
  id: {type:String,required:true},
  title: {type:String},
  videourl: {type: String},
  isfreeprivew:{type: Boolean, default: false},
  cloudinaryid: {type: String},
  lecture: {type:Buffer},
  quiz: [
    {
      que: {type: String,required: true},
      ans: {type:String,required:true},
      options: [{type:String,required:true}],
      title: {type: String,required: true}

    }
  ],


})

const sectionschema = new mongoose.Schema({
  title: String,
  lessons: [lessonschema]
})

const courseschema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  thumbnail: String,
  sections: [sectionschema],
  enrolledusers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },

  announcement: {
   text: String,
   date: Date,
  },
    screenshots: [{
      url: String,
       uploadedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
       uploadedat: {type:Date, default: Date.now()},
       course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
       approval: {type: Boolean,default: false},

    }],
 

});

module.exports = mongoose.model("Course", courseschema);
