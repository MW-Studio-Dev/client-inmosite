'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  HiBuildingOffice,
  HiUser,
  HiPhone,
  HiMapPin,
  HiGlobeAlt,
  HiCheckCircle,
  HiArrowRight,
  HiArrowLeft,
  HiBuildingStorefront,
  HiAcademicCap,
  HiHomeModern,
  HiChartBar,
  HiExclamationTriangle
} from 'react-icons/hi2'
import { useAuth } from '@/providers/AuthProvider'
import { useDashboardTheme } from '@/context/DashboardThemeContext'

interface OnboardingData {
  company_name?: string
  company_type?: string
  cuit?: string
  company_address?: string
  company_phone: string
  city: string
  province: string
  subdomain: string
  website_url?: string
  templateId?: string
}

const COMPANY_TYPES = [
  { value: 'inmobiliaria', label: 'Inmobiliaria', icon: HiBuildingOffice, description: 'Empresa inmobiliaria tradicional' },
  { value: 'agente_independiente', label: 'Agente Independiente', icon: HiUser, description: 'Corredor individual con perfil propio' },
  { value: 'inversor', label: 'Inversor', icon: HiChartBar, description: 'Inversor inmobiliario' },
  { value: 'estudio', label: 'Estudio', icon: HiBuildingStorefront, description: 'Estudio profesional' },
  { value: 'arquitectura', label: 'Arquitectura', icon: HiAcademicCap, description: 'Estudio de arquitectura' },
  { value: 'otro', label: 'Otro', icon: HiHomeModern, description: 'Otro tipo de perfil' }
]

const PROVINCES = [
  'Buenos Aires', 'Capital Federal', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba',
  'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja',
  'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan',
  'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán'
]

