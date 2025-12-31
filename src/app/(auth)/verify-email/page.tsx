"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { Loader } from "@/components/common/Loader";
import { useSearchParams, useRouter } from 'next/navigation';
import {
  HiCheckCircle,
  HiXCircle,
  HiArrowRight,
  HiEnvelope,
  HiExclamationTriangle
} from "react-icons/hi2";
import { useAuth } from '@/hooks';
import Image from 'next/image';
import Link from 'next/link';
import { HouseLoader } from '@/components/auth/HouseLoader';

const VerifyEmailPage = () => {
  const { verifyEmail, resendVerification, isLoading, clearError } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  // Estados
  const [verifyStatus, setVerifyStatus] = useState<'verifying' | 'success' | 'error' | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [showResendForm, setShowResendForm] = useState(false);
  const [email, setEmail] = useState('');
  const [resendStatus, setResendStatus] = useState<'success' | 'error' | null>(null);
  const [resendMessage, setResendMessage] = useState('');

  // Verificar email automáticamente al cargar
  useEffect(() => {
    if (token) {
      handleVerifyEmail(token);
    } else {
      setVerifyStatus('error');
      setStatusMessage('Token de verificación no encontrado');
      setShowResendForm(true);
    }
  }, [token]);

  const handleVerifyEmail = async (verificationToken: string) => {
    setVerifyStatus('verifying');
    setStatusMessage('');
    setErrorCode(null);

    try {
      const result = await verifyEmail(verificationToken);

      if (result.success) {
        setVerifyStatus('success');
        setStatusMessage(result.message || '¡Email verificado exitosamente!');

        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          router.push('/login?verified=true');
        }, 3000);
      } else {
        setVerifyStatus('error');
        setStatusMessage(result.message || 'Error al verificar el email');
        setErrorCode(result.error_code || null);
        setShowResendForm(true);
      }
    } catch (error) {
      setVerifyStatus('error');
      setStatusMessage('Error de conexión. Intenta nuevamente.');
      setShowResendForm(true);
    }
  };

  const handleResendVerification = async () => {
    if (!email.trim()) {
      setResendStatus('error');
      setResendMessage('Por favor, ingresa tu email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setResendStatus('error');
      setResendMessage('Por favor, ingresa un email válido');
      return;
    }

    try {
      const result = await resendVerification(email);

      if (result.success) {
        setResendStatus('success');
        setResendMessage(result.message || 'Email de verificación enviado exitosamente');
        setShowResendForm(false);
      } else {
        setResendStatus('error');
        setResendMessage(result.message || 'Error al reenviar el email');
      }
    } catch (error) {
      setResendStatus('error');
      setResendMessage('Error de conexión. Intenta nuevamente.');
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

            {/* Verification Card */}
            <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 shadow-2xl rounded-xl overflow-hidden">
              {/* Card Header */}
              <div className="pt-8 pb-6 px-8">
                <div className="flex items-center justify-center mb-6">
                  <HiEnvelope className="w-16 h-16 text-red-500" />
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl text-center text-white">
                  Verificación de Email
                </h1>
              </div>

              {/* Card Body */}
              <div className="space-y-6 px-8 pb-8">
                {/* Loading State - Verificando */}
                {verifyStatus === 'verifying' && (
                  <div className="py-8">
                    <HouseLoader size="md" message="Verificando tu email..." />
                  </div>
                )}

                {/* Success State */}
                {verifyStatus === 'success' && (
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="bg-green-500/20 rounded-full p-4">
                        <HiCheckCircle className="w-16 h-16 text-green-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-green-300">
                        ¡Verificado!
                      </h2>
                      <p className="text-gray-300">
                        {statusMessage}
                      </p>
                      <p className="text-sm text-gray-400">
                        Redirigiendo al login en 3 segundos...
                      </p>
                    </div>

                    <div className="pt-4">
                      <Link
                        href="/login"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors duration-200"
                      >
                        Ir al Login
                        <HiArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                )}

                {/* Error State */}
                {verifyStatus === 'error' && (
                  <div className="space-y-6">
                    <div className="text-center space-y-4">
                      <div className="flex justify-center">
                        <div className="bg-red-500/20 rounded-full p-4">
                          <HiXCircle className="w-16 h-16 text-red-400" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-red-300">
                          No se pudo verificar
                        </h2>
                        <p className="text-gray-300">
                          {statusMessage}
                        </p>
                      </div>

                      {/* Código de error (solo en desarrollo) */}
                      {process.env.NODE_ENV === 'development' && errorCode && (
                        <p className="text-xs text-gray-500 font-mono">
                          Error Code: {errorCode}
                        </p>
                      )}
                    </div>

                    {/* Botón para mostrar formulario de reenvío */}
                    {!showResendForm && (
                      <button
                        onClick={() => setShowResendForm(true)}
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold py-4 px-6 shadow-lg hover:shadow-xl hover:shadow-red-500/30 transition-all duration-200 rounded-lg border border-red-500/30 flex items-center justify-center gap-3"
                      >
                        <HiEnvelope className="w-5 h-5" />
                        Reenviar Email de Verificación
                      </button>
                    )}
                  </div>
                )}

                {/* Resend Form */}
                {showResendForm && verifyStatus !== 'verifying' && (
                  <div className="space-y-4 pt-4 border-t border-gray-700/50">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Reenviar Verificación
                      </h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Ingresa tu email y te enviaremos un nuevo link de verificación
                      </p>
                    </div>

                    {/* Resend Status Messages */}
                    {resendStatus && (
                      <div className={`p-4 rounded-lg border ${resendStatus === 'success'
                          ? 'bg-green-950/30 border-green-800/30'
                          : 'bg-red-950/30 border-red-800/30'
                        } `}>
                        <div className="flex items-center gap-3">
                          {resendStatus === 'success' ? (
                            <HiCheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                          ) : (
                            <HiExclamationTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                          )}
                          <span className={`text-sm font-medium ${resendStatus === 'success' ? 'text-green-300' : 'text-red-300'
                            } `}>
                            {resendMessage}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Email Input */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setResendStatus(null);
                          setResendMessage('');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleResendVerification();
                          }
                        }}
                        className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-600/50 hover:border-gray-500/70 focus:border-red-500/50 focus:outline-none rounded-lg text-white placeholder:text-gray-500 transition-all duration-200 backdrop-blur-sm"
                        autoComplete="email"
                      />
                    </div>

                    {/* Resend Button */}
                    <button
                      onClick={handleResendVerification}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:from-red-600/50 disabled:to-red-700/50 disabled:opacity-75 text-white font-semibold py-4 px-6 shadow-lg hover:shadow-xl hover:shadow-red-500/30 transition-all duration-200 rounded-lg disabled:cursor-not-allowed border border-red-500/30 flex items-center justify-center gap-3"
                    >
                      {isLoading ? (
                        <>
                          <HiEnvelope className="w-5 h-5 animate-pulse" />
                          <span>Enviando...</span>
                          <Loader className="text-white" scale={0.5} />
                        </>
                      ) : (
                        <>
                          <HiEnvelope className="w-5 h-5" />
                          <span>Reenviar Verificación</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Divider */}
                {verifyStatus !== 'verifying' && (
                  <>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700/50"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="bg-gray-900/80 px-2 text-gray-500">o</span>
                      </div>
                    </div>

                    {/* Links */}
                    <div className="text-center space-y-2">
                      <div>
                        <Link
                          href="/login"
                          className="text-red-400 hover:text-red-300 transition-colors duration-200 text-sm"
                        >
                          ← Volver al Login
                        </Link>
                      </div>
                      <div>
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
                  </>
                )}
              </div>
            </div>

            {/* Additional Help */}
            {verifyStatus !== 'verifying' && (
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
                </div>
              </div>
            )}
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

export default VerifyEmailPage;
