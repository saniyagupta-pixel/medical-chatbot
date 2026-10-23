import { useState } from "react";
import api from "../api";

const MainChat = ({ chatId, messages, setMessages }) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleSendButton = async () => {
    const text = message.trim();

    if (!text || isSending) return;
    if (!user?._id) {
      setSendError("Please sign in again before sending a message.");
      return;
    }

    setSendError("");
    setIsSending(true);

    // Add user message instantly
    const updatedMessages = [
      ...messages,
      { role: "user", content: text }
    ];

    setMessages(updatedMessages);
    setMessage("");

    try {
      const { data } = await api.post(`/api/chat/${user._id}/${chatId}`, {
        message: text,
      });

      if (typeof data?.reply !== "string" || !data.reply.trim()) {
        throw new Error("The chatbot returned an empty response.");
      }

      // Add bot reply
      setMessages([
        ...updatedMessages,
        {
          role: "bot",
          content: data.reply,
        },
      ]);
    } catch (error) {
      setSendError(
        error.response?.data?.message ||
          error.message ||
          "Unable to get a reply. Please try again."
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
            type="text"
            className="form-control p-3"
            placeholder="Ask your medical question..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendButton();
              }
            }}
            disabled={isSending}
          />

          <button
            className="btn btn-primary px-4"
            onClick={handleSendButton}
            disabled={isSending || !message.trim()}
          >
            {isSending ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainChat;