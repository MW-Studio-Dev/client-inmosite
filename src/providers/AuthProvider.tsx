// providers/AuthProvider.tsx - Global Auth Provider
'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useAuthStore } from '@/store/authStore'

// Context interface
interface AuthContextType {
  // Estado
  user: any
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  tokens: any
  isHydrated: boolean

  // Acciones
  login: (credentials: any) => Promise<any>
  register: (data: any) => Promise<any>
  logout: () => void
  verifyEmail: (token: string) => Promise<any>
  resendVerification: () => Promise<any>
  clearError: () => void
  updateUser: (data: any) => Promise<any>
  refreshToken: () => Promise<any>
  checkAuth: () => Promise<any>

  // Utilidades computadas
  isOwner: boolean
  isEmailVerified: boolean
  needsOnboarding: boolean
  company: any
  fullName: string
  initials: string

  // Permisos
  canManageProperties: boolean
  canManageWebsite: boolean
  canViewAnalytics: boolean

  // Estados de carga
  isInitializing: boolean
  isReady: boolean
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Global singleton para interceptors
let interceptorsSetup = false
let setupPromise: Promise<void> | null = null

const setupInterceptorsOnce = async () => {
  if (interceptorsSetup || setupPromise) {
    return setupPromise
  }

  setupPromise = (async () => {
    try {
      const axiosInstance = (await import('@/lib/api')).default

      // Clear any existing interceptors first
      axiosInstance.interceptors.request.clear()
      axiosInstance.interceptors.response.clear()

      // Interceptor para agregar el token a las requests
      axiosInstance.interceptors.request.use(
        (config) => {
          const token = localStorage.getItem('access_token')
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
          return config
        },
        (error) => Promise.reject(error)
      )

      // Interceptor para manejar errores 401 y refrescar token
      axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config

          if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            console.log('Token expirado, intentando refresh...')
            const refreshResult = await useAuthStore.getState().refreshTokens()

            if (refreshResult.success) {
              const newToken = localStorage.getItem('access_token')
              originalRequest.headers.Authorization = `Bearer ${newToken}`
              return axiosInstance(originalRequest)
            } else {
              console.log('Refresh token falló, redirigiendo a login')
              window.location.href = '/login'
              return Promise.reject(error)
            }
          }

          return Promise.reject(error)
        }
      )

      interceptorsSetup = true
      console.log('✅ Axios interceptors configurados globalmente')

    } catch (error) {
      console.error('❌ Error configurando interceptors:', error)
      setupPromise = null
    }
  })()

  return setupPromise
}

// Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const authStore = useAuthStore()
  const [isInitialized, setIsInitialized] = useState(false)

  // Configurar interceptors UNA SOLA VEZ cuando el provider se monte
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await setupInterceptorsOnce()
        await authStore.checkAuth() // Verificar estado inicial
        setIsInitialized(true)
      } catch (error) {
        console.error('❌ Error inicializando auth:', error)
        setIsInitialized(true) // Permitir que la app continue aunque falle
      }
    }

    initializeAuth()
  }, [])

  // Memoizar el valor del context para evitar re-renders innecesarios
  const contextValue = React.useMemo(() => ({
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
    fullName: authStore.user
      ? `${authStore.user.first_name} ${authStore.user.last_name}`.trim()
      : '',
    initials: authStore.user
      ? `${authStore.user.first_name?.charAt(0) || ''}${authStore.user.last_name?.charAt(0) || ''}`
      : '',

    // Permisos
    canManageProperties: authStore.user?.is_company_owner,
    canManageWebsite: authStore.user?.is_company_owner,
    canViewAnalytics: authStore.user?.is_company_owner,

    // Estados de carga
    isInitializing: !authStore.isHydrated || authStore.isLoading || !isInitialized,
    isReady: authStore.isHydrated && !authStore.isLoading && isInitialized,
  }), [authStore, isInitialized])

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook simplificado para usar el context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}

// Hook para verificar si el provider está disponible (opcional)
export function useAuthOptional() {
  const context = useContext(AuthContext)
  return context || null
}