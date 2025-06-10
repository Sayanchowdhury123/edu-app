import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti";

const Congratulation = ({courseid}) => {
    const[showcongrats,setshowcongrats] = useState(false)

     useEffect(() => {
       const alreadyshown = localStorage.getItem(`congrats_${courseid}`)
       if(!alreadyshown){
        setshowcongrats(true)
        localStorage.setItem(`congrats_${courseid}`,"true")
        confetti({
            particleCount:200,
            spread: 100,
            origin:{y: 0.6}
        })

       }
     },[courseid])

     if(!showcongrats) return null;

    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black opacity-90">
         <motion.div className="bg-white p-8 rounded-2xl shadow-xl text-center space-y-4 max-w-sm"
         initial={{scale: 0.6,opacity:0}}
         animate={{scale:1,opacity:1}}
         transition={{type:"spring",duration:0.6}}
         >
               <motion.h2 className="text-2xl font-bold text-purple-700"
               initial={{y:-20,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.2}}
               >
              🎉Congratulations!
               </motion.h2>

               <motion.p className="text-gray-700" 
               initial={{y:10,opacity:0}}
               animate={{y:0,opacity:1}}
               transition={{delay:0.3}}
               >
                 You've successfully completed this course!
               </motion.p>
               <motion.button className="btn btn-primary" onClick={() => setshowcongrats(false)}
                whileHover={{scale: 1.05}}
                >
                Close
               </motion.button>
         </motion.div>
        </div>
    )


}

export default Congratulation;