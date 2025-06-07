import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosinstance from "../api";
import { Authcontext } from "../context/Authcontext";
import "../App.css";
import { motion } from "framer-motion";
import { TiTick } from "react-icons/ti";
import { saveAs, SaveAs } from "file-saver";


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

    const fetchcourse = async () => {
        try {
            const res = await axiosinstance.get(`/course/${courseid}`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })
            setcourse(res.data)
            console.log(res.data);

        } catch (error) {
            console.log(error);
        }
    }

    const fetchuser = async () => {
        try {
            const res = await axiosinstance.get(`/users/wishlist`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })
            setu(res.data)


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
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        progress()
    }, [])

    useEffect(() => {
        fetchcourse();

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
            alert("you are enrolled")
        } catch (error) {
            console.log(error);
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
            alert("you are unenrolled")
        } catch (error) {
            console.log(error);
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
            alert("added to wishlist")

        } catch (error) {
            console.log(error);
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
            alert("removed from wishlist")

        } catch (error) {
            console.log(error);
        } finally {
            setuploading(false)
        }
    }

    const addreview = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosinstance.post(`/r/${courseid}`, { rating, comment }, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })
            fetchcourse();
            alert("review added")
            setrating("")
            setcomment("")
        } catch (error) {
            console.log(error);
        }
    }

    const delr = async (reviewid) => {
        try {
            const res = await axiosinstance.delete(`/r/${courseid}/reviews/${reviewid}`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })
            fetchcourse();
            alert("review deleted")
        } catch (error) {
            console.log(error);
        }
    }

    const similarc = async (cat) => {
        try {
            const res = await axiosinstance.get(`/course/similar/${cat}/${courseid}`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })
            console.log(rating);
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
    const totallessons = course?.sections?.reduce((acc, section) => acc + section?.lessons?.length, 0)
    const alllessoncompleted = completedlessonlength === totallessons;

    return (
        <motion.div className="max-w-[1200px] mx-auto p-6" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} >
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

                <button className="btn" onClick={() => navigate(`/chat/${courseid}`, { state: { courseid: course._id } })}>{user.user.role === "instructor" ? "chat with students" : "chat with instructor"}</button>

                <div className="card-body">
                    <p className="card-title text-2xl font-semibold">{course.title}</p>
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
                        {
                            course.enrolledusers?.includes(user.user.id) ? (
                                <div>
                                    <p className="text-lg font-semibold mb-2">sections</p>

                                    {course?.sections?.length === 0 ? (
                                        <p className="text-gray-500">No Sections Added Yet</p>
                                    ) : (
                                        <div>
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




                    <motion.div className="space-y-10" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        {course.enrolledusers?.includes(user.user.id) ? (
                            <div className="space-y-4">
                                <h1 className="text-2xl font-bold">Add Review</h1>
                                <form onSubmit={addreview} className="">
                                    <textarea type="text" className="textarea w-full" placeholder="Write your comment" onChange={(e) => setcomment(e.target.value)} value={comment} />
                                    <div className="starability-slot mt-4">

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
                                    <button type="submit" className="btn btn-sm btn-info ">Add</button>

                                </form>
                            </div>
                        ) : (
                            <div>
                                <p className="text-sm text-gray-500">you have to enroll to comment</p>
                            </div>
                        )}

                        <div>
                            <h1 className="text-2xl font-bold mb-4">Reviews</h1>

                            {course?.reviews?.length === 0 ? (
                                <p className="text-gray-500">No Reviews yet</p>
                            ) : (
                                <div className="max-h-64 overflow-y-auto space-y-3 p-2 bg-base-200 rounded shadow-inner scroll-smooth" style={{ scrollbarWidth: "none" }}>
                                    {course?.reviews?.map((r) => (
                                        <div key={r._id} className="bg-base-100 p-4 rounded shadow flex flex-col gap-2">
                                            <div className="starability-result" data-rating={r.rating}></div>
                                            <p>Comment: <strong>{r.comment}  </strong></p>


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


                    <div>
                        <h1 className="text-2xl font-bold mb-4 ">Similar Courses</h1>

                        <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-4">
                            {sim?.map((s, i) => (
                                <motion.div key={s._id} className="card bg-base-100 shadow-lg" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.03 }} transition={{ duration: 0.4, delay: i * 0.1 }}>
                                    <figure>
                                        <img src={s.thumbnail} alt="thumnail" className="w-full object-cover " />
                                    </figure>
                                    <div className="card-body">
                                        <p className="card-title text-lg ">{s.title}</p>
                                        <p className="text-sm text-gray-500">Price : ₹{course.price}</p>
                                        <p className="text-sm text-gray-500">Author : {course.instructor?.name}</p>
                                        <Link className="btn btn-primary btn-sm" to={`/course/${s._id}`}>
                                            View Course
                                        </Link>
                                    </div>


                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </motion.div>
    )
}


export default Course;