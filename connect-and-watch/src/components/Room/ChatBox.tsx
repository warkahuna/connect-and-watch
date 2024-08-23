import React, { useEffect } from "react";
import socket from "../../services/socket";
import "../../styles/ChatBoxStyle.css";
import ChatMessage from "../Chat/ChatMessage";
import ChatInput from "../Chat/ChatInput";
import { useDispatch, useSelector } from "react-redux";
import {
  addChatMessageAction,
  loadChatHistoryAction,
} from "../../store/slices/chatSlice";
import { RootState } from "../../store/store";
import { useParams } from "react-router-dom";

type MessageType = {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  roomId: string;
};

const ChatBox: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const dispatch = useDispatch();
  const messages = useSelector((state: RootState) => state.chat.messages);
  const username = useSelector((state: RootState) => state.auth.user?.username);

  useEffect(() => {
    const handleLoadChatHistory = (chatHistory: MessageType[]) => {
      console.log(chatHistory);

      dispatch(loadChatHistoryAction(chatHistory));
    };

    const handleReceiveMessage = (message: MessageType) => {
      console.log("Received message:", message);
      dispatch(addChatMessageAction(message));
    };

    socket.on("loadChatHistory", handleLoadChatHistory);
    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("loadChatHistory", handleLoadChatHistory);
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [roomId, dispatch]);

  const handleSendMessage = (message: string) => {
    const newMessage: MessageType = {
      id: Date.now().toString(),
      username: username, // Replace with actual username
      message,
      roomId: roomId || "",
      timestamp: new Date().toISOString(),
    };
    socket.emit("sendMessage", newMessage);
  };

  return (
    <div>
      <div className="chat-messages">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            username={msg.username}
            message={msg.message}
          />
        ))}
      </div>
      <ChatInput onSend={handleSendMessage} />
    </div>
  );
};

export default ChatBox;
