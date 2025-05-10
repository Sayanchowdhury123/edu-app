const express = require("express");
const { getcourses, getcoursebyid, createcourse, getcoursevideos } = require("../controllers/coursecontroller");
const { protect, isinstructor } = require("../middleware/auth");
const router = express.Router();


router.get("/", getcourses)
router.get("/:id", getcoursebyid)
router.get("/:courseid/videos",protect,getcoursevideos)
router.post("/", protect,isinstructor,createcourse)


module.exports = router;