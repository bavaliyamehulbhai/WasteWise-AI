import axios from "axios";

const rawUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").trim();
const normalizedBaseURL = rawUrl.replace(/\/+$/, "").endsWith("/api")
  ? rawUrl.replace(/\/+$/, "")
  : `${rawUrl.replace(/\/+$/, "")}/api`;

const api = axios.create({
  baseURL: normalizedBaseURL,
  timeout: 45000,
});

// Automatically attach JWT
api.interceptors.request.use(
  (config) => {
    const token =
      sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle authentication errors
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || "";
      const isAuthEndpoint = url.includes("/auth/login") || url.includes("/auth/register");

      if (!isAuthEndpoint) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;