const express = require("express");
const { protect } = require("../middleware/auth");
const Courseprogress = require("../models/courseprogress");
const Course = require("../models/course")
const router = express.Router();


router.get("/",protect,async (req,res) => {
    try {
            let progress = await Courseprogress.find({user: req.user._id})
              res.status(200).json(progress || {completedlesson: []})
    } catch (error) {
             console.log(error);
           res.status(500).json({msg: "fetching progress error"})
    }
})

router.post("/:courseid/complete",protect,async (req,res) => {
    try {
        const {lessonid} = req.body;
        console.log(lessonid);
        let progress = await Courseprogress.findOne({user: req.user._id, course: req.params.courseid})
        let course = await Course.find({_id: req.params.courseid});

        if(!progress){
            progress = new Courseprogress({
                user: req.user._id,
                course: req.params.courseid,
                completedlesson: [lessonid],
                
            })
        }else if(!progress.completedlesson.includes(lessonid)){
            progress.completedlesson.push(lessonid)
        }

        await progress.save();
        res.status(200).json({msg: "lesson marked complete"})

    } catch (error) {
        console.log(error);
           res.status(500).json({msg: "progress error"})
    }
})

module.exports = router;