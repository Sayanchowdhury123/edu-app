
import { useContext, useState } from "react";
import { useEffect } from "react";
import axiosinstance from "../api";
import { Link, useNavigate } from "react-router-dom";
import { motion, noop } from "framer-motion";
import { Authcontext } from "../context/Authcontext";
import { IoMdSearch } from "react-icons/io";
import { IoSearchCircleOutline } from "react-icons/io5";
import Loadingscrenn from "./Loadingscreen";



const Search = () => {

    const { user } = useContext(Authcontext)
    const [courses, setcourses] = useState([])
     const[loading,setloading] = useState(false)
    const navigate = useNavigate()
    const [searcharray, setsercharray] = useState([])
    const [searchtext, setsearchtext] = useState("")


    useEffect(() => {
        fetchcourses();
    }, [])

    const fetchcourses = async () => {
        try {
            setloading(true)
            const res = await axiosinstance.get("/course")
            setcourses(res.data)

            setsercharray(res.data)
            //  console.log(res.data);



        } catch (error) {
            console.log(error);
        }finally{
            setloading(false)
        }
    }






    const s = (text) => {
        setsearchtext(text)
          if(searchtext){
            const sa = courses.filter(c => c.title?.toLowerCase().includes(text?.toLowerCase()))
            setsercharray(sa)
          }
    }


     if(loading) return <Loadingscrenn/>
    return (
        <div className=" min-h-screen bg-base-200 py-5 " style={{ scrollbarWidth: "none" }}>

            <div className="container mx-auto px-4"  >

                   <div className="flex justify-center gap-2 mb-8 relative">

                    <input type="text" className="input w-full" onChange={(e) => {
                        s(e.target.value)
                    }} value={searchtext} placeholder="Search Courses" />
                    <IoMdSearch className="text-2xl absolute right-5 top-2"/>

                </div>

                <div className="h-[80vh] overflow-y-auto " style={{ scrollbarWidth: "none" }} >
                     {searcharray.length > 0 ? (
                                              <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2  gap-8   "  >
                        {
                            searcharray?.map((course, index) => (
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
                     ) : (
                        <p className="text-2xl font-semibold ">no results found</p>
                     )}

                </div>


            </div>
        </div>
    )
}

export default Search;