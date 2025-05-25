import { useContext, useEffect, useRef, useState } from "react";
import axiosinstance from "../api";
import { Authcontext } from "../context/Authcontext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CiCirclePlus } from "react-icons/ci";
import { motion } from "framer-motion";
import Cp from "./Cp";


const Profile = () => {
    const { login, user, logout } = useContext(Authcontext)
    const location = useLocation();
    const { videourl, title, courseid, lessonid } = location.state || {};
    const [courseprogress, setcourseprogress] = useState([])
    const [avatar, setavatar] = useState("")
    const [profile, setprofile] = useState()
    const fileinputref = useRef(null);
    const navigate = useNavigate()
    const [wl, setwl] = useState([])

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
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        progress();

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

    const userprofile = async () => {
        try {
            const res = await axiosinstance.get(`/users/profile`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })

            setprofile(res.data)
            //console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        userprofile();

    }, [])

    const unenrolled = async (courseid) => {
        try {
            const res = await axiosinstance.delete(`/enroll/${courseid}`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })

            userprofile()
            alert("you are unenrolled")
        } catch (error) {
            console.log(error);
        }
    }

    const wishlist = async () => {
        try {
            const res = await axiosinstance.get(`/users/wishlist`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })

            setwl(res.data)

            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        wishlist();
    }, [])

    const removewishlist = async (courseid) => {
        try {
            const res = await axiosinstance.delete(`/users/wishlist/${courseid}`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })

            wishlist()
            alert("removed from wishlist")

        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className=' min-h-screen'>
            {user.user.role === "instructor" ? "" : <button onClick={become_ins} className="btn">Become instructor</button>}
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

            <div className="mt-10 text-center ">
                <figure className="flex flex-col items-center ">
                    <img src={profile?.user?.avatar} alt="avatar" className="rounded-[50%] w-64 h-64 object-cover" />
                    <CiCirclePlus className="text-5xl  relative left-[75px] bottom-[50px] " onClick={handlefile} />
                </figure>

                <p>{profile?.user?.name}</p>
                <p>{profile?.user?.email}</p>
            </div>

            <div>
                <p>Course Progress</p>
                <div>
                    {courseprogress?.length === 0 ? (
                        <div>
                            <p>you have to watch course videos</p>
                            <button onClick={() => navigate(`/home`)} className="btn btn-primary btn-sm">Hone Page</button>
                        </div>
                    ) : (
                        <div className="flex ">
                            {courseprogress?.map((progress, i) => {
                                const course = profile?.enrolledcourses?.find(c => c._id === progress.course)
                                const totallessons = course?.sections?.reduce((acc, section) => acc + section.lessons.length, 0) || 0;
                                const completed = progress?.completedlesson?.length;
                                const percentage = totallessons ? Math.floor((completed / totallessons) * 100) : 0;


                                return (
                                    <div key={i} className="flex items-center gap-4">
                                        <div>
                                            <p>{course?.title}</p>
                                            <p className="">{percentage}% completed ({completed} / {totallessons} lessons)</p>
                                        </div>
                                        <Cp percentage={percentage} />


                                    </div>
                                )
                            })}
                        </div>
                    )}

                </div>
            </div>

            <div>
                <h1>Enrolled Courses</h1>

                {profile?.enrolledcourses?.length === 0 ? (
                    <div>

                    </div>
                ) : (

                    <div>
                        {profile?.enrolledcourses?.map((course) => (
                            <div key={course._id}>
                                <div>
                                    <figure>
                                        <img src={course?.thumbnail} alt="thumbnail" />
                                    </figure>
                                    <p className="card-title text-2xl font-semibold">{course.title}</p>
                                    <p className="text-lg text-gray-700">Price : ₹{course.price}</p>
                                    <p className="text-sm text-gray-500">Author : {course.instructor?.name}</p>

                                    <button className="btn btn-primary btn-sm" onClick={() => navigate(`/course/${course._id}`)} >View Course</button>
                                    <button className="btn btn-error btn-sm" onClick={() => unenrolled(course._id)} >Unenroll</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>


            <div>
                <h1>Wishlist</h1>

                {wl?.wishlist?.length === 0 ? (
                    <div>
                        <p>you have add to courses to wishlist</p>
                        <button onClick={() => navigate(`/home`)} className="btn btn-primary btn-sm">Hone Page</button>
                    </div>
                ) : (
                    <div>
                        {wl?.wishlist?.map((w) => (
                            <div key={w._id}>
                                <figure>
                                    <img src={w?.thumbnail} alt="thumbnail" />
                                </figure>
                                <p className="card-title text-2xl font-semibold">{w.title}</p>
                                <p className="text-lg text-gray-700">Price : ₹{w.price}</p>
                                <p className="text-sm text-gray-500">Author : {w.instructor?.name}</p>
                                <button className="btn btn-primary btn-sm" onClick={() => navigate(`/course/${w._id}`)} >View Course</button>
                                <button className="btn btn-error btn-sm" onClick={() => removewishlist(w._id)} >Remove From Wishlist</button>
                            </div>
                        ))}
                    </div>
                )}

            </div>


        </div>
    )
}

export default Profile;