// app/dashboard/page.tsx - Dashboard principal moderno
'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useDashboardTheme } from '@/context/DashboardThemeContext'
import Image from 'next/image'
import Link from 'next/link'
import {
  HiHome,
  HiChartBar,
  HiGlobe,
  HiCreditCard,
  HiExclamationCircle,
  HiCheckCircle,
  HiClock,
  HiEye,
  HiSparkles,
  HiTrendingUp,
  HiUsers,
  HiArrowRight,
  HiColorSwatch,
  HiOfficeBuilding,
  HiCog,
  HiStar,
  HiUser,
  HiLightningBolt,
  HiDocumentText,
} from 'react-icons/hi'
export default function AdminDashboard() {
  const { user, company } = useAuth()
  const { theme } = useDashboardTheme()
  const isDark = theme === 'dark'
  const [showTrialBanner, setShowTrialBanner] = useState(true)

  // Calcular días restantes del trial
  const getTrialDaysLeft = () => {
    if (!company?.trial_end_date) return 0
    try {
      const endDate = new Date(company.trial_end_date)
      const today = new Date()

      // Verificar si la fecha es válida
      if (isNaN(endDate.getTime())) return 0

      const diffTime = endDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return Math.max(0, diffDays)
    } catch (error) {
      console.error('Error calculating trial days left:', error)
      return 0
    }
  }

  const trialDaysLeft = getTrialDaysLeft()
  const isTrialExpiringSoon = trialDaysLeft <= 7 && company?.subscription_plan === 'trial'

  return (

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="space-y-4 sm:space-y-6">
        {/* Alerta de plan/trial */}
        {company?.subscription_plan === 'trial' && showTrialBanner && (
          <div className={`rounded-lg p-3 sm:p-4 border relative ${isDark
            ? 'bg-gray-800/50 border-gray-700'
            : 'bg-gray-100 border-gray-300'
            }`}>
            <button
              onClick={() => setShowTrialBanner(false)}
              className={`absolute top-2 right-2 p-1 rounded-full transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
              aria-label="Cerrar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pr-8">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isTrialExpiringSoon
                  ? 'bg-red-100 text-red-600'
                  : 'bg-blue-100 text-blue-600'
                  }`}>
                  {isTrialExpiringSoon ? (
                    <HiExclamationCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <HiClock className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </div>
                <div>
                  <h3 className={`text-sm sm:text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                    {isTrialExpiringSoon
                      ? '¡Tu período de prueba está por expirar!'
                      : 'Estás en período de prueba'
                    }
                  </h3>
                  <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                    Te quedan <strong>{trialDaysLeft} días</strong>. Actualiza tu plan para continuar usando todas las funciones.
                  </p>
                </div>
              </div>
              <Link
                href="/admin/suscripcion"
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm whitespace-nowrap ${isDark
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
              >
                Ver Planes
                <HiArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Header simple y limpio - Responsive */}
        <div className={`rounded-xl p-4 sm:p-6 shadow-sm border ${isDark
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
          }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              {/* Logo de la empresa o placeholder - Responsive */}
              <div className="relative group flex-shrink-0">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl flex items-center justify-center overflow-hidden border-2 shadow-lg hover:shadow-xl transition-all duration-300 ${isDark
                  ? 'bg-gradient-to-br from-gray-700 to-gray-600 border-gray-500'
                  : 'bg-gradient-to-br from-white to-gray-50 border-gray-300'
                  }`}>
                  {company?.logo ? (
                    <Image
                      src={company.logo}
                      alt={`${company?.name} logo`}
                      fill
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-center p-2">
                      <HiOfficeBuilding className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto ${isDark ? 'text-blue-400' : 'text-blue-600'
                        }`} />
                      <p className={`text-xs mt-1 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>Logo</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    // Aquí iría la lógica para cargar logo
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = 'image/*'
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0]
                      if (file) {
                        console.log('Subir logo:', file.name)
                        // Lógica para subir el logo
                      }
                    }
                    input.click()
                  }}
                  className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  +
                </button>
              </div>

              <div className="min-w-0 flex-1">
                <h1 className={`text-lg sm:text-2xl font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                  {company?.name || 'Panel Principal'}
                </h1>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  ¡Hola, {user?.first_name}! 👋
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
              {/* Estado del plan - Responsive */}
              <div className="text-right">
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>Plan actual</p>
                <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                  {getPlanDisplayName(company?.subscription_plan)}
                </p>
              </div>

              {/* Estado del sitio - Responsive */}
              <div className="text-right">
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>Sitio web</p>
                <p className={`text-sm font-semibold ${isDark ? 'text-green-400' : 'text-green-600'
                  }`}>
                  Activo
                </p>
              </div>

              {/* Avatar del usuario - Responsive */}
              <div className="relative flex-shrink-0">
                {user?.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.full_name || 'Usuario'}
                    width={40}
                    height={40}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 ${isDark ? 'border-gray-600' : 'border-gray-300'
                      }`}
                  />
                ) : (
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                    <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                      {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                    </span>
                  </div>
                )}
                <div className={`absolute -bottom-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 ${isDark ? 'border-gray-800' : 'border-white'
                  }`}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones Rápidas - Modern Grid */}
        <div className={`rounded-2xl p-6 shadow-lg border backdrop-blur-sm ${isDark
          ? 'bg-gray-800/90 border-gray-700'
          : 'bg-white/90 border-gray-200'
          }`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'
                }`}>
                Acciones Rápidas
              </h2>
              <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                Gestiona tu negocio de forma eficiente
              </p>
            </div>
            <div className={`p-3 rounded-xl ${isDark
              ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
              : 'bg-gradient-to-br from-indigo-500 to-purple-500'
              } text-white shadow-lg`}>
              <HiSparkles className="w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/dashboard/properties/new"
              className={`group relative overflow-hidden rounded-xl p-5 border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${isDark
                ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700/70'
                : 'bg-gradient-to-br from-red-50 to-pink-50 border-red-200 hover:from-red-100 hover:to-pink-100'
                }`}
            >
              <div className="relative z-10">
                <div className={`inline-flex p-3 rounded-lg mb-4 ${isDark
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-red-100 text-red-600'
                  } group-hover:scale-110 transition-transform duration-300`}>
                  <HiHome className="h-5 w-5" />
                </div>
                <h3 className={`font-semibold text-base mb-1 ${isDark ? 'text-white' : 'text-gray-900'
                  } group-hover:text-red-600 transition-colors`}>
                  Nueva Propiedad
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  Agregar al catálogo
                </p>
              </div>
              <div className="absolute -bottom-2 -right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <HiHome className="w-16 h-16 text-current" />
              </div>
            </Link>

            <Link
              href="/dashboard/clients/new"
              className={`group relative overflow-hidden rounded-xl p-5 border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${isDark
                ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700/70'
                : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 hover:from-blue-100 hover:to-cyan-100'
                }`}
            >
              <div className="relative z-10">
                <div className={`inline-flex p-3 rounded-lg mb-4 ${isDark
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-blue-100 text-blue-600'
                  } group-hover:scale-110 transition-transform duration-300`}>
                  <HiUsers className="h-5 w-5" />
                </div>
                <h3 className={`font-semibold text-base mb-1 ${isDark ? 'text-white' : 'text-gray-900'
                  } group-hover:text-blue-600 transition-colors`}>
                  Nuevo Cliente
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  Registrar cliente
                </p>
              </div>
              <div className="absolute -bottom-2 -right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <HiUsers className="w-16 h-16 text-current" />
              </div>
            </Link>

            <Link
              href="/dashboard/website"
              className={`group relative overflow-hidden rounded-xl p-5 border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${isDark
                ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700/70'
                : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:from-purple-100 hover:to-pink-100'
                }`}
            >
              <div className="relative z-10">
                <div className={`inline-flex p-3 rounded-lg mb-4 ${isDark
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'bg-purple-100 text-purple-600'
                  } group-hover:scale-110 transition-transform duration-300`}>
                  <HiColorSwatch className="h-5 w-5" />
                </div>
                <h3 className={`font-semibold text-base mb-1 ${isDark ? 'text-white' : 'text-gray-900'
                  } group-hover:text-purple-600 transition-colors`}>
                  Sitio Web
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  Personalizar diseño
                </p>
              </div>
              <div className="absolute -bottom-2 -right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <HiColorSwatch className="w-16 h-16 text-current" />
              </div>
            </Link>

            <Link
              href="/dashboard/analytics"
              className={`group relative overflow-hidden rounded-xl p-5 border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${isDark
                ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700/70'
                : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:from-green-100 hover:to-emerald-100'
                }`}
            >
              <div className="relative z-10">
                <div className={`inline-flex p-3 rounded-lg mb-4 ${isDark
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-green-100 text-green-600'
                  } group-hover:scale-110 transition-transform duration-300`}>
                  <HiChartBar className="h-5 w-5" />
                </div>
                <h3 className={`font-semibold text-base mb-1 ${isDark ? 'text-white' : 'text-gray-900'
                  } group-hover:text-green-600 transition-colors`}>
                  Analytics
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  Ver estadísticas
                </p>
              </div>
              <div className="absolute -bottom-2 -right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <HiChartBar className="w-16 h-16 text-current" />
              </div>
            </Link>

            <Link
              href="/subscription"
              className={`group relative overflow-hidden rounded-xl p-5 border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${isDark
                ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700/70'
                : 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200 hover:from-yellow-100 hover:to-amber-100'
                }`}
            >
              <div className="relative z-10">
                <div className={`inline-flex p-3 rounded-lg mb-4 ${isDark
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-yellow-100 text-yellow-600'
                  } group-hover:scale-110 transition-transform duration-300`}>
                  <HiCreditCard className="h-5 w-5" />
                </div>
                <h3 className={`font-semibold text-base mb-1 ${isDark ? 'text-white' : 'text-gray-900'
                  } group-hover:text-yellow-600 transition-colors`}>
                  Suscripción
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  Gestionar plan
                </p>
              </div>
              <div className="absolute -bottom-2 -right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <HiCreditCard className="w-16 h-16 text-current" />
              </div>
            </Link>

            <Link
              href="/dashboard/settings"
              className={`group relative overflow-hidden rounded-xl p-5 border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${isDark
                ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700/70'
                : 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-300 hover:from-gray-100 hover:to-slate-100'
                }`}
            >
              <div className="relative z-10">
                <div className={`inline-flex p-3 rounded-lg mb-4 ${isDark
                  ? 'bg-gray-600/50 text-gray-400'
                  : 'bg-gray-200 text-gray-700'
                  } group-hover:scale-110 transition-transform duration-300`}>
                  <HiCog className="h-5 w-5" />
                </div>
                <h3 className={`font-semibold text-base mb-1 ${isDark ? 'text-white' : 'text-gray-900'
                  } group-hover:text-gray-600 transition-colors`}>
                  Configuración
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  Ajustes generales
                </p>
              </div>
              <div className="absolute -bottom-2 -right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <HiCog className="w-16 h-16 text-current" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>

  )
}

// Función auxiliar para mostrar el nombre del plan
function getPlanDisplayName(plan?: string) {
  const planNames: Record<string, string> = {
    trial: 'Prueba Gratuita',
    basic: 'Plan Básico',
    premium: 'Plan Premium',
    enterprise: 'Plan Enterprise'
  }
  return planNames[plan || ''] || 'Sin plan'
}

