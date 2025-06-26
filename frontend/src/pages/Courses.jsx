
import { motion } from "framer-motion"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosinstance from "../api";
import Nav from "./Nav";
import Loadingscrenn from "./Loadingscreen";

const Courses = () => {
    const navigate = useNavigate()
    const [courses, setcourses] = useState([])
    const [loading, setloading] = useState(false)
    const fetchcourses = async () => {
        try {
            setloading(true)
            const res = await axiosinstance.get("/course")
            setcourses(res.data)
            console.log(res.data);
            //  console.log(res.data);



        } catch (error) {
            console.log(error);
        } finally {
            setloading(false)
        }
    }

    useEffect(() => {
        fetchcourses();
    }, [])

    //  if(loading) return <Loadingscrenn/>
    return (
        <div>
            <Nav />
            <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-purple-100 p-6">
                <motion.h1 initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 1 }} transition={{ duration: 0.5 }}
                    className="text-4xl font-bold text-purple-700 text-center mb-12"
                >
                    Explore Our Courses
                </motion.h1>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                    {courses?.map((c, i) => (
                        <motion.div key={c._id}
                            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2, duration: 0.5 }}
                            className="card bg-white shadow-xl hover:shadow-purple-200 hover:scale-[1.03] transition-transform duration-300">
                            <figure>
                                <img src={c?.thumbnail} alt={c?.title} className="w-full h-52 object-cover" />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title text-purple-700">{c?.title}</h2>
                                <p className="text-gray-500">{c?.description}</p>
                                <div className="text-sm  text-gray-500 ">Instructor: {c?.instructor?.name}</div>
                                <div className="card-actions justify-end">
                                   <button onClick={() => navigate(`/course/${c?._id}`)} className="btn btn-outline btn-sm text-purple-600 border-purple-400 hover:bg-purple-100">View Course</button>
                                </div>
                                   
                            </div>


                        </motion.div>
                    ))}
                </div>

            </div>
        </div>


    )
}

export default Courses;