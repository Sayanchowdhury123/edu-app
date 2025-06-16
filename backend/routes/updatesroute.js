const express = require("express")
const router = express.Router();
const Course = require("../models/course");
const { protect, isinstructor } = require("../middleware/auth");



router.put("/add/:courseid", protect,isinstructor,async (req,res) => {
 const {update} = req.body;
     try {
        const course = await Course.findById(req.params.courseid);
        if(!course){
      return res.status(400).json({msg:"no course found"})
        }

        course.announcement = {
            text: update,
            date: new Date()
        };
        await course.save();
        res.status(200).json(course.announcement)
    } catch (error) {
        res.status(500).json({msg:"failed to add update"})
        console.log(error);
    }
})

router.delete("/del/:courseid", protect,isinstructor,async (req,res) => {
 
     try {
        const course = await Course.findById(req.params.courseid);
        if(!course){
      return res.status(400).json({msg:"no course found"})
        }

        course.announcement = "";
        await course.save();
        res.status(200).json({msg:"updated removed"})
    } catch (error) {
        res.status(500).json({msg:"failed to remove update"})
        console.log(error);
    }
})


module.exports = router;