
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const InstructorLiveStream = () => {
    const location = useLocation()
    const {courseId} = location.state || {};
  const videoRef = useRef(null);
  const peerConnection = useRef(null);

  useEffect(() => {
    const startStream = async () => {

         peerConnection.current =  new RTCPeerConnection({
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" }
            ]
        })

          socket.emit("instructor-join", courseId);


      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoRef.current.srcObject = stream;

      stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));

      peerConnection.current.onicecandidate = e => {
        if (e.candidate) {
          socket.emit("ice-candidate", { candidate: e.candidate, courseId });
        }
      };

      socket.on("viewer-join", async () => {
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        socket.emit("offer", { offer, courseId });
      });

       socket.on("answer", async ({ answer }) => {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
      });

       socket.on("ice-candidate", async ({ candidate }) => {
            try {
                await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) {
                console.error("Failed to add ICE candidate", err);
            }
        });
    };

    startStream();

    return () => {
      
      peerConnection.current?.close();
    };
  }, [courseId]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Instructor Live Stream</h2>
      <video ref={videoRef} autoPlay playsInline muted className="rounded shadow-lg w-full max-w-3xl mx-auto" />
   </div>
  );
};

export default InstructorLiveStream;
