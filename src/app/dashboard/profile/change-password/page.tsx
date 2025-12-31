"use client";

import React, { useState } from 'react';
import {
    HiCheckCircle,
    HiXCircle,
    HiEye,
    HiEyeSlash,
    HiLockClosed
} from "react-icons/hi2";
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

const ChangePasswordPage = () => {
    const router = useRouter();

    // Estados para el formulario
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
    const [statusMessage, setStatusMessage] = useState('');
    const [fieldErrors, setFieldErrors] = useState<{
        currentPassword?: string;
        newPassword?: string;
        confirmPassword?: string;
    }>({});

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
        const errors: {
            currentPassword?: string;
            newPassword?: string;
            confirmPassword?: string;
        } = {};

        if (!currentPassword) {
            errors.currentPassword = 'La contraseña actual es requerida';
        }

        const passwordError = validatePassword(newPassword);
        if (passwordError) {
            errors.newPassword = passwordError;
        }

        if (!confirmPassword) {
            errors.confirmPassword = 'Debes confirmar la contraseña';
        } else if (newPassword !== confirmPassword) {
            errors.confirmPassword = 'Las contraseñas no coinciden';
        }

        if (currentPassword && newPassword && currentPassword === newPassword) {
            errors.newPassword = 'La nueva contraseña debe ser diferente a la actual';
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            setSubmitStatus('error');
            setStatusMessage('Por favor, corrige los errores en el formulario');
            return;
        }

        try {
            setIsLoading(true);

            // Llamar al endpoint real de change-password
            const response = await authService.changePassword({
                current_password: currentPassword,
                new_password: newPassword,
                new_password_confirm: confirmPassword
            });

            // Éxito
            setSubmitStatus('success');
            setStatusMessage(response.message || 'Contraseña cambiada exitosamente.');

            // Limpiar campos
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            // Opcional: redirigir al perfil después de 3 segundos
            setTimeout(() => {
                router.push('/dashboard/profile');
            }, 3000);

        } catch (error: any) {
            console.error('Error:', error);

            // Manejar diferentes tipos de errores
            if (error.response?.data?.errors) {
                // Errores de validación por campo
                const apiErrors = error.response.data.errors;
                const newFieldErrors: {
                    currentPassword?: string;
                    newPassword?: string;
                    confirmPassword?: string;
                } = {};

                if (apiErrors.current_password) {
                    newFieldErrors.currentPassword = Array.isArray(apiErrors.current_password)
                        ? apiErrors.current_password[0]
                        : apiErrors.current_password;
                }
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

                setFieldErrors(newFieldErrors);
                setSubmitStatus('error');
                setStatusMessage('Por favor, corrige los errores en el formulario');
            } else if (error.response?.data?.message) {
                setSubmitStatus('error');
                setStatusMessage(error.response.data.message);
            } else if (error.message) {
                setSubmitStatus('error');
                setStatusMessage(error.message);
            } else {
                setSubmitStatus('error');
                setStatusMessage('Ocurrió un error al cambiar tu contraseña. Intenta nuevamente.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleFieldChange = (field: 'current' | 'new' | 'confirm', value: string) => {
        if (field === 'current') {
            setCurrentPassword(value);
            if (fieldErrors.currentPassword) {
                setFieldErrors(prev => ({ ...prev, currentPassword: undefined }));
            }
        } else if (field === 'new') {
            setNewPassword(value);
            if (fieldErrors.newPassword) {
                setFieldErrors(prev => ({ ...prev, newPassword: undefined }));
            }
        } else {
            setConfirmPassword(value);
            if (fieldErrors.confirmPassword) {
                setFieldErrors(prev => ({ ...prev, confirmPassword: undefined }));
            }
        }

        if (submitStatus) {
            setSubmitStatus(null);
            setStatusMessage('');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 mb-4 inline-flex items-center transition-colors"
                    >
                        ← Volver
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                            <HiLockClosed className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Cambiar contraseña
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Actualiza tu contraseña para mantener tu cuenta segura
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card principal */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">

                    {/* Status Messages */}
                    {submitStatus && (
                        <div className={`mb-6 p-4 rounded-lg border ${
                            submitStatus === 'success'
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30'
                                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30'
                        }`}>
                            <div className="flex items-start gap-3">
                                {submitStatus === 'success' ? (
                                    <HiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                ) : (
                                    <HiXCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                )}
                                <p className={`text-sm font-medium ${
                                    submitStatus === 'success'
                                        ? 'text-green-800 dark:text-green-300'
                                        : 'text-red-800 dark:text-red-300'
                                }`}>
                                    {statusMessage}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Formulario */}
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">

                        {/* Contraseña Actual */}
                        <div>
                            <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Contraseña actual
                            </label>
                            <div className="relative">
                                <input
                                    id="current-password"
                                    type={showCurrentPassword ? "text" : "password"}
                                    placeholder="Ingresa tu contraseña actual"
                                    value={currentPassword}
                                    onChange={(e) => handleFieldChange('current', e.target.value)}
                                    className={`w-full px-4 py-2.5 pr-10 bg-white dark:bg-gray-700 border rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 ${
                                        fieldErrors.currentPassword
                                            ? 'border-red-500 dark:border-red-500'
                                            : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    {showCurrentPassword ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                                </button>
                            </div>
                            {fieldErrors.currentPassword && (
                                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                                    {fieldErrors.currentPassword}
                                </p>
                            )}
                        </div>

                        {/* Divisor */}
                        <div className="border-t border-gray-200 dark:border-gray-700"></div>

                        {/* Nueva Contraseña */}
                        <div>
                            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nueva contraseña
                            </label>
                            <div className="relative">
                                <input
                                    id="new-password"
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="Ingresa tu nueva contraseña"
                                    value={newPassword}
                                    onChange={(e) => handleFieldChange('new', e.target.value)}
                                    className={`w-full px-4 py-2.5 pr-10 bg-white dark:bg-gray-700 border rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 ${
                                        fieldErrors.newPassword
                                            ? 'border-red-500 dark:border-red-500'
                                            : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    {showNewPassword ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                                </button>
                            </div>
                            {fieldErrors.newPassword ? (
                                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                                    {fieldErrors.newPassword}
                                </p>
                            ) : (
                                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                                    Mínimo 8 caracteres, con mayúsculas, minúsculas y números
                                </p>
                            )}
                        </div>

                        {/* Confirmar Contraseña */}
                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Confirmar nueva contraseña
                            </label>
                            <div className="relative">
                                <input
                                    id="confirm-password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirma tu nueva contraseña"
                                    value={confirmPassword}
                                    onChange={(e) => handleFieldChange('confirm', e.target.value)}
                                    className={`w-full px-4 py-2.5 pr-10 bg-white dark:bg-gray-700 border rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 ${
                                        fieldErrors.confirmPassword
                                            ? 'border-red-500 dark:border-red-500'
                                            : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    {showConfirmPassword ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                                </button>
                            </div>
                            {fieldErrors.confirmPassword && (
                                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                                    {fieldErrors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {/* Botones de acción */}
                        <div className="flex items-center gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={isLoading || submitStatus === 'success'}
                                className="flex-1 sm:flex-initial bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-2.5 px-6 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Cambiando...</span>
                                    </>
                                ) : (
                                    <>
                                        <HiLockClosed className="w-4 h-4" />
                                        <span>Cambiar contraseña</span>
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>

                    {/* Información de seguridad */}
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Consejos de seguridad
                        </h3>
                        <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                            <li>• Usa una contraseña única que no hayas usado antes</li>
                            <li>• Evita usar información personal fácil de adivinar</li>
                            <li>• Considera usar un gestor de contraseñas</li>
                            <li>• Cambia tu contraseña regularmente</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordPage;
