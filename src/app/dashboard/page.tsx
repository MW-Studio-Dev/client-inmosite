// app/dashboard/page.tsx - Dashboard principal
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
  HiPlus
} from 'react-icons/hi'

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
    <div className="space-y-8">
      {/* Header personalizado */}
      <div className="bg-gradient-primary rounded-custom-xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold">
              ¡Hola, {user?.first_name}! 👋
            </h2>
            <p className="mt-2 text-lg text-white/90">
              Bienvenido al panel de {company?.name}
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <HiGlobe className="h-4 w-4" />
                <span>{company?.website_url_full}</span>
              </div>
              {company?.custom_domain && (
                <div className="flex items-center gap-2">
                  <HiCheckCircle className="h-4 w-4" />
                  <span>Dominio personalizado activo</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Avatar del usuario */}
          <div className="flex flex-col items-center">
            {user?.avatar ? (
              <Image 
                src={user.avatar} 
                alt={user.full_name}
                className="w-16 h-16 rounded-full border-4 border-white/20"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/20">
                <span className="text-2xl font-bold">
                  {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                </span>
              </div>
            )}
            <span className="mt-2 text-sm text-white/80">
              {company?.is_company_owner ? 'Propietario' : 'Usuario'}
            </span>
          </div>
        </div>
      </div>

      {/* Alerta de plan/trial */}
      {company?.subscription_plan === 'trial' && (
        <div className={`rounded-custom-lg p-4 border ${
          isTrialExpiringSoon 
            ? 'bg-red-50 border-red-200 text-red-800' 
            : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isTrialExpiringSoon ? (
                <HiExclamationCircle className="h-6 w-6 text-red-500" />
              ) : (
                <HiClock className="h-6 w-6 text-blue-500" />
              )}
              <div>
                <h3 className="font-semibold">
                  {isTrialExpiringSoon 
                    ? '¡Tu período de prueba está por expirar!' 
                    : 'Estás en período de prueba'
                  }
                </h3>
                <p className="text-sm opacity-90">
                  Te quedan {trialDaysLeft} días. Actualiza tu plan para continuar usando todas las funciones.
                </p>
              </div>
            </div>
            <Link 
              href="/admin/suscripcion"
              className="bg-white px-4 py-2 rounded-custom-lg font-semibold hover:bg-gray-50 transition-colors border"
            >
              Ver Planes
            </Link>
          </div>
        </div>
      )}

      {/* Stats reales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Propiedades Activas"
          value={company?.properties_count?.toString() || '0'}
          subtitle={`Límite: ${company?.property_limit || 0}`}
          icon={<HiHome className="h-6 w-6" />}
          color="blue"
          progress={company?.properties_count && company?.property_limit ? 
            (company.properties_count / company.property_limit) * 100 : 0}
        />
        
        <StatCard
          title="Plan Actual"
          value={getPlanDisplayName(company?.subscription_plan)}
          subtitle={company?.subscription_active ? 'Activo' : 'Inactivo'}
          icon={<HiCreditCard className="h-6 w-6" />}
          color={company?.subscription_active ? 'green' : 'red'}
        />
        
        <StatCard
          title="Estado del Sitio"
          value="Público"
          subtitle={`${company?.subdomain}.tuapp.com`}
          icon={<HiGlobe className="h-6 w-6" />}
          color="purple"
          action={
            <button 
              onClick={() => window.open(company?.website_url_full, '_blank')}
              className="text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1"
            >
              <HiEye className="h-3 w-3" />
              Ver sitio
            </button>
          }
        />
        
        <StatCard
          title="Últimas Visitas"
          value="1,234"
          subtitle="Este mes"
          icon={<HiChartBar className="h-6 w-6" />}
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-surface rounded-custom-xl p-6 border border-surface-border">
        <h3 className="text-xl font-bold text-text-primary mb-6">
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickActionCard
            href="/admin/propiedades/nueva"
            title="Agregar Propiedad"
            description="Publicar una nueva propiedad"
            icon="🏠"
            disabled={!company?.can_add_properties}
            disabledMessage={!company?.can_add_properties ? 'Límite alcanzado' : undefined}
          />
          
          <QuickActionCard
            href="/admin/sitio-web"
            title="Personalizar Sitio"
            description="Configurar tu página web"
            icon="🎨"
          />
          
          <QuickActionCard
            href="/admin/seguimiento"
            title="Ver Analytics"
            description="Revisar métricas y leads"
            icon="📊"
          />
          
          <QuickActionCard
            href="/admin/suscripcion"
            title="Gestionar Plan"
            description="Ver y actualizar suscripción"
            icon="💳"
            highlight={company?.subscription_plan === 'trial'}
          />
          
          <QuickActionCard
            href="/admin/inmobiliaria"
            title="Configurar Empresa"
            description="Datos y configuración"
            icon="🏢"
          />
          
          <QuickActionCard
            href="/admin/configuracion"
            title="Ajustes"
            description="Configuración general"
            icon="⚙️"
          />
        </div>
      </div>

      {/* Información adicional */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información del perfil */}
        <div className="bg-surface rounded-custom-xl p-6 border border-surface-border">
          <h3 className="text-lg font-bold text-text-primary mb-4">
            Tu Perfil
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-muted">Email:</span>
              <span className="text-text-primary">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Teléfono:</span>
              <span className="text-text-primary">{user?.phone || 'No configurado'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Registro:</span>
              <span className="text-text-primary">
                {new Date(user?.date_joined || '').toLocaleDateString('es-AR')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Email verificado:</span>
              <span className={`flex items-center gap-1 ${user?.email_verified ? 'text-green-600' : 'text-red-600'}`}>
                <HiCheckCircle className="h-4 w-4" />
                {user?.email_verified ? 'Verificado' : 'Pendiente'}
              </span>
            </div>
          </div>
        </div>

        {/* Información de la empresa */}
        <div className="bg-surface rounded-custom-xl p-6 border border-surface-border">
          <h3 className="text-lg font-bold text-text-primary mb-4">
            Tu Inmobiliaria
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-muted">Nombre:</span>
              <span className="text-text-primary">{company?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Tipo:</span>
              <span className="text-text-primary capitalize">{company?.company_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Subdominio:</span>
              <span className="text-text-primary">{company?.subdomain}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Zona horaria:</span>
              <span className="text-text-primary">{company?.timezone}</span>
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

// Componente de tarjeta de estadística mejorado
function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = 'blue',
  progress,
  action 
}: {
  title: string
  value: string
  subtitle?: string
  icon: React.ReactNode
  color?: 'blue' | 'green' | 'red' | 'purple' | 'orange'
  progress?: number
  action?: React.ReactNode
}) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    red: 'text-red-600 bg-red-100',
    purple: 'text-purple-600 bg-purple-100',
    orange: 'text-orange-600 bg-orange-100'
  }

  return (
    <div className="bg-surface p-6 rounded-custom-xl border border-surface-border hover:border-primary-300 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
              {icon}
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">{title}</p>
              <p className="text-2xl font-bold text-text-primary">{value}</p>
            </div>
          </div>
          
          {subtitle && (
            <p className="text-xs text-text-muted mt-1">{subtitle}</p>
          )}
          
          {progress !== undefined && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-text-muted mb-1">
                <span>Uso actual</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    progress > 90 ? 'bg-red-500' : progress > 70 ? 'bg-orange-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
          )}
          
          {action && (
            <div className="mt-3">
              {action}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Componente de acción rápida mejorado
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
  icon: string
  disabled?: boolean
  disabledMessage?: string
  highlight?: boolean
}) {
  const CardContent = () => (
    <div className={`
      relative p-6 rounded-custom-xl border transition-all duration-300 group
      ${disabled 
        ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60' 
        : highlight 
          ? 'bg-gradient-primary text-white border-primary-500 hover:scale-105 shadow-custom-lg hover:shadow-custom-xl' 
          : 'bg-surface border-surface-border hover:border-primary-300 hover:shadow-custom-md'
      }
    `}>
      <div className="flex items-start gap-4">
        <div className={`
          text-3xl p-3 rounded-lg transition-transform group-hover:scale-110
          ${highlight 
            ? 'bg-white/20' 
            : disabled 
              ? 'bg-gray-100' 
              : 'bg-primary-50'
          }
        `}>
          {icon}
        </div>
        <div className="flex-1">
          <h4 className={`font-bold text-lg mb-1 ${
            highlight ? 'text-white' : disabled ? 'text-gray-500' : 'text-text-primary'
          }`}>
            {title}
          </h4>
          <p className={`text-sm ${
            highlight ? 'text-white/90' : disabled ? 'text-gray-400' : 'text-text-muted'
          }`}>
            {description}
          </p>
          {disabledMessage && (
            <p className="text-xs text-red-500 mt-2 font-medium">
              {disabledMessage}
            </p>
          )}
        </div>
        {!disabled && !highlight && (
          <HiPlus className="h-5 w-5 text-text-tertiary group-hover:text-primary-600 transition-colors" />
        )}
      </div>
      
      {highlight && (
        <div className="absolute -top-2 -right-2">
          <div className="bg-white text-primary-600 text-xs font-bold px-2 py-1 rounded-full shadow-lg">
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