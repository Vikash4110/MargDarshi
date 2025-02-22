import React, { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL);

const Chat = ({ receiverId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    socket.emit("joinRoom", { userId: user?._id });

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [user]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    const messageData = {
      senderId: user._id,
      senderModel: user.role, // Mentor or Mentee
      receiverId,
      receiverModel: user.role === "Mentor" ? "Mentee" : "Mentor",
      message: newMessage,
    };

    socket.emit("sendMessage", messageData);
    setMessages([...messages, messageData]);
    setNewMessage("");

    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/messages/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messageData),
    });
  };

  return (
    <div className="w-full max-w-lg p-4 border rounded-lg shadow-md">
      <div className="h-80 overflow-y-auto border-b">
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 my-1 rounded ${msg.senderId === user._id ? "bg-blue-300" : "bg-gray-200"}`}>
            <strong>{msg.senderId === user._id ? "You" : "Them"}:</strong> {msg.message}
          </div>
        ))}
      </div>

      <div className="flex mt-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="ml-2 p-2 bg-blue-500 text-white rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
