// hooks/useAuth.ts - Hook actualizado con manejo mejorado de hidratación

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const authStore = useAuthStore();
  const interceptorSetup = useRef(false);
  
  // Extraer la función para evitar dependencias innecesarias del store completo
  const refreshTokens = authStore.refreshTokens;

  // Configurar interceptor para refresh automático de tokens (solo una vez)
  useEffect(() => {
    if (interceptorSetup.current) return;
    
    const setupTokenInterceptor = async () => {
      try {
        const axiosInstance = (await import('@/lib/api')).default;
        
        // Interceptor para agregar el token a las requests
        axiosInstance.interceptors.request.use(
          (config) => {
            const token = localStorage.getItem('access_token');
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
          },
          (error) => Promise.reject(error)
        );

        // Interceptor para manejar errores 401 y refrescar token
        axiosInstance.interceptors.response.use(
          (response) => response,
          async (error) => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry) {
              originalRequest._retry = true;

              console.log('Token expirado, intentando refresh...');
              const refreshResult = await refreshTokens(); // Usar la función extraída
              
              if (refreshResult.success) {
                // Retry la request original con el nuevo token
                const newToken = localStorage.getItem('access_token');
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axiosInstance(originalRequest);
              } else {
                // Refresh falló, redirigir a login
                console.log('Refresh token falló, redirigiendo a login');
                window.location.href = '/login';
                return Promise.reject(error);
              }
            }

            return Promise.reject(error);
          }
        );

        interceptorSetup.current = true;
        console.log('Axios interceptors configurados');
        
      } catch (error) {
        console.error('Error configurando interceptors:', error);
      }
    };

    setupTokenInterceptor();
  }, [refreshTokens]); // Incluir refreshTokens como dependencia

  return {
    // Estado
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading,
    error: authStore.error,
    tokens: authStore.tokens,
    isHydrated: authStore.isHydrated,

    // Acciones
    login: authStore.login,
    register: authStore.register,
    logout: authStore.logout,
    verifyEmail: authStore.verifyEmail,
    resendVerification: authStore.resendVerification,
    clearError: authStore.clearError,
    updateUser: authStore.updateUser,
    refreshToken: authStore.refreshTokens,
    checkAuth: authStore.checkAuth,
    
    // Utilidades computadas
    isOwner: authStore.user?.is_company_owner || false,
    isEmailVerified: authStore.user?.email_verified || false,
    needsOnboarding: !authStore.user?.onboarding_completed,
    company: authStore.user?.company || null,
    
    // Información adicional del usuario
    fullName: authStore.user 
      ? `${authStore.user.first_name} ${authStore.user.last_name}`.trim() 
      : '',
    initials: authStore.user 
      ? `${authStore.user.first_name?.charAt(0) || ''}${authStore.user.last_name?.charAt(0) || ''}` 
      : '',
    
    // Permisos (puedes extender según tus necesidades)
    canManageProperties: authStore.user?.is_company_owner,
    canManageWebsite: authStore.user?.is_company_owner,
    canViewAnalytics: authStore.user?.is_company_owner,
    
    // Estados de carga combinados
    isInitializing: !authStore.isHydrated || authStore.isLoading,
    isReady: authStore.isHydrated && !authStore.isLoading
  };
};