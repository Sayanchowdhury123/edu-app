import { useContext } from "react";
import axiosinstance from "../api";
import { Authcontext } from "../context/Authcontext";
import { Link } from "react-router-dom";


const Profile = () => {
    const {login,user,logout} = useContext(Authcontext)

    const become_ins = async () => {
        try {
            const res = await axiosinstance.put("/instructor/become-instructor",{
                  headers: {
                Authorization: `Bearer ${user.user.token}`
            }
            })
            login(res.data)
            alert("you became instructor")
        } catch (error) {
            console.log(error);
            alert("failed to become instructor")
        }
    }

    return(
     <div className=' min-h-screen'>
        {user.user.role === "instructor" ? ""  : <button onClick={become_ins} className="btn">Become instructor</button> }

     <br />


     <button className="btn" onClick={logout}>Logout</button>

     {
      user.user.role === "instructor" && (
         <Link className="btn" to={"/instructor-dasshboard"}>
         instructor dashboard
         </Link>
      )
     }
    </div>
    )
}

export default Profile;