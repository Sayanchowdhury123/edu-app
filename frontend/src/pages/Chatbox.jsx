import { useContext, useEffect, useState } from "react";
import { Authcontext } from "../context/Authcontext";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import axiosinstance from "../api";
import { motion } from "framer-motion";


const socket = io("http://localhost:5000")


const Chatbox = () => {
    const { user } = useContext(Authcontext)
    const location = useLocation()
    const { courseid } = location.state || {};
    const [messages, setmessages] = useState([])
    const [message, setmessage] = useState("")
    const [course, setcourse] = useState({})


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

    useEffect(() => {
        fetchcourse()
    }, [])

    useEffect(() => {
        socket.emit("join-room", courseid)

        socket.on("receive-message", (data) => {
            console.log(data);
            setmessages((prev) => [...prev, data])
        })

        return () => {
            socket.off("receive-message")
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

    return (
        <div className="max-w-5xl mx-auto mt-10 p-6 bg-base-200 rounded-2xl shadow-xl">
            <h1 className="text-2xl font-bold mb-4 text-center text-primary">Group discussion for {course?.title}</h1>
            <div className={`space-y-3 h-[600px] overflow-y-auto px-2  `} style={{ scrollbarWidth: "none" }}>
                {messages?.map((msg, index) => (
                    
                        <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }} className={`chat ${msg.sender._id === user.user.id ? "chat-end" : "chat-start"}`}>
                            <div className="chat-header font-semibold text-secondary">
                                {msg.sender._id.toString() === user.user.id ? "You" : msg.sender.name}
                                <time className="text-xs ml-1 text-gray-500">
                                    {formattime(msg.timestamp)}
                                </time>
                            </div>
                            <div className="chat-bubble bg-primary text-white">
                                {msg.message}
                            </div>
                        </motion.div>

                       
                    

                ))}

            </div>

            <div className="mt-4 flex items-center gap-2">
                <input type="text" onChange={(e) => setmessage(e.target.value)} value={message} placeholder="Type Your Message" className="input flex-grow " />
                <button onClick={sendmessage} className="btn btn-primary">Send</button>
            </div>

        </div>
    )
}

export default Chatbox;