import { motion } from "framer-motion";

const Cp = ({percentage}) => {
 const radius = 40;
 const stroke = 6;
 const normalizedradius = radius - stroke * 0.5;
 const cf = 2 * Math.PI * normalizedradius;
 const strokeDashoffset = cf - (percentage /100) * cf;
 const ringcolor = percentage >= 75 ? "#22c55e" : percentage >= 50 ? "#facc15" : "#ef4444";
    return(
        <svg width={100} height={100} className="transfrom -rotate-90">
            <circle cx="50" cy="50" r={normalizedradius} stroke="#e5e7eb" strokeWidth={stroke} fill="transparent" />
            <motion.circle cx="50" cy="50" r={normalizedradius} stroke={ringcolor} strokeWidth={stroke} fill="transparent" strokeDasharray={cf}  
            strokeDashoffset={cf} strokeLinecap="round" animate={{strokeDashoffset}} transition={{duration:1}}/>
            <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="16" fill={ringcolor} transform="rotate(90,50,50)" >
                {percentage}%
            </text>
            

        </svg>
    )
}

export default Cp;