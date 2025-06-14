import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import notfound from "../../assets/undraw_page-not-found_6wni.png"
const NotFound = () => {
  return (
    <motion.div
      className="h-screen flex flex-col items-center justify-center bg-base-200 p-4 text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
       <motion.img
        src={notfound}
        alt="404 Illustration"
        className="w-72 mb-6"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      />

      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-xl mt-4 text-base-content">Page not found</p>
      <p className="text-sm text-gray-500 mt-2 mb-6">
        Sorry, the page you’re looking for doesn’t exist or has been moved.
      </p>
     <Link to="/home" className="btn btn-primary">
        Back to Home
      </Link>
    </motion.div>
  );
};

export default NotFound;