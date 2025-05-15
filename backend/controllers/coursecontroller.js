const Course = require("../models/course");

exports.createcourse = async (req,res) => {
    try {
        const {title,description, price,category} = req.body;

        const course = await Course.create({
            title,
            description,
            price,
            category,
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
        
        const course = await Course.findById(req.params.courseid).populate("instructor", "name")
        
        res.json(course)
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:"failed to fetch cousre"})
    }
}

exports.getcoursevideos = async (req,res) => {
    try {
        const course = await Course.findById(req.params.courseid).select("title sections enrolledusers").lean()
         if(!course){
                return res.status(400).json({msg:"course not found"})
            }
        const isenrolled = course.enrolledusers.includes(req.user._id)
        const isinstructor = course.instructor.equals(req.user._id)

        if(!isenrolled && !isinstructor){
         return res.status(404).json({msg:"access denied"})
        }

        
            res.status(200).json({
                title: course.title,
                price: course.price,
                enrolledusers: course.enrolledusers,
                sections: course.sections.map((section,i) => ({
                    index: i,
                    title: section.title,
                    lessons: section.lessons.map((lesson,i) => ({
                        id: lesson.id,
                        videourl: lesson.videourl,
                        title: lesson.title,
                        isfreepreview: lesson.isfreeprivew
                    }))
                 }))
            })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"failed to fetch videos"})
    }
}

exports.updatecourse = async (req,res) => {
    try {
        const {title,description, price,category} = req.body;
            const course = await Course.findById(req.params.courseid);
            if(!course){
                return res.status(400).json({msg:"course not found"})
            }

            course.title = title || course.title;
            course.description = description || course.description;
            course.price = price || course.price;
            course.category = category || course.category;

            await course.save();

            res.status(200).json({msg:"course updated"})


    } catch (error) {
          console.log(error);
        res.status(500).json({msg:"failed to update course"})
    }
      

}


exports.deletecourse = async (req,res) => {
    try {
       
            const courses = await Course.find({instructor: req.user._id})
              const course = await Course.findByIdAndDelete(req.params.courseid);
            if(!course){
                return res.status(400).json({msg:"course not found"})
            }
          

        //  await course.save();

    res.status(200).json({msg:"course deleted"})


    } catch (error) {
          console.log(error);
        res.status(500).json({msg:"failed to deleted course"})
    }
      

}

