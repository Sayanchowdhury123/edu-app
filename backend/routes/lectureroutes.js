const express = require("express");
const Message = require("../models/messages");
const { protect } = require("../middleware/auth");
const router = express.Router();
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fs = require("fs");
const path = require("path");
const Course = require("../models/course");
const { buffer } = require("stream/consumers");
const fontkit = require("fontkit")


router.get("/:courseid/sections/:sectionindex/lessons/:lessonid/preview",async (req,res) => {
        const { courseid } = req.params;
    const { sectionindex } = req.params;
    const { lessonid } = req.params;

    try {
           const course = await Course.findById(courseid);
      if (!course) {
        return res.status(404).json({ msg: "course not found" });
      }

      const section = course.sections[parseInt(sectionindex)];
      if (!section) {
        return res.status(404).json({ msg: "section not found" });
      }

      const lesson = section.lessons.find((l) => l.id === lessonid);
      if (!lesson) {
        return res.status(404).json({ msg: "lesson not found" });
      }
    
        res.set({
        "Content-Type":"application/pdf",
        "Content-Disposition":"inline; filename=certificate.pdf",
        "Content-Length": lesson.lecture.length
       })

          return  res.send(Buffer.from(lesson.lecture))

    } catch (error) {
         console.log(error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to download lecture" });
      }
    }
})

router.put(
  "/:courseid/sections/:sectionindex/lessons/:lessonid",
  protect,
  async (req, res) => {
    const { lecture, coursename } = req.body;
    const { courseid } = req.params;
    const { sectionindex } = req.params;
    const { lessonid } = req.params;
    try {
      const course = await Course.findById(courseid);
      if (!course) {
        return res.status(404).json({ msg: "course not found" });
      }

      const section = course.sections[parseInt(sectionindex)];
      if (!section) {
        return res.status(404).json({ msg: "section not found" });
      }

      const lesson = section.lessons.find((l) => l.id === lessonid);
      if (!lesson) {
        return res.status(404).json({ msg: "lesson not found" });
      }

      const pdfdoc = await PDFDocument.create();
      pdfdoc.registerFontkit(fontkit)
      const page = pdfdoc.addPage([1000, 1000]);
      const fontbytes = fs.readFileSync(path.join(__dirname,"../fonts/Roboto_Condensed-Medium.ttf"))
      const font = await pdfdoc.embedFont(fontbytes);
      const fontSize = 16;
      const {width} = page.getSize();
      const coursetextwidth = font.widthOfTextAtSize(coursename,24)
      const lecturetextwidth = font.widthOfTextAtSize(lecture,fontSize)

      page.drawText(`${coursename} lectures`, {
        x: (width - coursetextwidth) / 2,
        y: 750,
        size: 24,
        color: rgb(0, 0, 0),
      });

      page.drawText(`${lecture}`, {
        x:  (width - lecturetextwidth) / 2,
        y: 720,
        size: fontSize,
        color: rgb(0, 0, 0),
      });

      const pdfBytes = await pdfdoc.save();
    

      lesson.lecture = Buffer.from(pdfBytes);
      await course.save();
      res.status(200).json({ msg: "lecture added" });
    } catch (error) {
      console.log(error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to add lecture" });
      }
    }
  }
);


module.exports = router;
