const express = require("express");
const { protect, isinstructor } = require("../middleware/auth");
const Course = require("../models/course");
const User = require("../models/user");
const router = express.Router();


router.get("/dashboard",protect,isinstructor,async (req,res) => {
    try {
        const courses = await Course.find({instructor: req.user._id}).select("title price enrolledusers thumbnail reviews").lean();
      

        res.status(200).json({
            totalcourses: courses.length,
            courses: courses
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"failed to load dashboard data"})
    }
})



router.put("/become-instructor", protect, async (req,res) => {
    try {
        const user = await User.findById(req.user._id)
        user.role = "instructor";
        await user.save();
        res.json(user)
    } catch (error) {
        console.log(error);
          res.status(500).json({msg:"failed to become instructor"})
    }
})


module.exports = router;