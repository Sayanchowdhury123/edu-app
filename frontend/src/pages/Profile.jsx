import { useContext, useEffect, useRef, useState } from "react";
import axiosinstance from "../api";
import { Authcontext } from "../context/Authcontext";
import { Link, useLocation } from "react-router-dom";
import { CiCirclePlus } from "react-icons/ci";

const Profile = () => {
    const { login, user, logout } = useContext(Authcontext)
    const location = useLocation();
    const { videourl, title, courseid, lessonid } = location.state || {};
    const [courseprogress, setcourseprogress] = useState([])
    const [avatar, setavatar] = useState("")
    const [profile, setprofile] = useState()
    const fileinputref = useRef(null);

    const become_ins = async () => {
        try {
            const res = await axiosinstance.put("/instructor/become-instructor", {
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

    const progress = async () => {
        try {
            const res = await axiosinstance.get(`/progress`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })

            setcourseprogress(res.data)
        } catch (error) {
            console.log(error);
        }
    }

    const userprofile = async () => {
        try {
            const res = await axiosinstance.get(`/users/profile`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })

            console.log(res.data);
            setprofile(res.data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        progress();
        userprofile();
    }, [])

    const handlefile = async () => {
        fileinputref.current.click()
    }

    const filechange = async (e) => {
        const file = e.target.files[0];
        setavatar(file)
       

        if (file) {
            const formdata = new FormData();
            formdata.append("avatar", file)
            try {

                const res = await axiosinstance.patch(`/users/upload-avatar`, formdata, {
                    headers: {
                        Authorization: `Bearer ${user.user.token}`,
                        "Content-Type": "multipart/form-data"

                    }
                })

                alert("photo uploaded")
                userprofile();

            } catch (error) {
                console.log(error);
            }
        }

    }


    return (
        <div className=' min-h-screen'>
            {user.user.role === "instructor" ? "" : <button onClick={become_ins} className="btn">Become instructor</button>}

            <br />


            <button className="btn" onClick={logout}>Logout</button>

            {
                user.user.role === "instructor" && (
                    <Link className="btn" to={"/instructor-dasshboard"}>
                        instructor dashboard
                    </Link>
                )
            }



            <div>
                <input type="file" className=" file-input hidden" onChange={(e) => filechange(e)} ref={fileinputref} />

            </div>

            <div className="mt-10">
                <figure className="flex flex-col items-center ">
                    <img src={profile?.user?.avatar} alt="avatar" className="rounded-[50%] w-64 h-64 object-cover" />
                    <CiCirclePlus className="text-5xl  relative left-[75px] bottom-[50px] " onClick={handlefile} />
                </figure>

                <p>{profile?.user?.name}</p>
            </div>
        </div>
    )
}

export default Profile;