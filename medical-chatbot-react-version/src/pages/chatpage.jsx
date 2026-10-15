import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import MainChat from "../components/mainchat";

const ChatPage = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  useEffect(() => {
    const fetchMessages = async () => {
      if (!userId) return;

      const { data } = await api.get(`/api/chat/${userId}/${chatId}`);

      setMessages(data.messages || []);
    };

    fetchMessages();
  }, [chatId, userId]);

  return (
    <MainChat
      chatId={chatId}
      messages={messages}
      setMessages={setMessages}
    />
  );
};

export default ChatPage;