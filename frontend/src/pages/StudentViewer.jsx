import { useContext, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { Authcontext } from "../context/Authcontext";
import { Track } from "livekit-client";


const StudentViewer = () => {
    const location = useLocation()
    const { courseId } = location.state || {};
    const {user} = useContext(Authcontext)

       



    return (
         
             <div className="flex flex-col items-center justify-center w-full h-full text-white p-4">
               <h2 className="text-xl font-bold mb-4">Watching Live Class</h2>
               <VideoConference/>
             </div>
              
    );
};





export default StudentViewer;