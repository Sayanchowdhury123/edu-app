
import { motion } from "framer-motion";
import { useLocation,Link } from "react-router-dom";
import ReactPlayer from "react-player";

const Videoplayer = () => {

    const location = useLocation();
    const {videourl,title,courseid} = location.state || {};


    return(
    <motion.div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-6"
    initial={{opacity:0}} animate={{opacity:1}} transition={{duration: 0.5}}
    >

   <div className="w-full max-w-4xl">
       <h1 className="text-3xl font-bold mb-6 text-center">{title || "Video Lesson"}</h1>
       <div className="aspect-video  bg-black rounded-lg overflow-hidden shadow-lg">
            {videourl ? (
                <ReactPlayer url={videourl} width={"100%"} height={"100%"} controls />
            ) : (
                <div className="flex items-center justify-center h-full ">No video found</div>
            )}
       </div>

       <div className="text-center mt-6">
         <Link to={`/course/${courseid}`} >Back To Dashboard</Link>
       </div>
   </div>


    </motion.div>

    )
}

export default Videoplayer;