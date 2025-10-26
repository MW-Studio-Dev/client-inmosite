// app/dashboard/page.tsx - Dashboard principal moderno
'use client'

import { useAuth } from '@/hooks/useAuth'
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
} from 'react-icons/hi'
import { HiComputerDesktop } from 'react-icons/hi2'

export default function AdminDashboard() {
  const { user, company } = useAuth()

  // Calcular días restantes del trial
  const getTrialDaysLeft = () => {
    if (!company?.trial_end_date) return 0
    const endDate = new Date(company.trial_end_date)
    const today = new Date()
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  const trialDaysLeft = getTrialDaysLeft()
  const isTrialExpiringSoon = trialDaysLeft <= 7 && company?.subscription_plan === 'trial'

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Header personalizado con diseño moderno */}
          <div className="relative overflow-hidden bg-red-600 rounded-3xl p-8 text-white shadow-2xl">
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <HiSparkles className="h-8 w-8 text-red-200 animate-pulse" />
                  <h2 className="text-4xl font-black text-white">
                    ¡Hola, {user?.first_name}!
                  </h2>
                </div>
                <p className="text-xl text-white/90 font-medium mb-6">
                  Bienvenido al panel de <span className="font-bold">{company?.name}</span>
                </p>
                
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                    <HiGlobe className="h-5 w-5" />
                    <span className="font-medium">{company?.website_url_full}</span>
                  </div>
                  {company?.custom_domain && (
                    <div className="flex items-center gap-3 bg-red-400/20 backdrop-blur-sm rounded-full px-4 py-2 border border-red-300/30">
                      <HiCheckCircle className="h-5 w-5 text-red-200" />
                      <span className="font-medium">Dominio personalizado</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 bg-red-700/20 backdrop-blur-sm rounded-full px-4 py-2 border border-red-500/30">
                    <HiUsers className="h-5 w-5 text-red-200" />
                    <span className="font-medium">Plan {getPlanDisplayName(company?.subscription_plan)}</span>
                  </div>
                </div>
              </div>
              
              {/* Avatar del usuario con diseño mejorado */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  {user?.avatar ? (
                    <Image 
                      src={user.avatar} 
                      alt={user.full_name}
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-2xl border-4 border-white/30 shadow-xl"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center border-4 border-white/30 shadow-xl backdrop-blur-sm">
                      <span className="text-2xl font-bold">
                        {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                      </span>
                    </div>
                  )}
                  {/* Status indicator */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-400 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <span className="text-sm font-semibold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30 flex items-center gap-2">
                    {company?.is_company_owner ? (
                      <>
                        <HiStar className="h-4 w-4" />
                        Propietario
                      </>
                    ) : (
                      <>
                        <HiUser className="h-4 w-4" />
                        Usuario
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Alerta de plan/trial mejorada */}
          {company?.subscription_plan === 'trial' && (
            <div className={`relative overflow-hidden rounded-2xl border-2 backdrop-blur-sm ${
              isTrialExpiringSoon 
                ? 'bg-red-100 border-red-300 shadow-red-200' 
                : 'bg-red-50 border-red-200 shadow-red-100'
            } shadow-xl`}>
              <div className="absolute inset-0 bg-white/60"></div>
              <div className="relative z-10 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${
                      isTrialExpiringSoon ? 'bg-red-600' : 'bg-red-500'
                    } text-white shadow-lg`}>
                      {isTrialExpiringSoon ? (
                        <HiExclamationCircle className="h-6 w-6" />
                      ) : (
                        <HiClock className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        {isTrialExpiringSoon ? (
                          <HiExclamationCircle className="h-5 w-5 text-red-600" />
                        ) : (
                          <HiLightningBolt className="h-5 w-5 text-red-600" />
                        )}
                        <h3 className="text-xl font-bold text-gray-900">
                          {isTrialExpiringSoon 
                            ? '¡Tu período de prueba está por expirar!' 
                            : 'Estás en período de prueba'
                          }
                        </h3>
                      </div>
                      <p className="text-gray-700 mt-1">
                        Te quedan <strong>{trialDaysLeft} días</strong>. Actualiza tu plan para continuar usando todas las funciones.
                      </p>
                    </div>
                  </div>
                  <Link 
                    href="/admin/suscripcion"
                    className="group bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
                  >
                    Ver Planes
                    <HiArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Stats con diseño más moderno */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatCard
              title="Propiedades Activas"
              value={company?.properties_count?.toString() || '0'}
              subtitle={`Límite: ${company?.property_limit || 0}`}
              icon={<HiHome className="h-7 w-7" />}
              color="red"
              progress={company?.properties_count && company?.property_limit ? 
                (company.properties_count / company.property_limit) * 100 : 0}
            />
            
            <StatCard
              title="Plan Actual"
              value={getPlanDisplayName(company?.subscription_plan)}
              subtitle={company?.subscription_active ? 'Activo' : 'Inactivo'}
              icon={<HiCreditCard className="h-7 w-7" />}
              color={company?.subscription_active ? 'red' : 'red'}
              variant={company?.subscription_active ? 'active' : 'inactive'}
            />
            
            <StatCard
              title="Estado del Sitio"
              value="Público"
              subtitle={`${company?.subdomain}.${process.env.NEXT_PUBLIC_BASE_DOMAIN}`}
              icon={<HiComputerDesktop className="h-7 w-7" />}
              color="red"
              action={
                <button 
                  onClick={() => window.open(`${company?.subdomain}.${process.env.NEXT_PUBLIC_BASE_DOMAIN}`, '_blank')}
                  className="group text-sm text-red-600 hover:text-red-800 flex items-center gap-2 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-all duration-300"
                >
                  <HiEye className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  Ver sitio
                </button>
              }
            />
            
            <StatCard
              title="Últimas Visitas"
              value="1,234"
              subtitle="Este mes (+12%)"
              icon={<HiTrendingUp className="h-7 w-7" />}
              color="red"
            />
          </div>

          {/* Quick Actions con diseño premium */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-red-200/50 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-red-600 rounded-xl">
                <HiSparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Acciones Rápidas
              </h3>
              <div className="flex-1 h-px bg-red-200 ml-4"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <QuickActionCard
                href="/admin/propiedades/nueva"
                title="Agregar Propiedad"
                description="Publicar una nueva propiedad"
                icon={<HiHome className="h-8 w-8" />}
                disabled={!company?.can_add_properties}
                disabledMessage={!company?.can_add_properties ? 'Límite alcanzado' : undefined}
              />
              
              <QuickActionCard
                href="/admin/sitio-web"
                title="Personalizar Sitio"
                description="Configurar tu página web"
                icon={<HiColorSwatch className="h-8 w-8" />}
              />
              
              <QuickActionCard
                href="/admin/seguimiento"
                title="Ver Analytics"
                description="Revisar métricas y leads"
                icon={<HiChartBar className="h-8 w-8" />}
              />
              
              <QuickActionCard
                href="/admin/suscripcion"
                title="Gestionar Plan"
                description="Ver y actualizar suscripción"
                icon={<HiCreditCard className="h-8 w-8" />}
                highlight={company?.subscription_plan === 'trial'}
              />
              
              <QuickActionCard
                href="/admin/inmobiliaria"
                title="Configurar Empresa"
                description="Datos y configuración"
                icon={<HiOfficeBuilding className="h-8 w-8" />}
              />
              
              <QuickActionCard
                href="/admin/configuracion"
                title="Ajustes"
                description="Configuración general"
                icon={<HiCog className="h-8 w-8" />}
              />
            </div>
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

// Componente ProfileItem para mejor organización
function ProfileItem({ 
  label, 
  value, 
  className = "" 
}: { 
  label: string
  value?: string
  className?: string 
}) {
  return (
    <div className="flex justify-between items-center p-4 bg-red-50/80 rounded-xl border border-red-100">
      <span className="text-gray-600 font-medium">{label}:</span>
      <span className={`text-gray-900 font-semibold ${className}`}>{value}</span>
    </div>
  )
}

// Componente de tarjeta de estadística completamente rediseñado
function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = 'red',
  variant = 'normal',
  progress,
  action 
}: {
  title: string
  value: string
  subtitle?: string
  icon: React.ReactNode
  color?: string
  variant?: 'normal' | 'active' | 'inactive'
  progress?: number
  action?: React.ReactNode
}) {
  const getVariantColors = () => {
    switch (variant) {
      case 'active':
        return 'bg-red-500 text-white'
      case 'inactive':
        return 'bg-red-300 text-white'
      default:
        return 'bg-red-500 text-white'
    }
  }

  return (
    <div className="group relative overflow-hidden bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-red-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105">
      {/* Background */}
      <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-all duration-300"></div>
      
      {/* Decorative circle */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-500/10 rounded-full blur-xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-2xl ${getVariantColors()} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          {action && (
            <div className="mt-1">
              {action}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-semibold text-red-600 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-black text-gray-900">{value}</p>
          
          {subtitle && (
            <p className="text-sm text-gray-500 font-medium">{subtitle}</p>
          )}
          
          {progress !== undefined && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-gray-600">
                <span>Uso actual</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-red-100 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    progress > 90 
                      ? 'bg-red-700' 
                      : progress > 70 
                        ? 'bg-red-600' 
                        : 'bg-red-500'
                  }`}
                  style={{ 
                    width: `${Math.min(progress, 100)}%`,
                    transform: 'translateX(0)',
                    animation: 'slideIn 1s ease-out'
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Componente de acción rápida completamente rediseñado
function QuickActionCard({ 
  href, 
  title, 
  description, 
  icon, 
  disabled = false,
  disabledMessage,
  highlight = false
}: {
  href: string
  title: string
  description: string
  icon: React.ReactNode
  disabled?: boolean
  disabledMessage?: string
  highlight?: boolean
}) {
  const CardContent = () => (
    <div className={`
      group relative overflow-hidden rounded-2xl border-2 transition-all duration-500
      ${disabled 
        ? 'bg-gray-100/80 border-gray-200 cursor-not-allowed opacity-60' 
        : highlight 
          ? 'bg-red-600 text-white border-red-500 hover:scale-105 shadow-2xl hover:shadow-red-500/25' 
          : 'bg-white/80 backdrop-blur-xl border-red-200/50 hover:border-red-300 hover:shadow-xl hover:scale-105'
      }
    `}>
      {/* Background para estados normales */}
      {!disabled && !highlight && (
        <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-all duration-300"></div>
      )}
      
      {/* Decorative background element */}
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 blur-2xl transition-all duration-500 group-hover:scale-150 ${
        highlight ? 'bg-white' : 'bg-red-500'
      }`}></div>
      
      <div className="relative z-10 p-6">
        <div className="flex items-start gap-4">
          <div className={`
            p-4 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3
            ${highlight 
              ? 'bg-white/20 backdrop-blur-sm border border-white/30 text-white' 
              : disabled 
                ? 'bg-gray-200 text-gray-500' 
                : 'bg-red-500 text-white shadow-lg'
            }
          `}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`font-bold text-lg mb-2 ${
              highlight ? 'text-white' : disabled ? 'text-gray-500' : 'text-gray-900'
            }`}>
              {title}
            </h4>
            <p className={`text-sm leading-relaxed ${
              highlight ? 'text-white/90' : disabled ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {description}
            </p>
            {disabledMessage && (
              <div className="flex items-center gap-2 text-xs text-red-700 mt-3 font-semibold bg-red-50 px-2 py-1 rounded-lg">
                <HiExclamationCircle className="h-3 w-3" />
                {disabledMessage}
              </div>
            )}
          </div>
          {!disabled && (
            <HiArrowRight className={`h-5 w-5 transition-all duration-300 group-hover:translate-x-1 ${
              highlight ? 'text-white' : 'text-red-400 group-hover:text-red-600'
            }`} />
          )}
        </div>
      </div>
      
      {highlight && (
        <div className="absolute -top-2 -right-2 z-20">
          <div className="bg-white text-red-600 text-xs font-black px-3 py-1 rounded-full shadow-xl border-2 border-red-100 animate-pulse flex items-center gap-1">
            <HiExclamationCircle className="h-3 w-3" />
            ¡Urgente!
          </div>
        </div>
      )}
    </div>
  )

  if (disabled) {
    return <CardContent />
  }

  return (
    <Link href={href} className="block">
      <CardContent />
    </Link>
  )
}