"use client";

import React, { useState } from 'react';
import {
  HiArrowRight,
  HiEye,
  HiEyeSlash,
  HiCheckCircle,
  HiXCircle,
} from "react-icons/hi2";
import { useAuth } from '@/hooks';
import Image from 'next/image';
import Link from 'next/link';

const RegisterForm = () => {
  const { register, isLoading, error, clearError } = useAuth();

  // Estados para el formulario
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Estados para registro simplificado
  const [registerData, setRegisterData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirm: '',
    account_type: 'inmobiliaria',
    accept_terms: false,
    accept_privacy: false
  });

  // Tipos de cuenta disponibles
  const accountTypes = [
    { value: 'inmobiliaria', label: 'Inmobiliaria' },
    { value: 'agente_independiente', label: 'Agente Independiente' },
    { value: 'inversor', label: 'Inversor' },
    { value: 'estudio', label: 'Estudio' },
    { value: 'arquitectura', label: 'Arquitectura' },
    { value: 'otro', label: 'Otro' }
  ];

  const handleRegisterSubmit = async () => {
    // Resetear status previo
    setSubmitStatus(null);
    setStatusMessage('');
    setErrorCode(null);
    setFieldErrors({});

    // Validaciones básicas
    const requiredFields = [
      'first_name', 'last_name', 'email', 'password',
      'password_confirm', 'account_type', 'accept_terms', 'accept_privacy'
    ];

    const missingFields = requiredFields.filter(field => {
      const value = registerData[field as keyof typeof registerData];
      return !value || (typeof value === 'boolean' && !value);
    });

    if (missingFields.length > 0) {
      setSubmitStatus('error');
      setStatusMessage('Por favor, completa todos los campos obligatorios');
      return;
    }

    if (registerData.password !== registerData.password_confirm) {
      setSubmitStatus('error');
      setStatusMessage('Las contraseñas no coinciden');
      return;
    }

    if (registerData.password.length < 8) {
      setSubmitStatus('error');
      setStatusMessage('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.email)) {
      setSubmitStatus('error');
      setStatusMessage('Por favor, ingresa un email válido');
      return;
    }

    try {
      // Preparar datos para la API según el nuevo formato
      const apiData = {
        first_name: registerData.first_name,
        last_name: registerData.last_name,
        email: registerData.email,
        password: registerData.password,
        password_confirm: registerData.password_confirm,
        account_type: registerData.account_type,
        accept_terms: registerData.accept_terms.toString(),
        accept_privacy: registerData.accept_privacy.toString()
      };

      // Usar el hook de autenticación
      const result = await register(apiData);

      if (result.success) {
        setSubmitStatus('success');
        setStatusMessage(result.message || '¡Registro exitoso! Revisa tu email y ingresa el código OTP para verificar tu cuenta.');

        // Redireccionar a página de verificación OTP según el next_step o por defecto
        const nextPage = result.next_step === 'verify_email' ? '/verify-otp' : '/verify-otp';

        setTimeout(() => {
          window.location.href = nextPage;
        }, 2000);

      } else {
        setSubmitStatus('error');
        setStatusMessage(result.message || 'Error al crear la cuenta. Intenta nuevamente.');
        setErrorCode(result.error_code || null);

        // Asegurar que los errores tengan el formato correcto (Record<string, string[]>)
        const normalizedErrors: Record<string, string[]> = {};
        if (result.errors && typeof result.errors === 'object') {
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              normalizedErrors[field] = messages;
            } else if (messages) {
              normalizedErrors[field] = [String(messages)];
            }
          });
        }
        setFieldErrors(normalizedErrors);
      }

    } catch (error) {
      console.error('Error de registro:', error);
      setSubmitStatus('error');
      setStatusMessage('Error de conexión. Intenta nuevamente.');
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setRegisterData(prev => ({
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
        {/* Header minimalista */}
        <header className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-red-400 transition-colors">
              ← Volver al inicio
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="w-full max-w-md space-y-8">

            {/* Logo y título al estilo Shopify */}
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
                Crea tu cuenta
              </h1>
              <p className="text-sm text-gray-400">
                Comienza tu camino en el mundo inmobiliario
              </p>
            </div>

            {/* Status Messages */}
            {(submitStatus || error) && (
              <div className={`p-4 rounded-lg border ${
                submitStatus === 'success'
                  ? 'bg-green-950/30 border-green-800/30'
                  : 'bg-red-950/30 border-red-800/30'
              }`}>
                <div className="flex items-start gap-3">
                  {submitStatus === 'success' ? (
                    <HiCheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <HiXCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      submitStatus === 'success' ? 'text-green-300' : 'text-red-300'
                    }`}>
                      {statusMessage || error}
                    </p>

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
                  </div>
                </div>
              </div>
            )}

            {/* Formulario minimalista */}
            <form onSubmit={(e) => { e.preventDefault(); handleRegisterSubmit(); }} className="space-y-4">
            {/* Nombre y Apellido en una fila */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="sr-only" htmlFor="first_name">Nombre</label>
                <input
                  id="first_name"
                  type="text"
                  placeholder="Nombre"
                  value={registerData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  className={`w-full px-3 py-2 bg-gray-800/50 border rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent backdrop-blur-sm ${
                    fieldErrors.first_name ? 'border-red-500' : 'border-gray-600/50'
                  }`}
                />
                {fieldErrors.first_name && (
                  <p className="mt-1 text-xs text-red-400">
                    {fieldErrors.first_name[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="sr-only" htmlFor="last_name">Apellido</label>
                <input
                  id="last_name"
                  type="text"
                  placeholder="Apellido"
                  value={registerData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  className={`w-full px-3 py-2 bg-gray-800/50 border rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent backdrop-blur-sm ${
                    fieldErrors.last_name ? 'border-red-500' : 'border-gray-600/50'
                  }`}
                />
                {fieldErrors.last_name && (
                  <p className="mt-1 text-xs text-red-400">
                    {fieldErrors.last_name[0]}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="sr-only" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={registerData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 bg-gray-800/50 border rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent backdrop-blur-sm ${
                  fieldErrors.email ? 'border-red-500' : 'border-gray-600/50'
                }`}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-400">
                  {fieldErrors.email[0]}
                </p>
              )}
            </div>

            {/* Tipo de Cuenta */}
            <div>
              <label className="sr-only" htmlFor="account_type">Tipo de Cuenta</label>
              <select
                id="account_type"
                value={registerData.account_type}
                onChange={(e) => handleInputChange('account_type', e.target.value)}
                className={`w-full px-3 py-2 bg-gray-800/50 border rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent backdrop-blur-sm ${
                  fieldErrors.account_type ? 'border-red-500' : 'border-gray-600/50'
                }`}
              >
                {accountTypes.map((type) => (
                  <option key={type.value} value={type.value} className="bg-gray-800">
                    {type.label}
                  </option>
                ))}
              </select>
              {fieldErrors.account_type && (
                <p className="mt-1 text-xs text-red-400">
                  {fieldErrors.account_type[0]}
                </p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label className="sr-only" htmlFor="password">Contraseña</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={registerData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full px-3 py-2 pr-10 bg-gray-800/50 border rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent backdrop-blur-sm ${
                    fieldErrors.password ? 'border-red-500' : 'border-gray-600/50'
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

            {/* Confirmar Contraseña */}
            <div>
              <label className="sr-only" htmlFor="password_confirm">Confirmar Contraseña</label>
              <div className="relative">
                <input
                  id="password_confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirmar contraseña"
                  value={registerData.password_confirm}
                  onChange={(e) => handleInputChange('password_confirm', e.target.value)}
                  className={`w-full px-3 py-2 pr-10 bg-gray-800/50 border rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent backdrop-blur-sm ${
                    fieldErrors.password_confirm || (submitStatus === 'error' && registerData.password !== registerData.password_confirm) ? 'border-red-500' : 'border-gray-600/50'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors"
                >
                  {showConfirmPassword ? (
                    <HiEyeSlash className="w-4 h-4" />
                  ) : (
                    <HiEye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {(fieldErrors.password_confirm) && (
                <p className="mt-1 text-xs text-red-400">
                  {fieldErrors.password_confirm[0]}
                </p>
              )}
              {submitStatus === 'error' && registerData.password !== registerData.password_confirm && (
                <p className="mt-1 text-xs text-red-400">
                  Las contraseñas no coinciden
                </p>
              )}
            </div>

            {/* Términos y Condiciones */}
            <div className="space-y-3">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={registerData.accept_terms}
                  onChange={(e) => handleInputChange('accept_terms', e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-600 bg-gray-800/50 text-red-600 focus:ring-red-500/50 focus:ring-offset-0"
                />
                <span className="text-xs text-gray-300 leading-relaxed">
                  Acepto los{' '}
                  <Link href="/terms" className="text-red-400 hover:text-red-300 underline transition-colors">
                    Términos y Condiciones
                  </Link>{' '}
                  del servicio
                </span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={registerData.accept_privacy}
                  onChange={(e) => handleInputChange('accept_privacy', e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-600 bg-gray-800/50 text-red-600 focus:ring-red-500/50 focus:ring-offset-0"
                />
                <span className="text-xs text-gray-300 leading-relaxed">
                  Acepto la{' '}
                  <Link href="/privacy" className="text-red-400 hover:text-red-300 underline transition-colors">
                    Política de Privacidad
                  </Link>{' '}
                  y el tratamiento de mis datos personales
                </span>
              </label>
            </div>

            {/* Botón principal */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creando cuenta...</span>
                </>
              ) : (
                <>
                  <span>Crear cuenta</span>
                  <HiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="text-center">
            <p className="text-sm text-gray-400">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-red-400 hover:text-red-300 font-medium transition-colors">
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>
        </main>
      </div>
    </div>
  );
};

export default RegisterForm;