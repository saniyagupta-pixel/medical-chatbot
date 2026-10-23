import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import MainChat from "../components/mainchat";

const ChatPage = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await axios.get(
        `https://medical-chatbot-1-4l2b.onrender.com/api/chat/${user._id}/${chatId}`,
        {
          withCredentials: true,
        }
      );

      setMessages(res.data.messages);
    };

    fetchMessages();
  }, [chatId]);

  return (
    <MainChat
      chatId={chatId}
      messages={messages}
      setMessages={setMessages}
    />
  );
};

export default ChatPage;