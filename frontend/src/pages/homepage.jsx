import { useContext, useState } from "react";
import { useEffect } from "react";
import axiosinstance from "../api";
import { Link } from "react-router-dom";
import { motion, noop } from "framer-motion";





const Homepage = () => {

   
    const [courses, setcourses] = useState([])
    const [selectcategory, setselectcategory] = useState("")
    const [filtered, setfiltered] = useState([])
    const [category, setcategory] = useState([])
 

    useEffect(() => {
        fetchcourses();
    }, [])

    const fetchcourses = async () => {
        try {
            const res = await axiosinstance.get("/course")
            setcourses(res.data)
            setfiltered(res.data)
            //  console.log(res.data);

            const unique = [
                "All", ...new Set(res.data.map((c) => c.category))
            ]


            setcategory(unique)

        } catch (error) {
            console.log(error);
        }
    }



    useEffect(() => {
        if (selectcategory === "All") {
            setfiltered(courses)
        } else {
            const filter = courses.filter((c) => c.category === selectcategory)
            setfiltered(filter)
        }
    }, [selectcategory])

    return (
        <div className=" min-h-screen bg-base-200 py-10 " style={{scrollbarWidth:"none"}}>
            <div className="container mx-auto px-4"  >


                <h1 className="text-4xl font-bold text-center mb-4 text-primary">Browse Courses</h1>

                <div className="flex justify-center mb-8">
                    <select className="select w-full max-w-xs" onChange={(e) => setselectcategory(e.target.value)} value={selectcategory} >
                        {category.map((cat, index) => (

                            <option key={index}>{cat}</option>

                        ))}
                    </select>
                </div>

                <div className="h-[80vh] overflow-y-auto " style={{scrollbarWidth:"none"}} >
                      <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2  gap-8   "  >
                    {
                        filtered?.map((course, index) => (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.03 }} transition={{ duration: 0.4, delay: index * 0.1 }}

                                key={course._id} className="card shadow-xl bg-base-100 hover:shadow-2xl transition-shadow">
                                <figure>
                                    <img src={course.thumbnail} alt="thumbnail" className="w-full h-48 object-cover " />
                                </figure>
                                <div className="card-body">

                                    <h1 className="card-title ">{course.title}</h1>
                                    <p className="text-sm line-clamp-2">{course.description?.substring(0, 100)}</p>
                                    <p className="text-sm text-gray-500">Price : ₹{course.price}</p>
                                    <p className="text-sm text-gray-500">Author : {course.instructor.name}</p>
                                    <div className="card-actions justify-end mt-4">
                                        <Link className="btn btn-primary btn-sm" to={`/course/${course._id}`}>
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
        </div>
    )
}

export default Homepage;