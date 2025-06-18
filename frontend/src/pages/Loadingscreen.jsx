import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const Loadingscrenn = () => {

    return(

   <motion.div className="flex flex-col items-center justify-center h-screen bg-base-200 text-base-content"
   initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.5}}
   >
      <motion.div className="flex items-center justify-center gap-4"
      initial={{scale:0.8}} animate={{scale:1}} transition={{type:"spring",stiffness:100}}
      >
      <span className="loading loading-spinner loading-lg text-primary">
         
      </span>
       <p className="text-lg font-semibold animate-pulse">
            Loading , Please wait...
          </p>
      </motion.div>

      <motion.div className="mt-6 text-sm text-gray-400"
      initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.5}}
      >
         Your content is being prepared
      </motion.div>
   </motion.div>

    )
}


export default Loadingscrenn;