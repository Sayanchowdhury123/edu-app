

import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import Ac from "./Animatedc";
const About = () => {

    const navigate = useNavigate()
    return (
        <div className="">
            <Nav />

            <div className="min-h-screen  bg-base-100 text-base-content py-16 px-4 md:px-20">
                <motion.h1 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }} className="text-4xl mt-10 font-bold text-primary mb-6 text-center"
                >
                    About Us

                </motion.h1>

                <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-center max-w-3xl mx-auto mb-12">
                    Welcome to our online learning platform, where we aim to make quality education accessible to everyone. Whether you’re learning a new skill or improving your career, we’re here to support your journey.

                </motion.p>


                <div className="grid md:grid-cols-2 gap-12 mb-16">
                    <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="space-y-4">
                        <h2 className="text-primary text-2xl font-semibold ">
                            Our Mission
                        </h2>
                        <p>
                            To provide affordable and accessible education to students around the world, empowering them to reach their full potential through flexible online learning experiences.

                        </p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="space-y-4">
                        <h2 className="text-primary text-2xl font-semibold ">
                            Our Vision
                        </h2>
                        <p>
                            To become a global leader in online education by building a platform where anyone can learn, teach, and grow—regardless of location or background.


                        </p>
                    </motion.div>

                </div>

               <div className="max-w-4xl w-full mx-auto">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
                    className="stats stats-vertical md:stats-horizontal  shadow-lg max-w-4xl w-full bg-base-200 "
                >
                    <div className="stat">
                        <div className="stat-title">
                            Courses
                        </div>
                        <div className="stat-value text-primary"><Ac from={0} to={500} />+</div>
                        <div className="stat-desc">Across 30+ categories</div>
                    </div>

                    <div className="stat">
                        <div className="stat-title">
                            Students
                        </div>
                        <div className="stat-value text-primary"><Ac from={0} to={12000} />+</div>
                        <div className="stat-desc">Learning daily</div>
                    </div>

                    
                    <div className="stat">
                        <div className="stat-title">
                            Instructors
                        </div>
                        <div className="stat-value text-primary"><Ac from={0} to={1200} />+</div>
                        <div className="stat-desc">Industry Experts</div>
                    </div>

                </motion.div>
               </div>
               

            </div>

        </div>

    )
}

export default About;