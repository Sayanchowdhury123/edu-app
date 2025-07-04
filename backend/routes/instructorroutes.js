const express = require("express");
const { protect, isinstructor } = require("../middleware/auth");
const Course = require("../models/course");
const User = require("../models/user");
const router = express.Router();
const sendemail = require("../utils/sendemail");

router.get("/dashboard", protect, isinstructor, async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .select("title price enrolledusers thumbnail reviews ")
      .lean();

    res.status(200).json({
      totalcourses: courses.length,
      courses: courses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "failed to load dashboard data" });
  }
});

router.get("/approval/:courseid", protect, isinstructor, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseid).populate(
      "screenshots.uploadedby screenshots.course",
      "name email avatar title price"
    );

    res.json(course);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "failed to load dashboard data" });
  }
});

router.put("/become-instructor", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.role = "instructor";
    await user.save();
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "failed to become instructor" });
  }
});

router.put(
  "/:courseid/approve/:ssid",
  protect,
  isinstructor,
  async (req, res) => {
    try {
      const course = await Course.findById(req.params.courseid);
      if (!course) {
        return res.status(400).json("course not found");
      }
        const user = await User.findById(req.user._id);

      const screenshot = course.screenshots.find(
        (s) => s._id.toString() === req.params.ssid.toString()
      );
      screenshot.approval = true;
      await course.save();

      const subject = `Purchased ${course.title}`;
      const html = `
          <h2>Hello ${user.name}</h2>
          <p>You have successfully purchased <strong> ₹${course.title}</strong> for ${course.price}</p>
          <p>Start learning now!</p> `;

      await sendemail(user.email, subject, html);
      res.status(200).json(screenshot);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "failed to approve screenshot" });
    }
  }
);

router.put(
  "/:courseid/disapprove/:ssid",
  protect,
  isinstructor,
  async (req, res) => {
    try {
      const course = await Course.findById(req.params.courseid);
      if (!course) {
        return res.status(400).json("course not found");
      }

      const screenshot = course.screenshots.find(
        (s) => s._id.toString() === req.params.ssid.toString()
      );
      screenshot.approval = false;
      await course.save();
      res.status(200).json(screenshot);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "failed to disapprove screenshot" });
    }
  }
);

router.delete(
  "/:courseid/del/:ssid",
  protect,
  isinstructor,
  async (req, res) => {
    try {
      console.log(req.params.courseid, req.params.ssid);
      const course = await Course.findById(req.params.courseid);
      if (!course) {
        return res.status(400).json("course not found");
      }

      course.screenshots = course.screenshots.filter(
        (s) => s._id.toString() !== req.params.ssid.toString()
      );
      await course.save();
      res.status(200).json("screenshot deleted");
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "failed to delete screenshot" });
    }
  }
);

module.exports = router;
