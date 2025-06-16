const mongoose = require("mongoose");

const quizresultschema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  score: Number,
  submittedAt: { type: Date, default: Date.now },
  courseid: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  lessonid: { type: String },
});


module.exports = mongoose.model("Quizresult",quizresultschema)
