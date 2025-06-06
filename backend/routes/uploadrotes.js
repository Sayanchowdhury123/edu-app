const { protect, isinstructor } = require("../middleware/auth");
const { uploadvideo, uploadimage } = require("../middleware/upload");
const Course = require("../models/course");
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("cloudinary").v2;

router.post(
  "/courses/:courseid/sections/:sectionindex/upload-video",
  protect,
  isinstructor,
  async (req, res) => {
    try {
      const { title, isfreepreview } = req.body;
    
      const { courseid } = req.params;
      const { sectionindex } = req.params;

      if (!title || !req.files.video) {
        return res.status(400).json({ msg: "missing required fields" });
      }

      const file = req.files.video;

      const result = await cloudinary.uploader.upload(file.tempFilePath,{
        folder: "lecture/videos",
        resource_type:"video",
      })

      const course = await Course.findById(courseid);
      if (!course) {
        return res.status(404).json({ msg: "course not found" });
      }

      const section = course.sections[sectionindex];
      if (!section) {
        return res.status(404).json({ msg: "section not found" });
      }

      section.lessons.push({
        id: uuidv4(),
        title: title,
        videourl: result.secure_url,
        cloudinaryid: result.public_id,
        isfreepreview: isfreepreview === "true",
      });

      await course.save();

      res.status(200).json({
        msg: "video uploaded and lesson added",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "failed to upload and save video" });
    }
  }
);

router.put(
  "/courses/:courseid/sections/:sectionindex/lessons/:lessonid",
  protect,
  isinstructor,
  async (req, res) => {
    try {
      const { title, isfreepreview } = req.body;
      const { courseid } = req.params;
      const { sectionindex } = req.params;
      const { lessonid } = req.params;
      

      if (!title || !req.files.video) {
        return res.status(400).json({ msg: "missing required fields" });
      }

      const course = await Course.findById(courseid);
      if (!course) {
        return res.status(404).json({ msg: "course not found" });
      }

      const section = course.sections[sectionindex];
      if (!section) {
        return res.status(404).json({ msg: "section not found" });
      }

      const lesson = section.lessons.find((l) => l.id === lessonid);
      if (!lesson) {
        return res.status(404).json({ msg: "lesson not found" });
      }

      if (title) lesson.title = title;
      if (isfreepreview !== undefined) lesson.isfreepreview = isfreepreview;
      if (req.files.video) {
        if (lesson.cloudinaryid) {
          await cloudinary.uploader.destroy(lesson.cloudinaryid, {
            resource_type: "video",
          });
        }

         const result = await cloudinary.uploader.upload(file.tempFilePath,{
        folder: "lecture/videos",
        resource_type:"video",
      })

       lesson.videourl = result.secure_url;
      lesson.cloudinaryid = result.public_id;
      }
     

      await course.save();

      res.status(200).json({ msg: "video edited" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "failed to update lesson" });
    }
  }
);

router.delete(
  "/courses/:courseid/sections/:sectionindex/lessons/:lessonid",
  protect,
  isinstructor,
  async (req, res) => {
    try {
      const { courseid } = req.params;
      const { sectionindex } = req.params;
      const { lessonid } = req.params;

      const course = await Course.findById(courseid);
      if (!course) {
        return res.status(404).json({ msg: "course not found" });
      }

      const section = course.sections[sectionindex];
      if (!section) {
        return res.status(404).json({ msg: "section not found" });
      }

      const lessson = section.lessons.find((l) => l.id === lessonid);
      if (!lessson) {
        return res.status(404).json({ msg: "lession not found" });
      }

      if (lessson.cloudinaryid) {
        await cloudinary.uploader.destroy(lessson.cloudinaryid, {
          resource_type: "video",
        });
      }

      section.lessons = section.lessons.filter((l) => l.id !== lessonid);

      await course.save();

      res.status(200).json({
        msg: " lesson deleted",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "failed to delete lesson" });
    }
  }
);

router.patch(
  "/courses/:courseid/upload-thumbnail",
  protect,
  isinstructor,
  async (req, res) => {
    try {
      if(!req.files.thumbnail){
        return res.status(400).json({ msg: "missing required fields" });
      }
      const { courseid } = req.params;

      const course = await Course.findById(courseid);
        const file = req.files.thumbnail;
       const result = await cloudinary.uploader.upload(file.tempFilePath,{
        folder: "lecture/photos",
    })

      course.thumbnail = result.secure_url;
      await course.save();

      res.status(200).json({
        msg: "thumbnail uploaded and saved to course",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "failed to upload and save image" });
    }
  }
);

module.exports = router;
