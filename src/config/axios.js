// frontend/src/config/axios.js
import axios from 'axios';

// URL base de tu backend
const API_URL = import.meta.env.VITE_API_URL;

// Crear instancia de axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Interceptor para agregar el token automáticamente a todas las peticiones
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;

    // Si el token expiró o es inválido (401)
    if (response?.status === 401) {
      // Limpiar el localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');

      // Redirigir al login (solo si no estamos ya en login/register)
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
