import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useStore } from '../store/useStore';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const setUser = useStore((s) => s.setUser);
  const navigate = useNavigate();

  const submit = async () => {
    try {
      const path = isLogin ? 'login' : 'register';
      const res = await api.post(`/auth/${path}`, { email, password });
      const token = res.data.access_token;

      if (!token) throw new Error('Не вдалося отримати токен');

      // Зберігаємо токен + email
      localStorage.setItem('token', token);
      localStorage.setItem('email', email);

      // Підтягуємо користувача з бекенду
      const me = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(me.data);

      navigate('/my-events');
    } catch (e: any) {
      setError(e.response?.data?.message || e.message || 'Помилка входу');
    }
  };

  return (
    <div className="mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0">
      <h2 className="text-xl mb-4">{isLogin ? 'Увійти' : 'Реєстрація'}</h2>
      <p>test@x.com</p>
      <p>abc123</p>
      <div className="space-y-2">
        <input
          type="email"
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