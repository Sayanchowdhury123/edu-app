import { useContext, useEffect, useRef, useState } from "react";
import { Authcontext } from "../context/Authcontext";
import axiosinstance from "../api";
import { Link, useNavigate } from "react-router-dom";
import { motion, stagger } from "framer-motion";
import toast from "react-hot-toast";
import Loadingscrenn from "./Loadingscreen";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.3,
            staggerChildren: 0.15,
        }
    }
}


const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
}

const Cousremanagementpage = () => {
    const { user } = useContext(Authcontext)
    const [course, setcousre] = useState([])
    const fileinput = useRef(null);
    const [file, setfile] = useState("")
    const [uploading, setuploading] = useState(null)
    const navigate = useNavigate()
      const[loading,setloading] = useState(false)

    const fetchinfo = async () => {
        try {
            setloading(true)
            const res = await axiosinstance.get("/instructor/dashboard", {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })
            setcousre(res.data.courses)
            
            //console.log(res.data.courses);
        } catch (error) {
            console.log("failed to fetch");
        }finally{
            setloading(false)
        }
    }

    useEffect(() => {

        fetchinfo();
    }, [user])

    const delprogress = async (courseid) => {
        try {
            const res = await axiosinstance.delete(`/progress/${courseid}`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })

        } catch (error) {
            console.log(error);
        }
    }



    const deletecourse = async (courseid) => {
        try {
            const res = await axiosinstance.delete(`/course/${courseid}`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })

            delprogress(courseid)

            fetchinfo();
            toast.success("Course Deleted")
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete course")
        }
    }

    const handlefile = async () => {
        fileinput.current.click();

    }

    const filechange = async (event, courseid) => {
        const file = event.target.files[0];
        setfile(file)
        const formdata = new FormData();
        formdata.append("thumbnail", file)

        if (file && courseid) {
            try {
                setuploading(courseid)
                const res = await axiosinstance.patch(`/courses/${courseid}/upload-thumbnail`, formdata, {
                    headers: {
                        Authorization: `Bearer ${user.user.token}`,
                        "Content-Type": "multipart/form-data"
                    }
                })



                fetchinfo();
                toast.success("Thumbnail Added")
            } catch (error) {
                console.log(error);
                toast.error("Failed to add thunbnail")

            } finally {
                setuploading(null)
            }

        }


    }
    
      if(loading) return <Loadingscrenn/>

    return (
        <motion.div className="p-6" initial="hidden" animate="visible" variants={containerVariants}  >
      <div className="flex justify-between items-center mb-4">
            <motion.h1 className="text-2xl font-bold " variants={cardVariants}>
                Manage your courses
            </motion.h1>


            <div className="space-x-2">
              <button onClick={() => navigate('/create-course')} className="btn btn-primary ">Create Course</button>
                <button className="btn btn-neutral  font-semibold" onClick={() => navigate("/course-updates")}>Course Updates</button>
            </div>
      </div>
          

            

            <div>
                {course?.length === 0 ? (
                    <div className=" h-[87vh] flex flex-col items-center justify-center gap-2">
                        <p className="text-error">No Courses Created Yet</p>

                    </div>
                ) : (
                    <motion.div className="grid grid-cols-1  md:grid-cols-3 gap-6" variants={containerVariants}>
                        {
                            course?.map((c) => (

                                <motion.div key={c._id} className="card bg-base-100 shadow-xl"
                                    variants={cardVariants} whileHover={{ scale: 1.02 }}

                                >

                                    <div className="card-body ">

                                        <img src={`${c.thumbnail}?${new Date().getTime()}`} alt="thumbnail" className="w-full h-64 object-cover rounded-xl bg-base-100" />
                                        {
                                            uploading === c._id && (
                                                <div className="absolute inset-0 bg-black opacity-50 flex items-center justify-center rounded-t-xl" >
                                                    <span className="loading loading-bars loading-lg text-primary">

                                                    </span>
                                                </div>
                                            )
                                        }
                                        <h2 className="card-title">{c.title}</h2>
                                        <p>Price: ₹{c.price}</p>
                                        <p>Reviews: {c.reviews.length}</p>
                                        <p>Enrolled users: {c.enrolledusers.length}</p>
                                        <input type="file" name="" id="" ref={fileinput} className="hidden" onChange={(event) => filechange(event, c._id)} />




                                    </div>

                                    <div className="card-actions">
                                       
                                        <Link to={`/instructor/edit-course/${c._id}`} className="btn btn-primary btn-sm mb-4 ml-6 btn-outline">Edit</Link>
                                        <button onClick={(e) => {
                                            e.stopPropagation()
                                            deletecourse(c._id)
                                        }} className="btn btn-error btn-outline btn-sm mb-4">Delete</button>
                                        <button onClick={handlefile} className="btn btn-secondary btn-sm mb-4 btn-outline ">Add thumbnail</button>

                                        <button className="btn btn-sm btn-outline" onClick={() => navigate(`/session-lesson/${c._id}`, {
                                            state: { coursename: c.title }
                                        })}>
                                            Manage Course
                                        </button>

                                        <button className="btn btn-sm btn-success btn-outline" onClick={() => navigate(`/approval/${c._id}`,{
                                            state: {course: c}
                                        })}>
                                          Payments 
                                        </button>

                                    </div>


                                </motion.div>
                            ))
                        }
                    </motion.div>
                )}

            </div>

        </motion.div>


    )
}

export default Cousremanagementpage;