import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom";

const Calltoaction = () => {

const navigate = useNavigate()
    return (
        <div className="py-20 px-6 md:px-20 bg-gradient-to-r from-indigo-600 to-purple-600">
     <motion.div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-xl text-center"
     
     initial={{scale:0.8,opacity:0}} whileInView={{scale: 1,opacity:1}} transition={{duration:0.6,type:"spring",stiffness:100}} viewport={{once:true}}
     >

     <h2 className="text-3xl md:text-4xl font-bold text-indigo-800 mb-4">Start Learning Today</h2>
     <p className="text-gray-600 mb-6">
        Join thousand of learners on your journey to mastering new skills and buliding your future
     </p>
     <button className="btn btn-primary btn-wide text-white bg-indigo-600 border-0 hover:bg-indigo-700 transition-all duration-300" onClick={() => navigate("/home")}>
       Explore Courses
     </button>
     </motion.div>
        </div>

    )
}

export default Calltoaction;