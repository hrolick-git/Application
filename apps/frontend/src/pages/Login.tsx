import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { AuthForm } from '../components/AuthForm';

export function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (data: any) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.password
      });

      // Збереження токена (переконайся, що назва поля в response.data правильна)
      localStorage.setItem('token', response.data.access_token);
      
      // Можна додати сповіщення або просто редирект
      navigate('/events');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-indigo-100 border border-slate-100">
        <h1 className="text-4xl font-black text-slate-900 mb-2">Welcome Back! 👋</h1>
        <p className="text-slate-500 mb-10 font-medium">Good to see you again. Log in to your account.</p>
        
        <AuthForm type="login" onSubmit={handleLogin} isLoading={loading} />
      </div>
    </div>
  );
}