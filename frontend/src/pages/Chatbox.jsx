import { useContext, useEffect, useState } from "react";
import { Authcontext } from "../context/Authcontext";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import axiosinstance from "../api";


const socket = io("http://localhost:5000")


const Chatbox = () => {
    const { user } = useContext(Authcontext)
    const location = useLocation()
    const { courseid} = location.state || {};
    const [messages, setmessages] = useState([])
    const [message, setmessage] = useState("")

    useEffect(() => {
        socket.emit("join-room",  courseid )

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

    return (
        <div>
            <h1>chatbox</h1>
            <div>
                {messages?.map((msg, index) => (
                    <div key={index} >
                        {msg?.sender?.name} : {msg.message}
                    </div>
                ))}
            </div>


            <input type="text" onChange={(e) => setmessage(e.target.value)} value={message} />
            <button onClick={sendmessage}>Send</button>
        </div>
    )
}

export default Chatbox;