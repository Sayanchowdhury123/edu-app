import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const StudentViewer = () => {
    const location = useLocation()
    const { courseId } = location.state || {};
    const videoRef = useRef(null);
    const peerConnection = useRef(null);

    useEffect(() => {

          peerConnection.current = new RTCPeerConnection({
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" }
            ]
        })

        socket.emit("viewer-join", courseId);

    
        peerConnection.current.ontrack = event => {
            videoRef.current.srcObject = event.streams[0];
        };
        peerConnection.current.onicecandidate = e => {
            if (e.candidate) {
                socket.emit("ice-candidate", { candidate: e.candidate, courseId });
            }
        };

        socket.on("offer", async ({ offer }) => {
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);
            socket.emit("answer", { answer, courseId });
        });

        socket.on("ice-candidate", async ({ candidate }) => {
            try {
                await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) {
                console.error("Failed to add ICE candidate", err);
            }
        });

        return () => {
            
            peerConnection.current?.close();
        };
    }, [courseId]);

    return (
        <div>
            <h2 className="text-xl font-bold mb-2">Live Class</h2>
            <video ref={videoRef} autoPlay playsInline className="rounded shadow-lg w-full max-w-3xl mx-auto" />
        </div>
    );
};

export default StudentViewer;