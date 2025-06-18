import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Authcontext } from "../context/Authcontext";
import axiosinstance from "../api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";


const Editreview = () => {
    const [rating, setrating] = useState("")
    const [comment, setcomment] = useState("")
    const navigate = useNavigate()
    const { user } = useContext(Authcontext)
    const { courseid } = useParams()
    const { reviewid } = useParams()

    const editr = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosinstance.put(`/r/${courseid}/reviews/${reviewid}`, { newrating: rating, newcomment: comment }, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })

            toast.success("review edited")
            navigate(`/course/${courseid}`)
        } catch (error) {
            console.log(error);
            toast.error("failed to edit review")
        }
    }

    return (
        <motion.div className="max-w-4xl mx-auto p-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

 <div className="space-y-4">
            <h1 className="text-2xl font-bold">Edit Review</h1>
            <form onSubmit={editr} className="">
                <textarea type="text" className="textarea w-full" placeholder="Write your comment" onChange={(e) => setcomment(e.target.value)} value={comment} />
                <div className="starability-slot mt-4">

                    <input type="radio" id="rate1" value="1" name="rating" onChange={(e) => setrating(e.target.value)} />
                    <label htmlFor="rate1" title="terrible">1 stars</label>

                    <input type="radio" id="rate2" value="2" name="rating" onChange={(e) => setrating(e.target.value)} />
                    <label htmlFor="rate2" title="not good">2 stars</label>

                    <input type="radio" id="rate3" value="3" name="rating" onChange={(e) => setrating(e.target.value)} />
                    <label htmlFor="rate3" title="average">3 stars</label>

                    <input type="radio" id="rate4" value="4" name="rating" onChange={(e) => setrating(e.target.value)} />
                    <label htmlFor="rate4" title="very good">4 stars</label>

                    <input type="radio" id="rate5" value="5" name="rating" onChange={(e) => setrating(e.target.value)} />
                    <label htmlFor="rate5" title="amazing">5 stars</label>




                </div>
                <button type="submit" className="btn btn-sm btn-info " >Edit</button>

            </form>
        </div>

        </motion.div>
       
    )
}

export default Editreview;