const mongoose = require("mongoose");

const courseschema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  thumbnail: String,
  videos: [
    {
      title: String,
      url: String,
      duration: String,
    },
  ],
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
});

module.exports = mongoose.model("Course", courseschema);
