// store/authStore.ts - Estado global con Zustand mejorado

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosInstance from '@/lib/api';
import { User, LoginCredentials, RegisterData, AuthState, LoginResponse, ApiErrorResponse } from '@/interfaces';
import axios from 'axios';

// Extender la interfaz AuthState para incluir isHydrated
interface ExtendedAuthState extends AuthState {
  isHydrated: boolean;
  setHydrated: () => void;
}

export const useAuthStore = create<ExtendedAuthState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isHydrated: false, // Nuevo estado para controlar la hidratación

      // Marcar como hidratado (se llama automáticamente por Zustand)
      setHydrated: () => {
        set({ isHydrated: true });
      },

      // Acción de login
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.post('/auth/login/', credentials);
          const { data } = response.data;

          // Guardar tokens en localStorage
          localStorage.setItem('access_token', data.tokens.access);
          localStorage.setItem('refresh_token', data.tokens.refresh);

          set({
            user: data.user,
            tokens: data.tokens,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          return {
            success: true,
            user: data.user,
            onboarding_required: data.onboarding_required
          } as LoginResponse;

        } catch (error) {
          let errorMessage = 'Error al iniciar sesión';
          let errorCode = 'UNKNOWN_ERROR';
          let errors: Record<string, string[]> = {};

          if (axios.isAxiosError(error) && error.response?.data) {
            const errorData = error.response.data;

            // Extraer mensaje principal
            errorMessage = errorData.message || error.message || errorMessage;

            // Extraer código de error
            errorCode = errorData.error_code || errorCode;

            // Extraer errores específicos de campos
            if (errorData.errors) {
              errors = errorData.errors;

              // Si hay errores en non_field_errors, usar el primero como mensaje principal
              if (errors.non_field_errors && errors.non_field_errors.length > 0) {
                errorMessage = errors.non_field_errors[0];
              }
            }
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
            user: null,
            tokens: null
          });

          return {
            success: false,
            message: errorMessage,
            error_code: errorCode,
            errors: errors
          } as LoginResponse;
        }
      },

      // Acción de registro
      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        
        try {
          await axiosInstance.post('/auth/register/', data);
          
          set({ isLoading: false, error: null });
          
          return { 
            success: true, 
            message: 'Registro exitoso. Revisa tu email para verificar tu cuenta.' 
          };

        } catch (error) {
          const errorMessage = axios.isAxiosError(error)
            ? ((error.response?.data)?.message || error.message || 'Error al registrar la cuenta')
            : (error instanceof Error ? error.message : 'Error al registrar la cuenta');
          set({ 
            isLoading: false, 
            error: errorMessage 
          });
          
          return { 
            success: false, 
            message: errorMessage 
          };
        }
      },

      // Acción de logout
      logout: () => {
        // Limpiar localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          error: null
        });
      },

      // Verificación de email
      verifyEmail: async (token: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.post('/auth/verify-email/', { token });

          set({ isLoading: false, error: null });

          return {
            success: true,
            message: response.data?.message || 'Email verificado exitosamente.'
          } as ApiErrorResponse;

        } catch (error) {
          let errorMessage = 'Error al verificar el email';
          let errorCode = 'UNKNOWN_ERROR';
          let errors: Record<string, string[]> = {};

          if (axios.isAxiosError(error) && error.response?.data) {
            const errorData = error.response.data;
            errorMessage = errorData.message || error.message || errorMessage;
            errorCode = errorData.error_code || errorCode;

            if (errorData.errors) {
              errors = errorData.errors;
              if (errors.non_field_errors && errors.non_field_errors.length > 0) {
                errorMessage = errors.non_field_errors[0];
              }
            }
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          set({
            isLoading: false,
            error: errorMessage
          });

          return {
            success: false,
            message: errorMessage,
            error_code: errorCode,
            errors: errors
          } as ApiErrorResponse;
        }
      },

      // Reenviar verificación de email
      resendVerification: async (email: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.post('/auth/resend-verification/', { email });

          set({ isLoading: false, error: null });

          return {
            success: true,
            message: response.data?.message || 'Email de verificación enviado exitosamente.'
          } as ApiErrorResponse;

        } catch (error) {
          let errorMessage = 'Error al reenviar el email de verificación';
          let errorCode = 'UNKNOWN_ERROR';
          let errors: Record<string, string[]> = {};

          if (axios.isAxiosError(error) && error.response?.data) {
            const errorData = error.response.data;
            errorMessage = errorData.message || error.message || errorMessage;
            errorCode = errorData.error_code || errorCode;

            if (errorData.errors) {
              errors = errorData.errors;
              if (errors.non_field_errors && errors.non_field_errors.length > 0) {
                errorMessage = errors.non_field_errors[0];
              }
            }
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          set({
            isLoading: false,
            error: errorMessage
          });

          return {
            success: false,
            message: errorMessage,
            error_code: errorCode,
            errors: errors
          } as ApiErrorResponse;
        }
      },

      // Limpiar errores
      clearError: () => {
        set({ error: null });
      },

      // Verificar autenticación al iniciar la app
      checkAuth: async () => {
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          set({ 
            isAuthenticated: false, 
            user: null, 
            tokens: null,
            isLoading: false 
          });
          return;
        }

        set({ isLoading: true });

        try {
          // Verificar si el token es válido obteniendo el perfil del usuario
          const response = await axiosInstance.get('/auth/profile/');
          const userData = response.data.data;

          // Obtener tokens del localStorage para mantener consistencia
          const refreshToken = localStorage.getItem('refresh_token');
          const tokens = get().tokens || {
            access: token,
            refresh: refreshToken || '',
            access_expires_at: 0,
            refresh_expires_at: 0
          };

          set({
            user: userData,
            tokens: tokens,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          return;

        } catch (error) {
          console.error('Auth check failed:', error);
          
          // Token inválido, limpiar estado
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });

          return;
        }
      },

      // Actualizar datos del usuario
      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData }
          });
        }
      },

      // Refresh tokens
      refreshTokens: async () => {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          return { success: false, message: 'No hay token de refresco disponible' };
        }

        try {
          const response = await axiosInstance.post('/auth/refresh/', { refresh: refreshToken });
          const { access, access_expires_at, refresh_expires_at } = response.data.data.tokens;

          // Actualizar tokens en localStorage
          localStorage.setItem('access_token', access);

          // Actualizar estado
          set((state) => ({
            tokens: {
              access,
              refresh: state.tokens?.refresh || refreshToken,
              access_expires_at: access_expires_at || 0,
              refresh_expires_at: refresh_expires_at || 0,
            },
            isAuthenticated: true,
            error: null
          }));

          return { success: true };

        } catch (error) {
          console.error('Token refresh failed:', error);
          
          // Refresh falló, limpiar estado y redirigir
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            error: null
          });

          const errorMessage = axios.isAxiosError(error)
            ? ((error.response?.data)?.message || error.message || 'Error al refrescar el token')
            : (error instanceof Error ? error.message : 'Error al refrescar el token');
          return { success: false, message: errorMessage };
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated
      }),
      onRehydrateStorage: () => (state) => {
        // Se ejecuta después de que Zustand restaura el estado
        if (state) {
          state.setHydrated();
          
          // Si hay un usuario persistido, verificar que el token siga siendo válido
          if (state.isAuthenticated && state.user) {
            // Ejecutar checkAuth en el próximo tick para no bloquear la hidratación
            setTimeout(() => {
              state.checkAuth();
            }, 0);
          }
        }
      },
    }
  )
);