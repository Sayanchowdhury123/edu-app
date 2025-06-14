import { motion } from "framer-motion";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";


const AnnouncementBanner = ({ announcement }) => {
const [show,setshow] = useState(true)

    const formattime = (timestamp) => {
        const date = new Date(timestamp)
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

console.log(announcement);
  if (!announcement) return null;

  return (
    <motion.div
      className={`alert alert-info   z-10000  shadow-lg ${show === false ? "hidden": ""} `}
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
       
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"
          />
      </svg>
      <p className="font-medium">{announcement.text}</p>
      <p className="text-sm text-black "> Posted on : {new Date(announcement.date).toLocaleDateString()}</p>
      <button className="btn btn-sm" onClick={(e) => setshow(false)}><IoMdClose/></button>
    </motion.div>
  );
};

export default AnnouncementBanner;
