const Course = require("../models/course");

exports.createcourse = async (req,res) => {
    try {
        const {title,description, price,category, videos, thumbnail} = req.body;

        const course = await Course.create({
            title,
            description,
            price,
            category,
            videos,
            thumbnail,
            instructor: req.user._id
        })

        res.status(201).json(course);
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:"error creating cousre"})
    }
}

exports.getcourses = async (req,res) => {
    try {
        const courses = await Course.find().populate("instructor", "name")
        res.json(courses)
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:"failed to fetch cousres"})
    }
}

exports.getcoursebyid = async (req,res) => {
    try {
        const course = await Course.findById(req.params.id).populate("instructor", "name")
        res.json(course)
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:"failed to fetch cousre"})
    }
}