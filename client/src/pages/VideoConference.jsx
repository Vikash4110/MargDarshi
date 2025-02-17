import { useEffect, useRef } from "react";
import ZegoExpressEngine from "zego-express-engine-webrtc";

const VideoConference = ({ roomID, userID, userName }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    const initZegoCloud = async () => {
      const appID = 93384374; // Replace with your ZEGOCLOUD App ID
      const serverSecret = "b517310bb5142adffe072f9076c67e56"; // Replace with your ZEGOCLOUD Server Secret

      const zg = new ZegoExpressEngine(appID, serverSecret);

      try {
        await zg.loginRoom(roomID, userID, { userName });
        console.log("Joined room successfully");

        // Start publishing local video stream
        const localStream = await zg.createStream();
        zg.startPublishingStream(roomID, localStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }

        // Handle remote streams
        zg.on("streamAdded", async (streamList) => {
          streamList.forEach(async (stream) => {
            const remoteStream = await zg.startPlayingStream(stream.streamID);
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
          });
        });

        zg.on("streamRemoved", (streamList) => {
          streamList.forEach((stream) => {
            zg.stopPlayingStream(stream.streamID);
          });
        });
      } catch (err) {
        console.error("Failed to join room:", err);
      }
    };

    initZegoCloud();

    // Cleanup on unmount
    return () => {
      const zg = new ZegoExpressEngine(appID, serverSecret);
      zg.logoutRoom(roomID);
      zg.destroyEngine();
    };
  }, [roomID, userID, userName]);

  return (
    <div>
      <h2>Video Conference</h2>
      <div>
        <video ref={localVideoRef} autoPlay playsInline muted />
        <video ref={remoteVideoRef} autoPlay playsInline />
      </div>
    </div>
  );
};

export default VideoConference;
