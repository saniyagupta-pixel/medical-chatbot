import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import MainChat from "../components/mainchat";

const ChatPage = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await api.get(`/api/chat/${user._id}/${chatId}`);

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