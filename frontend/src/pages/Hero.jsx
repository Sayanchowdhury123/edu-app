import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const arr = ["L", "e", "a", "r", "n", " ", "A", "n", "y", "t", "h", "i", "n", "g"];
const heading2 = ["A", "n", "y", "t", "i", "m", "e"];
const Hero = () => {

  const navigate = useNavigate()

  return (
    <section className="relative min-h-[93vh] flex items-center justify-center  text-white px-6 overflow-visible">

      <motion.div
        className="absolute inset-0 z-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-[length:200%_200%] "
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      <div className="text-center z-10 max-w-2xl">

        <h1 className="text-5xl md:text-6xl font-semibold mb-6 drop-shadow-lg">
          {[arr, heading2].map((line, lineIndex) => (
            <div key={lineIndex}>
              {line.map((a, i) => {

                if (a === " ") {
                  return (
                    <motion.span
                      key={`${lineIndex}-${i}`}
                      className="inline-block"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 + lineIndex * 0.5 }}
                    >
                      &nbsp;
                    </motion.span>
                  );
                }

                return (
                  <motion.span
                    key={i}
                    className="inline-block"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 + lineIndex * 0.5 }}
                  >
                    {a}
                  </motion.span>
                )


              })}

            </div>
          ))}
        </h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }} className="text-lg md:text-xl mb-8 font-light">
          Join thousands of learners and explore top-notch video courses led by expreet instructors
        </motion.p>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1, duration: 0.6 }}>
          <button onClick={() => navigate(`/signup`)} className="btn btn-accent btn-lg px-6 text-white">
            Sign Up Today
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero;