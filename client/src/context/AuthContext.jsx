import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      console.log("Fetching user...");
      const response = await api.get("/auth/me");
      console.log("User fetched:", response.data);
      setUser(response.data.user);
    } catch (error) {
      console.error("Fetch user error:", error);
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, rememberMe = false) => {
    try {
      console.log("Attempting login with:", { email, rememberMe });

      const response = await api.post("/auth/login", {
        email,
        password,
        rememberMe,
      });
      console.log("Login response:", response.data);

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error("Invalid response from server");
      }

      localStorage.setItem("token", token);

      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        console.log("✅ Remember me enabled - token will last 30 days");
      } else {
        localStorage.removeItem("rememberMe");
        console.log("✅ Remember me disabled - token will last 7 days");
      }

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);

      return { success: true, user };
    } catch (error) {
      console.error("Login error:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("rememberMe");
      delete api.defaults.headers.common["Authorization"];
      setUser(null);

      return {
        success: false,
        message:
          error.response?.data?.message || error.message || "Login failed",
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      console.log("Attempting registration with:", { name, email });

      if (!name?.trim() || !email?.trim() || !password?.trim()) {
        return {
          success: false,
          message: "All fields are required",
        };
      }

      if (password.length < 6) {
        return {
          success: false,
          message: "Password must be at least 6 characters long",
        };
      }

      const response = await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      console.log("Registration response:", response.data);

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error("Invalid response from server");
      }

      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);

      return { success: true, user };
    } catch (error) {
      console.error("Registration error:", error);

      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      setUser(null);

      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Registration failed",
      };
    }
  };

  const logout = () => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    localStorage.removeItem("rememberMe");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
