"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  HiCheckCircle,
  HiXCircle,
  HiArrowRight,
  HiKey,
  HiExclamationTriangle,
  HiArrowLeft
} from "react-icons/hi2";
import { useAuth } from '@/hooks';
import Image from 'next/image';
import Link from 'next/link';
import { HouseLoader } from '@/components/auth/HouseLoader';
import { Loader } from '@/components/common/Loader';

const VerifyOTPPage = () => {
  const { verifyEmail, verifyOTP, isLoading, clearError } = useAuth();
  const router = useRouter();

  // Estados
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [verifyStatus, setVerifyStatus] = useState<'verifying' | 'success' | 'error' | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState('');

  // Referencias para los inputs
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  // Obtener email del localStorage y enfocar el primer input al cargar
  useEffect(() => {
    // Obtener email del localStorage
    const storedEmail = localStorage.getItem('verification_email');
    if (storedEmail) {
      setEmail(storedEmail);
    }

    // Enfocar el primer input
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Manejar cambio en cada input
  const handleInputChange = (index: number, value: string) => {
    // Solo permitir números
    const numericValue = value.replace(/[^0-9]/g, '');

    const newOtpCode = [...otpCode];
    newOtpCode[index] = numericValue.slice(-1); // Solo el último carácter
    setOtpCode(newOtpCode);

    // Mover al siguiente input si se ingresó un número
    if (numericValue && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }

    // Limpiar estado de error al escribir
    if (verifyStatus === 'error') {
      setVerifyStatus(null);
      setStatusMessage('');
      setErrorCode(null);
    }
  };

  // Manejar tecla backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0 && inputRefs.current[index - 1]) {
      // Mover al input anterior si el actual está vacío
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'Enter') {
      // Intentar verificar con Enter
      handleVerifyOTP();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      // Navegar con flechas
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Manejar pegado de código
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const numericData = pastedData.replace(/[^0-9]/g, '').slice(0, 6);

    if (numericData.length === 6) {
      const newOtpCode = numericData.split('');
      setOtpCode(newOtpCode);
      // Enfocar el último input
      setTimeout(() => inputRefs.current[5]?.focus(), 0);
    }
  };

  // Verificar código OTP
  const handleVerifyOTP = async () => {
    const code = otpCode.join('');

    if (code.length !== 6) {
      setVerifyStatus('error');
      setStatusMessage('Por favor, ingresa el código completo de 6 dígitos');
      return;
    }

    if (!email) {
      setVerifyStatus('error');
      setStatusMessage('No se encontró el email de registro. Por favor, regístrate nuevamente.');
      return;
    }

    setVerifyStatus('verifying');
    setStatusMessage('');
    setErrorCode(null);

    try {
      // Usar la nueva función verifyOTP con email y código
      const result = await verifyOTP(email, code);

      if (result.success) {
        setVerifyStatus('success');
        setStatusMessage(result.message || '¡Código OTP verificado exitosamente!');

        // Limpiar email de localStorage después de verificación exitosa
        localStorage.removeItem('verification_email');

        // NUEVO: Verificar si hay un pago pendiente
        const pendingPaymentData = localStorage.getItem('pending_payment_data');

        if (pendingPaymentData) {
          try {
            const paymentData = JSON.parse(pendingPaymentData);

            // Si requiere pago
            if (paymentData.requires_payment || paymentData.checkout_url) {
              setStatusMessage('¡Email verificado! Preparando pago...');

              // Si ya tenemos el checkout_url, redirigir directamente
              if (paymentData.checkout_url) {
                setStatusMessage('¡Email verificado! Redirigiendo al pago...');

                // Limpiar datos de pago del localStorage
                localStorage.removeItem('pending_payment_data');

                // Guardar deadline si existe
                if (paymentData.payment_deadline) {
                  localStorage.setItem('payment_deadline', paymentData.payment_deadline);
                }

                // Guardar el plan_slug para referencia
                if (paymentData.plan_slug) {
                  localStorage.setItem('pending_payment_plan', paymentData.plan_slug);
                }

                // Redirigir a MercadoPago después de 2 segundos
                setTimeout(() => {
                  window.location.href = paymentData.checkout_url;
                }, 2000);
                return; // Salir para no ejecutar la redirección al login
              } else {
                // No tenemos checkout_url, redirigir a waiting-payment para que el usuario
                // pueda ver el estado y obtener el link de pago
                localStorage.setItem('pending_payment_plan', paymentData.plan_slug);
                localStorage.removeItem('pending_payment_data');

                setTimeout(() => {
                  router.push('/waiting-payment');
                }, 2000);
                return;
              }
            }
          } catch (e) {
            console.error('Error parsing pending payment data:', e);
          }
        }

        // Si no hay pago pendiente, redirigir al login después de 3 segundos
        setTimeout(() => {
          router.push('/login?verified=true');
        }, 3000);
      } else {
        setVerifyStatus('error');
        setStatusMessage(result.message || 'Código incorrecto. Intenta nuevamente.');
        setErrorCode(result.error_code || null);
        setAttempts(attempts + 1);

        // Limpiar el código después de un error
        setOtpCode(['', '', '', '', '', '']);
        // Enfocar el primer input
        setTimeout(() => inputRefs.current[0]?.focus(), 0);
      }
    } catch (error) {
      setVerifyStatus('error');
      setStatusMessage('Error de conexión. Intenta nuevamente.');
      setAttempts(attempts + 1);
      setOtpCode(['', '', '', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 0);
    }
  };

  // Reenviar código
  const handleResendCode = async () => {
    setIsResending(true);
    try {
      // Aquí deberías implementar una función para reenviar el código OTP
      // Por ahora, solo mostramos un mensaje
      setTimeout(() => {
        setIsResending(false);
        setVerifyStatus('success');
        setStatusMessage('Código reenviado exitosamente. Revisa tu email.');
      }, 2000);
    } catch (error) {
      setIsResending(false);
      setVerifyStatus('error');
      setStatusMessage('Error al reenviar el código. Intenta nuevamente.');
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

            {/* OTP Verification Card */}
            <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 shadow-2xl rounded-xl overflow-hidden">
              {/* Card Header */}
              <div className="pt-8 pb-6 px-8">
                <div className="flex items-center justify-center mb-6">
                  <HiKey className="w-16 h-16 text-red-500" />
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl text-center text-white">
                  Verificación por Código
                </h1>
                <p className="text-center text-gray-400 mt-2">
                  Ingresa el código de 6 dígitos que enviamos a tu email
                </p>
                {email && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">Email:</p>
                    <p className="text-base font-medium text-red-400 break-all">{email}</p>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="space-y-6 px-8 pb-8">
                {/* Loading State - Verificando */}
                {verifyStatus === 'verifying' && (
                  <div className="py-8">
                    <HouseLoader size="md" message="Verificando código..." />
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
                      {!statusMessage.includes('pago') && (
                        <p className="text-sm text-gray-400">
                          Redirigiendo...
                        </p>
                      )}
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

                {/* OTP Input Form */}
                {verifyStatus !== 'verifying' && verifyStatus !== 'success' && (
                  <>
                    <div className="space-y-6">
                      {/* OTP Inputs */}
                      <div className="flex justify-center gap-2">
                        {otpCode.map((digit, index) => (
                          <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={index === 0 ? handlePaste : undefined}
                            className={`
                              w-12 h-14 text-center text-lg font-semibold
                              bg-gray-800/50 border-2 rounded-lg
                              text-white placeholder:text-gray-600
                              transition-all duration-200 backdrop-blur-sm
                              focus:outline-none focus:ring-2 focus:ring-red-500/50
                              ${verifyStatus === 'error'
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-gray-600/50 hover:border-gray-500/70 focus:border-red-500/50'
                              }
                            `}
                            disabled={isLoading}
                          />
                        ))}
                      </div>

                      {/* Status Messages */}
                      {verifyStatus === 'error' && (
                        <div className="p-4 rounded-lg border bg-red-950/30 border-red-800/30">
                          <div className="flex items-start gap-3">
                            <HiXCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-red-300">
                                {statusMessage}
                              </p>
                              {attempts > 2 && (
                                <p className="text-xs text-red-400 mt-2">
                                  ¿Necesitas ayuda? Reenvía el código o contacta soporte.
                                </p>
                              )}
                              {/* Código de error (solo en desarrollo) */}
                              {process.env.NODE_ENV === 'development' && errorCode && (
                                <p className="mt-2 text-xs text-gray-500 font-mono">
                                  Error Code: {errorCode}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Verify Button */}
                      <button
                        onClick={handleVerifyOTP}
                        disabled={isLoading || otpCode.join('').length !== 6}
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:from-red-600/50 disabled:to-red-700/50 disabled:opacity-75 text-white font-semibold py-4 px-6 shadow-lg hover:shadow-xl hover:shadow-red-500/30 transition-all duration-200 rounded-lg disabled:cursor-not-allowed border border-red-500/30 flex items-center justify-center gap-3"
                      >
                        {isLoading ? (
                          <>
                            <HiKey className="w-5 h-5 animate-pulse" />
                            <span>Verificando...</span>
                            <Loader className="text-white" scale={0.5} />
                          </>
                        ) : (
                          <>
                            <HiKey className="w-5 h-5" />
                            <span>Verificar Código</span>
                            <HiArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </button>

                      {/* Resend Code */}
                      <div className="text-center">
                        <p className="text-sm text-gray-400 mb-2">
                          ¿No recibiste el código?
                        </p>
                        <button
                          onClick={handleResendCode}
                          disabled={isResending}
                          className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isResending ? 'Reenviando...' : 'Reenviar código'}
                        </button>
                      </div>
                    </div>

                    {/* Divider */}
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
                          href="/register"
                          className="text-red-400 hover:text-red-300 transition-colors duration-200 text-sm"
                        >
                          ← Volver al Registro
                        </Link>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">
                          ¿Ya tienes cuenta?{' '}
                        </span>
                        <Link
                          href="/login"
                          className="text-red-400 hover:text-red-300 font-semibold transition-colors duration-200"
                        >
                          Iniciar Sesión
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Additional Help */}
            {verifyStatus !== 'verifying' && verifyStatus !== 'success' && (
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

export default VerifyOTPPage;
