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
        `http://localhost:3002/api/chat/${user._id}/${chatId}`,
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