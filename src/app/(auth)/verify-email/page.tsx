"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Button, 
  Card, 
  CardBody, 
  CardHeader,
  Link
} from "@heroui/react";
import {
  HiCheckCircle,
  HiXCircle,
  HiArrowLeft,
  HiEnvelope
} from "react-icons/hi2";
import Image from 'next/image';

const EmailVerificationForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  
  // Estados para manejar la verificación
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  let setIsLoading = true

  // Función para verificar el email
  const verifyEmail = async (verificationToken: string) => {
    try {
      // URL del endpoint - reemplaza {{url_test}} con tu URL base
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/auth/verify-email/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: verificationToken
        })
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationStatus('success');
        setMessage('¡Tu cuenta ha sido verificada exitosamente! Ya puedes iniciar sesión.');
      } else {
        setVerificationStatus('error');
        setMessage(data.message || 'El token de verificación es inválido o ha expirado.');
      }
    } catch (error) {
      console.error('Error al verificar email:', error);
      setVerificationStatus('error');
      setMessage('Error de conexión. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading=false;
    }
  };

  // Efecto para iniciar la verificación automáticamente
  useEffect(() => {
    if (!token) {
      setVerificationStatus('error');
      setMessage('Token de verificación no encontrado en la URL.');
      setIsLoading=false;
      return;
    }

    // Mostrar el loader por 5 segundos mínimo
    const timer = setTimeout(() => {
      verifyEmail(token);
    }, 5000);

    return () => clearTimeout(timer);
  }, [token]);

  const handleGoToLogin = () => {
    router.push('/login');
  };

  const handleResendVerification = () => {
    // Aquí podrías implementar la lógica para reenviar el email de verificación
    console.log('Reenviando email de verificación...');
    // router.push('/resend-verification');
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
            <Card className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 shadow-2xl">
              <CardHeader className="text-center pb-8">
                <div className={`mx-auto w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg border transition-all duration-500 ${
                  verificationStatus === 'loading' 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-700 border-blue-400/30' 
                    : verificationStatus === 'success'
                    ? 'bg-gradient-to-r from-green-500 to-green-700 border-green-400/30'
                    : 'bg-gradient-to-r from-red-500 to-red-700 border-red-400/30'
                }`}>
                  {verificationStatus === 'loading' ? (
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : verificationStatus === 'success' ? (
                    <HiCheckCircle className="w-8 h-8 text-white" />
                  ) : (
                    <HiXCircle className="w-8 h-8 text-white" />
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-white mb-2">
                  {verificationStatus === 'loading' && 'Verificando Cuenta'}
                  {verificationStatus === 'success' && '¡Cuenta Verificada!'}
                  {verificationStatus === 'error' && 'Error de Verificación'}
                </h1>
                
                <p className="text-gray-400 text-base">
                  {verificationStatus === 'loading' && 'Por favor espera mientras verificamos tu cuenta...'}
                  {verificationStatus === 'success' && 'Tu cuenta ha sido activada correctamente'}
                  {verificationStatus === 'error' && 'No pudimos verificar tu cuenta'}
                </p>
              </CardHeader>
              
              <CardBody className="space-y-6 px-8 pb-8">
                {/* Loading State */}
                {verificationStatus === 'loading' && (
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <HiEnvelope className="w-12 h-12 text-blue-400 animate-pulse" />
                    </div>
                    <p className="text-gray-300 text-sm">
                      Verificando tu token de acceso...
                    </p>
                    <div className="w-full bg-gray-700/50 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                    </div>
                  </div>
                )}

                {/* Success State */}
                {verificationStatus === 'success' && (
                  <div className="text-center space-y-6">
                    <div className="p-4 bg-green-950/30 border border-green-800/30 rounded-lg">
                      <p className="text-green-300 text-sm">
                        {message}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <Button 
                        size="lg" 
                        onClick={handleGoToLogin}
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold py-6 shadow-lg hover:shadow-xl hover:shadow-green-500/30 transition-all duration-200 rounded-lg border border-green-500/30"
                        endContent={<HiArrowLeft className="w-5 h-5 rotate-180" />}
                      >
                        Ir a Iniciar Sesión
                      </Button>
                    </div>
                  </div>
                )}

                {/* Error State */}
                {verificationStatus === 'error' && (
                  <div className="text-center space-y-6">
                    <div className="p-4 bg-red-950/30 border border-red-800/30 rounded-lg">
                      <p className="text-red-300 text-sm">
                        {message}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <Button 
                        size="lg" 
                        onClick={handleResendVerification}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-6 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 rounded-lg border border-blue-500/30"
                        endContent={<HiEnvelope className="w-5 h-5" />}
                      >
                        Reenviar Email de Verificación
                      </Button>
                      
                      <Button 
                        size="lg" 
                        variant="ghost"
                        onClick={handleGoToLogin}
                        className="w-full text-gray-300 hover:text-white border border-gray-600/50 hover:border-gray-500/70 py-6 transition-all duration-200 rounded-lg"
                        startContent={<HiArrowLeft className="w-5 h-5" />}
                      >
                        Volver al Login
                      </Button>
                    </div>
                  </div>
                )}

                {/* Token Info (for debugging) */}
                {token && process.env.NODE_ENV === 'development' && (
                  <div className="mt-6 p-3 bg-gray-800/50 border border-gray-600/30 rounded-lg">
                    <p className="text-xs text-gray-400 break-all">
                      Token: {token}
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Additional Help */}
            <div className="text-center mt-8">
              <p className="text-gray-500 text-sm mb-4">
                ¿Problemas con la verificación?
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

export default EmailVerificationForm;