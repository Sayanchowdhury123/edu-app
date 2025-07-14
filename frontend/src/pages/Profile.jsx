import { useContext, useEffect, useRef, useState } from "react";
import axiosinstance from "../api";
import { Authcontext } from "../context/Authcontext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CiCirclePlus } from "react-icons/ci";
import { motion } from "framer-motion";
import Cp from "./Cp";
import { FaEdit } from "react-icons/fa";
import toast from "react-hot-toast";
import { IoIosHome } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import { FaBarsProgress } from "react-icons/fa6";
import { RiProgress3Fill } from "react-icons/ri";
import Loadingscrenn from "./Loadingscreen";


const Profile = () => {
    const { login, user, logout } = useContext(Authcontext)
    const location = useLocation();
    const { videourl, title, courseid, lessonid } = location.state || {};
    const [courseprogress, setcourseprogress] = useState([])
    const [avatar, setavatar] = useState("")
    const [profile, setprofile] = useState()
    const fileinputref = useRef(null);
    const navigate = useNavigate()
    const [wl, setwl] = useState([])
    const [uploading, setuploading] = useState(false)
    const [newname, setnewname] = useState("")
    const [modal, setmodal] = useState(false)
    const [loading, setloading] = useState(false)
    const [qr, setqr] = useState([])


    const become_ins = async () => {
        console.log(user.user.token);
        try {
            const res = await axiosinstance.put("/instructor/become-instructor", {}, {
                headers: {
                    Authorization: `Bearer ${user?.user?.token}`
                }
            })
            login(res.data)
            toast.success("you became instructor")
        } catch (error) {
            console.log(error);
            toast.error("failed to become instructor")
        }
    }

    const progress = async () => {
        try {
            const res = await axiosinstance.get(`/progress`, {
                headers: {
                    Authorization: `Bearer ${user?.user?.token}`
                }
            })

            setcourseprogress(res.data)
           //  console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        progress();

    }, [])

    const handlefile = async () => {
        fileinputref.current.click()
    }

    const filechange = async (e) => {
        const file = e.target.files[0];

        setavatar(file)
        if (file) {
            const formdata = new FormData();
            formdata.append("avatar", file)

            try {
                setuploading(true)
                const res = await axiosinstance.patch(`/users/upload-avatar`, formdata, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${user?.user?.token}`

                    }
                })
                userprofile();
                toast.success("avatar updated")

            } catch (error) {
                console.log(error);
                toast.error("failed to update avatar")
            } finally {
                setuploading(false)
            }
        }

    }

    const userprofile = async () => {
        try {
            setloading(true)
            const res = await axiosinstance.get(`/users/profile`, {
                headers: {
                    Authorization: `Bearer ${user?.user?.token}`
                }
            })

            setprofile(res.data)
            //console.log(res.data);
        } catch (error) {
            console.log(error);
        } finally {
            setloading(false)
        }
    }

    useEffect(() => {
        userprofile();

    }, [])

    const unenrolled = async (courseid) => {
        try {
            const res = await axiosinstance.delete(`/enroll/${courseid}`, {
                headers: {
                    Authorization: `Bearer ${user?.user?.token}`
                }
            })

            userprofile()
            toast.success("you are unenrolled")
        } catch (error) {
            console.log(error);
            toast.error("you failed to unenroll")
        }
    }

    const wishlist = async () => {
        try {
            const res = await axiosinstance.get(`/users/wishlist`, {
                headers: {
                    Authorization: `Bearer ${user?.user?.token}`
                }
            })

            setwl(res.data)

            //  console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        wishlist();
    }, [])

    const removewishlist = async (courseid) => {
        try {
            const res = await axiosinstance.delete(`/users/wishlist/${courseid}`, {
                headers: {
                    Authorization: `Bearer ${user?.user?.token}`
                }
            })

            wishlist()
            toast.success("removed from wishlist")

        } catch (error) {
            console.log(error);
            toast.error("failed to remove from wishlist")
        }
    }


    const editprofile = async () => {
        try {
            const res = await axiosinstance.put(`/users/profile`, { name: newname }, {
                headers: {
                    Authorization: `Bearer ${user?.user?.token}`
                }
            })

            userprofile();
            toast.success("profile name edited")

        } catch (error) {
            console.log(error);
            toast.error("failed to update profile")
        }
    }


    const fetchqr = async () => {

        try {
            const res = await axiosinstance.get(`/quiz/result`, {
                headers: {
                    Authorization: `Bearer ${user?.user?.token}`
                }
            })


            console.log(res.data);
            setqr(res.data)
            //  console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchqr()
    }, [])

    if (loading) return <Loadingscrenn />
    return (
        <motion.div className=' min-h-screen p-8' initial={{ opacity: 1, y: 50 }}
            animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}  >

            {modal && (
                <motion.div className="absolute inset-0 bg-black opacity-50 flex items-center justify-center rounded-t-xl gap-4 z-1000"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-base-300 p-6 rounded-xl shadow-xl w-full max-w-md space-y-4 ">
                        <input name="" id="" onChange={(e) => setnewname(e.target.value)} placeholder="Edit your name" className="input input-bordered w-full" />

                        <div className="flex justify-between">
                            <button className="btn btn-success " onClick={(e) => {
                                editprofile()
                                setmodal(false)
                            }}>Save Changes</button>
                            <button onClick={() => setmodal(false)} className="btn ">Cancel</button>
                        </div>

                    </motion.div>




                </motion.div>
            )}


            <div className="flex gap-4 mb-4 justify-between">

                <div>
                    <Link className="btn btn-primary" to={"/home"}>
                        <IoIosHome />  Home Page
                    </Link>


                </div>

                <div className="flex gap-4">
                    {user?.user?.role === "instructor" ? "" : <button onClick={become_ins} className="btn btn-primary">Become instructor</button>}

                    <button className="btn btn-error " onClick={logout}>
                        <IoIosLogOut className="relative " />
                        <p className="inline-block relative bottom-[1px]">Logout</p>
                    </button>

                    {
                        user?.user?.role === "instructor" && (
                            <Link className="btn btn-accent" to={"/instructor-dasshboard"}>
                                <MdDashboard />   <p className="inline-block relative bottom-[1px]">Instructor Dashboard</p>
                            </Link>
                        )
                    }

                </div>

            </div>


            <div className="mt-10 text-center mb-8">
                <div className=" mx-auto  w-64 relative">

                    <motion.img initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 100 }} src={profile?.user?.avatar} alt="avatar" className="rounded-[50%] w-64 h-64 object-cover border-4 border-primary shadow-xl" />
                    {
                        uploading && (
                            <div className="absolute inset-0 bg-black opacity-50 flex items-center justify-center rounded-full">
                                <span className="loading loading-bars loading-lg text-primary">

                                </span>
                            </div>
                        )
                    }
                    <motion.div className="absolute top-[190px] right-4 cursor-pointer" whileHover={{ scale: 1.2 }}>
                        <CiCirclePlus className="text-5xl " onClick={handlefile} />
                    </motion.div>
                    <input type="file" className=" file-input hidden" onChange={(e) => filechange(e)} ref={fileinputref} />

                </div>


                <p className="text-xl font-semibold mt-4 inline-block">{profile?.user?.name}</p>
                <motion.div className="inline-block relative left-1 bottom-[3px]" whileHover={{ scale: 1.2 }}>
                    <FaEdit className="inline-block " onClick={() => {
                        setmodal(true)

                    }} />
                </motion.div>

                <p className="text-gray-500">{profile?.user?.email}</p>
            </div>




            <div className=" mb-8">
                <p className="text-2xl font-semibold mb-2 inline-block">Course Progress</p>
                <div>
                    {courseprogress?.length === 0 ? (
                        <div className="text-center space-y-2">
                            <p className="text-error">you have to watch course videos</p>
                            <button onClick={() => navigate(`/home`)} className="btn btn-primary btn-sm">  <IoIosHome />  Home Page</button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 sm:grid-cols-2 gap-6 ">
                            {courseprogress?.map((progress, i) => {
                                const course = profile?.enrolledcourses?.find(c => c._id === progress.course)
                                const totallessons = course?.sections?.reduce((acc, section) => acc + section.lessons.length, 0) || 0;
                                const completed = progress?.completedlesson?.length;
                                const percentage = totallessons ? Math.floor((completed / totallessons) * 100) : 0;


                                return (
                                    <motion.div key={i} className="p-3 bg-base-100 rounded-box shadow-md flex items-center gap-6 "
                                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: i * 0.1 }}
                                    >
                                        <div>
                                            <p className="font-semibold text-primary">{course?.title}</p>
                                            <p className="text-sm text-gray-500">{percentage}% completed ({completed} / {totallessons} lessons)</p>

                                        </div>
                                        <Cp percentage={percentage} />


                                    </motion.div>
                                )
                            })}
                        </div>
                    )}

                </div>
            </div>


            <div className=" mb-8">
                <p className="text-2xl font-semibold mb-2 inline-block">Quiz Results</p>
                <div >
                    {qr?.length === 0 ? (
                        <div className="text-center space-y-2">
                            <p className="text-error">you have to solve quizes</p>
                            <button onClick={() => navigate(`/home`)} className="btn btn-primary btn-sm"> Home Page</button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 sm:grid-cols-2 gap-6 ">
                            {qr?.map((q, i) => {
                                const course = profile?.enrolledcourses?.find(c => c._id === q.courseid._id)
                                const lesson = course?.sections
                                    ?.flatMap(s => s.lessons)
                                    ?.find(l => l.id === q.lessonid)

                                const ql = lesson?.quiz?.length;
                                const qn = lesson?.quiz?.map((n) => n.title);

                                const percentage = ql ? Math.floor((q.score / ql) * 100) : 0;


                                return (
                                    <div key={i}>
                                 {ql === 0 ? "" : (
                                     <motion.div key={i} className="card bg-base-100 shadow-xl transition-all hover:scale-[1.02]"
                                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: i * 0.1 }}
                                        >

                                            <div className="card-body ">
                                                <h1 className="card-title text-primary">{lesson?.title} </h1>

                                                <p className="text-sm text-gray-500">Quizes: <span className="font-medium">{ql}</span> </p>

                                                <p className="text-sm text-gray-500" > <span className="font-medium">{percentage}%</span> Answered ({q.score} / {ql} Quizes)</p>
                                                <p className="text-sm text-gray-500" >Attempted on: <span className="font-medium">{new Date(q.submittedAt).toLocaleDateString()}</span>  </p>

                                                <progress max="100" value={percentage} className="w-full progress progress-primary">

                                                </progress>
                                            </div>



                                        </motion.div>
                                 )}
                                      
                                    </div>

                                )
                            })}
                        </div>
                    )}

                </div>
            </div>



            <div className="">
                <h1 className="text-2xl font-semibold mb-6">Enrolled Courses</h1>

                {profile?.enrolledcourses?.length === 0 ? (

                    <div className="text-center space-y-2">
                        <p className="text-error">you are not enrolled in any courses</p>
                        <button onClick={() => navigate(`/home`)} className="btn btn-primary btn-sm">  <IoIosHome />  Home Page</button>
                    </div>

                ) : (

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"  >
                        {profile?.enrolledcourses?.map((course, i) => (
                            <motion.div key={course._id} className="card bg-base-100 shadow-xl "
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                            >

                                <figure>
                                    <img src={course?.thumbnail} alt="thumbnail" className="h-48 w-full object-cover" />
                                </figure>

                                <div className="card-body">
                                    <p className="card-title text-xl font-semibold text-primary" >{course.title}</p>
                                    <p className="text-lg text-gray-700">Price : ₹{course.price}</p>
                                    <p className="text-sm text-gray-500">Author : {course.instructor?.name}</p>
                                </div>

                                <div className="card-actions justify-end mt-4 pr-3 pb-6 ">
                                    <button className="btn btn-primary btn-sm" onClick={() => navigate(`/course/${course._id}`)} >View Course</button>
                                    <button className="btn btn-error btn-sm" onClick={() => unenrolled(course._id)} >Unenroll</button>
                                </div>


                            </motion.div>
                        ))}
                    </div>
                )}

            </div>


            <div className="mt-6">
                <h1 className="text-2xl font-semibold mb-6">Wishlist</h1>

                {wl?.wishlist?.length === 0 ? (
                    <div className="text-center space-y-2" >
                        <p className="text-error">you have add to courses to wishlist</p>
                        <button onClick={() => navigate(`/home`)} className="btn btn-primary btn-sm">  <IoIosHome />  Home Page</button>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"  >
                        {wl?.wishlist?.map((w, i) => (
                            <motion.div key={w._id} className="card bg-base-100 shadow-xl "
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: i * 0.1 }} >
                                <figure>
                                    <img src={w?.thumbnail} alt="thumbnail" className="h-48 w-full object-cover" />
                                </figure>

                                <div className="card-body">
                                    <p className="card-title text-xl font-semibold text-primary">{w.title}</p>
                                    <p className="text-lg text-gray-700">Price : ₹{w.price}</p>
                                    <p className="text-sm text-gray-500">Author : {w.instructor?.name}</p>
                                </div>

                                <div className="card-actions justify-end mt-4 pr-3 pb-6">
                                    <button className="btn btn-primary btn-sm" onClick={() => navigate(`/course/${w._id}`)} >View Course</button>
                                    <button className="btn btn-error btn-sm" onClick={() => removewishlist(w._id)} >Remove From Wishlist</button>
                                </div>

                            </motion.div>
                        ))}
                    </div>
                )}

            </div>


        </motion.div>
    )
}

export default Profile;