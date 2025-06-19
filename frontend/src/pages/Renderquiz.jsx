import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import axiosinstance from "../api";
import { Authcontext } from "../context/Authcontext";


const RenderQuiz = () => {
    const questions = [];
    const location = useLocation()
    const { course, lessonid } = location.state || {};
    const [score, setscore] = useState(0)
    const [clickcount, setclickcount] = useState(0)
    const [showresult, setshowresult] = useState(false)
    const { user } = useContext(Authcontext)
    const navigate = useNavigate()
    const[quizresults,setquizresults] = useState([])

    

    course.sections.forEach((section) => {
        const l = section.lessons.find((lesson) => lesson.id === lessonid)
        l?.quiz.forEach((q) => questions.push(q))
    });


    const [current, setCurrent] = useState(0);
    const q = questions[current];



    const next = () => {
        if (current < questions.length - 1) setCurrent(current + 1);
        setclickcount(0)



    };

    const prev = () => {
        if (current > 0) setCurrent(current - 1);
        setclickcount(0)
    };


    const handleAnswer = async (option) => {

        if (option === q.ans) {
            setscore((prev) => prev + 1)
            toast.success("Correct Answer")

        }

        setclickcount((prev) => prev + 1)

        if (questions?.length - 1 === current) {

            setTimeout(async () => {
                setshowresult(true)

                confetti({
                    particleCount: 200,
                    spread: 100,
                    origin: { y: 0.6 }
                })

                try {

                    const res = await axiosinstance.post(`/quiz/result/${course._id}/lessons/${lessonid}`, { score: score + 1 }, {
                        headers: {
                            Authorization: `Bearer ${user.user.token}`
                        }
                    })

                    console.log(res.data);



                } catch (error) {
                    console.log(error);
                    toast.error("Result Already Submitted")
                }
            }, 2000);


        }



    };










  
    


    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-4 py-10 bg-base-100">
            <motion.div
                key={q._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.4 }}
                className="bg-base-200 rounded-xl shadow-lg p-8 w-full max-w-xl"
            >

                {showresult ? (<motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="bg-success/10 text-success border border-success rounded-xl shadow-lg p-6 max-w-xl text-center space-y-4">
                    <h2 className="text-3xl font-bold">Quiz Completed</h2>
                    <p className="text-xl font-semibold">Your Total Score is <span className="text-success">{score}</span></p>
                    <button className="btn btn-accent" onClick={() => navigate(`/course/${course._id}`)}>Course Page</button>
                </motion.div>
                ) :
                    (
                        <div>
                            <h2 className="text-2xl font-bold mb-2 text-primary">{q.title}</h2>
                            <p className="mb-6 text-lg">{q.que}</p>
                            <div className="grid grid-cols-1 gap-4">
                                {q.options.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        className="btn btn-outline btn-primary w-full"
                                        onClick={() => handleAnswer(opt)}
                                        disabled={clickcount > 0}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-6 flex justify-between">
                                <button
                                    onClick={prev}
                                    className="btn btn-sm btn-secondary"
                                    disabled={current === 0}
                                >
                                    Previous
                                </button>

                                <button
                                    onClick={next}
                                    className="btn btn-sm btn-primary"
                                    disabled={current === questions.length - 1}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}


            </motion.div>
        </div>
    );
};

export default RenderQuiz;

