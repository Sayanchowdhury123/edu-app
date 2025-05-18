import { useState } from "react";
import { useEffect } from "react";
import axiosinstance from "../api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";




const Homepage = () => {

    const [courses, setcourses] = useState([])

    useEffect(() => {
        fetchcourses();
    }, [])

    const fetchcourses = async () => {
        try {
            const res = await axiosinstance.get("/course")
            setcourses(res.data)

            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className=" min-h-screen bg-base-200 py-10 ">
            <div className="container mx-auto px-4">


                <h1 className="text-4xl font-bold text-left mb-4 text-primary">All Courses</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2  gap-8 ">
                    {
                        courses?.map((course,index) => (
                            <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} whileHover={{scale:1.03}} transition={{duration:0.4, delay: index*0.1 }}
                            
                            key={course._id} className="card shadow-xl bg-base-100 hover:shadow-2xl transition-shadow">
                                <figure>
                                     <img src={course.thumbnail} alt="thumbnail" className="w-full h-48 object-cover " />
                                </figure>
                                <div className="card-body">
                                   
                                    <h1 className="card-title ">{course.title}</h1>
                                    <p className="text-sm line-clamp-2">{course.description?.substring(0,100)}</p>
                                    <p className="text-sm text-gray-500">Price : ₹{course.price}</p>
                                    <p className="text-sm text-gray-500">Author : {course.instructor.name}</p>
                                    <div className="card-actions justify-end mt-4">
                                    <Link className="btn btn-primary btn-sm">
                                    View Course
                                    </Link>
                                    </div>
                                </div>

                            </motion.div>
                        ))
                    }

                </div>

            </div>
        </div>
    )
}

export default Homepage;