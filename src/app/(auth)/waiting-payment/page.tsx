"use client";

import React, { useState, useEffect } from 'react';
import { HiClock, HiCheckCircle, HiXCircle } from "react-icons/hi2";
import { Loader } from '@/components/common/Loader';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

const WaitingPaymentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');

  // Obtener parámetros de la URL (retorno de MercadoPago)
  const collection_status = searchParams.get('collection_status');
  const payment_id = searchParams.get('payment_id');
  const status = searchParams.get('status');
  const preference_id = searchParams.get('preference_id');

  useEffect(() => {
    // Verificar si el pago fue exitoso
    if (collection_status === 'approved' || status === 'approved' || status === 'authorized') {
      setPaymentStatus('success');

      // Si es una suscripción autorizada, redirigir a la página de éxito después de 2 segundos
      if (status === 'authorized') {
        setTimeout(() => {
          const queryParams = new URLSearchParams();
          if (preference_id) queryParams.set('preapproval_id', preference_id);
          if (status) queryParams.set('status', status);
          router.push(`/dashboard/subscription/success?${queryParams.toString()}`);
        }, 2000);
      }
    } else if (collection_status === 'rejected' || status === 'rejected' || collection_status === 'cancelled') {
      setPaymentStatus('failed');
    }

    // Obtener deadline del localStorage (si existe)
    const deadline = localStorage.getItem('payment_deadline');
    if (deadline && paymentStatus === 'pending') {
      const updateCountdown = () => {
        const now = new Date().getTime();
        const deadlineTime = new Date(deadline).getTime();
        const distance = deadlineTime - now;

        if (distance < 0) {
          setCountdown('Expirado');
          return;
        }

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setCountdown(`${hours}h ${minutes}m ${seconds}s`);
      };

      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);

      return () => clearInterval(interval);
    }
  }, [collection_status, status, paymentStatus, preference_id, router]);

  const handleRetry = () => {
    // Redirigir al usuario a seleccionar plan nuevamente
    localStorage.removeItem('payment_deadline');
    router.push('/select-plan');
  };

  const handleGoToLogin = () => {
    localStorage.removeItem('payment_deadline');
    router.push('/login');
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
        {/* Header */}
        <header className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-red-400 transition-colors">
              ← Volver al inicio
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="w-full max-w-md">

            {/* Logo */}
            <div className="text-center mb-8">
              <div className="relative w-64 h-32 mx-auto mb-8">
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
            </div>

            {/* Payment Status Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">

              {/* Pending Payment */}
              {paymentStatus === 'pending' && (
                <div className="text-center">
                  <div className="mb-6">
                    <HiClock className="w-16 h-16 text-yellow-500 mx-auto animate-pulse" />
                  </div>
                  <h1 className="text-2xl font-semibold text-white mb-3">
                    Pago Pendiente
                  </h1>
                  <p className="text-gray-400 text-sm mb-6">
                    Tu cuenta está en espera del pago. Completa el proceso para activar tu cuenta.
                  </p>

                  {countdown && countdown !== 'Expirado' && (
                    <div className="bg-yellow-950/30 border border-yellow-800/30 rounded-lg p-4 mb-6">
                      <p className="text-yellow-300 text-sm mb-2">Tiempo restante para completar el pago:</p>
                      <p className="text-yellow-100 text-2xl font-bold font-mono">{countdown}</p>
                    </div>
                  )}

                  {countdown === 'Expirado' && (
                    <div className="bg-red-950/30 border border-red-800/30 rounded-lg p-4 mb-6">
                      <p className="text-red-300 text-sm">El tiempo para completar el pago ha expirado.</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <p className="text-gray-400 text-xs">
                      Si ya realizaste el pago, espera unos minutos mientras procesamos la transacción.
                    </p>
                    <button
                      onClick={handleRetry}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg text-sm transition-colors"
                    >
                      Reintentar registro
                    </button>
                  </div>
                </div>
              )}

              {/* Success */}
              {paymentStatus === 'success' && (
                <div className="text-center">
                  <div className="mb-6">
                    <HiCheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  </div>
                  <h1 className="text-2xl font-semibold text-white mb-3">
                    {status === 'authorized' ? '¡Suscripción Autorizada!' : '¡Pago Exitoso!'}
                  </h1>
                  <p className="text-gray-400 text-sm mb-6">
                    {status === 'authorized'
                      ? 'Tu suscripción ha sido autorizada. Serás redirigido en unos momentos...'
                      : 'Tu pago ha sido confirmado. Tu cuenta está siendo activada.'}
                  </p>

                  {payment_id && (
                    <div className="bg-green-950/30 border border-green-800/30 rounded-lg p-4 mb-6">
                      <p className="text-green-300 text-xs mb-1">ID de Pago:</p>
                      <p className="text-green-100 text-sm font-mono">{payment_id}</p>
                    </div>
                  )}

                  {preference_id && status === 'authorized' && (
                    <div className="bg-green-950/30 border border-green-800/30 rounded-lg p-4 mb-6">
                      <p className="text-green-300 text-xs mb-1">ID de Suscripción:</p>
                      <p className="text-green-100 text-sm font-mono">{preference_id}</p>
                    </div>
                  )}

                  {status === 'authorized' ? (
                    <div className="flex items-center justify-center gap-2 text-green-400">
                      <Loader className="w-5 h-5" />
                      <span className="text-sm">Redirigiendo...</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleGoToLogin}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg text-sm transition-colors"
                    >
                      Ir a iniciar sesión
                    </button>
                  )}
                </div>
              )}

              {/* Failed */}
              {paymentStatus === 'failed' && (
                <div className="text-center">
                  <div className="mb-6">
                    <HiXCircle className="w-16 h-16 text-red-500 mx-auto" />
                  </div>
                  <h1 className="text-2xl font-semibold text-white mb-3">
                    Pago Rechazado
                  </h1>
                  <p className="text-gray-400 text-sm mb-6">
                    Tu pago no pudo ser procesado. Por favor, intenta nuevamente.
                  </p>

                  <div className="space-y-3">
                    <button
                      onClick={handleRetry}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg text-sm transition-colors"
                    >
                      Reintentar registro
                    </button>
                    <Link
                      href="/login"
                      className="block text-center text-sm text-gray-400 hover:text-red-400 transition-colors"
                    >
                      Volver al inicio de sesión
                    </Link>
                  </div>
                </div>
              )}

            </div>

            {/* Help Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-400">
                ¿Necesitas ayuda?{' '}
                <Link href="/contact" className="text-red-400 hover:text-red-300 transition-colors">
                  Contáctanos
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WaitingPaymentPage;
