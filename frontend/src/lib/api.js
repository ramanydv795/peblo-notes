import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://peblo-notes-sooty.vercel.app",
});

// Attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("peblo_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("peblo_token");
      localStorage.removeItem("peblo_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;