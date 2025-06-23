import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Popularcat = () => {
const navigate = useNavigate();

const categories = [
  { name: "Web Development", icon: "💻",cat:"web dev"},
  { name: "UI/UX Design", icon: "🎨" ,cat:"ui"},
  { name: "Marketing", icon: "📈" },
  { name: "Data Science", icon: "📊" },
  { name: "Photography", icon: "📷" },
  { name: "Business", icon: "💼" },
  { name: "Music", icon: "🎵" },
  { name: "Personal Development", icon: "🧠" },
];


    return (
        <div className="bg-white py-20 px-4 md:px-12">
             <motion.h2 className="text-4xl font-bold text-center mb-12 text-black"
           initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{duration:0.6}}
           >
              Explore Popular Categories
           </motion.h2>

           <div className="grid gap-8 sm:grid-col-2 md:grid-cols-4">
              {categories.map((cat,i) => (
                <motion.div key={i} onClick={() => {
                     navigate(`/home`,{state: {cat: cat.cat} })
                }} className="bg-gradient-to-br from-violet-100 to-indigo-100 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all cursor-pointer hover: -translate-y-1"
                initial={{opacity:0,x:40}} whileInView={{opacity:1,x:0}} transition={{duration:0.6, delay: i * 0.1}} viewport={{once: true}}
                >
                  <div className="text-4xl mb-3">{cat.icon}</div>
                  <h3 className="text-lg font-semibold text-indigo-700">{cat.name}</h3>
                </motion.div>
              ))}
           </div>
        </div>
    )
}

export default Popularcat;