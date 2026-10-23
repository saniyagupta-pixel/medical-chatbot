import { IoMdAddCircle } from "react-icons/io";
import { Link, useNavigate,useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";

const SideBar = () => {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();
  const { chatId } = useParams();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
  const fetchChats = async () => {
    if (!user?._id) return;

    const { data } = await api.get(`/api/chats/${user._id}`);

    setChats(data);
  };

  fetchChats();
}, [chatId, user?._id]);

  const createNewChat = async () => {
    const { data } = await api.post(`/api/new-chat/${user._id}`, {});

    setChats((prev) => [data, ...prev]);

    navigate(`/app/chat/${data._id}`);
  };

  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark"
      style={{ width: "280px", height: "100vh" }}
    >
      {/* New Chat Button */}
      <button
        onClick={createNewChat}
        className="btn btn-dark text-white mb-3"
      >
        <IoMdAddCircle /> New Chat
      </button>

      <hr />
      <h3 style={{color:"orange"}}>Recents</h3>
      <ul className="nav nav-pills flex-column mb-auto">
  {chats.filter((chat)=>
    chat._id === chatId || chat.title !== "new chat"
  )
    .map((chat) => (
      <li key={chat._id}>
        <Link
          to={`/app/chat/${chat._id}`}
          className="nav-link text-white"
        >
          {chat.title}
        </Link>
      </li>
    ))}
</ul>
      <hr />

      {/* Profile */}
      <div>
        <strong>{user?.name}</strong>
      </div>
    </div>
  );
};

export default SideBar;