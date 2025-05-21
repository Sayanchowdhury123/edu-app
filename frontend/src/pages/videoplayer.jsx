
import { motion } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import ReactPlayer from "react-player";
import { useEffect, useRef, useState } from "react";
import screenfull from "screenfull";
import { IoMdPause } from "react-icons/io";
import { FaPause, FaPlay } from "react-icons/fa";
import { MdFullscreen } from "react-icons/md";
import { AnimatePresence } from "framer-motion";
import { FaVolumeMute } from "react-icons/fa";
import { GoUnmute } from "react-icons/go";

const Videoplayer = () => {

    const location = useLocation();
    const { videourl, title, courseid } = location.state || {};
    const playerref = useRef(null)
    const playercontainerref = useRef(null)
    const [playing, setplaying] = useState(false)
    const [muted, setmuted] = useState(false)
    const [volume, setvolume] = useState(0.8)
    const [played, setplayed] = useState(0)
    const [v, setv] = useState(true)
    const [duration, setduration] = useState(0)
    const [showicon, setshowicon] = useState(null)

    const handleprogress = (state) => {
        setplayed(state.played)



    }

    const togglefullscrenn = () => {
        if (screenfull.isEnabled) {
            screenfull.request(playercontainerref.current)
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




    return (
        <motion.div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
            onClick={() => setv((prev) => !prev)}
        >
            <div className="text-center mt-6">
                <Link to={`/course/${courseid}`} >Back To Dashboard</Link>

            </div>



            <div className="w-full max-w-4xl" ref={playercontainerref} >
                <h1 className="text-3xl font-bold mb-6 text-center">{title || "Video Lesson"}</h1>
                <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg" >

                    {videourl ? (
                        <div className="relative w-full" onClick={playclick}>


                            <ReactPlayer url={videourl} width={"100%"} height={"100%"} ref={playerref} playing={playing} volume={volume} muted={muted} onProgress={handleprogress} controls={false} className="pointer-events-none"
                                onDuration={(d) => setduration(d)}
                            />

                            <AnimatePresence>

                                {showicon && (
                                    <motion.div key={showicon} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.5 }} className="absolute inset-0 flex items-center justify-center bg-black/20">
                                        {showicon === "play" ? (
                                            <FaPlay className="text-white text-5xl" />
                                        ) : (
                                            <FaPause className="text-5xl text-white" />
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>




                            <div className={`absolute bottom-10 z-50 left-0 right-0 bg-black  p-3 flex justify-between gap-2 ${v ? "opacity-100" : "opacity-0"}`}>
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

                            <div className={`absolute bottom-0 left-0 right-0 bg-black  px-4 py-2 flex flex-col z-50 text-white gap-4 ${v ? "opacity-100" : "opacity-0"}`} >
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex gap-2">

                                        <button onClick={(e) => {
                                            e.stopPropagation();
                                            setmuted((prev) => !prev)
                                        }} className="btn">
                                          {muted ? (<FaVolumeMute/>): (<GoUnmute/>)}  
                                        </button>

                                        <input type="range" min={0} max={1} step="0.01" value={volume}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                setvolume(parseFloat(e.target.value))
                                            }}
                                            className="range range-xs range-primary w-24 relative top-2"
                                        />
                                    </div>

                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        togglefullscrenn();
                                    }} className="" ><MdFullscreen size={30} /></button>
                                </div>
                            </div>




                        </div>


                    ) : (
                        <div className="flex items-center justify-center h-full ">No video found</div>
                    )}
                </div>


            </div>


        </motion.div>

    )
}

export default Videoplayer;