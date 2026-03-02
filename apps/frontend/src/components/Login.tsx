import { useState } from 'react';
import api from '../api/api';
import { useStore } from '../store/useStore';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const setUser = useStore((s) => s.setUser);

  const submit = async () => {
    try {
      const path = isLogin ? 'login' : 'register';
      const res = await api.post(`/auth/${path}`, { email, password });
      if (isLogin) {
        localStorage.setItem('token', res.data.access_token);
        setUser({ id: '', email });
      }
    } catch (e: any) {
      setError(e.response?.data?.message || 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl mb-4">{isLogin ? 'Увійти' : 'Реєстрація'}</h2>
      <div className="space-y-2">
        <input
          className="border p-2 w-full"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="border p-2 w-full"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2" onClick={submit}>
          {isLogin ? 'Увійти' : 'Зареєструватися'}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <button className="mt-4 text-sm" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Перейти до реєстрації' : 'Перейти до входу'}
      </button>
    </div>
  );
}
