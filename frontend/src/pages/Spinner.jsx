import { motion } from "framer-motion";

const Spinner = () => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <motion.div
        className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 1,
        }}
      />
    </div>
  );
};

export default Spinner;