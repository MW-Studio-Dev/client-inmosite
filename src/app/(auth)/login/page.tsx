"use client";

import React, { useState} from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Button, 
  Card, 
  CardBody, 
  CardHeader, 
  Divider,
  Link
} from "@heroui/react";
import {
  HiArrowRight,
  HiHome,
  HiEye,
  HiEyeSlash,
  HiCheckCircle,
  HiXCircle
} from "react-icons/hi2";
import { useAuth } from '@/hooks';

const LoginForm = () => {
  const { login, isLoading, error, clearError } = useAuth();
  
  // Hook para obtener parámetros de URL
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  
  // Estados para el formulario
  const [showPassword, setShowPassword] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

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
        setSubmitStatus('error');
        setStatusMessage(result.message || 'Error al iniciar sesión. Verifica tus credenciales.');
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
    <div className="min-h-screen bg-slate-950">
      {/* Fondo minimalista con grid sutil */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: "linear-gradient(to bottom, #0f172a, #1e1b4b)",
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px"
        }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header minimalista */}
        <header className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-950/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg shadow-lg">
                  <HiHome className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                  Inmo<span className="text-purple-400">Web</span>
                </span>
              </Link>
              
              <Link 
                href="/" 
                className="text-slate-400 hover:text-purple-400 font-medium transition-colors duration-200 text-sm"
              >
                ← Volver al inicio
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-8 px-4">
          <div className="w-full max-w-md">
            
            {/* Debug info - Solo en desarrollo */}
            {/* {process.env.NODE_ENV === 'development' && (
              <div className="mb-4 p-3 bg-blue-950/50 border border-blue-800/30 rounded-lg text-xs text-blue-300">
                <strong>Debug Info:</strong><br />
                Callback URL: {callbackUrl}<br />
                Is Loading: {isLoading ? 'true' : 'false'}<br />
                Error: {error || 'none'}
              </div>
            )} */}
            
            {/* Login Card */}
            <Card className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/30 shadow-2xl">
              <CardHeader className="text-center pb-8">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <HiHome className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Iniciar Sesión
                </h1>
                <p className="text-slate-400 text-base">
                  Accede a tu panel de administración
                </p>
                
                {/* Información de callback */}
                {callbackUrl !== '/dashboard' && (
                  <div className="mt-4 p-3 bg-purple-950/30 border border-purple-800/20 rounded-lg">
                    <p className="text-xs text-purple-300">
                      Te redirigiremos de vuelta a donde estabas
                    </p>
                  </div>
                )}
              </CardHeader>
              
              <CardBody className="space-y-6 px-8 pb-8">
                {/* Status Messages */}
                {(submitStatus || error) && (
                  <div className={`p-4 rounded-lg border ${
                    submitStatus === 'success' 
                      ? 'bg-green-950/30 border-green-800/30' 
                      : 'bg-red-950/30 border-red-800/30'
                  }`}>
                    <div className="flex items-center gap-3">
                      {submitStatus === 'success' ? (
                        <HiCheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      ) : (
                        <HiXCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      )}
                      <span className={`text-sm font-medium ${
                        submitStatus === 'success' ? 'text-green-300' : 'text-red-300'
                      }`}>
                        {statusMessage || error}
                      </span>
                    </div>
                  </div>
                )}

                {/* Email Input - Nativo */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">
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
                        bg-slate-800/50 
                        border-2 
                        ${submitStatus === 'error' && !loginData.email.trim() ? 'border-red-500' : 'border-slate-600'}
                        hover:border-slate-500 
                        focus:border-purple-500 
                        focus:outline-none
                        rounded-lg 
                        text-white 
                        placeholder:text-slate-500
                        transition-all 
                        duration-200
                        autocomplete-off
                      `}
                      autoComplete="off"
                      spellCheck="false"
                    />
                    {submitStatus === 'error' && !loginData.email.trim() && (
                      <p className="mt-1 text-xs text-red-400">Este campo es requerido</p>
                    )}
                  </div>
                </div>

                {/* Password Input - Nativo */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">
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
                        bg-slate-800/50 
                        border-2 
                        ${submitStatus === 'error' && !loginData.password.trim() ? 'border-red-500' : 'border-slate-600'}
                        hover:border-slate-500 
                        focus:border-purple-500 
                        focus:outline-none
                        rounded-lg 
                        text-white 
                        placeholder:text-slate-500
                        transition-all 
                        duration-200
                      `}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors duration-200"
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
                  {/* Checkbox nativo personalizado */}
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
                          ? 'bg-purple-500 border-purple-500' 
                          : 'bg-transparent border-slate-600 hover:border-slate-500'
                        }
                      `}>
                        {rememberMe && (
                          <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-slate-300 select-none">Recordarme</span>
                  </label>

                  <Link 
                    href="/forgot-password" 
                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                {/* Login Button */}
                <Button 
                  size="lg" 
                  onClick={handleLoginSubmit}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold py-6 shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  endContent={isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <HiArrowRight className="w-5 h-5" />
                  )}
                >
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>

                <Divider className="bg-slate-700/50" />

                {/* Register Link */}
                <div className="text-center">
                  <span className="text-slate-400 text-sm">
                    ¿No tienes cuenta?{' '}
                  </span>
                  <Link 
                    href="/register"
                    className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-200"
                  >
                    Regístrate gratis
                  </Link>
                </div>

                {/* Benefits Reminder */}
                <div className="p-4 bg-purple-950/30 border border-purple-800/20 rounded-lg">
                  <div className="text-center">
                    <h4 className="font-semibold text-purple-300 text-sm mb-1">
                      🎉 ¿Aún no tienes cuenta?
                    </h4>
                    <p className="text-purple-400 text-xs">
                      Regístrate y obtén <span className="font-semibold">14 días gratis</span> sin tarjeta de crédito
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Additional Help */}
            <div className="text-center mt-8">
              <p className="text-slate-500 text-sm mb-4">
                ¿Necesitas ayuda?
              </p>
              <div className="flex justify-center gap-6 text-sm">
                <Link 
                  href="/support" 
                  className="text-slate-400 hover:text-purple-400 transition-colors duration-200"
                >
                  Soporte
                </Link>
                <Link 
                  href="/contact" 
                  className="text-slate-400 hover:text-purple-400 transition-colors duration-200"
                >
                  Contacto
                </Link>
                <Link 
                  href="/demo" 
                  className="text-slate-400 hover:text-purple-400 transition-colors duration-200"
                >
                  Ver Demo
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer minimalista */}
        <footer className="py-6 border-t border-slate-800/50 bg-slate-950/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="p-1.5 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg">
                  <HiHome className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">
                  Inmo<span className="text-purple-400">Web</span>
                </span>
              </div>
              
              <p className="text-slate-500 text-sm">
                © 2025 InmoWeb by MW Studio Digital. <span className="text-purple-400">Argentina</span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LoginForm;