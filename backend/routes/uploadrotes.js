const { protect, isinstructor } = require("../middleware/auth");
const {uploadvideo,uploadimage} = require("../middleware/upload")
const Course = require("../models/course")
const express = require("express")
const router = express.Router();

router.post("/courses/:courseid/upload-video",protect,isinstructor,uploadvideo.single("video"), async (req,res) => {
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


router.post("/courses/:courseid/upload-thumbnail",protect,isinstructor,uploadimage.single("thumbnail"), async (req,res) => {
    try {
          const {path} = req.file;
        const {courseid} = req.params;

        const course = await Course.findById(courseid);

        course.thumbnail = path;
        await course.save();

          res.status(200).json({
            msg:"thumbnail uploaded and saved to course", 
            thumbnail: path,
            course

         })
        
    } catch (error) {
          console.log(error);
        res.status(500).json({msg:"failed to upload and save image"})
    }
})


module.exports = router;