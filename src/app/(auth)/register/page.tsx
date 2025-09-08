"use client";

import React, { useState } from 'react';
import { 
  Button, 
  Card, 
  CardBody, 

  Divider,
  Link
} from "@heroui/react";
import {
  HiArrowRight,
  HiHome,
  HiEye,
  HiEyeSlash,
  HiCheckCircle,
  HiXCircle,
  HiSparkles
} from "react-icons/hi2";
import { useAuth } from '@/hooks';

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
        setStatusMessage(result.message || 'Registro exitoso. Revisa tu email para verificar tu cuenta.');
        
        // Redireccionar a página de verificación después de 3 segundos
        setTimeout(() => {
          window.location.href = '/verify-email';
        }, 3000);
        
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
        <div className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Header del formulario */}
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <HiSparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Crear <span className="text-purple-400">Cuenta</span>
              </h1>
              <p className="text-slate-400 text-base">
                Completa tus datos para empezar con tu <span className="text-purple-400 font-medium">prueba gratuita</span>
              </p>
            </div>

            <Card className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/30 shadow-2xl">
              <CardBody className="p-8">
                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-slate-300">
                      Progreso del registro
                    </span>
                    <span className="text-sm font-medium text-purple-400">
                      {Math.round(getProgressPercentage())}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-purple-500 h-2 rounded-full transition-all duration-300"
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
                        validateStep(1) ? 'bg-purple-500' : 'bg-purple-900/30'
                      }`}>
                        <span className={`font-bold text-sm ${
                          validateStep(1) ? 'text-white' : 'text-purple-400'
                        }`}>1</span>
                      </div>
                      Información Personal
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Nombre */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">
                          Nombre <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Tu nombre"
                          value={registerData.user_first_name}
                          onChange={(e) => handleInputChange('user_first_name', e.target.value)}
                          className="w-full px-4 py-3 bg-slate-800/50 border-2 border-slate-600 hover:border-slate-500 focus:border-purple-500 focus:outline-none rounded-lg text-white placeholder:text-slate-500 transition-all duration-200"
                        />
                      </div>

                      {/* Apellido */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">
                          Apellido <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Tu apellido"
                          value={registerData.user_last_name}
                          onChange={(e) => handleInputChange('user_last_name', e.target.value)}
                          className="w-full px-4 py-3 bg-slate-800/50 border-2 border-slate-600 hover:border-slate-500 focus:border-purple-500 focus:outline-none rounded-lg text-white placeholder:text-slate-500 transition-all duration-200"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">
                          Email <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          placeholder="tu@email.com"
                          value={registerData.user_email}
                          onChange={(e) => handleInputChange('user_email', e.target.value)}
                          className="w-full px-4 py-3 bg-slate-800/50 border-2 border-slate-600 hover:border-slate-500 focus:border-purple-500 focus:outline-none rounded-lg text-white placeholder:text-slate-500 transition-all duration-200"
                        />
                      </div>

                      {/* Teléfono */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">
                          Teléfono <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="tel"
                          placeholder="1123456789"
                          value={registerData.user_phone}
                          onChange={(e) => handleInputChange('user_phone', e.target.value)}
                          className="w-full px-4 py-3 bg-slate-800/50 border-2 border-slate-600 hover:border-slate-500 focus:border-purple-500 focus:outline-none rounded-lg text-white placeholder:text-slate-500 transition-all duration-200"
                        />
                      </div>

                      {/* Contraseña */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">
                          Contraseña <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Mínimo 8 caracteres"
                            value={registerData.user_password}
                            onChange={(e) => handleInputChange('user_password', e.target.value)}
                            className="w-full px-4 py-3 pr-12 bg-slate-800/50 border-2 border-slate-600 hover:border-slate-500 focus:border-purple-500 focus:outline-none rounded-lg text-white placeholder:text-slate-500 transition-all duration-200"
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
                        </div>
                      </div>

                      {/* Confirmar Contraseña */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">
                          Confirmar Contraseña <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Repite tu contraseña"
                            value={registerData.user_password_confirm}
                            onChange={(e) => handleInputChange('user_password_confirm', e.target.value)}
                            className="w-full px-4 py-3 pr-12 bg-slate-800/50 border-2 border-slate-600 hover:border-slate-500 focus:border-purple-500 focus:outline-none rounded-lg text-white placeholder:text-slate-500 transition-all duration-200"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors duration-200"
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

                  <Divider className="bg-slate-700/50" />

                  {/* Información de la Empresa */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        validateStep(2) ? 'bg-purple-500' : 'bg-purple-900/30'
                      }`}>
                        <span className={`font-bold text-sm ${
                          validateStep(2) ? 'text-white' : 'text-purple-400'
                        }`}>2</span>
                      </div>
                      Información de la Inmobiliaria
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Nombre de la Inmobiliaria */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="block text-sm font-medium text-slate-300">
                          Nombre de la Inmobiliaria <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Inmobiliaria San Martín"
                          value={registerData.company_name}
                          onChange={(e) => handleInputChange('company_name', e.target.value)}
                          className="w-full px-4 py-3 bg-slate-800/50 border-2 border-slate-600 hover:border-slate-500 focus:border-purple-500 focus:outline-none rounded-lg text-white placeholder:text-slate-500 transition-all duration-200"
                        />
                      </div>

                      {/* CUIT */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">
                          CUIT <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="20-12345678-9"
                          value={registerData.cuit}
                          onChange={(e) => handleInputChange('cuit', e.target.value)}
                          className="w-full px-4 py-3 bg-slate-800/50 border-2 border-slate-600 hover:border-slate-500 focus:border-purple-500 focus:outline-none rounded-lg text-white placeholder:text-slate-500 transition-all duration-200"
                        />
                      </div>

                      {/* Teléfono de la Empresa */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">
                          Teléfono de la Empresa <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="tel"
                          placeholder="1145678901"
                          value={registerData.company_phone}
                          onChange={(e) => handleInputChange('company_phone', e.target.value)}
                          className="w-full px-4 py-3 bg-slate-800/50 border-2 border-slate-600 hover:border-slate-500 focus:border-purple-500 focus:outline-none rounded-lg text-white placeholder:text-slate-500 transition-all duration-200"
                        />
                      </div>

                      {/* Dirección */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="block text-sm font-medium text-slate-300">
                          Dirección <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Av. San Martín 1234"
                          value={registerData.company_address}
                          onChange={(e) => handleInputChange('company_address', e.target.value)}
                          className="w-full px-4 py-3 bg-slate-800/50 border-2 border-slate-600 hover:border-slate-500 focus:border-purple-500 focus:outline-none rounded-lg text-white placeholder:text-slate-500 transition-all duration-200"
                        />
                      </div>

                      {/* Ciudad */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">
                          Ciudad <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Buenos Aires"
                          value={registerData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="w-full px-4 py-3 bg-slate-800/50 border-2 border-slate-600 hover:border-slate-500 focus:border-purple-500 focus:outline-none rounded-lg text-white placeholder:text-slate-500 transition-all duration-200"
                        />
                      </div>

                      {/* Provincia */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">
                          Provincia <span className="text-red-400">*</span>
                        </label>
                        <select
                          value={registerData.province}
                          onChange={(e) => handleInputChange('province', e.target.value)}
                          className="w-full px-4 py-3 bg-slate-800/50 border-2 border-slate-600 hover:border-slate-500 focus:border-purple-500 focus:outline-none rounded-lg text-white transition-all duration-200"
                        >
                          <option value="">Selecciona una provincia</option>
                          {provinces.map((province) => (
                            <option key={province} value={province} className="bg-slate-800">
                              {province}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <Divider className="bg-slate-700/50" />

                  {/* Configuración del Sitio Web */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        validateStep(3) ? 'bg-purple-500' : 'bg-purple-900/30'
                      }`}>
                        <span className={`font-bold text-sm ${
                          validateStep(3) ? 'text-white' : 'text-purple-400'
                        }`}>3</span>
                      </div>
                      Configuración del Sitio Web
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Subdominio */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">
                          Subdominio <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                            https://
                          </span>
                          <input
                            type="text"
                            placeholder="inmosanmartin"
                            value={registerData.subdomain}
                            onChange={(e) => handleInputChange('subdomain', e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                            className="w-full px-4 py-3 pl-20 pr-32 bg-slate-800/50 border-2 border-slate-600 hover:border-slate-500 focus:border-purple-500 focus:outline-none rounded-lg text-white placeholder:text-slate-500 transition-all duration-200"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                            .tuapp.com
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Solo letras minúsculas y números, sin espacios ni caracteres especiales
                        </p>
                      </div>

                      {/* Sitio Web Actual */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">
                          Sitio Web Actual
                        </label>
                        <input
                          type="url"
                          placeholder="https://www.tuinmobiliaria.com.ar"
                          value={registerData.website_url}
                          onChange={(e) => handleInputChange('website_url', e.target.value)}
                          className="w-full px-4 py-3 bg-slate-800/50 border-2 border-slate-600 hover:border-slate-500 focus:border-purple-500 focus:outline-none rounded-lg text-white placeholder:text-slate-500 transition-all duration-200"
                        />
                        <p className="text-xs text-slate-500">
                          Opcional - Si ya tienes un sitio web
                        </p>
                      </div>
                    </div>
                  </div>

                  <Divider className="bg-slate-700/50" />

                  {/* Términos y Condiciones */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        validateStep(4) ? 'bg-purple-500' : 'bg-purple-900/30'
                      }`}>
                        <span className={`font-bold text-sm ${
                          validateStep(4) ? 'text-white' : 'text-purple-400'
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
                              ? 'bg-purple-500 border-purple-500' 
                              : 'bg-transparent border-slate-600 hover:border-slate-500'
                          }`}>
                            {registerData.user_accept_terms && (
                              <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M5 13l4 4L19 7"></path>
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-slate-300 select-none leading-relaxed">
                          Acepto los{' '}
                          <Link href="/terms" className="text-purple-400 hover:text-purple-300 transition-colors duration-200">
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
                              ? 'bg-purple-500 border-purple-500' 
                              : 'bg-transparent border-slate-600 hover:border-slate-500'
                          }`}>
                            {registerData.user_accept_privacy && (
                              <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M5 13l4 4L19 7"></path>
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-slate-300 select-none leading-relaxed">
                          Acepto la{' '}
                          <Link href="/privacy" className="text-purple-400 hover:text-purple-300 transition-colors duration-200">
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
                              ? 'bg-purple-500 border-purple-500' 
                              : 'bg-transparent border-slate-600 hover:border-slate-500'
                          }`}>
                            {registerData.user_marketing_emails && (
                              <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M5 13l4 4L19 7"></path>
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-slate-300 select-none leading-relaxed">
                          Quiero recibir emails con novedades, tips y ofertas especiales
                        </span>
                      </label>
                    </div>

                    {/* Benefits Box */}
                    <div className="mt-8 p-6 bg-purple-950/30 border border-purple-800/20 rounded-lg">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center">
                          <HiSparkles className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-purple-300 mb-2">
                            🎉 ¡Tu prueba gratuita incluye!
                          </h4>
                          <ul className="space-y-1 text-purple-400 text-sm">
                            <li>✅ 14 días completamente gratis</li>
                            <li>✅ Hasta 10 propiedades</li>
                            <li>✅ Sitio web personalizado</li>
                            <li>✅ Soporte por email</li>
                            <li>✅ Sin tarjeta de crédito requerida</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <Button 
                      size="lg" 
                      onClick={handleRegisterSubmit}
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold py-6 shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      endContent={isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <HiArrowRight className="w-5 h-5" />
                      )}
                    >
                      {isLoading ? 'Creando cuenta...' : '🚀 Crear Cuenta Gratis'}
                    </Button>
                    
                    <Button 
                      size="lg"
                      onClick={() => window.location.href = '/login'}
                      className="flex-1 border-2 border-purple-500 bg-transparent text-purple-400 hover:bg-purple-500 hover:text-white font-semibold py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Ya tengo cuenta
                    </Button>
                  </div>

                  <div className="text-center pt-4">
                    <p className="text-slate-500 text-sm">
                      Al registrarte, tu sitio estará disponible en:{' '}
                      <span className="font-medium text-purple-400">
                        https://{registerData.subdomain || 'tusubdominio'}.tuapp.com
                      </span>
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
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
                © 2025 InmoSite by MW Studio Digital. <span className="text-purple-400">Argentina</span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default RegisterForm;