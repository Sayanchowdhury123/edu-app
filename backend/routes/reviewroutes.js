const express = require("express");
const { protect } = require("../middleware/auth");
const Course = require("../models/course");
const router = express.Router();

router.get("/:courseid/reviews", async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseid).populate(
      "reviews.user",
      "name "
    );
    res.status(200).json({ reviews: course.reviews });
  } catch (error) {
    console.log(error);

    res.status(500).json({ msg: " failed to fetch review " });
  }
});

router.post("/:courseid/reviews", protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const course = await Course.findById(req.params.courseid);
    if (!course) {
      return res.status(400).json({ msg: "course not found" });
    }

    course.reviews.push({
      user: req.user._id,
      rating: Number(rating),
      comment: comment,
    });

    await course.save();

    res.status(200).json({ msg: "review added" });
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
    course.reviews.map((r) => {
      if (r._id === req.params.reviewid) {
        r.comment = newcomment, 
        r.rating = newrating
      }
    });

    await course.save();
    res.status(200).json({ msg: "review edited" });
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
    res.status(200).json({ msg: "review deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: " failed to delete review " });
  }
});

module.exports = router;
