import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Nav = () => {
    const [isopen, setisopen] = useState(false)
    const navlinks = ["Home", "Courses", "Pricing", "About", "Contact"]


    return (
    
           <motion.nav initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 70, damping: 12 }}
            className=" bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-md px-6 py-3 sticky top-0 z-50 backdrop-blur-lg"
        >
            <div className="container mx-auto flex items-center justify-between ">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
                    <Link to="/" className="text-2xl font-bold text-white">Edu App</Link>
                </motion.div>

                <div className="hidden md:flex space-x-6">
                    {navlinks.map((link, index) => (
                        <motion.div key={link} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + index * 0.1 }}   >
                            <Link to={link === "Home" ? "/" : `/${link.toLocaleLowerCase()}`} className="text-base font-medium hover:underline transition duration-300">
                                {link}
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="md:hidden">
                    <button onClick={() => {
                        setisopen((prev) => !prev)
                    }} className="btn btn-ghost">

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {isopen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>


            {isopen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} transition={{ duration: 0.4 }}
                    className="md:hidden px-4 py-4 space-y-2  bg-white/20 border-b border-white/20 backdrop-blur-lg rounded-b-lg shadow-md mt-2"
                >
                    {navlinks.map((link, index) => (
                        <motion.div key={link} initial={{ opacity: 0, y:-10 }} animate={{ opacity: 1,y:1 }} transition={{ delay:  0.3 + index * 0.1 }}  >
                            <Link to={`/${link.toLocaleLowerCase()}`} className="block text-base hover:underline" onClick={() => {setisopen((prev) => !prev)}}>
                                {link}
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </motion.nav>
        

        
      
    )
}

export default Nav;