
import { useContext, useEffect, useRef, useState } from "react";
import { Authcontext } from "../context/Authcontext";
import axiosinstance from "../api";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, stagger } from "framer-motion";



const Sessionlesson = () => {
    const { user } = useContext(Authcontext)
    const [course, setcousre] = useState([])
    const fileinput = useRef(null);
    const [file, setfile] = useState("")
    const [uploading, setuploading] = useState(false)
    const [sectiontitle, setsectiontitle] = useState("")
    const { courseid } = useParams();
    const [sections, setsections] = useState([])
    const [lessondata, setlessondata] = useState([])
    const navigate = useNavigate();
    const [uploadsectionindex, setuploadsectionindex] = useState(0)
    const [uploadprogress, setuploadprogress] = useState(null)
    const [lec, setlec] = useState(false)
    const [lectext, setlectext] = useState("")
    const [sectionindex, setsectionindex] = useState()
    const [lessonid, setlessonid] = useState()
    const location = useLocation();
    const { coursename } = location.state || {};

    const fetchvideos = async () => {
        try {
            const res = await axiosinstance.get(`/course/${courseid}/videos`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            });

            setsections(res.data.sections)
            //console.log(res.data.sections);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchvideos();
    }, [user])

    const addsection = async () => {
        try {
            const res = await axiosinstance.post(`/course/${courseid}/sections`, { title: sectiontitle }, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })

            setsectiontitle("")
            fetchvideos();
        } catch (error) {
            console.log(error);
        }
    }

    const addlesson = async (sectionindex, data) => {

        const formdata = new FormData();
        formdata.append("title", data.title)
        formdata.append("video", data.videourl)
        console.log(data);

        setuploadprogress(0)
        setuploadsectionindex(sectionindex)


        try {

            const res = await axiosinstance.post(`/courses/${courseid}/sections/${sectionindex}/upload-video`, formdata, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`,
                    "Content-Type": "multipart/form-data"

                },
                onUploadProgress: (ProgressEvent) => {
                    const percent = Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total)
                    setuploadprogress(percent)
                }
            })


            setuploadprogress(0)
            setuploadsectionindex(null)

            fetchvideos();

            alert("video uploaded")



        } catch (error) {
            console.log(error);
        }


    }

    const deletelesson = async (sectionindex, lessonid) => {
        try {
            const res = await axiosinstance.delete(`/courses/${courseid}/sections/${sectionindex}/lessons/${lessonid}`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`

                }
            })

            fetchvideos();
            alert("lesson deleted")
        } catch (error) {
            console.log(error);
        }
    }

    const deletsection = async (sectionindex) => {
        try {
            const res = await axiosinstance.delete(`/course/${courseid}/sections/${sectionindex}`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`

                }
            })

            fetchvideos();
            alert("section deleted")
        } catch (error) {
            console.log(error);
        }
    }

    const addlecture = async () => {
        try {
            const res = await axiosinstance.put(`/lecture/${courseid}/sections/${sectionindex}/lessons/${lessonid}`, { lecture: lectext, coursename: coursename }, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`

                }
            })

            fetchvideos()
            alert("lecture added")
        } catch (error) {
            console.log(error);
        }
    }

    const dellecture = async (courseid,sectionindex,lessonid) => {
        try {
            const res = await axiosinstance.delete(`/lecture/${courseid}/sections/${sectionindex}/lessons/${lessonid}`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`

                }
            })

            fetchvideos()
            alert("lecture removed")
        } catch (error) {
            console.log(error);
        }
    }
    return (

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto p-6">
            {lec && (
                <motion.div className="absolute inset-0 bg-black opacity-50 flex items-center justify-center rounded-t-xl gap-4 z-1000"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-base-300 p-6 rounded-xl shadow-xl  w-[800px] space-y-4 ">
                        <textarea name="" id="" onChange={(e) => setlectext(e.target.value)} placeholder="Add lecture" className="textarea textarea-bordered w-full h-96 " value={lectext} ></textarea>

                        <div className="flex justify-between">
                            <button className="btn btn-success " onClick={(e) => {
                                addlecture()
                                setlec(false)
                            }}>Save Changes</button>
                            <button onClick={() => setlec(false)} className="btn ">Cancel</button>
                        </div>

                    </motion.div>




                </motion.div>
            )}
            <h2 className="text-2xl font-bold mb-4">Manage sections and lessons</h2>

            <div className="mb-6">
                <motion.input type="text" className="input w-full mb-2" value={sectiontitle} onChange={(e) => setsectiontitle(e.target.value)} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }} />

                <button onClick={addsection} type="submit" className="btn btn-primary" >Add Section</button>


            </div>


            {
                sections?.map((section) => (
                    <motion.div key={section.index} className="mb-6 p-4 border rounded-2xl " initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: section.index * 0.1 }} >

                        <div className="flex justify-between">
                            <h3 className="font-semibold text-lg mb-2 ">{section.title}</h3>
                            <div>
                                <button type="submit" className="btn btn-dash   btn-sm mr-2 " onClick={() => navigate(`/edit-section/${courseid}/${section.index}`)}  >Edit section</button>
                                <button type="submit" className="btn btn-error   btn-sm " onClick={() => deletsection(section.index)}  >Delete section</button>

                            </div>

                        </div>

                        <ul className="list-disc ml-5">
                            {section?.lessons?.map((lesson) => (
                                <li key={lesson.id}>
                                    {lesson.title}
                                    <button type="submit" className="btn-link btn mb-1  ml-3 btn-sm " onClick={() => deletelesson(section.index, lesson.id)}  >Delete lesson</button>
                                    <button type="submit" className="btn-link btn mb-1  ml-3 btn-sm " onClick={() => navigate(`/edit-lesson/${courseid}/${section.index}/${lesson.id}`)}  >Edit lesson</button>
                                    <button type="submit" className="btn-link btn mb-1  ml-3 btn-sm " onClick={() => {
                                        setlec(true)
                                        setsectionindex(section.index)
                                        setlessonid(lesson.id)
                                    }} >Add Lecture</button>
                                    <button type="submit" className="btn-link btn mb-1  ml-3 btn-sm " onClick={() => {
                                      dellecture(courseid,section.index,lesson.id)
                                    }} >Remove Lecture</button>

                                </li>


                            ))}
                        </ul>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            addlesson(section.index, lessondata[section.index])
                        }} className="mt-4 space-y-4" >
                            <motion.input type="text" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }} className="input w-full " onChange={(e) => {
                                const updated = [...lessondata]
                                updated[section.index] = {
                                    ...updated[section.index],
                                    title: e.target.value
                                }
                                setlessondata(updated)
                            }} value={lessondata[section.index]?.title} required />

                            {uploadsectionindex === section.index && uploadprogress > 0 && (
                                <motion.div className="w-full bg-base-100 p-4 rounded-lg shadow-md mt-4"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="flex items-center gap-4">

                                        <span className="loading loading-spinner loading-md text-primary" />
                                        <p className="text-primary font-semibold">
                                            Uploading : {uploadprogress}%
                                        </p>

                                    </div>
                                    <progress className="progress progress-primary w-full mt-3 " value={uploadprogress} max="100" />
                                </motion.div>
                            )}

                            <motion.input type="file" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }} accept="video/*" className="file-input w-full" onChange={(e) => {
                                {
                                    const updated = [...lessondata]
                                    updated[section.index] = {
                                        ...updated[section.index],
                                        videourl: e.target.files[0]
                                    }
                                    setlessondata(updated)
                                }
                            }} required />
                            <button type="submit" className="btn btn-accent w-full">Add lesson</button>
                        </form>




                    </motion.div>



                ))
            }
        </motion.div>
    )
}

export default Sessionlesson;