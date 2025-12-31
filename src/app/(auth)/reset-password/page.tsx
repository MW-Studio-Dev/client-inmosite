"use client";

import React, { useState, useEffect, Suspense } from 'react';
import {
    HiArrowRight,
    HiCheckCircle,
    HiXCircle,
    HiExclamationTriangle,
    HiEye,
    HiEyeSlash
} from "react-icons/hi2";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/authService';

const ResetPasswordContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Estados para el formulario
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | 'warning' | null>(null);
    const [statusMessage, setStatusMessage] = useState('');
    const [fieldErrors, setFieldErrors] = useState<{
        newPassword?: string;
        confirmPassword?: string;
    }>({});

    // Obtener token de la URL al cargar el componente
    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            // Si no hay token en la URL, mostrar error
            setSubmitStatus('error');
            setStatusMessage('Token de recuperación no encontrado. Por favor, solicita un nuevo enlace de recuperación.');
        }
    }, [searchParams]);

    // Validación de contraseña
    const validatePassword = (password: string): string | null => {
        if (!password) {
            return 'La contraseña es requerida';
        }
        if (password.length < 8) {
            return 'La contraseña debe tener al menos 8 caracteres';
        }
        if (!/[A-Z]/.test(password)) {
            return 'Debe contener al menos una mayúscula';
        }
        if (!/[a-z]/.test(password)) {
            return 'Debe contener al menos una minúscula';
        }
        if (!/[0-9]/.test(password)) {
            return 'Debe contener al menos un número';
        }
        return null;
    };

    const handleSubmit = async () => {
        // Resetear status previo
        setSubmitStatus(null);
        setStatusMessage('');
        setFieldErrors({});

        // Validaciones
        const errors: { newPassword?: string; confirmPassword?: string } = {};

        const passwordError = validatePassword(newPassword);
        if (passwordError) {
            errors.newPassword = passwordError;
        }

        if (!confirmPassword) {
            errors.confirmPassword = 'Debes confirmar la contraseña';
        } else if (newPassword !== confirmPassword) {
            errors.confirmPassword = 'Las contraseñas no coinciden';
        }

        if (!token) {
            setSubmitStatus('error');
            setStatusMessage('Token inválido. Por favor, solicita un nuevo enlace de recuperación.');
            return;
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            setSubmitStatus('error');
            setStatusMessage('Por favor, corrige los errores en el formulario');
            return;
        }

        try {
            setIsLoading(true);

            // Llamar al endpoint real de reset-password
            const response = await authService.resetPassword({
                token,
                new_password: newPassword,
                new_password_confirm: confirmPassword
            });

            // Éxito
            setSubmitStatus('success');
            setStatusMessage(response.message || 'Contraseña restablecida exitosamente. Redirigiendo al inicio de sesión...');

            // Limpiar campos
            setNewPassword('');
            setConfirmPassword('');

            // Redirigir al login después de 3 segundos
            setTimeout(() => {
                router.push('/login');
            }, 3000);

        } catch (error: any) {
            console.error('Error:', error);

            // Manejar diferentes tipos de errores
            if (error.response?.data?.errors) {
                // Errores de validación por campo
                const apiErrors = error.response.data.errors;
                const newFieldErrors: { newPassword?: string; confirmPassword?: string } = {};

                if (apiErrors.new_password) {
                    newFieldErrors.newPassword = Array.isArray(apiErrors.new_password)
                        ? apiErrors.new_password[0]
                        : apiErrors.new_password;
                }
                if (apiErrors.new_password_confirm) {
                    newFieldErrors.confirmPassword = Array.isArray(apiErrors.new_password_confirm)
                        ? apiErrors.new_password_confirm[0]
                        : apiErrors.new_password_confirm;
                }
                if (apiErrors.token) {
                    setSubmitStatus('error');
                    setStatusMessage(Array.isArray(apiErrors.token) ? apiErrors.token[0] : apiErrors.token);
                }

                setFieldErrors(newFieldErrors);
            } else if (error.response?.data?.message) {
                setSubmitStatus('error');
                setStatusMessage(error.response.data.message);
            } else if (error.message) {
                setSubmitStatus('error');
                setStatusMessage(error.message);
            } else {
                setSubmitStatus('error');
                setStatusMessage('Ocurrió un error al restablecer tu contraseña. Intenta nuevamente.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = (value: string) => {
        setNewPassword(value);
        // Limpiar errores al escribir
        if (fieldErrors.newPassword) {
            setFieldErrors(prev => ({ ...prev, newPassword: undefined }));
        }
        if (submitStatus) {
            setSubmitStatus(null);
            setStatusMessage('');
        }
    };

    const handleConfirmPasswordChange = (value: string) => {
        setConfirmPassword(value);
        // Limpiar errores al escribir
        if (fieldErrors.confirmPassword) {
            setFieldErrors(prev => ({ ...prev, confirmPassword: undefined }));
        }
        if (submitStatus) {
            setSubmitStatus(null);
            setStatusMessage('');
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
                                Restablecer contraseña
                            </h1>
                            <p className="text-sm text-gray-400">
                                Ingresa tu nueva contraseña
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
                            {/* Nueva Contraseña */}
                            <div>
                                <label className="sr-only" htmlFor="new-password">Nueva contraseña</label>
                                <div className="relative">
                                    <input
                                        id="new-password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Nueva contraseña"
                                        value={newPassword}
                                        onChange={(e) => handlePasswordChange(e.target.value)}
                                        className={`w-full px-3 py-2 pr-10 bg-gray-800/50 border rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent backdrop-blur-sm ${fieldErrors.newPassword ? 'border-red-500' : 'border-gray-600/50'
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                                    >
                                        {showPassword ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {fieldErrors.newPassword && (
                                    <p className="mt-1 text-xs text-red-400">
                                        {fieldErrors.newPassword}
                                    </p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">
                                    Mínimo 8 caracteres, con mayúsculas, minúsculas y números
                                </p>
                            </div>

                            {/* Confirmar Contraseña */}
                            <div>
                                <label className="sr-only" htmlFor="confirm-password">Confirmar contraseña</label>
                                <div className="relative">
                                    <input
                                        id="confirm-password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirmar contraseña"
                                        value={confirmPassword}
                                        onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                                        className={`w-full px-3 py-2 pr-10 bg-gray-800/50 border rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent backdrop-blur-sm ${fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-600/50'
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                                    >
                                        {showConfirmPassword ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {fieldErrors.confirmPassword && (
                                    <p className="mt-1 text-xs text-red-400">
                                        {fieldErrors.confirmPassword}
                                    </p>
                                )}
                            </div>

                            {/* Botón principal */}
                            <button
                                type="submit"
                                disabled={isLoading || submitStatus === 'success'}
                                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Restableciendo...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Restablecer contraseña</span>
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

const ResetPasswordPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
};

export default ResetPasswordPage;
