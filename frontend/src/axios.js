import axios from 'axios';
import Cookies from 'js-cookie';


const API_URL = 'http://127.0.0.1:5174';
const api = axios.create({
    baseURL: API_URL,
  });  

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      alert('You do not have permission to access this resource.');
      window.location.href = '/dashboard';
    } else if (error.response?.status === 401) {
      alert('Session expired. Please log in again.');
      Cookies.remove('auth_token');
      Cookies.remove('user_role');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;