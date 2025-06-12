import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const StudentViewer = () => {
    const location = useLocation()
    const { courseId } = location.state || {};
    const videoRef = useRef(null);
    const peerConnection = useRef(null);
    const navigate = useNavigate()

    useEffect(() => {

        peerConnection.current = new RTCPeerConnection({
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" }
            ]
        });

        const remotestream = new MediaStream()
        videoRef.current.srcObject = remotestream;

        peerConnection.current.ontrack = (event) => {
            event.streams[0].getTracks().forEach(track => {
                remotestream.addTrack(track)
            })

        };

        peerConnection.current.onicecandidate = (e) => {
            if (e.candidate) {
                socket.emit("ice-candidate", { candidate: e.candidate, courseId });
            }
        };

        socket.emit("viewer-join", courseId);


        socket.on("offer", async ({ offer }) => {
            if (peerConnection.current.signalingState !== "stable") {
                console.log("skipping duplicate offer dur to wrong state");
                return;
            }
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


        socket.on("end-call", () => {

            if (peerConnection.current) {
                peerConnection.current.close()
                peerConnection.current = null;
            }
            if (remotestream) {
                remotestream.getTracks().forEach((track) => track.stop());

            }
            alert("instructor ended live class")
            navigate(`/course/${courseId}`)

            socket.disconnect()
        })

        return () => {
            socket.off("end-call")
            socket.off("offer")
            socket.off("ice-candidate")
            if (peerConnection.current) {
                peerConnection.current.close()
                peerConnection.current = null;
            }
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