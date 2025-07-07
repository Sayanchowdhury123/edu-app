import { motion, useScroll } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axiosinstance from "../api";
import { Authcontext } from "../context/Authcontext";
import { addMethod } from "yup";
import toast from "react-hot-toast";
import Loadingscrenn from "./Loadingscreen";



const Comments = () => {
    const [thread, setthread] = useState({})
    const [loading, setloading] = useState(false)
    const { threadid } = useParams()
    const { user } = useContext(Authcontext)
    const [createthread, setcreatethrread] = useState(false)
    const [text, settext] = useState("")
    const [question, setquestion] = useState("")
    const [showedit, setshowedit] = useState(false)
    const [commentid, setcommentid] = useState("")
    const commentcontainer = useRef(null)
    const inputref = useRef(null)
    const [ctext, setctext] = useState("")
    const fetchthreads = async () => {
        try {
            setloading(true)
            const res = await axiosinstance.get(`/dis/thread/${threadid}`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })



            setthread(res.data)
            //console.log(res.data);
            //);
            //  console.log(user.user);
        } catch (error) {
            console.log(error.response.data);
        } finally {
            setloading(false)
        }
    }

    useEffect(() => {
        fetchthreads()
        console.log(threadid);
    }, [threadid])


    const addc = async () => {
        try {

            const res = await axiosinstance.put(`/dis/thread/${threadid}/comment`, { text }, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })



            setthread((prev) => ({
                ...prev, comment: [...prev.comment, res.data]
            }))
            settext("")

            toast.success("Comment Added")
            console.log(res.data);

            //  console.log(user.user);
        } catch (error) {
            console.log(error.response.data);
            toast.error("Failed to add Comment")
        }
    }


    const deletec = async (commentid) => {
        try {

            const res = await axiosinstance.delete(`/dis/thread/${threadid}/comment/${commentid}`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })



            setthread((prev) => ({
                ...prev, comment: prev.comment.filter((c) => c._id !== commentid)
            }))
            toast.success("Comment deleted")

            //  console.log(user.user);
        } catch (error) {
            console.log(error.response.data);
            toast.error("failed to delete Comment")
        } finally {

        }
    }


    const editc = async () => {

        try {


            if (commentid) {
                const res = await axiosinstance.put(`/dis/thread/${threadid}/comment/${commentid}`, { text }, {
                    headers: {
                        Authorization: `Bearer ${user.user.token}`
                    }
                })



                //  console.log(res.data);
                settext("")
                setthread((prev) => ({
                    ...prev, comment: prev.comment.map((c) => c._id === commentid ? { ...c, text } : c)
                }))
                console.log(res.data);
                setshowedit(false)
                toast.success("Thrread edited")
            }

            //  console.log(user.user);
        } catch (error) {
            console.log(error.response.data);
            toast.error("failed to edit thraed")
        } finally {
            setshowedit(false)
        }
    }

    useEffect(() => {

        // messageendref.current?.scrollIntoView({ behavior: "smooth" })

        commentcontainer.current?.scrollTo({
            top: commentcontainer.current.scrollHeight,
            behavior: "smooth"
        })

    }, [thread?.comment?.length])


    if (loading) return <Loadingscrenn />
    return (
        <div className="w-full h-[100vh]  mx-auto px-4 py-10 bg-base-200  space-y-6 ">

            <div className=" max-w-4xl h-[95vh]  mx-auto  space-y-6 relative">

                <div className="flex-grow space-y-6 " style={{ scrollbarWidth: "none" }}>
                    <motion.div className="bg-base-100 p-6 rounded-xl shadow-lg  " initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} >
                        <div className="flex items-center space-x-4">
                            <img src={thread?.user?.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover ring ring-primary ring-offset-base-100 ring-offset-2" />
                            <div className="">

                                <p className="font-semibold text-lg  ">{thread?.user?.name} {thread?.user.role === "instructor" && (<span>(Instructor)</span>)} </p>
                                <p className="text-sm text-gray-500">Posted on: {new Date(thread?.createdAt).toLocaleDateString()}</p>
                            </div>

                        </div>


                        <div className="mt-4">
                            <h2 className="text-2xl font-bold ">{thread.title}</h2>
                            <p className="text-base text-gray-600 mt-1">{thread.question}</p>
                        </div>

                    </motion.div>

                    <motion.div className="bg-base-100 rounded-xl h-[62vh]  shadow-lg p-6" initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-xl font-semibold mb-4 text-primary" >Comments {thread?.comment?.length || 0}</h1>

                        {thread?.comment?.length === 0 ? (
                            <div  >
                                <p className="text-center   text-gray-400">No comments added yet</p>
                            </div>
                        ) : (
                            <div className="space-y-2 h-[50vh] overflow-y-auto" style={{ scrollbarWidth: "none" }} ref={commentcontainer}>
                                {thread?.comment?.map((c, i) => (
                                    <motion.div key={i} className="bg-base-200  p-4 rounded-2xl  flex justify-between items-start" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: i * 0.1 }} >
                                        <div className="flex items-start space-x-4">
                                            <img src={c.user.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
                                            <div>
                                                <p className="font-semibold">{c.user.name} {c.user.role === "instructor" && (<span>(Instructor)</span>)}</p>
                                                <p className="text-sm text-gray-600">{new Date(c?.createdAt).toLocaleDateString()}</p>
                                                <p className="mt-1">{c.text}</p>
                                            </div>

                                        </div>



                                        <div >
                                            
                                                <div className="space-x-2"  >
                                                    {user.user.role === c.user.role && (
                                                       <button className="btn btn-sm btn-success btn-outline" onClick={() => {
                                                        setshowedit(true)
                                                        setcommentid(c._id)
                                                        inputref.current.focus()
                                                        settext(c.text)
                                                    }} >Edit</button>
                                                    )}

                                                    {user.user.role === c.user.role || user.user.role === "instructor" ? (
                                                      <button className="btn btn-error btn-sm btn-outline" onClick={() => deletec(c._id)}>Delete</button>
                                                    ) : ""}
                                                  
                                                   
                                                </div>

                                            





                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>

                <motion.div className=" z-10 rounded-xl "
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                >
                    <div className=" flex  gap-2 absolute bottom-0 w-full">
                        <input name="" id="" className="input input-primary w-full mb-4" placeholder="Type your comment..." onChange={(e) => settext(e.target.value)} value={text} ref={inputref}  ></input>
                        <button className="btn btn-primary " onClick={showedit ? editc : addc}>{showedit ? "Update" : "Post"} Comment</button>
                        {showedit && (<button className="btn btn-outline ml-2" onClick={() => setshowedit(false)} >Cancel</button>)}
                    </div>

                </motion.div>



            </div>
        </div>

    )
}

export default Comments;