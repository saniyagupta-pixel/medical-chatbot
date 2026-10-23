import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.DEV
      ? ""
      : "https://medical-chatbot-iqkkisieo-sg-web-elite.vercel.app"),
  withCredentials: true,
});

export default api;
