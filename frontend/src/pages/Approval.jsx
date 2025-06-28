
import { motion } from "framer-motion"
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axiosinstance from "../api";
import { Authcontext } from "../context/Authcontext";
import toast from "react-hot-toast";

const Approval = () => {
    const { courseid } = useParams();
    const { user } = useContext(Authcontext)
    const [screenshots, setscreenshots] = useState([])
    const [loading, setloading] = useState(false)
    const location = useLocation()
    const {course} = location.state || {};

    const fetchinfo = async () => {
        try {
            setloading(true)
            const res = await axiosinstance.get(`/instructor/approval/${courseid}`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })
            setscreenshots(res.data.screenshots)
            console.log(res.data.screenshots);
            //console.log(res.data.courses);
        } catch (error) {
            console.log("failed to fetch");
        } finally {
            setloading(false)
        }
    }

    useEffect(() => {
        fetchinfo()
        console.log(courseid);
    }, [])


    const approve = async (ssid) => {

        try {
            const res = await axiosinstance.put(`/instructor/${courseid}/approve/${ssid}`, {}, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })

            console.log(res.data);

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

    return (
        <div className="">
            <h1>Payment Approval</h1>

            <div>
                {Array.isArray(screenshots) && screenshots?.map((s) => (
                    <div key={s._id}>

                       
                        <div>
                            <img src={s.uploadedby.avatar} alt="avatar" className="w-8" />
                            <p>Uploaded by: <span>{s.uploadedby.name}</span></p>
                            <p>Uploader Email: <span>{s.uploadedby.email}</span></p>
                            <p>Course: <span>{s?.course?.title}</span></p>
                            <p>Course Price: {s?.course?.price}</p>
                             
                        </div>


                        <div>
                            <a href={s.url} className="btn btn-primary">View Payment</a>
                            {s.approval ? (  <button className="btn btn-error" onClick={() => disapprove(s._id)}>Disapprove</button>) : ( <button className="btn btn-success" onClick={() => approve(s._id)}>Approve</button>)}
                           
                            <button className="btn btn-neutral" onClick={() => del(s._id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    )
}

export default Approval;
