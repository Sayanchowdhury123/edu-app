import { useEffect, useState } from "react";
import axiosinstance from "../api";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import { Authcontext } from "../context/Authcontext";
import { motion } from "framer-motion";
import io from "socket.io-client"

const socket = io("http://localhost:5000")

const Addupdates = () => {

const[text,settext] = useState("")
const navigate = useNavigate()
const {user} = useContext(Authcontext)
const {courseid} = useParams()





const addupdate = async () => {
    try {
        const res = await axiosinstance.put(`/courseupdate/add/${courseid}`,{update:text},{
             headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
        })
        console.log(res.data);
        toast.success("added announcement")
        navigate('/course-updates')
        let adata = res.data;
        socket.emit("add-update",{adata,courseid})
    } catch (error) {
        toast.error("failed to add announcement")
    }
}
    return(

         <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto p-6">
                           <h2 className="text-2xl font-bold mb-4">Add Announcement </h2>
               
                           <div className="mb-6">
                               <motion.input type="text" className="input w-full mb-4" value={text} onChange={(e) => settext(e.target.value)} initial={{scale:0.95,opacity:0}} animate={{scale:1,opacity:1}} transition={{duration:0.3}} />
                               <button onClick={addupdate} type="submit" className="btn btn-primary" >Add</button>
                           </div>
               </motion.div>
    )
}


export default Addupdates;