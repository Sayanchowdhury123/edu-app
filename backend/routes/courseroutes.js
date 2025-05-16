const express = require("express");
const {
  getcourses,
  getcoursebyid,
  createcourse,
  getcoursevideos,
  updatecourse,
  deletecourse
} = require("../controllers/coursecontroller");
const { protect, isinstructor } = require("../middleware/auth");
const router = express.Router();
const Course = require("../models/course");

router.get("/", getcourses);
router.get("/:courseid", getcoursebyid);
router.get("/:courseid/videos", protect, getcoursevideos);
router.post("/", protect, isinstructor, createcourse);
router.put("/:courseid",protect,isinstructor, updatecourse)
router.delete("/:courseid",protect,isinstructor, deletecourse)

router.post("/:courseid/sections", protect, isinstructor, async (req, res) => {
  try {
    const { title } = req.body;
    const course = await Course.findById(req.params.courseid);
    course.sections.push({
      title: title,
      lessons: [],
    });
    await course.save();
    res.status(200).json({ msg: "section added", sections: course.sections });
  } catch (error) {
    console.log(error);
    res.status(200).json({ msg: "failed to add section" });
  }
});

router.put(
  "/:courseid/sections/:sectionindex",
  protect,
  isinstructor,
  async (req, res) => {
    try {
      const { title } = req.body;
      const {sectionindex} = req.params.sectionindex;
      const course = await Course.findById(req.params.courseid);
      console.log(req.params.sectionindex);
      if (!course) {
        return res.status(400).json({ msg: "course not found" });
      }
   
      const section = course.sections[req.params.sectionindex];
       
          if(!section){
            return res.status(404).json({msg:"section not found"})
        }

       

        section.title = title;
        await course.save();

         res.status(200).json({ msg: "section updated", sections: course.sections });
        
    } catch (error) {
       console.log(error);
    res.status(200).json({ msg: "failed to edit section" });
    }
  }
);

router.delete(
  "/:courseid/sections/:sectionindex",
  protect,
  isinstructor,
  async (req, res) => {
    try {
      
      const {sectionindex} = req.params.sectionindex;
      const course = await Course.findById(req.params.courseid);
      if (!course) {
        return res.status(400).json({ msg: "course not found" });
      }

      if(sectionindex < 0 || sectionindex > course.sections.length){
        return res.status(400).json({msg:'invalid section index'})
      }

        course.sections.splice(sectionindex,1)
        await course.save();

         res.status(200).json({ msg: "section deleted" });
        
    } catch (error) {
       console.log(error);
    res.status(200).json({ msg: "failed to delete section" });
    }
  }
);

module.exports = router;
