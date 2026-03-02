import axios from 'axios';

const createAPIClient = () => {
  const env = import.meta.env.VITE_API_URL;
  if (env) {
    console.log('✅ Using VITE_API_URL:', env);
    return axios.create({ baseURL: env });
  }
  
  if (typeof window === 'undefined') {
    console.log('✅ Server-side, using localhost:4000');
    return axios.create({ baseURL: 'http://localhost:4000' });
  }
  
  const { hostname } = window.location;
  console.log('🔍 Current hostname:', hostname);
  
  // Якщо localhost - використовуємо localhost:4000
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    console.log('✅ Localhost detected, using http://localhost:4000');
    return axios.create({ baseURL: 'http://localhost:4000' });
  }
  
  // Для GitHub Codespaces: порт фронтенду -> порт бекенду
  // Використовуємо той же протокол, що й у сторінці (https у Codespaces),
  // і замінюємо порт 5173 на 4000 у hostname.
  const backendHostname = hostname.replace(/-5173\./, '-4000.');
  const protocol = window.location.protocol; // 'https:' у Codespaces
  const baseURL = `${protocol}//${backendHostname}`;
  console.log('✅ Codespaces detected, using:', baseURL);
  return axios.create({ baseURL });
};

const api = createAPIClient();

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
