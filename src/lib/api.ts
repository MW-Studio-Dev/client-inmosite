// lib/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Extender el tipo de Axios para incluir _retry
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

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

// Variable para controlar si hay un refresh en progreso
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Función para notificar a todos los suscriptores cuando el token se refresque
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Función para agregar suscriptores que esperan el refresh
const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Función para verificar si el token está expirado
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convertir a milisegundos
    const now = Date.now();

    // Considerar expirado si faltan menos de 30 segundos
    return exp - now < 30000;
  } catch (error) {
    console.error('Error al decodificar token:', error);
    return true; // Si hay error al decodificar, considerarlo expirado
  }
};

// Función para verificar si el refresh token está expirado
const isRefreshTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convertir a milisegundos
    const now = Date.now();

    // El refresh token está completamente expirado
    return now >= exp;
  } catch (error) {
    console.error('Error al decodificar refresh token:', error);
    return true;
  }
};

// Función para validar el formato del token
const isValidTokenFormat = (token: string): boolean => {
  if (!token) return false;
  const parts = token.split('.');
  return parts.length === 3; // JWT tiene 3 partes
};

// Función para limpiar la sesión
const clearSession = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth-storage');

    // Redirigir al login con la URL actual como callback
    const currentPath = window.location.pathname;
    const callbackParam = currentPath !== '/login' ? `?callbackUrl=${encodeURIComponent(currentPath)}` : '';
    window.location.href = `/login${callbackParam}`;
  }
};

// Función para agregar token
const addAuthToken = (config: InternalAxiosRequestConfig) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  if (token) {
    // Validar formato del token
    if (!isValidTokenFormat(token)) {
      console.error('Token inválido detectado');
      clearSession();
      return config;
    }

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

// Función para manejar refresh token mejorada
const handleRefreshToken = async (originalRequest: CustomAxiosRequestConfig, instance: typeof axiosInstance) => {
  if (!originalRequest._retry) {
    originalRequest._retry = true;
  }

  try {
    const refreshToken = localStorage.getItem('refresh_token');

    // Validar que existe el refresh token
    if (!refreshToken) {
      console.error('❌ No hay refresh token disponible');
      clearSession();
      return Promise.reject(new Error('No refresh token available'));
    }

    // Validar formato del refresh token
    if (!isValidTokenFormat(refreshToken)) {
      console.error('❌ Refresh token con formato inválido');
      clearSession();
      return Promise.reject(new Error('Invalid refresh token format'));
    }

    // Verificar si el refresh token ya expiró
    if (isRefreshTokenExpired(refreshToken)) {
      console.error('❌ Refresh token completamente expirado');
      clearSession();
      return Promise.reject(new Error('Refresh token expired'));
    }

    // Si ya hay un refresh en progreso, esperar a que termine
    if (isRefreshing) {
      console.log('⏳ Esperando refresh token en progreso...');
      return new Promise((resolve) => {
        addRefreshSubscriber((token: string) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          resolve(instance(originalRequest));
        });
      });
    }

    isRefreshing = true;
    console.log('🔄 Iniciando renovación de token...');

    // Realizar el refresh del token
    const response = await axios.post(`${instance.defaults.baseURL}/auth/refresh/`, {
      refresh: refreshToken
    });

    // Extraer los datos según el formato de tu API
    const responseData = response.data.data || response.data;
    const { access, refresh: newRefresh } = responseData;

    if (!access) {
      throw new Error('No access token in refresh response');
    }

    // Validar el nuevo token
    if (!isValidTokenFormat(access)) {
      throw new Error('Invalid access token format received from refresh');
    }

    // Guardar los nuevos tokens
    localStorage.setItem('access_token', access);
    if (newRefresh) {
      localStorage.setItem('refresh_token', newRefresh);
      console.log('✅ Token renovado exitosamente (con nuevo refresh token)');
    } else {
      console.log('✅ Token renovado exitosamente');
    }

    // Notificar a todos los suscriptores
    onRefreshed(access);
    isRefreshing = false;

    // Reintentar la petición original con el nuevo token
    if (originalRequest.headers) {
      originalRequest.headers.Authorization = `Bearer ${access}`;
    }
    return instance(originalRequest);

  } catch (error) {
    isRefreshing = false;
    refreshSubscribers = [];

    console.error('❌ Error al refrescar token:', error);

    // Analizar el tipo de error
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const errorData = error.response?.data;

      console.error('Detalles del error de refresh:', {
        status,
        message: errorData?.message,
        error_code: errorData?.error_code
      });

      // Si el refresh token también expiró o es inválido
      if (status === 401 || status === 403) {
        console.log('🚪 Refresh token expirado o inválido. Cerrando sesión...');
      }
    }

    // Limpiar sesión y redirigir
    clearSession();
    return Promise.reject(error);
  }
};

// Interceptor para responses - manejar errores y refresh token
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Si es error 401 (Unauthorized)
    if (error.response?.status === 401) {
      // Evitar loop infinito en la ruta de refresh
      if (originalRequest.url?.includes('/auth/refresh/')) {
        console.error('Error en el refresh token endpoint');
        clearSession();
        return Promise.reject(error);
      }

      // Si no hemos intentado refrescar el token
      if (!originalRequest._retry) {
        return handleRefreshToken(originalRequest, axiosInstance);
      }
    }

    // Si es error 403 (Forbidden) y el token está expirado
    if (error.response?.status === 403) {
      const token = localStorage.getItem('access_token');
      if (token && isTokenExpired(token)) {
        if (!originalRequest._retry) {
          return handleRefreshToken(originalRequest, axiosInstance);
        }
      }
    }

    return Promise.reject(error);
  }
);

// Interceptor para responses de axiosInstanceMultipart
axiosInstanceMultipart.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Si es error 401 (Unauthorized)
    if (error.response?.status === 401) {
      // Evitar loop infinito en la ruta de refresh
      if (originalRequest.url?.includes('/auth/refresh/')) {
        console.error('Error en el refresh token endpoint');
        clearSession();
        return Promise.reject(error);
      }

      // Si no hemos intentado refrescar el token
      if (!originalRequest._retry) {
        return handleRefreshToken(originalRequest, axiosInstanceMultipart);
      }
    }

    // Si es error 403 (Forbidden) y el token está expirado
    if (error.response?.status === 403) {
      const token = localStorage.getItem('access_token');
      if (token && isTokenExpired(token)) {
        if (!originalRequest._retry) {
          return handleRefreshToken(originalRequest, axiosInstanceMultipart);
        }
      }
    }

    return Promise.reject(error);
  }
);

// Exportar función auxiliar para verificar token desde otros componentes
export const checkTokenValidity = (): boolean => {
  const token = localStorage.getItem('access_token');
  if (!token) return false;

  if (!isValidTokenFormat(token)) {
    clearSession();
    return false;
  }

  if (isTokenExpired(token)) {
    return false;
  }

  return true;
};

// Exportar función para forzar logout
export const forceLogout = () => {
  clearSession();
};

export default axiosInstance;