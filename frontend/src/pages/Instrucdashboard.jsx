import { useEffect } from "react";
import axiosinstance from "../api";
import { useState } from "react";
import { useContext } from "react";
import { Authcontext } from "../context/Authcontext";
import {Bar} from "react-chartjs-2";
import { Chart as Chartjs,BarElement,CategoryScale,LinearScale } from "chart.js";
import {motion} from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

Chartjs.register(BarElement,CategoryScale,LinearScale)

const Instructordashboard = () => {
const[stats,setstats] = useState([])
const {user} = useContext(Authcontext)
const chartref = useRef(null)
const navigate = useNavigate()
   useEffect(() => {

  
  const fetchinfo = async () => {
    try {
        const res = await axiosinstance.get("/instructor/dashboard", {
            headers: {
                Authorization: `Bearer ${user.user.token}`
            }
        })
       setstats(res.data)
       console.log(res.data);
    } catch (error) {
        console.log("failed to fetch");
    }
  }

  fetchinfo();
   },[user])


   useEffect(() => {
     return () => {
        if(chartref.current){
            chartref.current.destroy();
        }
     }
   },[])

   if(!stats) return <p className="p-4">Loading Dashboard...</p>;





    const coursestats  = stats?.courses?.map((c) => {
            let students = c.enrolledusers.length;
            let revenue = students * c.price;

            

            return {
                courseid: c._id,
                students: students,
                revenue: revenue,
                title: c.title,
                price: c.price,
                reviews: c.reviews.length || 0
            }
        })

        const totalstudents = coursestats?.reduce((acc,c) => acc + c.students,0)
        const totalrevenue = coursestats?.reduce((acc,c) => acc + c.revenue,0)

            const chartData = {
        labels: coursestats?.map(c => c.title),
        datasets: [
            {
                label: "Revenue",
                data: coursestats?.map(c => c.revenue),
                backgroundColor: "rgba(34,197,94,0.7)"
            }
        ]

    }

    return(
       <motion.div initial={{opacity:0, y:20}} animate={{opacity:1,y:0}} className="p-4">
        <div className="flex justify-between">
         <h1 className="text-3xl font-bold mb-4">Instructor Dashboard</h1>
         <button className="btn rounded-xl font-semibold" onClick={() => navigate("/create-course")} >Create Course</button>
        </div>
         

         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 ">
            <div className="bg-base-100 p-4 rounded shadow">
                 <h2 className="text-xl font-semibold">Total courses</h2>
                 <p className="text-2xl">{stats?.totalcourses}</p>
            </div>

             <div className="bg-base-100 p-4 rounded shadow">
                 <h2 className="text-xl font-semibold">Total students</h2>
                 <p className="text-2xl">{totalstudents}</p>
            </div>

              <div className="bg-base-100 p-4 rounded shadow">
                 <h2 className="text-xl font-semibold">Total revenue</h2>
                 <p className="text-2xl">{totalrevenue}</p>
            </div>
         </div>

         
       
       <div className="mb-6 flex justify-center">
        <Bar ref={chartref} data={chartData}  />
       </div>

      <div className="grid gap-4">
        {coursestats?.map((course) => (
            <div key={course.courseid} className="border p-4 rounded-xl">
                <h2 className="text-xl font-semibold">{course.title}</h2>
                <p>Price: ₹{course.price}</p>
                <p>Students: {course.students}</p>
                <p>Reviews: {course.reviews}</p>
                <p>Revenue: {course.revenue}</p>
            </div>
        ))}
       </div>
     

       </motion.div>
    )
}

export default Instructordashboard;