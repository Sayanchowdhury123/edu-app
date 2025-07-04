import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Authcontext } from "../context/Authcontext";
import { motion } from "framer-motion";
import axiosinstance from "../api";
import toast from "react-hot-toast";

const Editlesson = () => {
    const { courseid } = useParams();
    const { sectionindex } = useParams();
    const { lessonid } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(Authcontext)
    const [title, settitle] = useState("")
    const [videourl, setvideourl] = useState(null)
    const [uploadsectionindex, setuploadsectionindex] = useState(false)
    const [uploadprogress, setuploadprogress] = useState(null)


  

    const editl = async (courseid,sectionindex,lessonid) => {
       console.log(courseid);
        const formdata = new FormData();
        formdata.append("title", title)
        formdata.append("video", videourl)

    
        setuploadsectionindex(true)
        try {
            const res = await axiosinstance.put(`/courses/${courseid}/sections/${sectionindex}/lessons/${lessonid}`, formdata,{
                headers: {
                    Authorization: `Bearer ${user.user.token}`,
                    "Content-Type": "multipart/form-data"

                }

            }
        )

            
            setuploadsectionindex(false)

            toast.success("lesson edited")
            navigate(`/session-lesson/${courseid}`)
        } catch (error) {
            console.log(error);
            toast.error("failed to edit lesson")
        }
    }

    return (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto p-6">

            <h2 className="text-2xl font-bold mb-4">Edit lesson </h2>
            <form onSubmit={(e) => {
                e.preventDefault();
                editl(courseid, sectionindex, lessonid)
            }} className="mt-4 space-y-4" >
                <motion.input type="text" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }} className="input w-full " onChange={(e) => {
                    settitle(e.target.value)
                }} required />

                {uploadsectionindex &&  (
                    <motion.div className="w-full bg-base-100 p-4 rounded-lg shadow-md mt-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex items-center gap-4">

                            <span className="loading loading-spinner loading-md text-primary" />
                            <p className="text-primary font-semibold">
                                Uploading...
                            </p>

                        </div>
                        <progress className="progress progress-primary w-full mt-3 " value={uploadprogress} max="100" />
                    </motion.div>
                )}

                <motion.input type="file" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }} accept="video/*" className="file-input w-full" onChange={(e) => {
                    setvideourl(e.target.files[0])
                }}  />
                <button type="submit" className="btn btn-accent w-full">Edit lesson</button>
            </form>
        </motion.div>
    )
}

export default Editlesson;