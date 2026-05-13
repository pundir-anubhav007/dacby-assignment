import axios from "axios";

// 1. Create a base instance so we don't type http://localhost:8080 every time
const api = axios.create({
  baseURL: "http://localhost:8080/api/v1", // Adjust if your backend port is different
});

// 2. The Interceptor (Frontend Middleware)
api.interceptors.request.use(
  (config) => {
    // Look inside the browser's local storage for the token
    const token = localStorage.getItem("accessToken");

    // If it exists, attach it to the headers just like Postman does
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
