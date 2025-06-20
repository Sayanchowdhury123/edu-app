import { motion, useScroll } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axiosinstance from "../api";
import { Authcontext } from "../context/Authcontext";
import { addMethod } from "yup";
import toast from "react-hot-toast";
import Loadingscrenn from "./Loadingscreen";



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

    const fetchthreads = async () => {
        try {
            setloading(true)
            const res = await axiosinstance.get(`/dis/${courseid}`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })



            setthreads(res.data)
            console.log(res.data);

            //  console.log(user.user);
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
            console.log(res.data);
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

            console.log(tid);
            if (tid) {
                const res = await axiosinstance.put(`/dis/thread/${tid}`, { title, question }, {
                    headers: {
                        Authorization: `Bearer ${user.user.token}`
                    }
                })



                console.log(res.data);
                settitle("")
                setquestion("")
                setthreads((prev) => prev.map(t => t._id === tid ? res.data : t))
                console.log(res.data);
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


            <div className=" max-w-4xl mx-auto px-4 py-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-primary  ">Threads</h1>
                    <button className="btn btn-success" onClick={() => setcreatethrread(true)}>Add Thread</button>
                </div>

                {threads?.length === 0 ? (
                    <div className="text-center text-lg text-gray-500">
                        <p>no threads created yet</p>
                    </div>
                ) : (
                    <div>

                        {Array.isArray(threads) && threads?.map((t, i) => (
                            <motion.div className="bg-base-100 p-5 rounded-lg shadow-md border border-base-300 mb-4 space-y-4" key={t._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.03 }} transition={{ duration: 0.4, delay: i * 0.1 }} >
                            <div className="flex justify-between">
                             <div className="flex items-center gap-4">
                                    <img src={t?.user?.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover ring ring-primary ring-offset-base-100 ring-offset-2" />
                                    <p className="font-semibold text-lg text-base-content ">{t?.user?.name}</p>
                                    <Link to={`/thread/${t._id}`}  className="text-sm text-info hover:underline">{t?.comment?.length || 0} comment(s)</Link>
                                </div>

                                <div>
                                <p className="text-sm text-gray-400">Posted on: {new Date(t?.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                               

                                <div className="ml-2">
                                    <h2 className="text-xl font-bold text-secondary">{t.title}</h2>
                                    <p className="text-base text-gray-600">{t.question}</p>
                                </div>

                                {user.user.id === t.user._id || user.user.role === "instructor" ? (
                                    <div className="flex justify-end gap-2">
                                        <button className="btn btn-success btn-sm" onClick={() => {
                                            setshowedit(true)
                                            settid(t._id)
                                            settitle(t.title)
                                            setquestion(t.question)
                                        }}>Edit</button>
                                        <button className="btn btn-error btn-sm" onClick={() => deletethreads(t._id)}>Delete</button>
                                    </div>
                                ) : ""}

                            </motion.div>
                        ))}
                    </div>
                )}
            </div>


        </div>

    )
}

export default Discussionforum;