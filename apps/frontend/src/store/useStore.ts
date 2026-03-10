import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/api';

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
  joined?: boolean;
  full?: boolean;
}

interface State {
  user: User | null;
  events: Event[];
  setUser: (user: User | null) => void;
  setEvents: (events: Event[]) => void;
  logout: () => void;
  fetchEvents: () => Promise<void>; // Додали функцію завантаження
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      user: null,
      events: [],
      setUser: (user) => set({ user }),
      setEvents: (events) => set({ events }),
      logout: () => {
        set({ user: null, events: [] });
        localStorage.removeItem('token');
      },
      // Ця функція тепер сама знає, якого юзера питати
      fetchEvents: async () => {
        const currentUser = get().user;
        
        // 1. Використовуємо наш готовий api клієнт (він сам додасть базу: localhost або railway)
        // 2. Додаємо userId тільки якщо він є
        const url = currentUser?.id 
          ? `/events?userId=${currentUser.id}` 
          : '/events';

        try {
          const res = await api.get(url); // Використовуй 'api' замість 'axios'
          set({ events: res.data });
        } catch (error) {
          console.error("Помилка завантаження івентів:", error);
        }
      },
    }),
    { name: 'user-storage' }
  )
);