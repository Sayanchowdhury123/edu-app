import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react";


const Back = () => {
    const [isvisible,setisvisible] = useState(false)

    useEffect(() => {
     const togglevis = () =>{
        setisvisible(window.scrollY > 300)
     }

     window.addEventListener("scroll", togglevis)

     return () => window.removeEventListener("scroll", togglevis)
    },[])

    const scrolltotop = () => {
        window.scrollTo({top:0,behavior:"smooth"})
    }

    return (
       <AnimatePresence>
        {isvisible && (
            <motion.button onClick={scrolltotop} initial={{opacity:0,y:50,scale:0.8}}
             animate={{opacity:1,y:0,scale:1}} transition={{duration:0.3}}
             className="btn btn-circle fixed bottom-6 left-6 z-50 bg-primary text-white shadow-lg hover:scale-110 transition-all duration-300 hover:bg-primary-focus"
            >
                    <ArrowUp className="w-6 h-6" /> 
            </motion.button>
        )}
       </AnimatePresence>
    )
}

export default Back;