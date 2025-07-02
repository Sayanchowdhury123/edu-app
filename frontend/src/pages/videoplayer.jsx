
import { motion } from "framer-motion";
import { useLocation, Link, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import { useContext, useEffect, useRef, useState } from "react";
import screenfull from "screenfull";
import { IoMdPause } from "react-icons/io";
import { FaPause, FaPlay } from "react-icons/fa";
import { MdFullscreen } from "react-icons/md";
import { AnimatePresence } from "framer-motion";
import { FaVolumeMute } from "react-icons/fa";
import { GoUnmute } from "react-icons/go";
import axiosinstance from "../api";
import { Authcontext } from "../context/Authcontext";
import { IoMdSettings } from "react-icons/io";
import { IoIosSkipForward } from "react-icons/io";
import { IoIosSkipBackward } from "react-icons/io";
import toast from "react-hot-toast"


const Videoplayer = () => {
    const { user } = useContext(Authcontext)
    const location = useLocation();
    const { videourl, title, courseid, lessonid, resolutions, lesson } = location.state || {};
    const playerref = useRef(null)
    const playercontainerref = useRef(null)
    const [playing, setplaying] = useState(false)
    const [muted, setmuted] = useState(false)
    const [volume, setvolume] = useState(0.8)
    const [played, setplayed] = useState(0)
    const [v, setv] = useState(false)
    const [duration, setduration] = useState(0)
    const [showicon, setshowicon] = useState(null)
    const navigate = useNavigate()
    const [courseprogress, setcourseprogress] = useState([])
    const [res, setres] = useState(null)
    const [qbox, setqbox] = useState(false)
    const [quality, setquality] = useState(videourl)
    const [control, setcontrol] = useState(false)
    const [showskip, setshowskip] = useState(false)
    const timeref = useRef(null)





    const progressc = async () => {
        try {
            const res = await axiosinstance.get(`/progress`, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })

            setcourseprogress(res.data)
            //  console.log(resolutions);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        progressc()
    }, [])



    const handleprogress = (state) => {
        setplayed(state.played)
        // console.log(played);
        const coursep = courseprogress?.find((c) => c.course === courseid)
        const iscompleted = coursep?.completedlesson?.includes(lessonid)
        if (!iscompleted && state.played === 1) {

            progress();
            console.log(lessonid);

        }
    }

    const progress = async () => {
        try {
            const res = await axiosinstance.post(`/progress/${courseid}/complete`, { lessonid: lessonid }, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })

            toast.success(`${title} is completed`)
        } catch (error) {
            console.log(error);
        }
    }

    const togglefullscrenn = () => {
        if (screenfull.isEnabled) {
            if(screenfull.isFullscreen){
                screenfull.exit()
            } else{
                screenfull.request(playercontainerref.current)
            }
           
        }
    }

    const formattime = (seconds) => {
        const min = Math.floor(seconds / 60)
        const sec = Math.floor(seconds % 60)

        return `${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec} `;
    }

    const playclick = () => {
        setplaying((prev) => {
            const newstate = !prev;
            setshowicon(newstate ? "play" : "pause")
            setTimeout(() => setshowicon(null), 1000)
            return newstate;

        })





    }


    const handlequality = (e) => {
        setquality(resolutions[e.target.value])
        console.log(resolutions[e.target.value]);
       

    }


    const skipforward = () => {
        const currenttime = playerref.current.getCurrentTime();
        console.log(currenttime);
        playerref.current.seekTo(currenttime + 10)
    }

    const skipbackward = () => {
        const currenttime = playerref.current.getCurrentTime();
        console.log(currenttime);
        playerref.current.seekTo(currenttime - 10)
    }


    useEffect(() => {
        const hadlemousemove = () => {
            setcontrol(true)
            setshowskip(true)
            if (timeref.current) {
                clearTimeout(timeref.current)
            }

            timeref.current = setTimeout(() => {
                setcontrol(false)
                setshowskip(false)
            }, 5000);

        }

        const container = playercontainerref.current;
        if (container) {
            container.addEventListener("mousemove", hadlemousemove)
        }


        return () => {

            if (container) container.removeEventListener("mousemove", hadlemousemove)

            if (timeref.current) clearTimeout(timeref.current)


        }
    }, [])


    return (

        <div className="bg-base-200 h-screen  p-6">
            <div className="flex justify-between">
                <div>
                    <Link to={`/course/${courseid}`} className="btn btn-accent" >Back To Dashboard</Link>
                </div>

                <button className="btn btn-primary" onClick={() => navigate("/profile", {
                    state: { courseid: courseid }
                })}>Go To Profile</button>

            </div>

            <motion.div className=" flex justify-center items-center h-[80vh]"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}

            >





                <div className="w-full max-w-4xl relative flex flex-col justify-center  " ref={playercontainerref} >
                   <h1 className={`text-3xl ${control ? "opacity-100" : "opacity-0"} transition-all duration-500 font-bold text-center mb-1`}>{title || "Video Lesson"}</h1>
                    <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg  "  >




                        {videourl ? (
                            <div className=""  >



                                <div className="relative" onClick={playclick}>

                                   {showskip ? (<div className="absolute inset-0 flex justify-center items-center transition-all duration-500 ">
                                        <div className="flex justify-between w-full sm:px-20 lg:px-70 " >
                                            <motion.div whileTap={{ scale: 0.9 }} onClick={(e) => {
                                                e.stopPropagation()
                                                skipbackward()
                                            }}  >
                                                <IoIosSkipBackward size={60} fill="black" />

                                            </motion.div>

                                            <motion.div whileTap={{ scale: 0.9 }} onClick={(e) => {
                                                e.stopPropagation()
                                                skipforward()

                                            }}>
                                                <IoIosSkipForward size={60} fill="black" />
                                            </motion.div>


                                        </div>
                                    </div>) : ""}

                                    <ReactPlayer url={quality} width={"100%"} height={"100%"} ref={(player) => playerref.current = player} playing={playing} volume={volume} muted={muted} onProgress={handleprogress} controls={false} className="pointer-events-none"
                                        onDuration={(d) => setduration(d)}
                                    />

                                     
                                </div>

                                
                                <AnimatePresence>
                                     

                                    {showicon && (
                                        <motion.div key={showicon} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.5 }} className="absolute inset-0 flex  justify-center items-center bg-black/20">
                                            {showicon === "play" ? (
                                                <FaPlay className="text-black text-7xl" />
                                            ) : (
                                                <FaPause className="text-7xl text-black" />
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>


                               



                              



                                <div className={`${control ? "opacity-100" : " opacity-0"} transition-all duration-500 `}   >
                                    <div className={`absolute bottom-12 z-50 left-0 right-0 bg-black   px-3 py-3 flex justify-between gap-2 `}>
                                        <span>{formattime(played * duration)}</span>

                                        <input type="range" min={0} max={1} step="any" value={played} className="range range-sm range-primary w-full "
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                const seek = parseFloat(e.target.value)

                                                setplayed(seek)
                                                playerref.current.seekTo(seek)


                                            }}
                                        />
                                        <span>{formattime(duration)}</span>
                                    </div>

                                    <div className={`absolute   bottom-0 left-0 right-0 bg-black rounded-lg  px-3 py-3 flex flex-col z-50 text-white gap-4 `} >
                                        <div className="flex items-center justify-between flex-wrap gap-4">
                                            <div className="flex gap-2">

                                                <button onClick={(e) => {
                                                    e.stopPropagation();
                                                    setmuted((prev) => !prev)
                                                }} className="btn">
                                                    {muted ? (<FaVolumeMute />) : (<GoUnmute />)}
                                                </button>

                                                <input type="range" min={0} max={1} step="0.01" value={volume}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        setvolume(parseFloat(e.target.value))
                                                    }}
                                                    className="range range-xs range-primary w-24 relative top-2"
                                                />
                                            </div>






                                            <div className="flex items-center gap-3">

                                                {
                                                    qbox && (
                                                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className=" ">
                                                            <select name="" id="" className="select" onChange={(e) => handlequality(e)}>
                                                                <option value="720p"  >720p</option>
                                                                <option value="480p"   >480p</option>
                                                                <option value="360p"   >360p</option>
                                                                <option value="144p" >144p</option>
                                                            </select>

                                                        </motion.div>
                                                    )
                                                }

                                                <button onClick={(e) => {
                                                    e.stopPropagation();

                                                    setqbox((prev) => !prev)
                                                }}>
                                                    <motion.div  ><IoMdSettings size={25} /></motion.div>
                                                </button>

                                                <button onClick={(e) => {
                                                    e.stopPropagation();
                                                    togglefullscrenn();
                                                }} className="" ><MdFullscreen size={30} /></button>
                                            </div>

                                        </div>
                                    </div>
                                </div>






                            </div>


                        ) : (
                            <div className="flex items-center justify-center h-full ">No video found</div>
                        )}
                    </div>


                </div>


            </motion.div>
        </div>


    )
}

export default Videoplayer;