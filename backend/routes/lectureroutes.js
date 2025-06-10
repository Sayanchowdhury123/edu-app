const express = require("express");
const Message = require("../models/messages");
const { protect } = require("../middleware/auth");
const router = express.Router();
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fs = require("fs");
const path = require("path");
const Course = require("../models/course");
const { buffer } = require("stream/consumers");
const fontkit = require("fontkit");

router.get(
  "/:courseid/sections/:sectionindex/lessons/:lessonid/preview",
  async (req, res) => {
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
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=certificate.pdf",
        "Content-Length": lesson.lecture.length,
      });

      return res.send(Buffer.from(lesson.lecture));
    } catch (error) {
      console.log(error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to download lecture" });
      }
    }
  }
);

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
      pdfdoc.registerFontkit(fontkit);
      const page = pdfdoc.addPage([900, 1000]);
      const fontbytes = fs.readFileSync(
        path.join(__dirname, "../fonts/Roboto_Condensed-Medium.ttf")
      );
      const customfont = await pdfdoc.embedFont(fontbytes);
      const fontSize = 16;
      let y = 920;
      const maxcharperline = 135;

      const lines = lecture.match(new RegExp(`.{1,${maxcharperline}}`,'g'))
      
 
      page.drawText(`${coursename} lectures`, {
        x: 376,
        y: 950,
        font: customfont,
        size: 24,
        color: rgb(0, 0, 0),
      });

      for(const line of lines){
       page.drawText(line.trim(), {
          x: 20,
          y: y,
          font: customfont,
          size: fontSize,
          color: rgb(0, 0, 0),
        });
        y -= fontSize + 8;
      }
          
        
     
      

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

router.delete(
  "/:courseid/sections/:sectionindex/lessons/:lessonid",
  protect,
  async (req, res) => {
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

      lesson.lecture = "";
      await course.save();
      res.status(200).json({ msg: "lecture removed" });
    } catch (error) {
      console.log(error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to remove lecture" });
      }
    }
  }
);

module.exports = router;
