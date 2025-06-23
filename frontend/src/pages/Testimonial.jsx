import { motion } from "framer-motion";

const testimonials = [
    {
        name: "Amit Sharma",
        title: "Web Developer",
        text: "This platform helped me land my first job! The instructors are top-notch and the content is always up to date.",
        avatar: "https://i.pravatar.cc/100?img=1",
    },
    {
        name: "Priya Das",
        title: "UI/UX Designer",
        text: "I loved the design courses — they’re interactive, practical, and easy to follow.",
        avatar: "https://i.pravatar.cc/100?img=2",
    },
    {
        name: "Rahul Verma",
        title: "Marketing Executive",
        text: "I’ve completed 10+ courses and I can say this is one of the best platforms for learning new skills.",
        avatar: "https://i.pravatar.cc/100?img=3",
    },
     {
    name: "Aarav Mehta",
    title: "Frontend Developer",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "The course structure was very well thought out. The explanations were clear, and I loved the interactive examples."
  },
  {
    name: "Riya Kapoor",
    title: "UI/UX Designer",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    text: "The design sections of the course helped me enhance my workflow. It’s perfect for anyone starting out in tech."
  },
  {
    name: "Devansh Singh",
    title: "Full Stack Developer",
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
    text: "This course gave me confidence to build full-fledged apps. The backend sections were top notch!"
  },

];





const Testimonial = () => {


    return (

        <div className="bg-gradient-to-r from-white to-indigo-50 py-20 px-4 md:px-12 text-black">
            <motion.h2 className="text-4xl font-bold text-center mb-12 text-indigo-800"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            >
                What Our Learners Say
            </motion.h2>


            <div className="grid gap-8 grid-col-1 md:grid-cols-3">
                {testimonials.map((t, i) => (
                    <motion.div key={i} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                        initial={{
                            opacity: 0,
                            y: i % 2 === 0 ? 50 : -50,
                        }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5  ,delay: i * 0.2 }} viewport={{once:true}}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <img src={t.avatar} alt={t.avatar} className="w-14 h-14 rounded-full ring ring-indigo-300 ring-offset-2" />
                            <div>
                                <h1 className="text-lg font-semibold text-indigo-700">{t.name}</h1>
                                <p className="text-sm text-gray-500">{t.title}</p>
                               
                            </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{t.text}</p>

                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default Testimonial;