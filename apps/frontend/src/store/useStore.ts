import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface State {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useStore = create<State>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  setUser: (user) => {
    set({ user });
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  },
  logout: () => {
    set({ user: null });
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },
}));