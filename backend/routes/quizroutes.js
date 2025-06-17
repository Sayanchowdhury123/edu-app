const express = require("express");
const { protect, isinstructor } = require("../middleware/auth");
const router = express.Router();
const Course = require("../models/course");
const Quizresult = require("../models/quizresults")

router.get("/result/:courseid",protect,async (req,res) => {
    const { courseid } = req.params;
           console.log(courseid);
    try {
        const qr =  await Quizresult.find({
            courseid: courseid,
            userid: req.user._id
           })

            if (!qr) {
             return res.status(400).json({ msg: "quiz result not found" });
           }

           res.status(200).json(qr)

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "failed to fetch quiz result" });
    }
})

router.put("/:courseid/sections/:sectionindex/lessons/:lessonid",protect,isinstructor,async (req,res) => {
    const {que,ans,options,title} = req.body;
      const { courseid } = req.params;
           const { sectionindex } = req.params;
           const { lessonid } = req.params;
           
     try {
        if (!que || !title || !ans || !options || !Array.isArray(options)) {
             return res.status(400).json({ msg: "invalid quiz data" });
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

          lesson.quiz.push({que,ans,options,title})

           await course.save();

           res.status(200).json({msg:"quiz created", course: course})
     } catch (error) {
              console.log(error);
      res.status(500).json({ msg: "failed to add quiz" });
     }
           
})


router.post("/result/:courseid/lessons/:lessonid",protect,async (req,res) => {
    const {score} = req.body;
        const { courseid } = req.params;
           const { lessonid } = req.params;
          console.log(score,courseid,lessonid);
          
    try {
         if (typeof score !== "number" || isNaN(score)) {
             return res.status(400).json({ msg: "invalid score" });
           }

           const existing = await Quizresult.findOne({
            courseid,
            lessonid,
            userid: req.user._id
           })

           if(existing){
            return res.status(400).json({msg:"Result already submitted"})
           }

           const newquizresult = new Quizresult({
              courseid: courseid,
              userid: req.user._id,
              score: score,
              lessonid: lessonid
           })

           await newquizresult.save()
     
        
           res.status(200).json(newquizresult)
    } catch (error) {
             console.log(error);
      res.status(500).json({ msg: "failed to save quiz result" });
    }
})

router.put("/:courseid/sections/:sectionindex/lessons/:lessonid/q/:quizid",protect,isinstructor,async (req,res) => {
  const {que,ans,options,title} = req.body;
  
           const { courseid } = req.params;
           const { sectionindex } = req.params;
           const { lessonid } = req.params;
           const {quizid} = req.params;
          // console.log(courseid,sectionindex,lessonid,quizid);
           
     try {
    
     
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

          const quiz = lesson.quiz.find((q) => q._id?.toString() === quizid?.toString())
            

          if(!quiz){
            return res.status(400).json({msg:"quiz not found"})
          }
          
          quiz.que = que;
          quiz.ans = ans;
          quiz.options = options;
          quiz.title = title;

           await course.save();

           res.status(200).json({msg:"quiz updated"})
     } catch (error) {
              console.log(error);
      res.status(500).json({ msg: "failed to update quiz" });
     }
           
})

router.delete("/:courseid/sections/:sectionindex/lessons/:lessonid/q/:quizid",protect,isinstructor,async (req,res) => {

      const { courseid } = req.params;
           const { sectionindex } = req.params;
           const { lessonid } = req.params;
           const {quizid} = req.params;
           
     try {
    
     
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

      lesson.quiz = lesson.quiz.filter(q => q._id.toString() !== quizid)

           await course.save();

           res.status(200).json({msg:"quiz deleted"})
     } catch (error) {
              console.log(error);
      res.status(500).json({ msg: "failed to delete quiz" });
     }
           
})


module.exports = router;