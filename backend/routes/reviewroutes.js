const express = require("express");
const { protect } = require("../middleware/auth");
const Course = require("../models/course");
const router = express.Router();

router.get("/:courseid", async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseid).populate("reviews.user");
    res.status(200).json({ reviews: course.reviews });
  } catch (error) {
    console.log(error);

    res.status(500).json({ msg: " failed to fetch review " });
  }
});



router.post("/:courseid/:userid", protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const course = await Course.findById(req.params.courseid);
    if (!course) {
      return res.status(400).json({ msg: "course not found" });
    }

    course.reviews.push({
      user: req.params.userid,
      rating: Number(rating),
      comment: comment,
    });

    await course.save();


    const updatedcourse = await Course.findById(req.params.courseid).populate("reviews.user")
    const addedreview = updatedcourse.reviews[course.reviews.length - 1]
    
    res.status(200).json(addedreview);
  } catch (error) {
    console.log(error);

    res.status(500).json({ msg: " failed to add review " });
  }
});

router.put("/:courseid/reviews/:reviewid", protect, async (req, res) => {
  try {
    const { newcomment, newrating } = req.body;
    
    const course = await Course.findById(req.params.courseid);
    if (!course) {
      return res.status(400).json({ msg: "course not found" });
    }
     
   const review = course.reviews.find((r) => r._id.toString() === req.params.reviewid)
   if(!review){
     return res.status(400).json({ msg: "review not found" });
   }

    review.comment = newcomment;
    review.rating = newrating;

    await course.save(); 
    res.status(200).json(course.reviews);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: " failed to edit review " });
  }
});

router.delete("/:courseid/reviews/:reviewid", protect, async (req, res) => {
  try {

    const course = await Course.findById(req.params.courseid);
    if (!course) {
      return res.status(400).json({ msg: "course not found" });
    }
  course.reviews =  course.reviews.filter((r) => r._id.toString()  !== req.params.reviewid.toString());

    await course.save();
    res.status(200).json(req.params.reviewid);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: " failed to delete review " });
  }
});

module.exports = router;
