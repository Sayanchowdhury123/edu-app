import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosinstance from "../api";
import { Authcontext } from "../context/Authcontext";
import "../App.css";
import { motion } from "framer-motion";
import { TiTick } from "react-icons/ti";
import { saveAs, SaveAs } from "file-saver";
import Congratulation from "./Congratulation";
import AnnouncementBanner from "./AnnouncementBanner";
import io from "socket.io-client"
import Loadingscrenn from "./Loadingscreen";
import toast from "react-hot-toast";

const socket = io("http://localhost:5000")

const Course = () => {
    const { courseid } = useParams()
    const [course, setcourse] = useState({})
    const { user } = useContext(Authcontext)
    const [en, seten] = useState(false)
    const [u, setu] = useState({})
    const [rating, setrating] = useState("")
    const [comment, setcomment] = useState("")
    const navigate = useNavigate();
    const [sim, setsim] = useState([]);
    const [courseprogress, setcourseprogress] = useState([])
    const [uploading, setuploading] = useState(false)
    const [loading, setloading] = useState(false)
    const [completelesson, setcompletelesson] = useState(false)
    const [quizresults, setquizresult] = useState([])
    const [reviews, setreviews] = useState([])
    const messageendref = useRef(null)
    const reviewcontainer = useRef(null)


    useEffect(() => {
        socket.emit("join-update", courseid)


        socket.on("got-update", (adata) => {

            setcourse((prev) => {
                return { ...prev, announcement: adata }
            })
        })

        return () => {
            socket.off("got-update")
        }
    }, [courseid])


    const fetchcourse = async () => {
        try {
            setloading(true)
            const res = await axiosinstance.get(`/course/${courseid}`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })

            

            setcourse(res.data)
             console.log(res.data);
            
            //  console.log(user.user);
        } catch (error) {
            console.log(error);
        } finally {
            setloading(false)
        }
    }


    useEffect(() => {

       // messageendref.current?.scrollIntoView({ behavior: "smooth" })

        reviewcontainer.current?.scrollTo({
            top: reviewcontainer.current.scrollHeight,
            behavior:"smooth"
        })

    }, [reviews.length])

    const fetchuser = async () => {
        try {
            const res = await axiosinstance.get(`/users/wishlist`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })
            setu(res.data)

            //console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    const progress = async () => {
        try {
            const res = await axiosinstance.get(`/progress`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })

            setcourseprogress(res.data)
            // console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        progress()
    }, [])

    useEffect(() => {
        fetchcourse();
       // console.log(courseid);

    }, [courseid])

    useEffect(() => {
        fetchuser();

    }, [user])



    const enrolled = async (courseid) => {
        try {
            setuploading(true)
            const res = await axiosinstance.post(`/enroll/${courseid}`, {}, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })
            seten(true)
            fetchcourse();
            toast.success("you are enrolled")
        } catch (error) {
            console.log(error);
            toast.error("failed to enroll")
        } finally {
            setuploading(false)
        }
    }

    const unenrolled = async (courseid) => {
        try {
            setuploading(true)
            const res = await axiosinstance.delete(`/enroll/${courseid}`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })

            fetchcourse();
            toast.success("you are unenrolled")
        } catch (error) {
            console.log(error);
            toast.error("failed to unenroll")
        } finally {
            setuploading(false)
        }
    }

    const addtowishlist = async (courseid) => {
        try {
            setuploading(true)
            const res = await axiosinstance.post(`/users/wishlist/${courseid}`, {}, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })

            fetchuser();
            toast.success("added to wishlist")

        } catch (error) {
            console.log(error);
            toast.error("failed to add to wishlist")
        } finally {
            setuploading(false)
        }
    }

    const removewishlist = async (courseid) => {
        try {
            setuploading(true)
            const res = await axiosinstance.delete(`/users/wishlist/${courseid}`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })

            fetchuser();
            toast.success("removed from wishlist")

        } catch (error) {
            console.log(error);
            toast.error("failed to remove from wishlist")
        } finally {
            setuploading(false)
        }
    }


    const fetchreview = async () => {
        try {
               const res = await axiosinstance.get(`/r/${courseid}`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })

             setreviews(res.data.reviews)
            // console.log(res.data.reviews);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
      fetchreview()
    },[])

    const addreview = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosinstance.post(`/r/${courseid}/${user.user.id}`, { rating, comment }, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })

            setreviews((prev) => [...prev, res.data])
            // fetchcourse();
            toast.success("review added")
            setrating("")
            setcomment("")
        } catch (error) {
            console.log(error);
            toast.error("failed to add review")
        }
    }

    const delr = async (reviewid) => {
        try {
            const res = await axiosinstance.delete(`/r/${courseid}/reviews/${reviewid}`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })
            const id = res.data;
            console.log(id);
            setreviews((prev) => prev.filter(r => r._id?.toString() !== id?.toString()))
            // fetchcourse();
            toast.success("review deleted")
        } catch (error) {
            console.log(error);
            toast.error("failed to delete review")
        }
    }

    const similarc = async (cat) => {
        try {
            const res = await axiosinstance.get(`/course/similar/${cat}/${courseid}`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })
            // console.log(res.data);
            setsim(res.data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (course && course.category) {
            similarc(course.category)
        }

    }, [course])

    const handleplay = (lesson) => {
        navigate(`/video/${lesson.id}`, {
            state: { videourl: lesson.videourl, title: lesson.title, courseid: courseid, lessonid: lesson.id }
        })
    }


    const Downloadcertificate = async () => {
        try {
            const res = await axiosinstance.post("/certificate/generate", {
                studentname: user.user.name,
                coursetitle: course?.title
            }, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                },
                responseType: "blob"
            })

            const blob = new Blob([res.data], { type: "application/pdf" });

            saveAs(blob, "certificate.pdf")
        } catch (error) {
            console.log(error);
        }
    }

    const coursep = courseprogress?.find(c => c.course === courseid)
    
    const completedlessonlength = coursep?.completedlesson?.length;
  
    const totallessons = course?.sections?.reduce((acc, section) => acc + section.lessons.length, 0)
  
    const alllessoncompleted = (
       course?.enrolledusers?.includes(user.user.id) && completedlessonlength === totallessons
    )
   
   






    if (loading) return <Loadingscrenn />
    return (

        <motion.div className=" mx-auto p-6 " initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} >

            {course?.announcement?.text?.length > 0 && course?.enrolledusers?.includes(user.user.id) && (<AnnouncementBanner announcement={course?.announcement} />)}

            {alllessoncompleted && <Congratulation courseid={course._id} />}


            {
                uploading && (
                    <div className="absolute inset-0 bg-black opacity-50 flex items-center justify-center z-1000">
                        <span className="loading loading-bars loading-lg text-primary">

                        </span>
                    </div>
                )
            }



            <div className="card bg-base-100 shadow-xl mb-6">
                <figure>
                    <motion.img src={course.thumbnail} alt="thumbnail" className="w-full h-96 object-cover bg-center" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} />
                </figure>

                <button className="btn " onClick={() => navigate(`/chat/${courseid}`, { state: { courseid: course._id } })}>{user.user.role === "instructor" ? "Chat With Students" : "Chat With Instructor"}</button>
                <button className="btn" onClick={() => navigate(`/forum/${courseid}`)}>Discussion forum</button>

                <div className="card-body">

                    <p className="card-title text-2xl font-bold">{course.title}</p>
                    <p className="text-sm line-clamp-2 text-gray-500">{course.description?.substring(0, 100)}</p>
                    <p className="text-lg text-gray-700">Price : ₹{course.price}</p>
                    <p className="text-sm text-gray-500">Author : {course.instructor?.name}</p>
                    <div className="mt-4">
                        {course.enrolledusers?.includes(user.user.id) ? (
                            <button className="btn btn-primary mr-4" onClick={() => unenrolled(course._id)}> Unenroll</button>
                        ) : (<button className="btn btn-secondary mr-4" onClick={() => enrolled(course._id)}> Enroll</button>)
                        }



                        {u?.wishlist?.some(w => w._id === course._id) ? (
                            <button className="btn btn-outline btn-accent  " onClick={() => removewishlist(course._id)}> Remove From Wishlist</button>)
                            : (<button className="btn btn-outline btn-accent  " onClick={() => addtowishlist(course._id)}> Add To Wishlist</button>)
                        }


                        {alllessoncompleted && (<button className="btn btn-success ml-4" onClick={Downloadcertificate} >Download Certificate</button>)}
                    </div>

                    <div className="mt-6">
                         <h1 className="text-2xl font-bold mb-4">Sections</h1>
                        {
                            course.enrolledusers?.includes(user.user.id) ? (
                                <div className="max-h-[260px] overflow-y-auto"   style={{ scrollbarWidth: "none" }}>
                                

                                    {course?.sections?.length === 0 ? (
                                        <p className="text-gray-500">No Sections Added Yet</p>
                                    ) : (
                                        <div style={{scrollbarWidth:"none"}}>
                                            {course?.sections?.map((s, index) => (
                                                <motion.div key={index} className="collapse collapse-arrow bg-base-200 mb-2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: index * 0.1 }}>

                                                    <input type="checkbox" />
                                                    <div className="collapse-title text-md font-medium">
                                                        {s.title || `Section ${index + 1}`}
                                                    </div>

                                                    <div className="collapse-content">
                                                        {s?.lessons?.map((l, i) => {
                                                            const coursep = courseprogress?.find(c => c.course === courseid)
                                                            const iscompleted = coursep?.completedlesson?.includes(l.id)


                                                            return (

                                                                <motion.div key={i} initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.3 }} className="flex items-center justify-between py-2 px-2 bg-base-100 rounded shadow-sm mb-1">
                                                                    <span className="text-sm font-medium">{l.title}</span>
                                                                    <div className="flex gap-2 items-center">
                                                                        {iscompleted && (<TiTick className="text-primary" />)}
                                                                        <button className="btn btn-xs btn-outline btn-primary relative r" onClick={() => handleplay(l)}>Watch video</button>
                                                                        {l.lecture && (<a className="btn btn-xs btn-outline btn-primary relative r" href={`http://localhost:5000/api/lecture/${courseid}/sections/${index}/lessons/${l.id}/preview`} target="_blank" rel="noopener noreferrer">Preview Lecture PDF</a>)}
                                                                        {l.quiz.length > 0 && (<button className="btn btn-xs btn-outline btn-primary relative r" onClick={() => navigate(`/render-quiz`, {
                                                                            state: { course: course, lessonid: l.id }
                                                                        })}>Give a quiz</button>)}
                                                                    </div>


                                                                </motion.div>

                                                            )

                                                        })}
                                                    </div>

                                                </motion.div>
                                            ))}
                                        </div>
                                    )}


                                </div>) : (<div>  <p className="text-sm text-gray-500">You have to enroll to watch videos</p> </div>
                            )
                        }
                    </div>




                    <motion.div className="space-y-4 mt-4" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        {course.enrolledusers?.includes(user.user.id) ? (
                            <div className="">
                                <h1 className="text-2xl font-bold mb-2">Add Review</h1>
                                <form onSubmit={addreview} className="">
                                    <textarea type="text" className="textarea w-full" placeholder="Write your comment" onChange={(e) => setcomment(e.target.value)} value={comment} />
                                    <div className="starability-slot mt-2">

                                        <input type="radio" id="rate1" value="1" name="rating" onChange={(e) => setrating(e.target.value)} />
                                        <label htmlFor="rate1" title="terrible">1 stars</label>

                                        <input type="radio" id="rate2" value="2" name="rating" onChange={(e) => setrating(e.target.value)} />
                                        <label htmlFor="rate2" title="not good">2 stars</label>

                                        <input type="radio" id="rate3" value="3" name="rating" onChange={(e) => setrating(e.target.value)} />
                                        <label htmlFor="rate3" title="average">3 stars</label>

                                        <input type="radio" id="rate4" value="4" name="rating" onChange={(e) => setrating(e.target.value)} />
                                        <label htmlFor="rate4" title="very good">4 stars</label>

                                        <input type="radio" id="rate5" value="5" name="rating" onChange={(e) => setrating(e.target.value)} />
                                        <label htmlFor="rate5" title="amazing">5 stars</label>




                                    </div>
                                    <button type="submit" className="btn btn-sm btn-info relative bottom-5">Add</button>

                                </form>
                            </div>
                        ) : (
                            <div>
                                <p className="text-sm text-gray-500">you have to enroll to comment</p>
                            </div>
                        )}

                        <div>
                            <h1 className="text-2xl font-bold mb-4">Reviews</h1>

                            {reviews?.length === 0 ? (
                                <p className="text-gray-500">No Reviews yet</p>
                            ) : (
                                <div className="max-h-89 overflow-y-auto space-y-3 p-2 bg-base-200 rounded-2xl shadow-xl scroll-smooth  " style={{ scrollbarWidth: "none" }} ref={reviewcontainer} >
                                    {Array.isArray(reviews) && reviews?.map((r) => (
                                        <div key={r._id} className="bg-base-100 p-4 rounded-2xl shadow flex flex-col gap-2">
                                        <div className="flex gap-2">
                                          <img src={r?.user?.avatar} alt=""  className="object-cover h-7 w-7 rounded-full "/>
                                            <p>{r?.user?.name}</p>
                                        </div>
                                            
                                            <div className="starability-result" data-rating={r.rating}></div>
                                            <p>Comment : <strong>{r.comment}  </strong></p>


                                            {course?.enrolledusers?.includes(user.user.id) && (
                                                <div className="flex gap-2">
                                                    <button className="btn btn-error btn-sm" onClick={() => delr(r._id)}>Delete</button>
                                                    <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/reviews/${r._id}/${courseid}`)}>Edit</button>

                                                </div>
                                            )}
                                        </div>
                                    ))}
                                  
                                </div>
                            )}

                        </div>
                    </motion.div>


                    <div className="mt-4">
                        <h1 className="text-2xl font-bold mb-4 ">Similar Courses</h1>

                        {sim?.length === 0 ? (
                            <div className="text-center space-y-2" >
                                <p className="text-error">No similar courses found</p>
                                <button onClick={() => navigate(`/home`)} className="btn btn-primary btn-sm"> Home Page</button>
                            </div>
                        ) : (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"  >
                                {sim?.map((w, i) => (
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

                                        <div className="card-actions  mt-4 pr-3 pb-6">
                                            <button className="btn btn-primary btn-sm w-full" onClick={() => navigate(`/course/${w._id}`)} >View Course</button>

                                        </div>

                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </motion.div>
    )
}


export default Course;