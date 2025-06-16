import axios from "axios";

// ✅ Fixed API Configuration
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const apiURL = baseURL.endsWith("/api") ? baseURL : `${baseURL}/api`;

console.log("🔧 API Configuration:", {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  baseURL: baseURL,
  finalApiURL: apiURL,
});

export const api = axios.create({
  baseURL: apiURL,
  timeout: 15000, // Increased timeout for Render cold starts
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for CORS
});

// ✅ Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("📤 API Request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: config.headers,
    });

    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor
api.interceptors.response.use(
  (response) => {
    console.log("📥 API Response:", {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("❌ API Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      origin: window.location.origin,
      error: error.response?.data || error.message,
    });

    // Handle specific error cases
    if (error.code === "ERR_NETWORK") {
      console.error("🔥 Network Error - Check if backend is running:", apiURL);
    }

    if (error.response?.status === 401) {
      console.log("🔓 Unauthorized - Clearing token and redirecting to login");
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];

      if (
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/register")
      ) {
        window.location.href = "/login";
      }
    }

    if (error.response?.status === 403) {
      console.error("🚫 CORS Error - Origin not allowed");
    }

    return Promise.reject(error);
  }
);

export default api;
