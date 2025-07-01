import { useContext, useState } from "react";
import { useEffect } from "react";
import axiosinstance from "../api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, noop } from "framer-motion";
import { Authcontext } from "../context/Authcontext";
import { IoSearch } from "react-icons/io5";
import { IoMdSearch } from "react-icons/io";
import { IoSearchCircleOutline } from "react-icons/io5";
import { Sun, Moon } from "lucide-react"
import { Themecontext } from "../context/Themecontext";
import Loadingscrenn from "./Loadingscreen";





const Homepage = () => {
    const { theme, toggletheme } = useContext(Themecontext)
    const { user } = useContext(Authcontext)
    const [courses, setcourses] = useState([])

    const [filtered, setfiltered] = useState([])
    const [category, setcategory] = useState([])
    const [profile, setprofile] = useState()
    const navigate = useNavigate()
    const [searcharray, setsercharray] = useState([])
    const [searchtext, setsearchtext] = useState("")
    const [loading, setloading] = useState(false)
    const location = useLocation()
    const [selectcategory, setselectcategory] = useState("All")





    const fetchcourses = async () => {
        try {
            setloading(true)
            const res = await axiosinstance.get("/course")
            setcourses(res.data)
            setfiltered(res.data)
            setsercharray(res.data)
            console.log(user);

            const unique = [
                "All", ...new Set(res.data.map((c) => c.category))
            ]


            setcategory(unique)

        } catch (error) {
            console.log(error);
        } finally {
            setloading(false)
        }
    }

    useEffect(() => {
        fetchcourses();
    }, [])

    const catc = async () => {
        try {
            const res = await axiosinstance.get(`/course/category/${location.state?.cat}`)
            setfiltered(res.data)
            setselectcategory(location.state?.cat)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (location.state?.cat) {
            console.log(location.state?.cat);
            if (location.state?.cat) {
                catc();
            }
        }
    }, [location.state])



    useEffect(() => {
        if (selectcategory === "All") {
            setfiltered(courses)

        } else {
            console.log(selectcategory);
            const filter = courses.filter((c) => c.category === selectcategory)
            setfiltered(filter)
        }
    }, [selectcategory])


    const userprofile = async () => {
        try {
            const res = await axiosinstance.get(`/users/profile`, {
                headers: {
                    Authorization: `Bearer ${user?.user?.token}`
                }
            })

            setprofile(res.data)
            //console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        userprofile();
    }, [])

    if (searchtext) {
        const sa = courses.filter((c) => c.title === searchtext)
        setsercharray(sa)
    }
    if (loading) return <Loadingscrenn />
    return (
        <div className=" min-h-screen bg-base-200 py-5 " style={{ scrollbarWidth: "none" }}>

            <div className="flex justify-end items-center gap-6 px-6 cursor-pointer"  >
                <div>
                    <button onClick={toggletheme} className="btn btn-sm btn-outline">
                        {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
                        {theme === "light" ? "Dark" : "Light"}
                    </button>

                </div>
                {user?.user?.token && (
                    <div className="flex items-center gap-2 " onClick={() => navigate(`/profile`)}>
                        <motion.img initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 100 }} src={profile?.user?.avatar} alt="avatar" className="rounded-[50%] w-10 h-10 object-cover shadow-xl" />
                        <p className="text-primary font-semibold text-sm">{profile?.user?.name}</p>
                    </div>
                )}

            </div>


            <div className="container mx-auto px-4"  >


                <h1 className="text-4xl font-bold text-center mb-4 text-primary">Browse Courses</h1>

                <div className="flex justify-center gap-2 mb-8 ">
                    <select className="select w-full max-w-xs " onChange={(e) => setselectcategory(e.target.value)} value={selectcategory} >
                        {category.map((cat, index) => (

                            <option key={index}>{cat}</option>

                        ))}
                    </select>


                    <IoSearch className={`relative   top-[2px] text-4xl ${theme === "light" ? "bg-black text-white" : "bg-white text-black"}  rounded-full p-2 cursor-pointer`} onClick={() => navigate("/search")} />


                </div>

                <div className="h-[80vh] overflow-y-auto " style={{ scrollbarWidth: "none" }} >
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