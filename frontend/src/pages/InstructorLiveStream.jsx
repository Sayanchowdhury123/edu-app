
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const InstructorLiveStream = () => {
  const location = useLocation()
  const { courseId } = location.state || {};
  const videoRef = useRef(null);
  const peerConnection = useRef(null);
  const localstream = useRef(null)
  const navigate = useNavigate()
  let offercreated = false;

const peerConnections = useRef({})

  useEffect(() => {
    const startStream = async () => {

      peerConnection.current = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" }
        ]
      });

      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localstream.current = stream;
      videoRef.current.srcObject = stream;

      socket.emit("instructor-join", courseId);


      stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));

      peerConnection.current.onicecandidate = e => {
        if (e.candidate) {
          socket.emit("ice-candidate", { candidate: e.candidate, courseId });
        }
      };

      socket.on("viewer-join", async ({viewid}) => {
        if (offercreated || !peerConnection.current) return;
        offercreated = true;
    
        const pc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" }
        ]
      });

      peerConnection.current[viewid] = pc;

       localstream.current.getTracks().forEach(track => pc.addTrack(track, localstream.current));

       pc.onicecandidate = (e) => {
        if(e.candidate){
          socket.emit("ice-candidate", {candidate: e.candidate, to: viewid})
        }
       }

        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        socket.emit("offer", { offer, to: viewid });
      });

      socket.once("answer", async ({ answer }) => {

        const pc = peerConnection.current;

        if (pc.signalingState === "have-local-offer") {
          try {
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));

          } catch (error) {
            console.log("failed to set remote description (answer)", error);
          }
        } else {
          console.log("skipped setting remote description already in stable state");
        }

      });
    };

    startStream();

    return () => {
      socket.off("answer")
      socket.off("viewer-join")
      socket.off("ice-candidate")
      if (peerConnection.current) {
        peerConnection.current.close()
      }

      if (localstream.current) {
        localstream.current.getTracks().forEach((track) => {
          track.stop()
          localstream.current = null;
        })
      }

    };
  }, [courseId]);





  const handleendcall = () => {
    if (peerConnection.current) {
      peerConnection.current.close()
      peerConnection.current = null;


    }
    if (localstream.current) {
      console.log("cleaning up localstream");
      localstream.current.getTracks().forEach((track) => {
        track.stop()
        localstream.current = null;
      });

    }


    socket.emit("end-call", { courseId })

    alert("Live Class Ended")
    navigate(`/course/${courseId}`)

    socket.disconnect();
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Instructor Live Stream</h2>
      <video ref={videoRef} autoPlay playsInline muted className="rounded shadow-lg w-full h-[80vh] mx-auto" />
      <button className="btn btn-error " onClick={handleendcall}>End Call</button>

    </div>
  );
};

export default InstructorLiveStream;
