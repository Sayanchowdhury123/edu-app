const express = require("express");
const { protect, isinstructor } = require("../middleware/auth");
const Course = require("../models/course");
const router = express.Router();


router.get("/dashboard",protect,isinstructor,async (req,res) => {
    try {
        const courses = await Course.find({instructor: req.user._id}).select("title price enrolledusers reviews").lean();
        let totalstudents = 0;
        let totalrevenue = 0;

    const coursestats  =  courses.forEach((c) => {
            let students = c.enrolledusers.length;
            let revenue = students * c.price;

            totalrevenue += revenue;
            totalstudents += students;

            return {
                courseid: c._id,
                students: students,revenue,
                title: c.title,
                price: c.price,
                reviews: c.reviews.length || 0
            }
        })

        res.status(200).json({
            totalrevenue,
            totalstudents,
            totalcourses: courses.length,
            courses: coursestats
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"failed to load dashboard data"})
    }
})


module.exports = router;