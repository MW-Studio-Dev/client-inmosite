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

        // Asegurar que los errores tengan el formato correcto (Record<string, string[]>)
        const normalizedErrors: Record<string, string[]> = {};
        if (errors && typeof errors === 'object') {
          Object.entries(errors).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              normalizedErrors[field] = messages;
            } else if (messages) {
              normalizedErrors[field] = [String(messages)];
            }
          });
        }

        // Detectar si es un error de cuenta pendiente de pago
        if (message.includes('pago') || message.includes('payment') || message.includes('pending_payment')) {
          setSubmitStatus('warning');
        } else {
          setSubmitStatus('error');
        }

        setStatusMessage(message);
        setErrorCode(code || null);
        setFieldErrors(normalizedErrors);

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
      setFieldErrors({});
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
        {/* Header minimalista como RegisterForm */}
        <header className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-red-400 transition-colors">
              ← Volver al inicio
            </Link>
          </div>
        </header>

        {/* Main Content - Igual estructura que RegisterForm */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="w-full max-w-md space-y-8">

            {/* Logo y título al estilo RegisterForm */}
            <div className="text-center">
              <div className="relative w-64 h-32 mx-auto mb-8">
                {/* Tarjeta con fondo gris para el logo */}
                <div className="absolute inset-0 bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl"></div>
                <div className="relative w-full h-full flex items-center justify-center p-6">
                  <Image
                    src='/logo.png'
                    alt="Logo InmoSite"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <h1 className="text-2xl font-normal text-white mb-2">
                Inicia sesión
              </h1>
              <p className="text-sm text-gray-400">
                Accede a tu portal inmobiliario
              </p>
            </div>

            {/* Status Messages - Igual que RegisterForm */}
            {(submitStatus || error) && (
              <div className={`p-4 rounded-lg border ${submitStatus === 'success'
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
                    <p className={`text-sm font-medium ${submitStatus === 'success'
                        ? 'text-green-300'
                        : submitStatus === 'warning'
                          ? 'text-yellow-300'
                          : 'text-red-300'
                      }`}>
                      {statusMessage || error}
                    </p>

                    {/* Link especial para pago pendiente */}
                    {submitStatus === 'warning' && statusMessage.includes('pago') && (
                      <div className="mt-4 space-y-2">
                        <Link
                          href="/waiting-payment"
                          className="block w-full text-center py-2 px-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors text-sm"
                        >
                          Completar Pago Ahora
                        </Link>
                        <p className="text-xs text-yellow-400/70 text-center">
                          Debes completar el pago para activar tu cuenta
                        </p>
                      </div>
                    )}

                    {/* Mostrar errores adicionales si existen */}
                    {Object.keys(fieldErrors).length > 0 && (
                      <ul className="mt-2 space-y-1 text-xs text-red-400">
                        {Object.entries(fieldErrors).map(([field, messages]) => {
                          const messagesArray = Array.isArray(messages) ? messages : [messages].filter(Boolean);
                          return messagesArray.map((msg, idx) => (
                            <li key={`${field}-${idx}`} className="flex items-start gap-1">
                              <span className="text-red-500">•</span>
                              <span>{msg}</span>
                            </li>
                          ));
                        })}
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
                  </div>
                </div>
              </div>
            )}

            {/* Formulario minimalista - Igual estilo que RegisterForm */}
            <form onSubmit={(e) => { e.preventDefault(); handleLoginSubmit(); }} className="space-y-4">
              {/* Email - Igual estilo que RegisterForm */}
              <div>
                <label className="sr-only" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={loginData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 bg-gray-800/50 border rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent backdrop-blur-sm ${fieldErrors.email ? 'border-red-500' : 'border-gray-600/50'
                    }`}
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-400">
                    {fieldErrors.email[0]}
                  </p>
                )}
              </div>

              {/* Contraseña - Igual estilo que RegisterForm */}
              <div>
                <label className="sr-only" htmlFor="password">Contraseña</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    value={loginData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full px-3 py-2 pr-10 bg-gray-800/50 border rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent backdrop-blur-sm ${fieldErrors.password ? 'border-red-500' : 'border-gray-600/50'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    {showPassword ? (
                      <HiEyeSlash className="w-4 h-4" />
                    ) : (
                      <HiEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1 text-xs text-red-400">
                    {fieldErrors.password[0]}
                  </p>
                )}
              </div>

              {/* Forgot Password - Posicionado después del campo de contraseña */}
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Botón principal - Igual estilo que RegisterForm */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <>
                    <span>Iniciar sesión</span>
                    <HiArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Links - Igual estilo que RegisterForm */}
            <div className="text-center">
              <p className="text-sm text-gray-400">
                ¿No tienes cuenta?{' '}
                <Link href="/select-plan" className="text-red-400 hover:text-red-300 font-medium transition-colors">
                  Crear cuenta
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LoginForm;
