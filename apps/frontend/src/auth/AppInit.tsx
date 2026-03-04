// src/auth/AppInit.tsx
import { useEffect, useState, ReactNode } from "react";
import api from "../api/api";
import { useStore } from "../store/useStore";
import { Loader } from "../components/Loader";

export function AppInit({ children }: { children: ReactNode }) {
  const setUser = useStore((s) => s.setUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token"); // перевіряємо токен
    if (!token) {
      setLoading(false);
      return;
    }

    api.get("/users/me") // підтягуємо користувача з бекенду
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />; // поки завантажується, спінер

  return <>{children}</>;
}