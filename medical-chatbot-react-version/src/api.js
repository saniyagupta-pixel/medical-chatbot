import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://medical-chatbot-1-4l2b.onrender.com",
  withCredentials: true,
});

export default api;
