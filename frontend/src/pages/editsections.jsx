
import { useContext, useEffect, useRef, useState } from "react";
import { Authcontext } from "../context/Authcontext";
import axiosinstance from "../api";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, stagger } from "framer-motion";


const Editsection = () => {
 const {courseid} = useParams();
 const {sectionindex} = useParams();
const[sectiontitle,setsectiontitle] = useState("")
const {user} = useContext(Authcontext)
const navigate = useNavigate();

   console.log(sectionindex);
 const editsection = async () => {
        try {
             const res = await axiosinstance.put(`/course/${courseid}/sections/${sectionindex}`,{title: sectiontitle} , {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                    
                }
            })

            
            alert("section edited")
            navigate(`/session-lesson/${courseid}`)
         } catch (error) {
            console.log(error);
         }
    }

    return(

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto p-6">
                    <h2 className="text-2xl font-bold mb-4">Edit section </h2>
        
                    <div className="mb-6">
                        <motion.input type="text" className="input w-full mb-4" value={sectiontitle} onChange={(e) => setsectiontitle(e.target.value)} initial={{scale:0.95,opacity:0}} animate={{scale:1,opacity:1}} transition={{duration:0.3}} />
                        <button onClick={editsection} type="submit" className="btn btn-primary" >Edit Section</button>
                    </div>
        </motion.div>
    )
}

export default Editsection;