import { motion, useScroll } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axiosinstance from "../api";
import { Authcontext } from "../context/Authcontext";
import { addMethod } from "yup";
import toast from "react-hot-toast";



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
            setloading(true)
            const res = await axiosinstance.post(`/dis/${courseid}/create`, { title, question }, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })


            settitle("")
            setquestion("")
            setthreads((prev) => [...prev, res.data])
            console.log(res.data);
            setcreatethrread(false)
            //  console.log(user.user);
        } catch (error) {
            console.log(error.response.data);
        } finally {
            setloading(false)
        }
    }


    const deletethreads = async (threadid) => {
        try {
            setloading(true)
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
            setloading(false)
        }
    }


    const editthreads = async () => {

        try {
            setloading(true)
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
            setloading(false)
        }
    }

    return (
        <div>
            <h1>Discussion Forum</h1>
            <button className="btn" onClick={() => setcreatethrread(true)}>Add Thread</button>
            {
                createthread && (
                    <div>
                        <h1>Create Thread</h1>
                        <div>
                            <label htmlFor="t">Title: </label>
                            <input className="input" type="text" name="" id="t" onChange={(e) => settitle(e.target.value)} />
                        </div>

                        <div>
                            <label htmlFor="q">Question: </label>
                            <input type="text" className="input" id="q" onChange={(e) => setquestion(e.target.value)} />
                        </div>
                        <button className="btn btn-primary" onClick={addthreads}>Create Thread</button>
                        <button className="btn btn-accent" onClick={() => setcreatethrread(false)}>Cancel</button>
                    </div>
                )
            }

            {
                showedit && (
                    <div>
                        <h1>Edit Thread</h1>
                        <div>
                            <label htmlFor="t">Title: </label>
                            <input className="input" type="text" name="" id="t" onChange={(e) => settitle(e.target.value)} />
                        </div>

                        <div>
                            <label htmlFor="q">Question: </label>
                            <input type="text" className="input" id="q" onChange={(e) => setquestion(e.target.value)} />
                        </div>
                        <button className="btn btn-primary" onClick={() => editthreads(t._id)}>Edit Thread</button>
                        <button className="btn btn-accent" onClick={() => setshowedit(false)}>Cancel</button>
                    </div>
                )
            }


            <div>
                {threads?.length === 0 ? (
                    <div>
                        <p>no threads created yet</p>
                    </div>
                ) : (
                    <div>
                        <h1>Threads</h1>
                        {Array.isArray(threads) && threads?.map((t) => (
                            <div key={t._id}>
                                <div>
                                    <h1>{t.title}</h1>
                                    <p>{t.question}</p>
                                </div>


                                <div>
                                    <button className="btn btn-success btn-outline" onClick={() => {
                                        setshowedit(true)
                                        settid(t._id)
                                    }}>Edit</button>
                                    <button className="btn btn-error btn-outline" onClick={() => deletethreads(t._id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>


        </div>

    )
}

export default Discussionforum;