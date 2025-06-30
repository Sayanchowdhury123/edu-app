import { useContext } from "react"
import { useState } from "react"
import { Authcontext } from "../context/Authcontext"
import { useEffect } from "react"
import axiosinstance from "../api"
import { useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Loadingscrenn from "./Loadingscreen"
import toast from "react-hot-toast"
import { IoMdArrowRoundBack } from "react-icons/io";


const Quizes = () => {
    const [course, setcourse] = useState([])
    const [loading, setloading] = useState(false)
    const { user } = useContext(Authcontext)
    const location = useLocation();
    const { courseid } = location.state || {};
    const [deleteing, setdeleting] = useState(null)
    const navigate = useNavigate()


    const fetchcourse = async () => {
        try {
            setloading(true)
            const res = await axiosinstance.get(`/course/${courseid}`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })
            setcourse(res.data)
            console.log(res.data);
            //  console.log(user.user);
        } catch (error) {
            console.log(error);
        } finally {
            setloading(false)
        }
    }

    useEffect(() => {
        fetchcourse();
    }, [])



    const deletequiz = async (sectionindex, lessonid, quizid) => {
        console.log(sectionindex, lessonid, quizid, courseid);
        try {
            setdeleting(sectionindex)
            const res = await axiosinstance.delete(`quiz/${courseid}/sections/${sectionindex}/lessons/${lessonid}/q/${quizid}`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`

                }
            })

            setcourse((prev) => {
                return {
                    ...prev, sections: prev.sections.map((s, i) => {
                        if (i === sectionindex) {
                            return {
                                ...s, lessons: s.lessons.map((l) => l.id === lessonid ? { ...l, quiz: l.quiz.filter((q) => q._id !== quizid) } : l),
                            }
                        }
                        return s;
                    })
                }
            })


            toast.success("quiz removed")
            console.log(res.data.course);
            

        } catch (error) {
            console.log(error);
            toast.error("failed to remove quiz")
        } finally {
            setdeleting(null)
        }
    }


    if (loading) return <Loadingscrenn />
    return (


        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto p-6">
           <div className="flex justify-between mb-4">
            <h2 className="text-2xl font-bold mb-4">Manage Quizes</h2>

            <div>
              
                <button className="btn btn-primary" onClick={() => navigate(`/session-lesson/${courseid}`)}>  <IoMdArrowRoundBack/>Back</button>
            </div>
           
           </div>
           
            <div className="h-[90vh] overflow-y-auto  flex flex-col rounded-2xl gap-6" style={{ scrollbarWidth: "none" }}>
                {
                    course?.sections?.map((section, index) => (
                        <motion.div key={index} className="mb-6 bg-base-300 rounded-2xl  h-[200px] overflow-y-auto   " initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: section.index * 0.1 }} style={{ scrollbarWidth: "none" }} >

                            {deleteing === index && (
                                <div className="absolute inset-0 bg-black opacity-50 flex items-center justify-center rounded-t-xl" >
                                    <span className="loading loading-bars loading-lg text-primary">

                                    </span>
                                </div>
                            )}


                            <div className="" style={{ scrollbarWidth: "none" }}>
                                {section?.lessons?.length === 0 ? (
                                    <div className="flex flex-col items-center relative   top-16 gap-3">
                                        <p className="text-error">No lesson Added Yet</p>
                                        <button className="btn btn-sm btn-outline btn-accent" onClick={() => navigate(`/session-lesson/${course._id}`)}>Create Lesson</button>
                                    </div>
                                ) : ""}
                                <ul className="list ml-2 flex gap-9 p-4  rounded-2xl ">
                                    {section?.lessons?.map((lesson) => (

                                        <li key={lesson.id} className=" h-[148px]  ">
                                            <div className="flex justify-between items-center mb-4 ">
                                                <h3 className="font-semibold text-lg mb-1 ">{lesson.title} / {section.title}</h3>
                                                <button onClick={() => navigate(`/quiz`, {
                                                    state: { courseid: courseid, sectionindex: index, lessonid: lesson.id }
                                                })} className="btn btn-primary btn-outline btn-sm">  Add Quiz</button>
                                            </div>

                                            <div>
                                                {lesson?.quiz?.length === 0 ? (
                                                    <div className=" ">
                                                        <p className="text-error">you have to add quiz</p>

                                                    </div>
                                                ) : (
                                                    <div className="h-[13vh]  overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                                                        {
                                                            lesson?.quiz?.map((q) => (
                                                                <div key={q._id} className="flex flex-col   bg-base-200 p-4 rounded-xl gap-3 mb-2">
                                                                    <p>{q.que}</p>
                                                                    <div className="flex gap-2 ">

                                                                        <button type="submit" className="btn-error btn-outline btn mb-1   btn-sm " onClick={() => deletequiz(index, lesson.id, q._id)}  >Delete Quiz</button>
                                                                        <button type="submit" className="btn-info btn-outline btn mb-1   btn-sm " onClick={() => navigate(`/edit-quiz`, {
                                                                            state: { courseid: courseid, sectionindex: index, lessonid: lesson.id, quizid: q._id, quiz: q }
                                                                        })}  >Edit Quiz</button>

                                                                    </div>
                                                                </div>

                                                            ))
                                                        }
                                                    </div>
                                                )}


                                            </div>






                                        </li>


                                    ))}
                                </ul>
                            </div>







                        </motion.div>



                    ))
                }
            </div>

        </motion.div>

    )
}

export default Quizes;