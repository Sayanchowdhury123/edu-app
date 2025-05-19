const express = require("express");
const { protect } = require("../middleware/auth");
const Course = require("../models/course");
const User = require("../models/user");
const sendemail = require("../utils/sendemail");
const router = express.Router();

router.post("/:courseid", protect, async (req, res) => {
  try {
    const userid = req.user._id.toString();
    const { courseid } = req.params;
    const course = await Course.findById(courseid);
    const user = await User.findById(userid);
    if (!course) {
      return res.status(400).json({ msg: "course not found" });
    }


    course.enrolledusers.push(userid);
    await course.save();

    const subject = `Enrolled in ${course.title}`;
    const html = `
          <h2>Hello ${user.name}</h2>
          <p>You have successfully enrolled in <strong>${course.title}</strong></p>
          <p>Start learning now!</p> `;

    await sendemail(user.email, subject, html);

    res.status(200).json({ msg: "enrolled and email sent" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "failed to enroll" });
  }
});

router.delete("/:courseid", protect, async (req, res) => {
  try {
    const { courseid } = req.params;
    const course = await Course.findById(courseid);
    const user = await User.findById(req.user._id.toString());
    if (!course) {
      return res.status(400).json({ msg: "course not found" });
    }

  course.enrolledusers =  course.enrolledusers.filter((s) => s._id.toString() !== user._id.toString() );

    await course.save();

    const subject = `Unenrolled in ${course.title}`;
    const html = `
          <h2>Hello ${user.name}</h2>
          <p>You have successfully unenrolled in <strong>${course.title}</strong></p> `;

    await sendemail(user.email, subject, html);

    res.status(200).json({ msg: "unenrolled and email sent" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "failed to unenroll" });
  }
});

module.exports = router;
