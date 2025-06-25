import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";

const Contacts = () => {

const navigate = useNavigate()
    return (

        <div>
            <Nav/>
         <div className="min-h-[93vh] py-10 bg-gradient-to-r from-purple-100 via-white to-purple-50 px-4">
           <motion.h1 initial={{opacity:0,y:-50}} animate={{opacity:1,y:0}} transition={{duration:0.8}}
            className="text-purple-700 font-bold text-4xl mb-10 text-center"
           >
            Get in Touch
           </motion.h1>
 
 <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
   <motion.div className="bg-white p-8 rounded-xl shadow-xl backdrop-blur-md border border-purple-200"
   initial={{opacity:0,x:-60}} animate={{opacity:1,x:0}} transition={{duration:0.9}}
   >
    <form className="space-y-5">
     <div>
        <label className="label mb-2">
            <span className="label-text text-purple-700 font-medium">Name</span>
        </label>
        <input type="text" placeholder="Your Name" className="input input-bordered w-full" />
     </div>

     <div>
        <label className="label mb-2">
            <span className="label-text text-purple-700 font-medium">Email</span>
        </label>
        <input type="email" placeholder="Your Email" className="input input-bordered w-full" />
     </div>

      <div>
        <label className="label mb-2">
            <span className="label-text text-purple-700 font-medium">Email</span>
        </label>
       <textarea placeholder="Write your message. . ." name="" className="textarea w-full textarea-bordered" id=""></textarea>
     </div>

     <button className="btn btn-primary w-full bg-purple-600 hover:bg-purple-700 border-none">Send Message</button>
    </form>
   </motion.div>
      <motion.div
          className="flex flex-col justify-center space-y-6 p-8 rounded-xl bg-white shadow-xl border border-purple-200"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-2xl font-semibold text-purple-700">Contact Information</h2>
          <p className="text-gray-600">Feel free to reach out to us for any inquiries, suggestions, or feedback.</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-purple-600 font-medium">📧 Email:</span>
              <span className="text-gray-600">support@udemyclone.com</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-purple-600 font-medium">📞 Phone:</span>
              <span className="text-gray-600">+91 1234567890</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-purple-600 font-medium">📍 Address:</span>
              <span className="text-gray-600">Kolkata, West Bengal, India</span>
            </div>
          </div>
        </motion.div>


         

 </div>

        </div>
        </div>


    )
}

export default Contacts;