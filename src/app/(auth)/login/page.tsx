"use client";

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  HiArrowRight,
  HiEye,
  HiEyeSlash,
  HiCheckCircle,
  HiXCircle,
  HiExclamationTriangle
} from "react-icons/hi2";
import { useAuth } from '@/hooks';
import Image from 'next/image';
import Link from 'next/link';
import { HouseLoader } from '@/components/auth/HouseLoader';

const LoginForm = () => {
  const { login, isLoading, error, clearError } = useAuth();
  
  // Hook para obtener parámetros de URL
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  
  // Estados para el formulario
  const [showPassword, setShowPassword] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | 'warning' | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Estados para login
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [rememberMe, setRememberMe] = useState(false);

  const handleLoginSubmit = async () => {
    // Resetear status previo
    setSubmitStatus(null);
    setStatusMessage('');
    setErrorCode(null);
    setFieldErrors({});

    // Validaciones básicas
    if (!loginData.email.trim() || !loginData.password.trim()) {
      setSubmitStatus('error');
      setStatusMessage('Por favor, completa todos los campos');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginData.email)) {
      setSubmitStatus('error');
      setStatusMessage('Por favor, ingresa un email válido');
      return;
    }

    try {
      console.log('Iniciando login...');

      // Usar el hook de autenticación
      const result = await login({
        email: loginData.email,
        password: loginData.password
      });

      console.log('Resultado del login:', result);

      if (result.success) {
        setSubmitStatus('success');
        setStatusMessage('¡Inicio de sesión exitoso! Redirigiendo...');

        // Redireccionar a la URL de callback o dashboard por defecto
        setTimeout(() => {
          console.log('Redirigiendo a:', callbackUrl);
          window.location.href = callbackUrl;
        }, 1500);

      } else {
        // Manejar diferentes tipos de errores
        const message = result.message || 'Error al iniciar sesión. Verifica tus credenciales.';
        const code = result.error_code;
        const errors = result.errors || {};

        setSubmitStatus('error');
        setStatusMessage(message);
        setErrorCode(code || null);
        setFieldErrors(errors);

        // Determinar si es un warning (email no verificado)
        if (code === 'INVALID_CREDENTIALS' && message.toLowerCase().includes('email no verificado')) {
          setSubmitStatus('warning');
        }
      }

    } catch (error) {
      console.error('Error de login:', error);
      setSubmitStatus('error');
      setStatusMessage('Error de conexión. Intenta nuevamente.');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setLoginData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpiar errores al escribir
    if (submitStatus || error) {
      setSubmitStatus(null);
      setStatusMessage('');
      clearError();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950">
      {/* Fondo con patrones sutiles */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 0%, rgba(239, 68, 68, 0.1), transparent 50%),
            radial-gradient(circle at 0% 50%, rgba(239, 68, 68, 0.05), transparent 50%),
            radial-gradient(circle at 100% 50%, rgba(239, 68, 68, 0.05), transparent 50%),
            linear-gradient(rgba(239, 68, 68, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239, 68, 68, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: "auto, auto, auto, 60px 60px, 60px 60px"
        }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header minimalista */}
        <header className="border-b border-gray-800/50 backdrop-blur-sm bg-gray-900/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2">
                <div className="relative w-32 h-32">
                  <Image 
                    src='/logo.png' 
                    alt="Logo" 
                    fill
                    className="object-contain drop-shadow-lg"
                    priority
                  />
                </div>
              </Link>
              
              <Link 
                href="/" 
                className="text-gray-400 hover:text-red-400 font-medium transition-colors duration-200 text-sm"
              >
                ← Volver al inicio
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-8 px-4">
          <div className="w-full max-w-md">
            
            {/* Login Card - Personalizado sin HeroUI */}
            <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 shadow-2xl rounded-xl overflow-hidden">
              {/* Card Header con Logo y Título lado a lado */}
              <div className="pt-8 pb-6 px-8">
                {/* Logo y título horizontales */}
                <div className="flex items-center justify-center gap-6 mb-6">
                  
                  <div className="text-center mb-6">
                    <h1 className="text-3xl sm:text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent mb-2">
                      Bienvenido de Nuevo
                    </h1>
                    <p className="text-gray-400 text-lg">Accede a tu portal inmobiliario</p>
                  </div>
                </div>
         
                
                {/* Información de callback */}
                {callbackUrl !== '/dashboard' && (
                  <div className="mt-4 p-3 bg-red-950/30 border border-red-800/20 rounded-lg">
                    <p className="text-xs text-red-300">
                      Te redirigiremos de vuelta a donde estabas
                    </p>
                  </div>
                )}
              </div>
              
              {/* Card Body */}
              <div className="space-y-6 px-8 pb-8">
                {/* Loading State con House Loader */}
                {isLoading && (
                  <div className="py-8">
                    <HouseLoader size="md" message="Iniciando sesión..." />
                  </div>
                )}

                {/* Status Messages */}
                {!isLoading && (submitStatus || error) && (
                  <div className={`p-4 rounded-lg border ${
                    submitStatus === 'success'
                      ? 'bg-green-950/30 border-green-800/30'
                      : submitStatus === 'warning'
                      ? 'bg-yellow-950/30 border-yellow-800/30'
                      : 'bg-red-950/30 border-red-800/30'
                  }`}>
                    <div className="flex items-start gap-3">
                      {submitStatus === 'success' ? (
                        <HiCheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      ) : submitStatus === 'warning' ? (
                        <HiExclamationTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <HiXCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          submitStatus === 'success'
                            ? 'text-green-300'
                            : submitStatus === 'warning'
                            ? 'text-yellow-300'
                            : 'text-red-300'
                        }`}>
                          {statusMessage || error}
                        </p>

                        {/* Mostrar errores adicionales si existen */}
                        {Object.keys(fieldErrors).length > 0 && (
                          <ul className="mt-2 space-y-1 text-xs text-red-400">
                            {Object.entries(fieldErrors).map(([field, messages]) => (
                              messages.map((msg, idx) => (
                                <li key={`${field}-${idx}`} className="flex items-start gap-1">
                                  <span className="text-red-500">•</span>
                                  <span>{msg}</span>
                                </li>
                              ))
                            ))}
                          </ul>
                        )}

                        {/* Agregar link para verificar email si es necesario */}
                        {submitStatus === 'warning' && statusMessage.toLowerCase().includes('email no verificado') && (
                          <div className="mt-3">
                            <Link
                              href="/verify-email"
                              className="text-yellow-400 hover:text-yellow-300 text-xs font-medium underline"
                            >
                              ¿No recibiste el email? Reenviar verificación
                            </Link>
                          </div>
                        )}

                        {/* Código de error para debugging (solo en desarrollo) */}
                        {process.env.NODE_ENV === 'development' && errorCode && (
                          <p className="mt-2 text-xs text-gray-500 font-mono">
                            Error Code: {errorCode}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Email Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      value={loginData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleLoginSubmit();
                        }
                      }}
                      className={`
                        w-full px-4 py-3 
                        bg-gray-800/50 
                        border-2 
                        ${submitStatus === 'error' && !loginData.email.trim() ? 'border-red-500' : 'border-gray-600/50'}
                        hover:border-gray-500/70 
                        focus:border-red-500/50 
                        focus:outline-none
                        rounded-lg 
                        text-white 
                        placeholder:text-gray-500
                        transition-all 
                        duration-200
                        backdrop-blur-sm
                      `}
                      autoComplete="off"
                      spellCheck="false"
                    />
                    {submitStatus === 'error' && !loginData.email.trim() && (
                      <p className="mt-1 text-xs text-red-400">Este campo es requerido</p>
                    )}
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Contraseña <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Tu contraseña"
                      value={loginData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleLoginSubmit();
                        }
                      }}
                      className={`
                        w-full px-4 py-3 pr-12
                        bg-gray-800/50 
                        border-2 
                        ${submitStatus === 'error' && !loginData.password.trim() ? 'border-red-500' : 'border-gray-600/50'}
                        hover:border-gray-500/70 
                        focus:border-red-500/50 
                        focus:outline-none
                        rounded-lg 
                        text-white 
                        placeholder:text-gray-500
                        transition-all 
                        duration-200
                        backdrop-blur-sm
                      `}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors duration-200"
                    >
                      {showPassword ? (
                        <HiEyeSlash className="w-5 h-5" />
                      ) : (
                        <HiEye className="w-5 h-5" />
                      )}
                    </button>
                    {submitStatus === 'error' && !loginData.password.trim() && (
                      <p className="mt-1 text-xs text-red-400">Este campo es requerido</p>
                    )}
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  {/* Checkbox personalizado */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`
                        w-4 h-4 rounded border-2 transition-all duration-200 flex items-center justify-center
                        ${rememberMe 
                          ? 'bg-red-500 border-red-500' 
                          : 'bg-transparent border-gray-600/50 hover:border-gray-500/70'
                        }
                      `}>
                        {rememberMe && (
                          <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-300 select-none">Recordarme</span>
                  </label>

                  <Link 
                    href="/forgot-password" 
                    className="text-sm text-red-400 hover:text-red-300 transition-colors duration-200"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                {/* Login Button - Personalizado sin HeroUI */}
                <button
                  onClick={handleLoginSubmit}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:from-red-600/50 disabled:to-red-700/50 disabled:opacity-75 text-white font-semibold py-4 px-6 shadow-lg hover:shadow-xl hover:shadow-red-500/30 transition-all duration-200 rounded-lg disabled:cursor-not-allowed border border-red-500/30 flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <svg
                        viewBox="0 0 100 100"
                        className="w-5 h-5 animate-pulse"
                      >
                        <path d="M50 10 L90 45 L10 45 Z" fill="currentColor" />
                        <rect x="20" y="45" width="60" height="45" fill="currentColor" />
                      </svg>
                      <span>Iniciando sesión...</span>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </>
                  ) : (
                    <>
                      <span>Iniciar Sesión</span>
                      <HiArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Divider personalizado */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700/50"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-gray-900/80 px-2 text-gray-500">o</span>
                  </div>
                </div>

                {/* Register Link */}
                <div className="text-center">
                  <span className="text-gray-400 text-sm">
                    ¿No tienes cuenta?{' '}
                  </span>
                  <Link 
                    href="/register"
                    className="text-red-400 hover:text-red-300 font-semibold transition-colors duration-200"
                  >
                    Regístrate gratis
                  </Link>
                </div>
              </div>
            </div>

            {/* Additional Help */}
            <div className="text-center mt-8">
              <p className="text-gray-500 text-sm mb-4">
                ¿Necesitas ayuda?
              </p>
              <div className="flex justify-center gap-6 text-sm">
                <Link 
                  href="/support" 
                  className="text-gray-400 hover:text-red-400 transition-colors duration-200"
                >
                  Soporte
                </Link>
                <Link 
                  href="/contact" 
                  className="text-gray-400 hover:text-red-400 transition-colors duration-200"
                >
                  Contacto
                </Link>
                <Link 
                  href="/demo" 
                  className="text-gray-400 hover:text-red-400 transition-colors duration-200"
                >
                  Ver Demo
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer minimalista */}
        <footer className="py-6 border-t border-gray-800/50 bg-gray-900/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="relative w-32 h-32">
                  <Image 
                    src='/logo.png' 
                    alt="Logo" 
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
               
              </div>
              
              <p className="text-gray-500 text-sm">
                © 2025 InmoSite by MW Studio Digital. <span className="text-red-400">Argentina</span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LoginForm;