// lib/api.ts
import axios from 'axios';

// Configuración base de Axios
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const axiosInstanceMultipart = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
});

// Función para agregar token
const addAuthToken = (config: any) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Interceptor para requests - agregar token automáticamente
axiosInstance.interceptors.request.use(
  (config) => {
    return addAuthToken(config);
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para axiosInstanceMultipart - agregar token y manejar FormData
axiosInstanceMultipart.interceptors.request.use(
  (config) => {
    // Si es FormData, no establecer Content-Type (el navegador lo hará con el boundary)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return addAuthToken(config);
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Función para manejar refresh token
const handleRefreshToken = async (originalRequest: any, instance: any) => {
  originalRequest._retry = true;

  try {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (refreshToken) {
      const response = await axios.post(`${instance.defaults.baseURL}/auth/refresh/`, {
        refresh: refreshToken
      });

      const { access } = response.data;
      localStorage.setItem('access_token', access);

      // Reintentar la petición original con el nuevo token
      originalRequest.headers.Authorization = `Bearer ${access}`;
      return instance(originalRequest);
    }
  } catch (error) {
    console.log('Error refreshing token:', error);
    // Error al refrescar token, redirigir a login
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
  }
};

// Interceptor para responses - manejar errores y refresh token
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si es error 401 y no hemos intentado refrescar el token
    if (error.response?.status === 401 && !originalRequest._retry) {
      return handleRefreshToken(originalRequest, axiosInstance);
    }

    return Promise.reject(error);
  }
);

// Interceptor para responses de axiosInstanceMultipart
axiosInstanceMultipart.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si es error 401 y no hemos intentado refrescar el token
    if (error.response?.status === 401 && !originalRequest._retry) {
      return handleRefreshToken(originalRequest, axiosInstanceMultipart);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;