import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const arr = ["L", "e", "a", "r", "n", " ", "A", "n", "y", "t", "h", "i", "n", "g", ",", " ", "A", "n", "y", "t", "i", "m", "e"]
const Hero = () => {

  const navigate = useNavigate()

  return (
    <section className="min-h-[93vh] flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white px-6">
      <div className="text-center max-w-2xl">


        
          {arr.map((a, i) => (
           <motion.h1 key={i} className="inline-block text-5xl md:text-6xl font-semibold mb-6 drop-shadow-lg" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}>
                {a}
           </motion.h1>
        ))}
        

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }} className="text-lg md:text-xl mb-8 font-light">
          Join thousands of learners and explore top-notch video courses led by expreet instructors
        </motion.p>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.8, duration: 0.6 }}>
          <button onClick={() => navigate(`/signup`)} className="btn btn-accent btn-lg px-6 text-white">
            Start Learning Now
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero;