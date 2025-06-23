import { motion } from "framer-motion"
import { Headphones } from 'lucide-react';
const Howitworks = () => {

    const steps = [
  {
    title: "Sign Up",
    desc: "Create your free account in just a few clicks and get started instantly.",
    icon: "👤",
  },
  {
    title: "Choose a Course",
    desc: "Browse thousands of expert-led courses tailored to your goals.",
    icon: "📚",
  },
  {
    title: "Learn at Your Pace",
    desc: "Access videos anytime, anywhere on desktop or mobile.",
    icon: "🎧",
  },
  {
    title: "Earn Certificates",
    desc: "Showcase your skills with industry-recognized certifications.",
    icon: "📜",
  },
];


    return (

        <div className="bg-gradient-to-r from-white to-slate-100 py-20 px-4 md:px-12 text-black">
           <motion.h2 className="text-4xl font-bold text-center mb-12"
           initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{duration:0.6}}
           >
              How It Works   
           </motion.h2>

           <div className="grid gap-8 grid-col-1 md:grid-cols-2 lg:grid-cols-4">
             {steps.map((step,i) => (
                <motion.div key={i} initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} transition={{ delay:  i * 0.2}} viewport={{once:true}} 
                className="bg-white shadow-md rounded-xl p-6 text-center space-y-4 hover:shadow-xl transition"
                >
                  <div className="text-4xl">
                      {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </motion.div>
             ))}
           </div>
        </div>
    )
}

export default Howitworks;