import { useContext, useEffect, useState } from "react";
import { Authcontext } from "../context/Authcontext";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import axiosinstance from "../api";
import { motion } from "framer-motion";
import { useRef } from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";



const socket = io("http://localhost:5000")


const Chatbox = () => {
    const { user } = useContext(Authcontext)
    const location = useLocation()
    const { courseid } = location.state || {};
    const [messages, setmessages] = useState([])
    const [message, setmessage] = useState("")
    const [course, setcourse] = useState({})
    const messageendref = useRef(null)
    const [modal, setmodal] = useState(false)
    const [messageid, setmessageid] = useState("")
    const [edittext, setedittext] = useState("")
    const [showedit, setshowedit] = useState(false)


    const fetchcourse = async () => {
        try {
            const res = await axiosinstance.get(`/course/${courseid}`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })
            setcourse(res.data)
            //console.log(res.data);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchcourse()
        console.log(user.user.token);
    }, [])

    useEffect(() => {
        socket.emit("join-room", courseid)

        socket.on("receive-message", (data) => {
            console.log(data);
            setmessages((prev) => [...prev, data])
        })

        socket.on("r-edit", (message) => {
              console.log(message);
            setmessages((prev) => prev.map((msg) => msg?._id === message?._id ? message : msg))
        })

        socket.on("r-del",(messageid) => {
            setmessages((prev) => prev.filter((msg) => msg?._id !== messageid))
        })

        return () => {
            socket.off("receive-message")
            socket.off("r-edit")
             socket.off("r-del")
        }
    }, [courseid])


    const fetchmessgaes = async () => {
        try {
            const res = await axiosinstance.get(`/chat/${courseid}`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })

            setmessages(res.data)
           // console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchmessgaes();
        //  console.log(courseid);

    }, [courseid])



    const sendmessage = () => {
        const data = { sender: user?.user?.id, message, courseid }
        socket.emit("send-message", { data })

        setmessage("")
    }

    const formattime = (timestamp) => {
        const date = new Date(timestamp)
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    useEffect(() => {

        messageendref.current?.scrollIntoView({ behavior: "smooth" })

    }, [messages.length])



    const delmsg = async () => {
        try {
            
                const res = await axiosinstance.delete(`/chat/${messageid}`, {
                    headers: {
                        Authorization: `Bearer ${user.user.token}`
                    }
                })
                
                
                fetchmessgaes()
                setmodal(false)
                socket.emit("del", {messageid,courseid})
                 alert("msg deleted")
            

        } catch (error) {
            console.log(error);
        }
    }


    const editmsg = async () => {
        try {
            
                const res = await axiosinstance.put(`/chat/${messageid}`, { newmessage: edittext }, {
                    headers: {
                        Authorization: `Bearer ${user.user.token}`
                    }
                })
                 
                 const textupdated = res.data;
                // console.log(textupdated);
                 socket.emit("edit", {courseid, textupdated} )
              
                setshowedit(false)
                 setmessages((prev) => prev.map((msg) => msg?._id === textupdated?._id ? textupdated : msg))
                 alert("msg edited")
            

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="max-w-5xl mx-auto mt-10 p-6 bg-base-200 rounded-2xl shadow-xl">
            {modal && (
                <motion.div className="absolute inset-0 bg-black opacity-50 flex items-center justify-center rounded-t-xl gap-4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >

                    {!showedit ? (
                    <div className="flex gap-4">
                        <button className="btn btn-error" onClick={(e) => {
                            e.stopPropagation()
                            delmsg()
                        }}><MdDelete className="" />Delete</button>
                        <button className="btn btn-info" onClick={() => {
                            setshowedit(true)
                        }}><FaEdit className="" />Edit</button>
                    </div>
                 ) : (
                    
                        <motion.div   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-base-300 p-6 rounded-xl shadow-xl w-full max-w-md space-y-4 ">
                            <textarea name="" id="" onChange={(e) => setedittext(e.target.value)} placeholder="Edit your message" className="textarea textarea-bordered w-full"></textarea>

                            <div className="flex justify-between">
                                <button className="btn btn-success " onClick={(e) => {
                                     editmsg()
                                    setmodal(false)
                                 }}>Save Changes</button>
                                <button onClick={() => setshowedit(false)} className="btn ">Cancel</button>
                            </div>

                        </motion.div>
                    
                 )}
                   

                </motion.div>
            )}


           

            <h1 className="text-2xl font-bold mb-4 text-center text-primary">Group discussion for {course?.title}</h1>


            <div className={`space-y-3 h-[600px] overflow-y-auto px-2  `} style={{ scrollbarWidth: "none" }}>



                {messages?.map((msg, index) => (

                    <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }} className={`chat ${msg?.sender?._id === user.user.id ? "chat-end" : "chat-start"}  `} onClick={() => {
                        setmessageid(msg._id)
                        setmodal((prev) => !prev)
                    }}  >
                        <div className="chat-header font-semibold text-secondary"  >
                            {msg.sender?._id?.toString() === user.user.id ? "You" : msg.sender.name}
                            <time className="text-xs ml-1 text-gray-500">
                                {formattime(msg.timestamp)}
                            </time>
                        </div>
                        <div className="chat-bubble bg-primary text-white">
                            {msg.message}
                        </div>
                    </motion.div>

                ))}

                <div ref={messageendref} />
            </div>


            <div className="mt-4 flex items-center gap-2">
                <input type="text" onChange={(e) => setmessage(e.target.value)} value={message} placeholder="Type Your Message" className="input flex-grow " onKeyDown={(e) => e.key === "Enter" && sendmessage()} />
                <button onClick={sendmessage} className="btn btn-primary">Send</button>
            </div>

        </div>
    )
}

export default Chatbox;