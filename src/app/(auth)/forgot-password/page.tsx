"use client";

import React, { useState } from 'react';
import {
    HiArrowRight,
    HiCheckCircle,
    HiXCircle,
    HiExclamationTriangle
} from "react-icons/hi2";
import Image from 'next/image';
import Link from 'next/link';
import { authService } from '@/services/authService';

const ForgotPasswordPage = () => {
    // Estados para el formulario
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | 'warning' | null>(null);
    const [statusMessage, setStatusMessage] = useState('');
    const [fieldError, setFieldError] = useState<string | null>(null);

    const handleSubmit = async () => {
        // Resetear status previo
        setSubmitStatus(null);
        setStatusMessage('');
        setFieldError(null);

        // Validaciones básicas
        if (!email.trim()) {
            setSubmitStatus('error');
            setStatusMessage('Por favor, ingresa tu email');
            setFieldError('El email es requerido');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setSubmitStatus('error');
            setStatusMessage('Por favor, ingresa un email válido');
            setFieldError('Email inválido');
            return;
        }

        try {
            setIsLoading(true);

            // Llamar al endpoint real de forgot-password
            const response = await authService.forgotPassword(email);

            // Éxito
            setSubmitStatus('success');
            setStatusMessage(response.message || 'Si el email existe en nuestros registros, recibirás instrucciones para restablecer tu contraseña.');
            setEmail(''); // Limpiar campo

        } catch (error: any) {
            console.error('Error:', error);

            // Manejar diferentes tipos de errores
            if (error.response?.data?.message) {
                setSubmitStatus('error');
                setStatusMessage(error.response.data.message);
            } else if (error.message) {
                setSubmitStatus('error');
                setStatusMessage(error.message);
            } else {
                setSubmitStatus('error');
                setStatusMessage('Ocurrió un error al procesar tu solicitud. Intenta nuevamente.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (value: string) => {
        setEmail(value);
        // Limpiar errores al escribir
        if (submitStatus || fieldError) {
            setSubmitStatus(null);
            setStatusMessage('');
            setFieldError(null);
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
                        <Link href="/login" className="inline-flex items-center text-sm text-gray-400 hover:text-red-400 transition-colors">
                            ← Volver al inicio de sesión
                        </Link>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
                    <div className="w-full max-w-md space-y-8">

                        {/* Logo y título */}
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
                                Recuperar contraseña
                            </h1>
                            <p className="text-sm text-gray-400">
                                Ingresa tu email y te enviaremos las instrucciones
                            </p>
                        </div>

                        {/* Status Messages */}
                        {submitStatus && (
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
                                            {statusMessage}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Formulario minimalista */}
                        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
                            {/* Email */}
                            <div>
                                <label className="sr-only" htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => handleInputChange(e.target.value)}
                                    className={`w-full px-3 py-2 bg-gray-800/50 border rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent backdrop-blur-sm ${fieldError ? 'border-red-500' : 'border-gray-600/50'
                                        }`}
                                />
                                {fieldError && (
                                    <p className="mt-1 text-xs text-red-400">
                                        {fieldError}
                                    </p>
                                )}
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
                                        <span>Enviando...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Enviar instrucciones</span>
                                        <HiArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Links */}
                        <div className="text-center">
                            <p className="text-sm text-gray-400">
                                ¿Recordaste tu contraseña?{' '}
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

export default ForgotPasswordPage;
