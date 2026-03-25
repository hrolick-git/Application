import axios from 'axios';

const createAPIClient = () => {
  const env = import.meta.env.VITE_API_URL;
  if (env) {
    return axios.create({ baseURL: env });
  }
  
  if (typeof window === 'undefined') {
    console.log('✅ Server-side, using localhost:4000');
    return axios.create({ baseURL: 'http://localhost:4000' });
  }
  
  const { hostname } = window.location;
  console.log('🔍 Current hostname:', hostname);
  
  // if localhost not exist - use localhost:4000
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    console.log('✅ Localhost detected, using http://localhost:4000');
    return axios.create({ baseURL: 'http://localhost:4000' });
  }
  
  // For GitHub Codespaces: port frontend -> port backend
  // We use the same protocol as in the page (https in Codespaces),
  // and replace port 5173 with 4000 in the hostname.
  const backendHostname = hostname.replace(/-5173\./, '-4000.');
  const protocol = window.location.protocol; // 'https:' in Codespaces
  const baseURL = `${protocol}//${backendHostname}`;
  console.log('✅ Codespaces detected, using:', baseURL);
  return axios.create({ baseURL });
};

const api = createAPIClient();

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && token !== 'undefined') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
