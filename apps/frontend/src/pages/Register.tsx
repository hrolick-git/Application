import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import api from '../api/api';
import { AuthForm } from '../components/AuthForm';

export function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const handleRegister = async (data: any) => {
  setLoading(true);
  try {
    await api.post('/auth/register', data);
    const loginRes = await api.post('/auth/login', {
      email: data.email,
      password: data.password
    });

    // 1. Зберігаємо токен для майбутніх запитів
    const token = loginRes.data.access_token;
    localStorage.setItem('token', token);
    console.log('Login Response Data:', loginRes.data);
    // 2. ОНОВЛЮЄМО СТАН В REACТ (Zustand)
    // Витягуємо функцію setUser зі стору
    const setUser = useStore.getState().setUser;
    
    // Перевіряємо, чи є юзер у відповіді. 
    // Якщо бекенд не шле об'єкт user, можна створити його вручну з email
    const userData = loginRes.data.user || { email: data.email, id: 'temp-id' };
    setUser(userData); 

    // 3. Тепер переходимо
    navigate('/events');
  } catch (err: any) {
    alert(err.response?.data?.message || 'Registration failed');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-indigo-100 border border-slate-100">
        <h1 className="text-4xl font-black text-slate-900 mb-2">Join us! 🚀</h1>
        <p className="text-slate-500 mb-10 font-medium">Create your account to start exploring events.</p>
        
        <AuthForm type="register" onSubmit={handleRegister} isLoading={loading} />
      </div>
    </div>
  );
}