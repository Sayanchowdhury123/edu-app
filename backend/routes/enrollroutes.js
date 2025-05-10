const express = require("express");
const { protect } = require("../middleware/auth");
const Course = require("../models/course");
const router = express.Router();

router.post("/enroll/:courseid", protect,async (req,res) => {
    try {
        const {courseid} = req.params;
        const course = await Course.findById(courseid);
        if(!course){
           return res.status(400).json({msg:'course not found'})
        }
        course.enrolledusers.push(req.user._id)
        await course.save();
        res.status(200).json({msg:"you are enrolled"})
    } catch (error) {
        console.log(error);
          res.status(500).json({msg:"failed to enroll"})
    }
})

module.exports = router;