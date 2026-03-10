import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import api from "../api/api";

export function useAuth() {
  const setUser = useStore((s) => s.setUser);
  const logoutStore = useStore((s) => s.logout);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.access_token);
    setUser(res.data.user);
    navigate("/my-events");
  };

  const register = async (email: string, password: string) => {
    await api.post("/auth/register", { email, password });
    await login(email, password); // after registration, login
  };

  const logout = () => {
    logoutStore();
    navigate("/auth");
  };

  return { login, register, logout };
}