import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Authcontext } from "../context/Authcontext";
import axiosinstance from "../api";


const Editreview = () => {
    const [rating, setrating] = useState("")
    const [comment, setcomment] = useState("")
    const navigate = useNavigate()
    const {user} = useContext(Authcontext)
    const {courseid} = useParams()
    const {reviewid} = useParams()

const editr = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosinstance.put(`/r/${courseid}/reviews/${reviewid}`, {newrating: rating,newcomment: comment }, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })
          
            alert("review edited")
            navigate(`/course/${courseid}`)
        } catch (error) {
            console.log(error);
        }
    }

    return(
      <div>
        <h1>Edit Review</h1>

          <form onSubmit={editr}>
                        <textarea type="text" className="textarea" onChange={(e) => setcomment(e.target.value)} value={comment} />
                        <input type="number" className="input" onChange={(e) => setrating(e.target.value)} value={rating} />
                        <button type="submit" className="btn btn-sm btn-info">Edit</button>
                    </form>
      </div>
    )
}

export default Editreview;