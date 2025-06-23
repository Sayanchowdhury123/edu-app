import { motion } from "framer-motion"
import Marquee from "react-fast-marquee"

const Marquees = () => {

    const techitems = [
        { src: "assets/react-svgrepo-com.svg", name: "React" },
        { src: "/assets/express-svgrepo-com.svg", name: "Express" },
        { src: "/assets/mongodb-svgrepo-com.svg", name: "MongoDB" },
        { src: "/assets/nodejs01-svgrepo-com.svg", name: "Node.Js" },
        { src: "/assets/tailwind-svgrepo-com.svg", name: "Tailwindcss" },
        { src: "/assets/stripe-svgrepo-com.svg", name: "Stripe" },
        {src:"assets/html-124-svgrepo-com.svg",name:"Html"},
        {src: "assets/css3-01-svgrepo-com.svg", name: "Css"},
        {src:"/assets/js01-svgrepo-com.svg", name:"Js"},
        {src:"/assets/websocket-svgrepo-com.svg",name:"Socket.io"}
    ]

    return (

        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
            className="py-10 bg-gradient-to-r from-[#1e293b] via-[#0f172a] to-[#1e293b]"
        >
            <h2 className="text-center text-2xl md:text-3xl font-bold mb-6">
                Powered By Modern Technologies
            </h2>

            <Marquee speed={60} gradient={false} pauseOnHover className="space-x-10">
              {techitems.map((item,index) => (
                <div key={index} className="mx-4 flex flex-col items-center space-y-2 ml-10 ">
                  <img src={item.src} alt={item.name} className="h-12 w-12 object-contain hover:scale-110 transition duration-300 invert" />
                  <p className="text-white text-sm">{item.name}</p>
                </div>
              ))}
            </Marquee>

        </motion.div>
    )
}

export default Marquees;