import { useRef, useState } from "react";
import axios from "axios";

const MainChat = ({ chatId, messages, setMessages }) => {
  const userElement = useRef();
  const [sendError, setSendError] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleSendButton = async () => {
    const text = userElement.current.value.trim();

    if (!text) return;

    setSendError("");

    // Add user message instantly
    const updatedMessages = [
      ...messages,
      { role: "user", content: text }
    ];

    setMessages(updatedMessages);
    userElement.current.value = "";

    try {
      const res = await axios.post(
        `https://medical-backend-61g4.onrender.com/api/chat/${user._id}/${chatId}`,
        {
          message: text,
        },
        {
          withCredentials: true,
        }
      );

      // Add bot reply
      setMessages([
        ...updatedMessages,
        {
          role: "bot",
          content: res.data.reply,
        },
      ]);
    } catch {
      setSendError(
        "Unable to get a reply. Check that the chatbot service is deployed and its URL is configured on the backend."
      );
    }
  };

  return (
    <div
      className="d-flex flex-column"
      style={{
        height: "calc(100vh - 80px)",
        width: "100%",
        backgroundColor: "#f8f9fa",
      }}
    >
      {/* Messages Section */}
      <div
        className="flex-grow-1 overflow-auto px-3 py-4"
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`d-flex mb-4 ${
              msg.role === "user"
                ? "justify-content-end"
                : "justify-content-start"
            }`}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "14px 18px",
                borderRadius: "16px",
                backgroundColor:
                  msg.role === "user" ? "#0d6efd" : "#ffffff",
                color: msg.role === "user" ? "white" : "black",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                lineHeight: "1.6",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div
        className="bg-white border-top p-3"
        style={{
          position: "sticky",
          bottom: 0,
          width: "100%",
        }}
      >
        {sendError && (
          <div className="alert alert-danger mx-auto mb-2" role="alert" style={{ maxWidth: "900px" }}>
            {sendError}
          </div>
        )}
        <div
          className="input-group"
          style={{
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          <input
            ref={userElement}
            type="text"
            className="form-control p-3"
            placeholder="Ask your medical question..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendButton();
              }
            }}
          />

          <button
            className="btn btn-primary px-4"
            onClick={handleSendButton}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainChat;