import { motion, useScroll } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axiosinstance from "../api";
import { Authcontext } from "../context/Authcontext";
import { addMethod } from "yup";
import toast from "react-hot-toast";
import Loadingscrenn from "./Loadingscreen";
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import { AiFillDislike } from "react-icons/ai";
import { AiOutlineDislike } from "react-icons/ai";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { IoCheckmarkDoneCircle } from "react-icons/io5";

const Discussionforum = () => {
    const [threads, setthreads] = useState([])
    const [loading, setloading] = useState(false)
    const { courseid } = useParams()
    const { user } = useContext(Authcontext)
    const [createthread, setcreatethrread] = useState(false)
    const [title, settitle] = useState("")
    const [question, setquestion] = useState("")
    const [showedit, setshowedit] = useState(false)
    const [tid, settid] = useState("")
    const [like, setlike] = useState(0)
    const [inlike, setinlike] = useState(false)

    const fetchthreads = async () => {
        try {
            setloading(true)
            const res = await axiosinstance.get(`/dis/${courseid}`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })



            setthreads(res.data)
            

            
        } catch (error) {
            console.log(error.response.data);
        } finally {
            setloading(false)
        }
    }

    useEffect(() => {
        fetchthreads()

    }, [courseid])


    const addthreads = async () => {
        try {

            const res = await axiosinstance.post(`/dis/${courseid}/create`, { title, question }, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })


            settitle("")
            setquestion("")
            setthreads((prev) => [...prev, res.data])
            toast.success("Thread Added")
        
            setcreatethrread(false)
            //  console.log(user.user);
        } catch (error) {
            console.log(error.response.data);
            toast.success("Failed to add thread")
        }
    }


    const deletethreads = async (threadid) => {
        try {

            const res = await axiosinstance.delete(`/dis/thread/${threadid}`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })



            setthreads((prev) => prev.filter(t => t._id !== threadid))
            toast.success("Thread deleted")

            //  console.log(user.user);
        } catch (error) {
            console.log(error.response.data);
            toast.error("failed to delete thread")
        } finally {

        }
    }


    const editthreads = async () => {

        try {

            
            if (tid) {
                const res = await axiosinstance.put(`/dis/thread/${tid}`, { title, question }, {
                    headers: {
                        Authorization: `Bearer ${user.user.token}`
                    }
                })



                
                settitle("")
                setquestion("")
                setthreads((prev) => prev.map(t => t._id === tid ? res.data : t))
            
                setshowedit(false)
                toast.success("Thrread edited")
            }

            //  console.log(user.user);
        } catch (error) {
            console.log(error.response.data);
            toast.error("failed to edit thraed")
        } finally {

        }
    }

    const resolvethreads = async (tid) => {

        try {


            if (tid) {
                const res = await axiosinstance.put(`/dis/thread/${tid}/resolve`, {}, {
                    headers: {
                        Authorization: `Bearer ${user.user.token}`
                    }
                })




                setthreads((prev) => prev.map((t) => t._id === tid ? { ...t, isresolved: true } : t))
                

                toast.success("Thrread is resolved")
            }

            //  console.log(user.user);
        } catch (error) {
            console.log(error.response.data);
            toast.error("failed to reslove thraed")
        } finally {

        }
    }

    const unresolvethreads = async (tid) => {

        try {


            if (tid) {
                const res = await axiosinstance.put(`/dis/thread/${tid}/unresolve`, {}, {
                    headers: {
                        Authorization: `Bearer ${user.user.token}`
                    }
                })




                setthreads((prev) => prev.map((t) => t._id === tid ? { ...t, isresolved: false } : t))
                

                toast.success("Thread is unresolved")
            }

            //  console.log(user.user);
        } catch (error) {
            console.log(error.response.data);
            toast.error("failed to reslove thraed")
        } finally {

        }
    }


    const addlike = async (tid) => {

        try {

            const thread = threads.find((t) => t._id)
            if (thread?.dislikes?.includes(user.user.id)) {
                const res = await axiosinstance.put(`/dis/thread/${tid}/removedis`, {}, {
                    headers: {
                        Authorization: `Bearer ${user.user.token}`
                    }
                })

                setthreads((prev) => prev.map((t) => t._id === tid ? { ...t, dislikes: res.data.dislikes } : t))
            }

            const res = await axiosinstance.put(`/dis/thread/${tid}/inlike`, {}, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })

            console.log(res.data.likes.length);


            setthreads((prev) => prev.map((t) => t._id === tid ? { ...t, likes: res.data.likes } : t))


            //  console.log(user.user);
        } catch (error) {
            console.log(error.response.data);
            toast.error("failed to like")
        }
    }

    const removelike = async (tid) => {

        try {



            const res = await axiosinstance.put(`/dis/thread/${tid}/delike`, {}, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })

            setthreads((prev) => prev.map((t) => t._id === tid ? { ...t, likes: res.data.likes } : t))

            




            //  console.log(user.user);
        } catch (error) {
            console.log(error.response.data);
            toast.error("failed to like")
        } finally {

        }
    }

    const adddislike = async (tid) => {

        try {
            const thread = threads.find((t) => t._id)
            if (thread?.likes?.includes(user.user.id)) {
                const res = await axiosinstance.put(`/dis/thread/${tid}/delike`, {}, {
                    headers: {
                        Authorization: `Bearer ${user.user.token}`
                    }
                })

                setthreads((prev) => prev.map((t) => t._id === tid ? { ...t, likes: res.data.likes } : t))
            }

            const res = await axiosinstance.put(`/dis/thread/${tid}/adddis`, {}, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })

           // console.log(res.data.likes.length);
            setthreads((prev) => prev.map((t) => t._id === tid ? { ...t, dislikes: res.data.dislikes } : t))
        } catch (error) {
            console.log(error.response.data);
            toast.error("failed to add dislike")
        }
    }

    const removedislike = async (tid) => {

        try {

            const res = await axiosinstance.put(`/dis/thread/${tid}/removedis`, {}, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })

            setthreads((prev) => prev.map((t) => t._id === tid ? { ...t, dislikes: res.data.dislikes } : t))
          //  console.log(res.data);

            //  console.log(user.user);
        } catch (error) {
            console.log(error.response.data);
            toast.error("failed to remove dislike")
        } finally {

        }
    }





    if (loading) return <Loadingscrenn />
    return (
        <div className="max-w-full h-[100vh] mx-auto p-6 bg-base-200 shadow-lg rounded-xl space-y-6">

            <div className="flex justify-center items-center">
                <h1 className="text-4xl font-bold  text-primary">Discussion Forum</h1>

            </div>

            {
                createthread && (
                    <div className=" fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
                        <motion.div className=" bg-base-100 p-5 rounded-lg border border-primary w-[700px]"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <h1 className="text-xl font-bold mb-4 text-primary">Create Thread</h1>

                            <div className="form-control mb-4">
                                <label htmlFor="t" className="label mb-2"><span className="label-text">Title </span></label>
                                <input className="input input-bordered w-full" type="text" name="" id="t" onChange={(e) => settitle(e.target.value)} />
                            </div>

                            <div className="form-control mb-4">
                                <label htmlFor="q" className="label mb-2"> <span className="label-text">Question</span></label>
                                <input type="text" className="input input-bordered w-full" id="q" onChange={(e) => setquestion(e.target.value)} />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button className="btn btn-primary" onClick={addthreads}>Create Thread</button>
                                <button className="btn btn-outline" onClick={() => setcreatethrread(false)}>Cancel</button>
                            </div>

                        </motion.div>
                    </div>

                )
            }

            {
                showedit && (
                    <div className=" fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
                        <motion.div className=" bg-base-100 p-5 rounded-lg border border-primary w-[700px]"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}>
                            <h1 className="text-xl font-bold mb-4 text-primary">Edit Thread</h1>
                            <div className="form-control mb-4">
                                <label htmlFor="t" className="label mb-2"><span className="label-text">Title </span></label>
                                <input className="input input-bordered w-full" type="text" name="" id="t" onChange={(e) => settitle(e.target.value)} value={title} />
                            </div>

                            <div className="form-control mb-4">
                                <label htmlFor="q" className="label mb-2"> <span className="label-text">Question</span></label>
                                <input type="text" className="input input-bordered w-full" id="q" onChange={(e) => setquestion(e.target.value)} value={question} />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button className="btn btn-primary" onClick={() => editthreads(t._id)}>Edit Thread</button>
                                <button className="btn btn-outline" onClick={() => setshowedit(false)}>Cancel</button>
                            </div>

                        </motion.div>

                    </div>

                )
            }


            <div className=" max-w-4xl mx-auto px-4 py-2 space-y-2">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-primary  ">Threads</h1>
                    <button className="btn btn-primary" onClick={() => setcreatethrread(true)}>Add Thread</button>
                </div>

                {threads?.length === 0 ? (
                    <div className="text-center text-lg text-gray-500">
                        <p>no threads created yet</p>
                    </div>
                ) : (
                    <div className="h-[79vh] overflow-y-auto" style={{ scrollbarWidth: "none" }}>

                        {Array.isArray(threads) && threads?.map((t, i) => (
                            <motion.div className="bg-base-100 p-5 rounded-lg shadow-md border border-base-300 mb-4 space-y-4  " key={t._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: i * 0.1 }} >
                                <div className="flex justify-between items-center space-x-4">


                                    <div className="flex items-center gap-2">
                                        <img src={t?.user?.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover " />
                                        <div>
                                            <p className="font-semibold text-lg  ">{t?.user?.name}  {t?.user.role === "instructor" && (<span>(Instructor)</span>)}</p>
                                            <p className="text-sm text-gray-500">Posted on: {new Date(t?.createdAt).toLocaleDateString()}</p>
                                        </div>

                                    </div>


                                    <div className="flex items-center gap-2">
                                        <Link to={`/thread/${t._id}`} className="text-sm text-info hover:underline">{t?.comment?.length || 0} comment(s)</Link>
                                        {t.isresolved === true ? <IoCheckmarkDoneCircle className="mt-[5px]" /> : ""}
                                    </div>
                                </div>


                                <div className="ml-2">
                                    <h2 className="text-2xl font-bold">{t.title}</h2>
                                    <p className="text-base text-gray-600">{t.question}</p>
                                </div>


                                <div className="flex justify-between items-center gap-2">

                                    <div className="flex gap-2">
                                        <div className="flex items-center gap-1" onClick={() => {

                                            if (t?.likes?.includes(user.user.id)) {
                                                removelike(t._id)
                                            } else {
                                                addlike(t._id)
                                            }
                                        }} >

                                            {t.likes.includes(user.user.id) ? <AiFillLike /> : <AiOutlineLike />}
                                            <motion.p key={t.likes.length} animate={{ scale: [1.3, 1] }} transition={{ duration: 0.3 }}>

                                                {t.likes.length}
                                            </motion.p>
                                        </div>

                                        <div className="flex items-center gap-1" onClick={() => {

                                            if (t?.dislikes?.includes(user.user.id)) {
                                                removedislike(t._id)
                                            } else {
                                                adddislike(t._id)
                                            }
                                        }}>

                                            {t?.dislikes?.includes(user.user.id) ? <AiFillDislike /> : <AiOutlineDislike />}
                                            <motion.p key={t.likes.length} animate={{ scale: [1.3, 1] }} transition={{ duration: 0.3 }}>

                                                {t.dislikes.length}
                                            </motion.p>
                                        </div>
                                    </div>

                                     
                                        <div className="space-x-2">
                                            {user.user.id === t.user._id && (
                                                <button className="btn btn-success btn-sm" onClick={() => {
                                                setshowedit(true)
                                                settid(t._id)
                                                settitle(t.title)
                                                setquestion(t.question)
                                            }}>Edit</button>
                                            )}
                                           
                                            {user.user.id === t.user._id || user.user.role === "instructor" ? ( <button className="btn btn-error btn-sm" onClick={() => deletethreads(t._id)}>Delete</button>) : "" }
                                           

                                            {user.user.role === "instructor" && (<button className={`btn  btn-sm ${t.isresolved === true ? "btn-neutral" : "btn-accent"}`} onClick={() => {
                                                if (t.isresolved === false) {
                                                    resolvethreads(t._id)
                                                } else {
                                                    unresolvethreads(t._id)
                                                }
                                            }}>{t.isresolved === false ? "resolve" : "unresolve"}</button>)}
                                        </div>
                                    




                                </div>


                            </motion.div>
                        ))}
                    </div>
                )}
            </div>


        </div>

    )
}

export default Discussionforum;