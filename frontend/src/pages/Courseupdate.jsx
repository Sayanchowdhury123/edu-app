import { useContext, useState } from "react";
import { useEffect } from "react";
import axiosinstance from "../api";
import { Link, useNavigate } from "react-router-dom";
import { motion, noop } from "framer-motion";
import { Authcontext } from "../context/Authcontext";
import { IoSearch } from "react-icons/io5";
import { IoMdSearch } from "react-icons/io";
import { IoSearchCircleOutline } from "react-icons/io5";
import {Sun,Moon} from "lucide-react"
import { Themecontext } from "../context/Themecontext";
import toast from "react-hot-toast";
import Loadingscrenn from "./Loadingscreen";





const Courseupdates = () => {
   const {theme,toggletheme} = useContext(Themecontext)
   const {user} = useContext(Authcontext)
    const [courses, setcourses] = useState([])
    const [selectcategory, setselectcategory] = useState("")
    const [filtered, setfiltered] = useState([])
    const [category, setcategory] = useState([])
    const [profile, setprofile] = useState()
    const navigate = useNavigate()
    const [searcharray,setsercharray] = useState([])
    const [searchtext,setsearchtext] = useState("")
   const[loading,setloading] = useState(false)
   
   

    const fetchcourses = async () => {
        try {
            setloading(true)
              const res = await axiosinstance.get("/instructor/dashboard", {
                           headers: {
                               Authorization: `Bearer ${user.user.token}`
                           }
                       })
            setcourses(res.data.courses)
            console.log(res.data.courses);
             
        } catch (error) {
            console.log(error);
        }finally{
            setloading(false)
        }
    }

     useEffect(() => {
        fetchcourses();
    }, [])



       const userprofile = async () => {
        try {
            const res = await axiosinstance.get(`/users/profile`, {
                headers: {
                    Authorization: `Bearer ${user?.user?.token}`
                }
            })

            setprofile(res.data)
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
     userprofile();
    },[])

    if(searchtext) {
        const sa = courses.filter((c) => c.title === searchtext)
        setsercharray(sa)
    }


    const delupdate = async (courseid) => {
        try {
            const res = await axiosinstance.delete(`/courseupdate/del/${courseid}`,{
                 headers: {
                        Authorization: `Bearer ${user.user.token}`
                    }
            })
           
        setcourses(prev => prev.map(c => c._id === courseid ? {...c, announcement: {...c.announcement,text:""}} : c) )
            toast.success("removed announcement")

        
        } catch (error) {
            toast.error("failed to remove announcement")
        }
    }
   if(loading) return <Loadingscrenn/>
    return (
        <div className=" min-h-screen bg-base-200 py-5 " style={{scrollbarWidth:"none"}}>
      
    
           

            <div className="container mx-auto px-4"  >
                 

                <h1 className="text-3xl font-bold mb-8">Course Announcement</h1>

              

                <div className="h-[80vh] overflow-y-auto " style={{scrollbarWidth:"none"}} >
                      <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2  gap-8   "  >
                    {
                         courses?.map((course, index) => (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.03 }} transition={{ duration: 0.4, delay: index * 0.1 }}

                                key={course._id} className="card shadow-xl bg-base-100 hover:shadow-2xl transition-shadow">
                                <figure>
                                    <img src={course.thumbnail} alt="thumbnail" className="w-full h-48 object-cover " />
                                </figure>
                                <div className="card-body">

                                    <h1 className="card-title ">{course.title}</h1>
                                    
                                    <p className="text-sm text-gray-500">Update : {course.announcement.text}</p>
                                    <div className="card-actions justify-start mt-4">
                                        <Link className="btn btn-primary btn-sm" to={`/addupdate/${course._id}`}>
                                            Add Update
                                        </Link>
                                        <button  className="btn btn-success btn-sm" onClick={() => navigate(`/editupdate/${course._id}`,{
                                            state: {edittext: course?.announcement?.text}
                                        })} >
                                           Edit update
                                         </button>
                                         <Link className="btn btn-error btn-sm" onClick={() => delupdate(course._id)} >
                                            Remove Update
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

export default Courseupdates;