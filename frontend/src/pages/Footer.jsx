

import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {

    const navigate = useNavigate()
    return (
        <motion.footer className="bg-gray-900 py-12 px-6 md:px-20 text-gray-200 "
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: "easeOut" }} viewport={{once:true}}
        >
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-xl font-bold text-white mb-3">Edu App</h3>
                    <p className="text-sm">
                        Empwering learners to grow their skills and achieve their goals with world-class content
                    </p>
                </div>

                <div>
                    <h4 className="text-lg font-semibold mb-2">Explore</h4>
                    <ul className="space-y-1 text-sm">
                        <li><Link className="hover:text-indigo-600"  >Courses</Link></li>
                        <li><Link  className="hover:text-indigo-600">Instructors</Link></li>
                        <li><Link  className="hover:text-indigo-600">Pricing</Link></li>
                        <li><Link   className="hover:text-indigo-600">Blog</Link></li>
                    </ul>
                </div>


                <div>
                    <h4 className="text-lg font-semibold mb-2">
                        Support
                    </h4>
                    <ul className="text-sm space-y-1">
                          <li><Link className="hover:text-indigo-600" >Help Center</Link></li>
                        <li><Link  className="hover:text-indigo-600">Term of Service</Link></li>
                        <li><Link  className="hover:text-indigo-600">Policy</Link></li>
                        <li><Link   className="hover:text-indigo-600">CContact Us</Link></li>
                    </ul>

                </div>


                <div>
                    <h4 className="text-lg font-semibold mb-2">Stay Updated</h4>
                    <p className="mb-3 text-sm">Subscribe to our newsletter for the latest updates</p>
                    <input type="text" className="input input-bordered w-full mb-2" placeholder="Enter your email" />
                    <button className="btn btn-primary w-full">Subscribe</button>

                </div>
            </div>

            <div className="text-center text-sm text-gray-400 mt-10">
                &copy; {new Date().getFullYear()} Edu App. All rights reserved.
            </div>
        </motion.footer>

    )
}

export default Footer;