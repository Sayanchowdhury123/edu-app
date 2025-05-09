const { protect, isinstructor } = require("../middleware/auth");
const upload = require("../middleware/upload");
const Course = require("../models/course")
const express = require("express")
const router = express.Router();

router.post("/courses/:courseid/upload-video",protect,isinstructor,upload.single("video"), async (req,res) => {
    try {
        const {title,duration} = req.body;
        const {path} = req.file;
        const {courseid} = req.params;

        if(!title || !path){
            return res.status(400).json({msg:"missing required fields"})
        }

        const course = await Course.findById(courseid);
        if(!course){
            return res.status(404).json({msg:"course not found"})
        }

        course.videos.push({
            title: title,
            url: path,
            duration: duration
        })

        await course.save()

        res.status(200).json({
            msg:"video uploaded and saved to course", 
            video: {
            title,
            url: path,
            duration: duration
        },
        course
    })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"failed to upload and save video"})
    }
})


module.exports = router;