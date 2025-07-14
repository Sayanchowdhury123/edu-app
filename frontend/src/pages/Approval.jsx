
import { motion } from "framer-motion"
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axiosinstance from "../api";
import { Authcontext } from "../context/Authcontext";
import toast from "react-hot-toast";
import Loadingscrenn from "./Loadingscreen";
import { FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FcDisapprove } from "react-icons/fc";
import { FcApprove } from "react-icons/fc";
import { MdManageAccounts } from "react-icons/md";

const Approval = () => {
    const { courseid } = useParams();
    const { user } = useContext(Authcontext)
    const [screenshots, setscreenshots] = useState([])
    const [loading, setloading] = useState(false)
    const location = useLocation()
    const { course } = location.state || {};
    const navigate = useNavigate()

    const fetchinfo = async () => {
        try {
            setloading(true)
            const res = await axiosinstance.get(`/instructor/approval/${courseid}`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })
            setscreenshots(res.data.screenshots)
            
            
        } catch (error) {
            console.log("failed to fetch");
        } finally {
            setloading(false)
        }
    }

    useEffect(() => {
        fetchinfo()
        
    }, [])


    const approve = async (ssid) => {

        try {
            const res = await axiosinstance.put(`/instructor/${courseid}/approve/${ssid}`, {}, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })

            

            setscreenshots((prev) => prev.map((s) => s._id === ssid ? res.data : s))
            toast.success("payment approved")

        } catch (error) {
            console.log(error);
            toast.error("payment not approved")

        }
    }




    const del = async (ssid) => {

        try {
            const res = await axiosinstance.delete(`/instructor/${courseid}/del/${ssid}`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })

            setscreenshots((prev) => prev.filter((s) => s._id !== ssid))

            toast.success("payment deleted")

        } catch (error) {
            console.log(error);
            toast.error("payment not deleted")
        }
    }

    const disapprove = async (ssid) => {

        try {
            const res = await axiosinstance.put(`/instructor/${courseid}/disapprove/${ssid}`, {}, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })

            setscreenshots((prev) => prev.map((s) => s._id?.toString() === ssid?.toString() ? res.data : s))

            toast.success("payment disapproved")

        } catch (error) {
            console.log(error);
            toast.error("payment not disapproved")
        }
    }

    if(loading) return <Loadingscrenn/>

    return (
        <motion.div className="min-h-screen w-full p-8">
            <div className="flex justify-between">
                <div>
    <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="text-3xl font-semibold mb-6">Payment Approval</motion.h1>
                </div>
            
                <div>
                    <button className="btn btn-primary" onClick={() => navigate(`/course-management`)}><MdManageAccounts/>Course management</button>
                </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.isArray(screenshots) && screenshots?.map((s, i) => (
                    <motion.div whileHover={{scale: 1.05}} key={s._id} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card">


                        <div className="card-body bg-base-200 rounded-xl shadow-lg">
                            <div className="flex items-center gap-2">
                             <img src={s?.uploadedby?.avatar} alt="avatar" className="w-8 rounded-full" />
                            <p className="text-sm"> <span className="">{s?.uploadedby?.name}</span></p>
                            </div>
                           
                            <p className="text-sm"> Uploader Email : <span className="t">{s?.uploadedby?.email}</span></p>
                            <p>Course : <span>{s?.course?.title}</span></p>
                            <p>Course Price : ₹{s?.course?.price}</p>

                            <div className="card-actions mt-2">
                                <a href={s.url} className="btn btn-sm btn-outline btn-primary"><FaEye/>View Payment</a>
                                {s.approval ? (<button className="btn btn-accent btn-outline btn-sm" onClick={() => disapprove(s._id)}><FcDisapprove/>Disapprove</button>) : (<button className="btn btn-sm btn-outline btn-success" onClick={() => approve(s._id)}><FcApprove/>Approve</button>)}

                                <button className="btn btn-error btn-sm btn-outline" onClick={() => del(s._id)}><MdDelete/>Delete</button>
                            </div>

                        </div>



                    </motion.div>
                ))}
            </div>
        </motion.div>

    )
}

export default Approval;
