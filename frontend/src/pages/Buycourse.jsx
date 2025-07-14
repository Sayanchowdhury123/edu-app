import toast from "react-hot-toast";
import { motion } from "framer-motion"
import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosinstance from "../api";
import { Authcontext } from "../context/Authcontext";

const Buycourse = () => {
  const {user} = useContext(Authcontext)
    const location = useLocation()
   const {course} = location.state || {};
   const [loading,setloading] = useState(false)
     const upiid = "sayanchoudhury123@ybl"
     const title = course.title;
     const price = course.price;

     const uplLink = `upi://pay?pa=${upiid}&pn=${title}&am=${price}&cu=INR&tn=Course%20urchase`;

     const [file,setfile] = useState("")

  const filechange = async () => {
        
        if (file) {
            const formdata = new FormData();
            formdata.append("screenshot", file)

            try {
              setloading(true)
                
                const res = await axiosinstance.put(`/courses/screenshot/${course._id}`, formdata, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${user?.user?.token}`

                    }
                })
                
                toast.success("Screenshot sent")
               setfile("")
            } catch (error) {
                console.log(error);
                toast.error("failed to send screenshot")
            } finally {
                setloading(false)
            }
        }

    }
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-4">
            {
                loading && (
                    <div className="absolute inset-0 bg-black opacity-50 flex items-center justify-center z-1000">
                        <span className="loading loading-bars loading-lg text-primary">

                        </span>
                    </div>
                )
            }
          <motion.h1 initial={{y:-50,opacity:0}} animate={{y:0,opacity:1}}  transition={{type:"spring",duration:0.6}} className="text-4xl font-bold text-white mb-6">Scan to pay</motion.h1>
        
        <div className="">
                    <motion.img initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",stiffness:120}} src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
            uplLink
          )}&size=200*200`} alt="UPI QR" className="rounded-xl shadow-lg mb-2" />

        <p className="text-2xl font-bold">Title: {course.title}</p>
        <p className="text-sm font-semibold">Price: ₹{course.price}</p>
        </div>


          <motion.div className="mt-4 w-full max-w-sm bg-white text-gray-800 p-6 rounded-xl shadow-xl space-y-4"
           initial={{opacity:0,y:50}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
          >
            <label htmlFor="form-control w-full">
                <div className="label">
                    <span className="label-text font-semibold text-gray-700 mb-2">Upload Payment Screenshot</span>
                </div>
            </label>
            <input  type="file" className="file-input w-full  text-primary file-input-primary"  onChange={(e) => setfile(e.target.files[0])} />
            <button className="btn btn-primary w-full" onClick={filechange}>Send</button>
          </motion.div>
        </div>

        

    )
}

export default Buycourse;