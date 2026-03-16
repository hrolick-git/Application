import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { AIAssistant } from './components/AIAssistant';
import { Login } from "./pages/Login";
import { MyEvents } from "./pages/MyEvents";
import { EventsList } from "./pages/EventsList";
import { EventDetails } from "./pages/EventDetails";
import { CreateEvent } from "./pages/CreateEvent";
import { AppInit } from "./auth/AppInit";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { useEffect, useState } from 'react';
import { useStore } from './store/useStore';
import api from './api/api';
import "./styles/index.css";
import { EditEvent } from "./pages/EditEvent";
import { Register } from "./pages/Register";
import { Settings } from "./pages/Settings";
import { Profile } from "./pages/Profile";

export function App() {
  const setUser = useStore((s) => s.setUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api
        .get('/users/me', { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div>Завантаження...</div>;

  return (
    <AppInit>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Navbar />
        <div className="mx-auto max-w-7xl">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/my-events"
              element={
                <ProtectedRoute>
                  <MyEvents />
                </ProtectedRoute>
              }
            />
            <Route path="/events" element={<EventsList />} />
            <Route
              path="/events/new"
              element={
                <ProtectedRoute>
                  <CreateEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/:id"
              element={
                <ProtectedRoute>
                  <EventDetails />
                </ProtectedRoute>
              }
            />
            <Route path="/events/:id/edit" element={
                <ProtectedRoute>
                  <EditEvent />
                </ProtectedRoute>
            } />
            <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
            } />
            <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
            } />
            <Route path="*" element={<EventsList />} />
          </Routes>
        </div>
      <AIAssistant />
      </BrowserRouter>
    </AppInit>
  );
}