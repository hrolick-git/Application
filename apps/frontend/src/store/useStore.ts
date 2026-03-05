import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface Event {
  id: string;
  title: string;
  startsAt: string;
  organizerId: string;
  location: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  capacity?: number | null;
  participants: any[];
}

interface State {
  user: User | null;
  events: Event[]; // Додали сюди
  setUser: (user: User | null) => void;
  setEvents: (events: Event[]) => void; // Додали метод для оновлення
  logout: () => void;
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      user: null,
      events: [], // Ініціалізуємо порожнім масивом
      setUser: (user) => set({ user }),
      setEvents: (events) => set({ events }), // Реалізація методу
      logout: () => {
        set({ user: null, events: [] }); // При логауті чистимо все
        localStorage.removeItem('token');
      },
    }),
    { name: 'user-storage' }
  )
);