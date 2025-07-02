const { protect, isinstructor } = require("../middleware/auth");
const { uploadvideo, uploadimage } = require("../middleware/upload");
const Course = require("../models/course");
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("cloudinary").v2;
const Courseprogress = require("../models/courseprogress");

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

      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "lecture/videos",
        resource_type: "video",
        eager: [
          { width: 1280, crop: "scale", format: "mp4" },
          { width: 854, crop: "scale", format: "mp4" },
          { width: 640, crop: "scale", format: "mp4" },
          { width: 256, crop: "scale", format: "mp4" },
        ],
        eager_async: false,
      });

      const course = await Course.findById(courseid);
      if (!course) {
        return res.status(404).json({ msg: "course not found" });
      }

      const section = course.sections[sectionindex];
      if (!section) {
        return res.status(404).json({ msg: "section not found" });
      }

      const resolutions = {
        "720p": result.eager?.[0]?.secure_url,
        "480p": result.eager?.[1]?.secure_url,
        "360p": result.eager?.[2]?.secure_url,
        "144p": result.eager?.[3]?.secure_url,
      };

      console.log(resolutions);

      section.lessons.push({
        id: uuidv4(),
        title: title,
        videourl: result.secure_url,
        cloudinaryid: result.public_id,
        isfreepreview: isfreepreview === "true",
        resolutions: resolutions,
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

      if (!title) {
        return res.status(400).json({ msg: "missing required fields" });
      }

      const file = req.files?.video;
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

      if (file) {
        if (lesson.cloudinaryid) {
          await cloudinary.uploader.destroy(lesson.cloudinaryid, {
            resource_type: "video",
          });
        }

        const result = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: "lecture/videos",
          resource_type: "video",
          eager: [
            { width: 1280, crop: "scale", format: "mp4" },
            { width: 854, crop: "scale", format: "mp4" },
            { width: 640, crop: "scale", format: "mp4" },
            { width: 256, crop: "scale", format: "mp4" },
          ],
          eager_async: false,
        });

        const resolutions = {
          "720p": result.eager?.[0]?.secure_url,
          "480p": result.eager?.[1]?.secure_url,
          "360p": result.eager?.[2]?.secure_url,
          "144p": result.eager?.[3]?.secure_url,
        };

        lesson.videourl = result.secure_url;
        lesson.cloudinaryid = result.public_id;
        lesson.resolutions = resolutions;
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

      await Courseprogress.findOneAndDelete({ course: courseid });

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
      if (!req.files.thumbnail) {
        return res.status(400).json({ msg: "missing required fields" });
      }
      const { courseid } = req.params;

      const course = await Course.findById(courseid);
      const file = req.files.thumbnail;
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "lecture/photos",
      });

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

router.put("/courses/screenshot/:courseid", protect, async (req, res) => {
  try {
    if (!req.files || !req.files.screenshot) {
      return res.status(400).json({ msg: "no screenshot uploaded" });
    }

    const file = req.files.screenshot;

    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "screenshots",
    });

    const course = await Course.findById(req.params.courseid);
    if (!course) {
      return res.status(404).json({ msg: "course not found" });
    }
    const newscreenshot = {
      url: result.secure_url,
      uploadedby: req.user._id,
      course: req.params.courseid,
    };

    console.log(newscreenshot);
    course.screenshots.push(newscreenshot);

    await course.save();

    res.status(200).json(course.screenshots);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "failed to upload screenshot" });
  }
});

module.exports = router;