export function OnboardingWizard() {
  const router = useRouter()
  const { theme } = useDashboardTheme()
  const isDark = theme === 'dark'
  const { user, updateUser, completeOnboarding } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isHandlingRef = useRef(false)
  const [accountType, setAccountType] = useState(user?.account_type || 'agente_independiente')
  const [formData, setFormData] = useState<OnboardingData>({
    company_name: user?.company?.name || '',
    company_phone: user?.phone || '',
    city: '',
    province: 'Buenos Aires',
    subdomain: '',
    website_url: '',
    templateId: 'classic'
  })
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const isCompanyAccount = ['inmobiliaria', 'estudio', 'arquitectura'].includes(accountType)
  const totalSteps = isCompanyAccount ? 4 : 3

  const validateSubdomain = (subdomain: string) => {
    const clean = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '')
    return clean.length >= 3 && clean.length <= 50 && /^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(clean)
  }

  const validateCUIT = (cuit: string) => {
    const clean = cuit.replace(/[^0-9]/g, '')
    return clean.length === 11
  }

  const validatePhone = (phone: string) => {
    const clean = phone.replace(/[\s-]/g, '')
    return /^(\+54|0)?[1-9]\d{8,10}$/.test(clean)
  }

  const getStepTitle = () => {
    const steps = [
      'Bienvenido a InmoSite',
      'Información de Contacto',
      isCompanyAccount ? 'Datos de la Empresa' : 'Tu Perfil Profesional',
      'Personaliza tu Sitio'
    ]
    return steps[currentStep]
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                ¡Hola, {user?.first_name}! 👋
              </h2>
              <p className="text-gray-600 mb-8">
                Completemos tu perfil para que puedas comenzar a usar InmoSite
              </p>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Tipo de cuenta
              </label>
              <div className="grid gap-3">
                {COMPANY_TYPES.map((type) => {
                  const Icon = type.icon
                  return (
                    <button
                      key={type.value}
                      onClick={() => setAccountType(type.value)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${accountType === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`w-6 h-6 mt-1 ${accountType === type.value ? 'text-blue-600' : 'text-gray-400'
                          }`} />
                        <div>
                          <h3 className="font-semibold text-gray-900">{type.label}</h3>
                          <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Información de Contacto
              </h2>
              <p className="text-gray-600">
                Estos datos serán visibles en tu perfil público
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono de contacto *
                </label>
                <input
                  type="tel"
                  value={formData.company_phone}
                  onChange={(e) => setFormData({ ...formData, company_phone: e.target.value })}
                  placeholder="+54 11 1234-5678"
                  className={`w-full px-4 py-3 rounded-lg border ${formData.company_phone && !validatePhone(formData.company_phone)
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                    } focus:ring-2 focus:border-transparent`}
                />
                {formData.company_phone && !validatePhone(formData.company_phone) && (
                  <p className="mt-2 text-sm text-red-600">
                    Ingresa un teléfono válido (ej: +54 11 1234-5678)
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Provincia *
                  </label>
                  <select
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {PROVINCES.map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Ej: Capital Federal"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        if (isCompanyAccount) {
          return (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Datos de la Empresa
                </h2>
                <p className="text-gray-600">
                  Información oficial de tu empresa
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la empresa *
                  </label>
                  <input
                    type="text"
                    value={formData.company_name || ''}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    placeholder="Inmobiliaria González & Asociados"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CUIT (sin guiones) *
                  </label>
                  <input
                    type="text"
                    value={formData.cuit || ''}
                    onChange={(e) => setFormData({ ...formData, cuit: e.target.value })}
                    placeholder="30123456789"
                    maxLength={11}
                    className={`w-full px-4 py-3 rounded-lg border ${formData.cuit && !validateCUIT(formData.cuit)
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                      } focus:ring-2 focus:border-transparent`}
                  />
                  {formData.cuit && !validateCUIT(formData.cuit) && (
                    <p className="mt-2 text-sm text-red-600">
                      El CUIT debe tener 11 dígitos numéricos
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección de la empresa *
                  </label>
                  <input
                    type="text"
                    value={formData.company_address || ''}
                    onChange={(e) => setFormData({ ...formData, company_address: e.target.value })}
                    placeholder="Av. Corrientes 1234, Piso 2"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )
        } else {
          return (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Tu Perfil Profesional
                </h2>
                <p className="text-gray-600">
                  Personaliza tu presencia online
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <HiUser className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  {user?.full_name}
                </h3>
                <p className="text-blue-700 mb-4">
                  {COMPANY_TYPES.find(t => t.value === accountType)?.label}
                </p>
                <p className="text-sm text-blue-600">
                  Tu perfil profesional será creado automáticamente con tu información
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biografía profesional (opcional)
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe tu experiencia y especialidad..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )
        }

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Personaliza tu Sitio
              </h2>
              <p className="text-gray-600">
                Configura tu presencia online en InmoSite
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Elige una plantilla para tu sitio *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {[
                    { id: 'classic', name: 'Clásico', icon: HiBuildingOffice, desc: 'Diseño clásico y elegante' },
                    { id: 'modern', name: 'Moderno', icon: HiHomeModern, desc: 'Moderno y dinámico' },
                    { id: 'elegant', name: 'Elegante', icon: HiBuildingStorefront, desc: 'Elegante y minimalista' }
                  ].map(template => {
                    const Icon = template.icon;
                    const isSelected = formData.templateId === template.id;
                    return (
                      <button
                        key={template.id}
                        onClick={() => setFormData({ ...formData, templateId: template.id })}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${isSelected
                          ? `border-blue-500 ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'}`
                          : `${isDark ? 'border-gray-700' : 'border-gray-200'} ${isDark ? 'hover:border-gray-500' : 'hover:border-gray-300'}`
                          }`}
                      >
                        <Icon className={`w-8 h-8 mb-2 ${isSelected ? (isDark ? 'text-blue-400' : 'text-blue-600') : (isDark ? 'text-gray-500' : 'text-gray-400')}`} />
                        <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{template.name}</h4>
                        <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{template.desc}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Subdominio para tu sitio *
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={formData.subdomain}
                    onChange={(e) => {
                      const clean = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                      setFormData({ ...formData, subdomain: clean })
                    }}
                    placeholder="mi-negocio"
                    className={`flex-1 px-4 py-3 rounded-l-lg border ${formData.subdomain && !validateSubdomain(formData.subdomain)
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                      } focus:ring-2 focus:border-transparent`}
                  />
                  <span className="px-4 py-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-600">
                    .inmosite.com
                  </span>
                </div>
                {formData.subdomain && !validateSubdomain(formData.subdomain) && (
                  <p className="mt-2 text-sm text-red-600">
                    El subdominio debe tener entre 3 y 50 caracteres, usar solo letras, números y guiones
                  </p>
                )}
                {formData.subdomain && validateSubdomain(formData.subdomain) && (
                  <p className="mt-2 text-sm text-green-600">
                    ✅ Tu sitio será: {formData.subdomain}.inmosite.com
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sitio web existente (opcional)
                </label>
                <input
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  placeholder="https://miweb.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">
                  🎉 ¡Todo listo para comenzar!
                </h4>
                <p className="text-green-700 text-sm">
                  Una vez que completes el onboarding, podrás:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-green-700">
                  <li>• Publicar tus propiedades inmediatamente</li>
                  <li>• Acceder a todas las herramientas del dashboard</li>
                  <li>• Tener tu propio sitio web profesional</li>
                </ul>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleSubmit = async () => {
    if (isHandlingRef.current) return
    isHandlingRef.current = true
    setIsSubmitting(true)

    try {
      const response = await completeOnboarding({
        account_type: accountType,
        ...formData
      })

      if (response.success) {
        showNotification('success', '¡Onboarding completado exitosamente!')

        // Redirigir al dashboard después de un breve delay
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      } else {
        showNotification('error', response.message || 'Error al completar el onboarding')
      }
    } catch (error) {
      console.error('Error en onboarding:', error)
      showNotification('error', 'Error de conexión. Inténtalo nuevamente.')
    } finally {
      setIsSubmitting(false)
      isHandlingRef.current = false
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return true
      case 1:
        return validatePhone(formData.company_phone) && formData.city && formData.province
      case 2:
        if (isCompanyAccount) {
          return !!(formData.company_name && formData.cuit && validateCUIT(formData.cuit) && formData.company_address)
        }
        return true
      case 3:
        return validateSubdomain(formData.subdomain)
      default:
        return false
    }
  }

  const handleNext = () => {
    if (canProceed()) {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        handleSubmit()
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border flex items-center gap-3 animate-pulse ${notification.type === 'success'
          ? 'bg-green-50 border-green-200 text-green-800'
          : 'bg-red-50 border-red-200 text-red-800'
          }`}>
          {notification.type === 'success' ? (
            <HiCheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <HiExclamationTriangle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      <div className="w-full max-w-4xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">
              Paso {currentStep + 1} de {totalSteps}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(((currentStep + 1) / totalSteps) * 100)}% completado
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 text-center">
              {getStepTitle()}
            </h1>
          </div>

          {/* Step content */}
          <div className="mb-8">
            {renderStepContent()}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              <HiArrowLeft className="w-5 h-5" />
              Anterior
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed() || isSubmitting}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${!canProceed() || isSubmitting
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Procesando...
                </>
              ) : currentStep === totalSteps - 1 ? (
                <>
                  <HiCheckCircle className="w-5 h-5" />
                  Completar Onboarding
                </>
              ) : (
                <>
                  Siguiente
                  <HiArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Skip link */}
        {currentStep < totalSteps - 1 && (
          <div className="text-center mt-6">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-500 hover:text-gray-700 text-sm underline"
            >
              Omitir por ahora y continuar al dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
