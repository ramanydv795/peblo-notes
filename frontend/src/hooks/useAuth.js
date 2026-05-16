import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export const useAuth = () => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("peblo_user");
    return saved ? JSON.parse(saved) : null;
  });
  const navigate = useNavigate();

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("peblo_token", data.token);
    localStorage.setItem("peblo_user", JSON.stringify(data.user));
    setUser(data.user);
    navigate("/dashboard");
  };

  const signup = async (name, email, password) => {
    const { data } = await api.post("/auth/signup", { name, email, password });
    localStorage.setItem("peblo_token", data.token);
    localStorage.setItem("peblo_user", JSON.stringify(data.user));
    setUser(data.user);
    navigate("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("peblo_token");
    localStorage.removeItem("peblo_user");
    setUser(null);
    navigate("/login");
  };

  return { user, login, signup, logout };
};