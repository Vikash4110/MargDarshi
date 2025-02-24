// src/components/VideoCall.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import AgoraRTC from "agora-rtc-sdk-ng";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaTimes } from "react-icons/fa";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";

const VideoCall = ({ channelName, onClose }) => {
  console.log("VideoCall component rendered with channelName:", channelName);
  const { authorizationToken } = useAuth();
  const [token, setToken] = useState(null);
  const [joined, setJoined] = useState(false);
  const [localAudio, setLocalAudio] = useState(true);
  const [localVideo, setLocalVideo] = useState(true);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const client = useRef(AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })).current;
  const localTracks = useRef({ audioTrack: null, videoTrack: null });

  useEffect(() => {
    let isMounted = true;

    const fetchTokenAndJoin = async () => {
      try {
        // Check permissions first
        console.log("Checking media permissions...");
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        console.log("Permissions granted");

        console.log("Fetching token for channel:", channelName);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/video-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authorizationToken,
          },
          body: JSON.stringify({ channelName }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch video token");
        }
        const data = await response.json();
        console.log("Token fetched:", data.token);
        setToken(data.token);
        if (isMounted) await joinCall(data.token);
      } catch (err) {
        console.error("Fetch token or permissions error:", err);
        toast.error(err.message || "Failed to start video call - please allow camera/microphone access");
        onClose();
      }
    };

    fetchTokenAndJoin();

    return () => {
      isMounted = false;
      leaveCall();
    };
  }, [channelName, authorizationToken]);

  const joinCall = async (token) => {
    console.log("Joining call with token:", token, "channelName:", channelName);
    try {
      console.log("Attempting to join channel with App ID:", import.meta.env.VITE_AGORA_APP_ID);
      await client.join(import.meta.env.VITE_AGORA_APP_ID, channelName, token, null);
      console.log("Joined channel successfully");

      localTracks.current.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      console.log("Audio track created");
      localTracks.current.videoTrack = await AgoraRTC.createCameraVideoTrack();
      console.log("Video track created");

      await client.publish([localTracks.current.audioTrack, localTracks.current.videoTrack]);
      console.log("Tracks published");

      if (localVideoRef.current) {
        localTracks.current.videoTrack.play(localVideoRef.current);
        console.log("Local video playing");
      } else {
        console.error("Local video container not ready");
        throw new Error("Local video container not found");
      }

      setJoined(true);

      client.on("user-published", async (user, mediaType) => {
        console.log("User published:", user.uid, "mediaType:", mediaType);
        await client.subscribe(user, mediaType);
        if (mediaType === "video") {
          if (remoteVideoRef.current) {
            user.videoTrack.play(remoteVideoRef.current);
            setRemoteUsers((prev) => [...prev.filter((u) => u.uid !== user.uid), user]);
            console.log("Remote video playing for user:", user.uid);
          } else {
            console.error("Remote video container not ready");
          }
        }
        if (mediaType === "audio") {
          user.audioTrack.play();
          console.log("Remote audio playing for user:", user.uid);
        }
      });

      client.on("user-unpublished", (user) => {
        console.log("User unpublished:", user.uid);
        if (user.videoTrack) user.videoTrack.stop();
        setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
      });

      client.on("user-left", (user) => {
        console.log("User left:", user.uid);
        setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
      });
    } catch (err) {
      console.error("Join call error:", err);
      toast.error("Failed to join video call: " + err.message);
      leaveCall();
    }
  };

  const leaveCall = async () => {
    if (joined) {
      if (localTracks.current.audioTrack) localTracks.current.audioTrack.close();
      if (localTracks.current.videoTrack) localTracks.current.videoTrack.close();
      await client.leave();
      setJoined(false);
      setRemoteUsers([]);
      console.log("Left video call");
    }
    onClose();
  };

  const toggleAudio = async () => {
    if (localTracks.current.audioTrack) {
      localTracks.current.audioTrack.setEnabled(!localAudio);
      setLocalAudio(!localAudio);
      console.log("Audio toggled to:", !localAudio);
    }
  };

  const toggleVideo = async () => {
    if (localTracks.current.videoTrack) {
      localTracks.current.videoTrack.setEnabled(!localVideo);
      setLocalVideo(!localVideo);
      console.log("Video toggled to:", !localVideo);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-[1000]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-white w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl p-6 flex flex-col relative"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex-1 flex space-x-4">
          <div className="w-1/2 h-full bg-gray-900 rounded-lg overflow-hidden relative">
            <div ref={localVideoRef} className="w-full h-full" />
            {!localVideo && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white">
                Video Off
              </div>
            )}
          </div>
          <div className="w-1/2 h-full bg-gray-900 rounded-lg overflow-hidden relative">
            <div ref={remoteVideoRef} className="w-full h-full" />
            {remoteUsers.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white">
                Waiting for participant...
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 flex justify-center space-x-6">
          <motion.button
            onClick={toggleAudio}
            className={`p-3 rounded-full ${localAudio ? "bg-green-500" : "bg-red-500"} text-white`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {localAudio ? <FaMicrophone /> : <FaMicrophoneSlash />}
          </motion.button>
          <motion.button
            onClick={toggleVideo}
            className={`p-3 rounded-full ${localVideo ? "bg-green-500" : "bg-red-500"} text-white`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {localVideo ? <FaVideo /> : <FaVideoSlash />}
          </motion.button>
          <motion.button
            onClick={leaveCall}
            className="p-3 rounded-full bg-red-600 text-white"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaTimes />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VideoCall;