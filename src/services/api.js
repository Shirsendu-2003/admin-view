// 📁 services/api.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://student-backend-h505.onrender.com/api", // Adjust path as needed
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Automatically attach token if exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
