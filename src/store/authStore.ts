// store/authStore.ts - Estado global con Zustand mejorado

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosInstance from '@/lib/api';
import { User, LoginCredentials, RegisterData, AuthState, LoginResponse, ApiErrorResponse } from '@/interfaces';
import axios from 'axios';

// Extender la interfaz AuthState para incluir isHydrated y nuevas funciones
interface ExtendedAuthState extends AuthState {
  isHydrated: boolean;
  setHydrated: () => void;
  verifyOTP: (email: string, otpCode: string) => Promise<ApiErrorResponse>;
  completeOnboarding: (onboardingData: any) => Promise<any>;
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
          const response = await axiosInstance.post('/auth/register-basic/', data);
          const responseData = response.data;

          // Guardar email en localStorage para usarlo en verificación OTP
          localStorage.setItem('verification_email', data.user_email);

          set({ isLoading: false, error: null });

          return {
            success: true,
            message: responseData.message || 'Registro exitoso. Revisa tu email para verificar tu cuenta.',
            data: responseData.data,
            next_step: responseData.next_step
          };

        } catch (error) {
          let errorMessage = 'Error al registrar la cuenta';
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
            error: errorMessage
          });

          return {
            success: false,
            message: errorMessage,
            error_code: errorCode,
            errors: errors
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

      // Verificación de email (mantiene compatibilidad)
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

      // Verificación de código OTP (nuevo endpoint)
      verifyOTP: async (email: string, otpCode: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.post('/auth/verify-otp/', {
            email: email,
            code: otpCode
          });

          set({ isLoading: false, error: null });

          return {
            success: true,
            message: response.data?.message || 'Código OTP verificado exitosamente.',
            data: response.data?.data
          } as ApiErrorResponse;

        } catch (error) {
          let errorMessage = 'Error al verificar el código OTP';
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
        const refreshToken = localStorage.getItem('refresh_token');

        if (!token) {
          console.log('ℹ️ No hay token de acceso. Usuario no autenticado.');
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
          // console.log('🔍 Verificando autenticación...');

          // Verificar si el token es válido obteniendo el perfil del usuario
          const response = await axiosInstance.get('/auth/profile/');
          const userData = response.data.data;

          // Obtener tokens del localStorage para mantener consistencia
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

          console.log('✅ Usuario autenticado:', userData.email);
          return;

        } catch (error) {
          // console.error('❌ Verificación de autenticación fallida:', error);

          // Analizar el tipo de error
          // if (axios.isAxiosError(error)) {
          //   const status = error.response?.status;

          //   // if (status === 401) {
          //   //   // console.log('🔄 Token expirado. Intentando renovar...');

          //   //   // El interceptor ya debería haber intentado renovar el token
          //   //   // Si llegamos aquí, significa que el refresh también falló
          //   //   // o no hay refresh token disponible
          //   //   // if (!refreshToken) {
          //   //   //   // console.log('❌ No hay refresh token. Cerrando sesión.');
          //   //   // } else {
          //   //   //   console.log('❌ Refresh token también inválido o expirado. Cerrando sesión.');
          //   //   // }
          //   // } else {
          //   //   console.log('❌ Error de autenticación inesperado:', status);
          //   // }
          // }

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
          // console.error('❌ No hay refresh token disponible');
          // Limpiar estado
          get().logout();
          return { success: false, message: 'No hay token de refresco disponible' };
        }

        try {
          // console.log('🔄 Renovando tokens desde authStore...');
          const response = await axiosInstance.post('/auth/refresh/', { refresh: refreshToken });

          // Extraer datos según el formato de tu API
          const responseData = response.data.data || response.data;
          const { access, refresh: newRefresh } = responseData;

          if (!access) {
            throw new Error('No se recibió access token en la respuesta');
          }

          // Actualizar tokens en localStorage
          localStorage.setItem('access_token', access);
          if (newRefresh) {
            localStorage.setItem('refresh_token', newRefresh);
          }

          // Actualizar estado
          set((state) => ({
            tokens: {
              access,
              refresh: newRefresh || refreshToken,
              access_expires_at: 0,
              refresh_expires_at: 0,
            },
            isAuthenticated: true,
            error: null
          }));

          // console.log('✅ Tokens renovados exitosamente desde authStore');
          return { success: true };

        } catch (error) {
          // console.error('❌ Error al refrescar token desde authStore:', error);

          // Analizar el error
          let errorMessage = 'Error al refrescar el token';
          let shouldLogout = false;

          if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const errorData = error.response?.data;

            errorMessage = errorData?.message || error.message || errorMessage;

            // Si el refresh token es inválido o expiró (401/403), hacer logout
            if (status === 401 || status === 403) {
              console.log('🚪 Refresh token inválido o expirado. Cerrando sesión...');
              shouldLogout = true;
            }
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          // Limpiar sesión si es necesario
          if (shouldLogout) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');

            set({
              user: null,
              tokens: null,
              isAuthenticated: false,
              error: null
            });
          }

          return { success: false, message: errorMessage };
        }
      },

      // Completar onboarding
      completeOnboarding: async (onboardingData: any) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.post('/auth/onboarding/complete/', onboardingData);

          // Actualizar datos del usuario con la respuesta
          if (response.data.data?.user) {
            const updatedUser = response.data.data.user;
            set({
              user: updatedUser,
              isLoading: false,
              error: null
            });
          } else {
            // Si no vienen datos de usuario, obtener el perfil actualizado
            const profileResponse = await axiosInstance.get('/auth/profile/');
            const updatedUser = profileResponse.data.data;

            set({
              user: updatedUser,
              isLoading: false,
              error: null
            });
          }

          return {
            success: true,
            message: response.data?.message || 'Onboarding completado exitosamente',
            data: response.data?.data
          };

        } catch (error) {
          let errorMessage = 'Error al completar el onboarding';
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
          };
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

          // No llamamos a checkAuth aquí porque AuthMonitor se encarga de ello
          // Esto evita llamadas duplicadas y ciclos infinitos
        }
      },
    }
  )
);