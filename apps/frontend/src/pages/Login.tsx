import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import api from '../api/api';
import { AuthForm } from '../components/AuthForm';

export function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (data: any) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', data);

      // 1. Зберігаємо токен (щоб працювали наступні запити до API)
      const token = res.data.access_token;
      localStorage.setItem('token', token);

      // 2. ОНОВЛЮЄМО ZUSTAND (Це те, чого не вистачало!)
      // Витягуємо функцію setUser зі стору
      const setUser = useStore.getState().setUser;
      
      // Беремо юзера з відповіді бекенду. 
      // Якщо бекенд ще не оновлено, використовуємо fallback (тимчасове рішення)
      const userData = res.data.user || { email: data.email, id: 'temp-id' };
      setUser(userData);

      // 3. Тепер редирект
      navigate('/events');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-indigo-100 border border-slate-100">
        <h1 className="text-4xl font-black text-slate-900 mb-2">Welcome Back! 👋</h1>
        <p className="text-slate-500 mb-10 font-medium">Good to see you again. Log in to your account.</p>
        
        <AuthForm type="login" onSubmit={handleLogin} isLoading={loading} />
      </div>
    </div>
  );
}