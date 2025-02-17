import { useEffect, useRef } from "react";
import ZegoExpressEngine from "zego-express-engine-webrtc";

const VideoCall = () => {
  const videoRef = useRef(null);
  const urlParams = new URLSearchParams(window.location.search);
  const roomID = urlParams.get("roomID");

  useEffect(() => {
    if (!roomID) {
      alert("No room ID found.");
      return;
    }

    const appID = 93384374; // Replace with your ZEGOCLOUD App ID
    const serverSecret = b517310bb5142adffe072f9076c67e56 ; // Replace with your ZEGOCLOUD Server Secret

    const zg = new ZegoExpressEngine(appID, serverSecret);

    // Join the room
    zg.loginRoom(roomID, "user", { userName: "User" })
      .then(() => {
        console.log("Joined room successfully");

        // Start publishing video
        zg.startPublishingStream(roomID, videoRef.current);
      })
      .catch((err) => {
        console.error("Failed to join room:", err);
      });

    // Cleanup on unmount
    return () => {
      zg.logoutRoom(roomID);
      zg.destroyEngine();
    };
  }, [roomID]);

  return (
    <div>
      <h2>Video Conference</h2>
      <video ref={videoRef} autoPlay playsInline muted />
    </div>
  );
};

export default VideoCall;