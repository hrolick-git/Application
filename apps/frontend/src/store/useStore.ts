import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/api';

interface User {
  id: string;
  email: string;
  name?: string;
  vibecoins?: number;
}

interface Tag {
  id: string;
  name: string;
}

interface Event {
  id: string;
  title: string;
  startsAt: string;
  organizerId: string;
  location: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  colorTheme?: string;
  capacity?: number | null;
  participants: any[];
  joined?: boolean;
  full?: boolean;
  tags?: Tag[];
}

interface State {
  user: User | null;
  events: Event[];
  tags: Tag[];
  selectedTags: string[];
  setUser: (user: User | null) => void;
  setEvents: (events: Event[]) => void;
  setSelectedTags: (tagIds: string[]) => void;
  logout: () => void;
  fetchEvents: () => Promise<void>;
  fetchTags: () => Promise<void>;
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      user: null,
      events: [],
      tags: [],
      selectedTags: [],
      setUser: (user) => set({ user }),
      setEvents: (events) => set({ events }),
      setSelectedTags: (tagIds) => {
        set({ selectedTags: tagIds });
        get().fetchEvents();
      },
      logout: () => {
        set({ user: null, events: [], selectedTags: [] });
        localStorage.removeItem('token');
      },
      fetchEvents: async () => {
        const currentUser = get().user;
        const selectedTags = get().selectedTags;

        const params = new URLSearchParams();
        if (currentUser?.id) params.set('userId', currentUser.id);
        if (selectedTags.length > 0) params.set('tagIds', selectedTags.join(','));

        try {
          const res = await api.get(`/events?${params.toString()}`);
          set({ events: res.data });
        } catch (error) {
          console.error("Error fetching events:", error);
        }
      },
      fetchTags: async () => {
        try {
          const res = await api.get('/events/tags');
          const sorted = [...res.data].sort((a: { name: string }, b: { name: string }) => {
            if (a.name === 'Other') return 1;
            if (b.name === 'Other') return -1;
            return 0;
          });
          set({ tags: sorted });
        } catch (error) {
          console.error("Error fetching tags:", error);
        }
      },
    }),
    { 
      name: 'user-storage',
      partialize: (state) => ({ user: state.user })
    }
  )
);