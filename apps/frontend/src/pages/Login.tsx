import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import api from "../api/api";
import { AuthForm } from "../components/AuthForm";
import { toast } from "react-hot-toast";

export function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (data: any) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", data);

      // 1. Save the token (so subsequent requests to the API will work)
      const token = res.data.access_token;
      localStorage.setItem("token", token);

      // 2. Update user in Zustand using fresh backend profile data
      const setUser = useStore.getState().setUser;

      let userData = res.data.user;
      if (!userData?.id) {
        const me = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        userData = me.data;
      }

      setUser(userData);

      // 3. Redirect to the events page
      navigate("/events");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-0 md:p-6 min-h-[calc(100vh-70px)]">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-6 md:p-10 shadow-2xl shadow-indigo-100 border border-slate-100">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
          Welcome Back! 👋
        </h1>
        <p className="text-slate-500 mb-10 font-medium">
          Good to see you again. Log in to your account.
        </p>

        <AuthForm type="login" onSubmit={handleLogin} isLoading={loading} />
      </div>
    </div>
  );
}
