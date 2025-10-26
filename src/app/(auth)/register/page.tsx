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

  // Estados para registro
  const [registerData, setRegisterData] = useState({
    user_first_name: '',
    user_last_name: '',
    user_email: '',
    user_phone: '',
    user_password: '',
    user_password_confirm: '',
    user_accept_terms: false,
    user_accept_privacy: false,
    user_marketing_emails: false,
    company_name: '',
    company_type: 'inmobiliaria',
    cuit: '',
    company_phone: '',
    company_address: '',
    city: '',
    province: '',
    subdomain: '',
    website_url: ''
  });

  const provinces = [
    'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 
    'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 
    'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan', 
    'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero', 
    'Tierra del Fuego', 'Tucumán'
  ];

  const handleRegisterSubmit = async () => {
    // Resetear status previo
    setSubmitStatus(null);
    setStatusMessage('');

    // Validaciones básicas
    const requiredFields = [
      'user_first_name', 'user_last_name', 'user_email', 'user_phone',
      'user_password', 'user_password_confirm', 'company_name', 'cuit',
      'company_phone', 'company_address', 'city', 'province', 'subdomain'
    ];

    const missingFields = requiredFields.filter(field => !registerData[field as keyof typeof registerData]);
    
    if (missingFields.length > 0) {
      setSubmitStatus('error');
      setStatusMessage('Por favor, completa todos los campos obligatorios');
      return;
    }

    if (registerData.user_password !== registerData.user_password_confirm) {
      setSubmitStatus('error');
      setStatusMessage('Las contraseñas no coinciden');
      return;
    }

    if (registerData.user_password.length < 8) {
      setSubmitStatus('error');
      setStatusMessage('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (!registerData.user_accept_terms || !registerData.user_accept_privacy) {
      setSubmitStatus('error');
      setStatusMessage('Debes aceptar los términos y condiciones y la política de privacidad');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.user_email)) {
      setSubmitStatus('error');
      setStatusMessage('Por favor, ingresa un email válido');
      return;
    }

    const cuitRegex = /^\d{11}$/;
    if (!cuitRegex.test(registerData.cuit.replace(/[-\s]/g, ''))) {
      setSubmitStatus('error');
      setStatusMessage('El CUIT debe tener 11 dígitos');
      return;
    }

    try {
      // Preparar datos para la API
      const apiData = {
        ...registerData,
        cuit: registerData.cuit.replace(/[-\s]/g, '') // Limpiar CUIT
      };

      // Usar el hook de autenticación
      const result = await register(apiData);

      if (result.success) {
        setSubmitStatus('success');
        setStatusMessage(result.message || 'Registro exitoso. Tu cuenta debe ser aprobada por nuestros administradores. Te notificaremos por email cuando esté lista para acceder a la plataforma.');
        
        // Redireccionar a página de verificación después de 5 segundos
        setTimeout(() => {
          window.location.href = '/verify-email';
        }, 5000);
        
      } else {
        setSubmitStatus('error');
        setStatusMessage(result.message || 'Error al crear la cuenta. Intenta nuevamente.');
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
    }
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return registerData.user_first_name && registerData.user_last_name && 
               registerData.user_email && registerData.user_phone &&
               registerData.user_password && registerData.user_password_confirm;
      case 2:
        return registerData.company_name && registerData.cuit && 
               registerData.company_phone && registerData.company_address &&
               registerData.city && registerData.province;
      case 3:
        return registerData.subdomain;
      case 4:
        return registerData.user_accept_terms && registerData.user_accept_privacy;
      default:
        return false;
    }
  };

  const getProgressPercentage = () => {
    let completedSteps = 0;
    for (let i = 1; i <= 4; i++) {
      if (validateStep(i)) completedSteps++;
    }
    return (completedSteps / 4) * 100;
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
                <div className="relative w-8 h-8">
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
        <div className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Header del formulario con logo y título lado a lado */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-6 mb-6">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
                  <Image 
                    src='/logo.png' 
                    alt="Logo" 
                    fill
                    className="object-contain drop-shadow-lg"
                    priority
                  />
                </div>
                
                <div className="text-center sm:text-left">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                    Crear <span className="text-red-400">Cuenta</span>
                  </h1>
                  <p className="text-gray-400 text-base">
                    Completa tus datos para empezar con tu <span className="text-red-400 font-medium">prueba gratuita</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Card Principal - Personalizado sin HeroUI */}
            <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 shadow-2xl rounded-xl">
              <div className="p-8">
                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-300">
                      Progreso del registro
                    </span>
                    <span className="text-sm font-medium text-red-400">
                      {Math.round(getProgressPercentage())}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-800/50 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-red-700 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage()}%` }}
                    />
                  </div>
                </div>

                {/* Status Messages */}
                {(submitStatus || error) && (
                  <div className={`p-4 rounded-lg border mb-6 ${
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

                <div className="space-y-8">
                  {/* Información Personal */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        validateStep(1) ? 'bg-red-500' : 'bg-red-900/30'
                      }`}>
                        <span className={`font-bold text-sm ${
                          validateStep(1) ? 'text-white' : 'text-red-400'
                        }`}>1</span>
                      </div>
                      Información Personal
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Nombre */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          Nombre <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Tu nombre"
                          value={registerData.user_first_name}
                          onChange={(e) => handleInputChange('user_first_name', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-600/50 hover:border-gray-500/70 focus:border-red-500/50 focus:outline-none rounded-lg text-white placeholder:text-gray-500 transition-all duration-200 backdrop-blur-sm"
                        />
                      </div>

                      {/* Apellido */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          Apellido <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Tu apellido"
                          value={registerData.user_last_name}
                          onChange={(e) => handleInputChange('user_last_name', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-600/50 hover:border-gray-500/70 focus:border-red-500/50 focus:outline-none rounded-lg text-white placeholder:text-gray-500 transition-all duration-200 backdrop-blur-sm"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          Email <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          placeholder="tu@email.com"
                          value={registerData.user_email}
                          onChange={(e) => handleInputChange('user_email', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-600/50 hover:border-gray-500/70 focus:border-red-500/50 focus:outline-none rounded-lg text-white placeholder:text-gray-500 transition-all duration-200 backdrop-blur-sm"
                        />
                      </div>

                      {/* Teléfono */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          Teléfono <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="tel"
                          placeholder="1123456789"
                          value={registerData.user_phone}
                          onChange={(e) => handleInputChange('user_phone', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-600/50 hover:border-gray-500/70 focus:border-red-500/50 focus:outline-none rounded-lg text-white placeholder:text-gray-500 transition-all duration-200 backdrop-blur-sm"
                        />
                      </div>

                      {/* Contraseña */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          Contraseña <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Mínimo 8 caracteres"
                            value={registerData.user_password}
                            onChange={(e) => handleInputChange('user_password', e.target.value)}
                            className="w-full px-4 py-3 pr-12 bg-gray-800/50 border-2 border-gray-600/50 hover:border-gray-500/70 focus:border-red-500/50 focus:outline-none rounded-lg text-white placeholder:text-gray-500 transition-all duration-200 backdrop-blur-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors duration-200"
                          >
                            {showPassword ? (
                              <HiEyeSlash className="w-5 h-5" />
                            ) : (
                              <HiEye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Confirmar Contraseña */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          Confirmar Contraseña <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Repite tu contraseña"
                            value={registerData.user_password_confirm}
                            onChange={(e) => handleInputChange('user_password_confirm', e.target.value)}
                            className="w-full px-4 py-3 pr-12 bg-gray-800/50 border-2 border-gray-600/50 hover:border-gray-500/70 focus:border-red-500/50 focus:outline-none rounded-lg text-white placeholder:text-gray-500 transition-all duration-200 backdrop-blur-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors duration-200"
                          >
                            {showConfirmPassword ? (
                              <HiEyeSlash className="w-5 h-5" />
                            ) : (
                              <HiEye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

  

                  {/* Información de la Empresa */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        validateStep(2) ? 'bg-red-500' : 'bg-red-900/30'
                      }`}>
                        <span className={`font-bold text-sm ${
                          validateStep(2) ? 'text-white' : 'text-red-400'
                        }`}>2</span>
                      </div>
                      Información de la Inmobiliaria
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Nombre de la Inmobiliaria */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300">
                          Nombre de la Inmobiliaria <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Inmobiliaria San Martín"
                          value={registerData.company_name}
                          onChange={(e) => handleInputChange('company_name', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-600/50 hover:border-gray-500/70 focus:border-red-500/50 focus:outline-none rounded-lg text-white placeholder:text-gray-500 transition-all duration-200 backdrop-blur-sm"
                        />
                      </div>

                      {/* CUIT */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          CUIT <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="20-12345678-9"
                          value={registerData.cuit}
                          onChange={(e) => handleInputChange('cuit', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-600/50 hover:border-gray-500/70 focus:border-red-500/50 focus:outline-none rounded-lg text-white placeholder:text-gray-500 transition-all duration-200 backdrop-blur-sm"
                        />
                      </div>

                      {/* Teléfono de la Empresa */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          Teléfono de la Empresa <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="tel"
                          placeholder="1145678901"
                          value={registerData.company_phone}
                          onChange={(e) => handleInputChange('company_phone', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-600/50 hover:border-gray-500/70 focus:border-red-500/50 focus:outline-none rounded-lg text-white placeholder:text-gray-500 transition-all duration-200 backdrop-blur-sm"
                        />
                      </div>

                      {/* Dirección */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300">
                          Dirección <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Av. San Martín 1234"
                          value={registerData.company_address}
                          onChange={(e) => handleInputChange('company_address', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-600/50 hover:border-gray-500/70 focus:border-red-500/50 focus:outline-none rounded-lg text-white placeholder:text-gray-500 transition-all duration-200 backdrop-blur-sm"
                        />
                      </div>

                      {/* Ciudad */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          Ciudad <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Buenos Aires"
                          value={registerData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-600/50 hover:border-gray-500/70 focus:border-red-500/50 focus:outline-none rounded-lg text-white placeholder:text-gray-500 transition-all duration-200 backdrop-blur-sm"
                        />
                      </div>

                      {/* Provincia */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          Provincia <span className="text-red-400">*</span>
                        </label>
                        <select
                          value={registerData.province}
                          onChange={(e) => handleInputChange('province', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-600/50 hover:border-gray-500/70 focus:border-red-500/50 focus:outline-none rounded-lg text-white transition-all duration-200 backdrop-blur-sm"
                        >
                          <option value="">Selecciona una provincia</option>
                          {provinces.map((province) => (
                            <option key={province} value={province} className="bg-gray-800">
                              {province}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>


                  {/* Configuración del Sitio Web */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        validateStep(3) ? 'bg-red-500' : 'bg-red-900/30'
                      }`}>
                        <span className={`font-bold text-sm ${
                          validateStep(3) ? 'text-white' : 'text-red-400'
                        }`}>3</span>
                      </div>
                      Configuración del Sitio Web
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Subdominio */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          Subdominio <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                            https://
                          </span>
                          <input
                            type="text"
                            placeholder="inmobiliaria"
                            value={registerData.subdomain}
                            onChange={(e) => handleInputChange('subdomain', e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                            className="w-full px-4 py-3 pl-20 pr-32 bg-gray-800/50 border-2 border-gray-600/50 hover:border-gray-500/70 focus:border-red-500/50 focus:outline-none rounded-lg text-white placeholder:text-gray-500 transition-all duration-200 backdrop-blur-sm"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                            .inmosite.com
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Solo letras minúsculas y números, sin espacios ni caracteres especiales
                        </p>
                      </div>

                      {/* Sitio Web Actual */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          Sitio Web Actual
                        </label>
                        <input
                          type="url"
                          placeholder="https://www.tuinmobiliaria.com.ar"
                          value={registerData.website_url}
                          onChange={(e) => handleInputChange('website_url', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-600/50 hover:border-gray-500/70 focus:border-red-500/50 focus:outline-none rounded-lg text-white placeholder:text-gray-500 transition-all duration-200 backdrop-blur-sm"
                        />
                        <p className="text-xs text-gray-500">
                          Opcional - Si ya tienes un sitio web
                        </p>
                      </div>
                    </div>
                  </div>

    

                  {/* Términos y Condiciones */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        validateStep(4) ? 'bg-red-500' : 'bg-red-900/30'
                      }`}>
                        <span className={`font-bold text-sm ${
                          validateStep(4) ? 'text-white' : 'text-red-400'
                        }`}>4</span>
                      </div>
                      Términos y Condiciones
                    </h3>
                    <div className="space-y-4">
                      {/* Términos y Condiciones */}
                      <label className="flex items-start gap-3 cursor-pointer">
                        <div className="relative mt-1">
                          <input
                            type="checkbox"
                            checked={registerData.user_accept_terms}
                            onChange={(e) => handleInputChange('user_accept_terms', e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`w-4 h-4 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                            registerData.user_accept_terms 
                              ? 'bg-red-500 border-red-500' 
                              : 'bg-transparent border-gray-600/50 hover:border-gray-500/70'
                          }`}>
                            {registerData.user_accept_terms && (
                              <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M5 13l4 4L19 7"></path>
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-gray-300 select-none leading-relaxed">
                          Acepto los{' '}
                          <Link href="/terms" className="text-red-400 hover:text-red-300 transition-colors duration-200">
                            Términos y Condiciones
                          </Link>{' '}
                          del servicio <span className="text-red-400">*</span>
                        </span>
                      </label>

                      {/* Política de Privacidad */}
                      <label className="flex items-start gap-3 cursor-pointer">
                        <div className="relative mt-1">
                          <input
                            type="checkbox"
                            checked={registerData.user_accept_privacy}
                            onChange={(e) => handleInputChange('user_accept_privacy', e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`w-4 h-4 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                            registerData.user_accept_privacy 
                              ? 'bg-red-500 border-red-500' 
                              : 'bg-transparent border-gray-600/50 hover:border-gray-500/70'
                          }`}>
                            {registerData.user_accept_privacy && (
                              <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M5 13l4 4L19 7"></path>
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-gray-300 select-none leading-relaxed">
                          Acepto la{' '}
                          <Link href="/privacy" className="text-red-400 hover:text-red-300 transition-colors duration-200">
                            Política de Privacidad
                          </Link>{' '}
                          y el tratamiento de mis datos personales <span className="text-red-400">*</span>
                        </span>
                      </label>

                      {/* Marketing Emails */}
                      <label className="flex items-start gap-3 cursor-pointer">
                        <div className="relative mt-1">
                          <input
                            type="checkbox"
                            checked={registerData.user_marketing_emails}
                            onChange={(e) => handleInputChange('user_marketing_emails', e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`w-4 h-4 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                            registerData.user_marketing_emails 
                              ? 'bg-red-500 border-red-500' 
                              : 'bg-transparent border-gray-600/50 hover:border-gray-500/70'
                          }`}>
                            {registerData.user_marketing_emails && (
                              <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M5 13l4 4L19 7"></path>
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-gray-300 select-none leading-relaxed">
                          Quiero recibir emails con novedades y promociones
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Botones de acción - Personalizados sin HeroUI */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <button
                      onClick={handleRegisterSubmit}
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:from-red-600/50 disabled:to-red-700/50 text-white font-semibold py-4 px-6 shadow-lg hover:shadow-xl hover:shadow-red-500/30 transition-all duration-200 rounded-lg disabled:cursor-not-allowed border border-red-500/30 flex items-center justify-center gap-3"
                    >
                      <span>{isLoading ? 'Creando cuenta...' : 'Crear Cuenta Gratis'}</span>
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <HiArrowRight className="w-5 h-5" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => window.location.href = '/login'}
                      className="flex-1 border-2 border-red-500/60 bg-transparent text-red-400 hover:bg-red-500 hover:text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl hover:shadow-red-500/30 transition-all duration-200"
                    >
                      Ya tengo cuenta
                    </button>
                  </div>
                </div>
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

export default RegisterForm;