import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRef } from "react";
import axiosinstance from "../api";
import { Authcontext } from "../context/Authcontext";
import toast from "react-hot-toast";


const Quiz = () => {
    const location = useLocation()
    const { courseid, lessonid, sectionindex } = location.state || {};
    const [title, settile] = useState("")
    const [que, setque] = useState("")
    const [ans, setans] = useState("")
    const [options, setoptions] = useState([])
    const [o, seto] = useState("")
    const optionsref = useRef(null)
    const {user} = useContext(Authcontext)
     const navigate = useNavigate()

    const addoptions = () => {
        if (o) {
            setoptions((prev) => {
                return [...prev, o]
            })

            seto("")
            toast.success(` Added ${o}`)
            console.log(options);

        }
    }

const addquiz = async () => {
        try {
            const res = await axiosinstance.put(`quiz/${courseid}/sections/${sectionindex}/lessons/${lessonid}`, { title: title, que: que, ans: ans, options: options }, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`

                }
            })

            
            toast.success("quiz added")
            console.log(res.data.course);
            settile("")
            setque("")
            setans("")
            navigate(`/quizes`, {
                 state: { lessonid: lessonid, courseid: courseid, sectionindex: sectionindex }
            })
        } catch (error) {
            console.log(error);
            toast.error("failed to add quiz")
        }
    }
  



    const handleoptionchage = (index, value) => {
        const updated = [...options]
        updated[index] = value;
        setoptions(updated)
    }

    const handleoptionremove = (index) => {

        setoptions((prev) => prev.filter((_, i) => i !== index))

    }

    const handleoptionadd = () => {
        if (options.length > 4) return;
        setoptions((prev) => [...prev, ""])

    }
    return (

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4">
            <h1 className="text-3xl font-bold mb-4 text-center" >Add Quiz</h1>


            <div className="space-y-4 md:w-md mx-auto">
                <div>
                    <label className="block mb-1"> Quiz Title</label>
                    <input name="title" className="input w-full input-bordered" onChange={(e) => settile(e.target.value)} value={title} />

                </div>

                <div>
                    <label className="block mb-1 ">Question</label>
                    <input name="q" className="input w-full input-bordered" onChange={(e) => setque(e.target.value)} value={que} />

                </div>

                <div>
                    <label className="block mb-1 ">Answer</label>
                    <input name="a" className="input w-full input-bordered" onChange={(e) => setans(e.target.value)} value={ans} />

                </div>


                 <div className="">
                    <label className="block mb-1 ">Options</label>
                    {options?.map((opt, index) => (
                        <div key={index} className="flex items-center mb-2 gap-1">
                            <input name="o" className="input w-full input-bordered " ref={optionsref} onChange={(e) => handleoptionchage(index, e.target.value)} value={opt} disabled={options.length > 4} />


                            <button className={`btn  btn-sm btn-error mt-1 mb-1  `} onClick={() => handleoptionremove(index)}>Remove</button>
                        </div>


                    ))}




                    <p className="text-red-500 mt-1">{options.length > 4 ? "Limit Reached" : ""}</p>

                </div>

                <button className={`btn btn-outline btn-info btn-sm mb-4 w-full `} onClick={handleoptionadd} disabled={options.length > 4}>Add Option</button>

                <button type="submit" className="btn btn-primary w-full" onClick={addquiz}>
                    Submit
                </button>

            </div>



        </motion.div>
    )

}


export default Quiz;