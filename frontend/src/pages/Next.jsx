import { animate, motion, useMotionValue, useTransform } from "framer-motion"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Next = ({from,to}) => {
const count = useMotionValue(from)
const rounded = useTransform(count,(latest) => Math.floor(latest))
const[value,setvalue] = useState(from)

useEffect(() => {
 const controls = animate(count,to,{
    duration:5,
    ease:"easeOut"
 })

 const unsuscribe = rounded.on("change",(v) => {
    setvalue(v)
 })


 return () => {
    controls.stop()
    unsuscribe();
 }
},[to])



    return <span>{value}</span>
}

export default Next;