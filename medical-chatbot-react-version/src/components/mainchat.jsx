import { useRef, useState } from "react";
import axios from "axios";

const MainChat = ({ chatId, messages, setMessages }) => {
  const userElement = useRef();
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleSendButton = async () => {
    const text = userElement.current.value.trim();

    if (!text || isSending) return;

    // Add user message instantly
    const updatedMessages = [
      ...messages,
      { role: "user", content: text }
    ];

    setMessages(updatedMessages);
    userElement.current.value = "";
    setError("");
    setIsSending(true);

    try {
      const res = await axios.post(
        `https://medical-chatbot-1-4l2b.onrender.com/api/chat/${user._id}/${chatId}`,
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
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "The chatbot could not answer right now. Please try again."
      );
    } finally {
      setIsSending(false);
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
        {error && (
          <div
            className="alert alert-danger mb-2"
            role="alert"
            style={{ maxWidth: "900px", margin: "0 auto" }}
          >
            {error}
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
            disabled={isSending}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendButton();
              }
            }}
          />

          <button
            className="btn btn-primary px-4"
            onClick={handleSendButton}
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainChat;