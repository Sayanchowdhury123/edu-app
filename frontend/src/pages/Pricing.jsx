import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";


const pricingPlans = [
    {
        title: "Free",
        price: "$0",
        features: [
            "Access to limited courses",
            "Community support",
            "Basic certificate",
        ],
        button: "Get Started",
        style: "border border-gray-300",
    },
    {
        title: "Pro",
        price: "$19/month",
        features: [
            "Access to all courses",
            "Premium support",
            "Verified certificate",
            "Downloadable resources",
        ],
        button: "Upgrade Now",
        style: "border-2 border-primary shadow-lg bg-base-200",
    },
    {
        title: "Enterprise",
        price: "Custom",
        features: [
            "Team access",
            "Dedicated support",
            "Custom integrations",
            "Admin dashboard",
        ],
        button: "Contact Sales",
        style: "border border-gray-300",
    },
];



const Pricing = () => {

    
    return (
        <div>
            <Nav/>
            <div className="min-h-screen bg-base-100 py-20 px-4">
            <div className="text-center mb-12">
                <motion.h2 initial={{opacity:0,y:-20}} animate={{opacity:1,y:1}} transition={{duration:0.5}}
                 className="text-4xl font-bold text-primary mb-2"
                >
                 Pricing Plans
                </motion.h2>
                <motion.p className="text-base-content"
                initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}}
                >
              Choose a plan that fits your learning journey
                </motion.p>
            </div>

            <div className="grid gap-8 grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto">
                {pricingPlans.map((plan,i) => (
                    <motion.div key={i} initial={{opacity:0,y:30,scale:0.9}}
                     animate={{opacity:1,y:0,scale:1}} transition={{delay: i * 0.2}} className={`rounded-xl p-6 ${plan.style}`}
                    >
                       <h3 className="text-xl font-bold text-primary mb-2">{plan.title}</h3>
                       <p className="text-3xl font-extrabold mb-4">{plan.title}</p>
                        <ul className="mb-6 space-y-2">
                           {plan.features.map((f,idx) => (
                            <li key={idx} >
                               <span>{f}</span>
                            </li>
                           ))}
                        </ul>
                        <button className="btn btn-primary w-full">{plan.button}</button>
                    </motion.div>
                ))}
            </div>
        </div>
        </div>
       

    )
}

export default Pricing;