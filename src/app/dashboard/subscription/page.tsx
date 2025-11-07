// app/admin/suscripcion/page.tsx - Gestión de suscripciones
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { 
  HiCheck, 
  HiStar, 
  HiCreditCard,
  HiClock,
  HiExclamationCircle,
  HiInformationCircle,
  HiArrowRight,
  HiShieldCheck
} from 'react-icons/hi'

interface SubscriptionPlan {
  id: string
  slug: string
  name: string
  plan_type: string
  billing_cycle: string
  price_usd: number
  price_ars: number
  price_display: string
  description: string
  features_list: string[]
  is_popular: boolean
  duration_days: number
}

export default function SubscriptionPage() {
  const { company } = useAuth()
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  // Cargar planes disponibles
  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/subscriptions/plans/')
      const data = await response.json()
      if (data.success) {
        setPlans(data.data)
      }
    } catch (error) {
      console.error('Error fetching plans:', error)
    } finally {
      setLoading(false)
    }
  }

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

  // Características por plan (simuladas hasta que vengan del backend)
  const planFeatures: Record<string, string[]> = {
    trial: [
      'Hasta 10 propiedades',
      'Sitio web básico',
      'Soporte por email',
      '30 días de prueba'
    ],
    basic: [
      'Hasta 50 propiedades',
      'Sitio web personalizable',
      'Analytics básicos',
      'Soporte prioritario',
      'Sin marca InmoSite'
    ],
    premium: [
      'Hasta 200 propiedades',
      'Sitio web avanzado',
      'Analytics completos',
      'CRM integrado',
      'API access',
      'Soporte 24/7'
    ],
    enterprise: [
      'Propiedades ilimitadas',
      'Sitio web premium',
      'Analytics avanzados',
      'CRM completo',
      'Integraciones custom',
      'Manager dedicado',
      'White label'
    ]
  }

  const handleSelectPlan = (planSlug: string) => {
    setSelectedPlan(planSlug)
    setShowConfirmModal(true)
  }

  const handleConfirmUpgrade = async () => {
    // Aquí iría la lógica para actualizar el plan
    console.log('Upgrading to plan:', selectedPlan)
    setShowConfirmModal(false)
    // Mostrar mensaje de éxito o redirigir a procesamiento de pago
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text-primary">
          Gestión de Suscripción
        </h1>
        <p className="mt-2 text-lg text-text-secondary">
          Elige el plan que mejor se adapte a tu inmobiliaria
        </p>
      </div>

      {/* Estado actual */}
      <div className="bg-surface rounded-custom-xl p-6 border border-surface-border">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-text-primary mb-2">
              Plan Actual: {getPlanDisplayName(company?.subscription_plan)}
            </h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <HiCreditCard className="h-5 w-5 text-text-muted" />
                <span className="text-text-secondary">
                  Estado: {company?.subscription_active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              
              {company?.subscription_plan === 'trial' && (
                <div className="flex items-center gap-2">
                  <HiClock className="h-5 w-5 text-orange-500" />
                  <span className="text-text-secondary">
                    Trial expira en {trialDaysLeft} días
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <HiInformationCircle className="h-5 w-5 text-text-muted" />
                <span className="text-text-secondary">
                  Propiedades: {company?.properties_count}/{company?.property_limit}
                </span>
              </div>
            </div>
          </div>
          
          {company?.subscription_plan === 'trial' && trialDaysLeft <= 7 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800">
                <HiExclamationCircle className="h-5 w-5" />
                <span className="font-semibold">¡Acción requerida!</span>
              </div>
              <p className="text-sm text-red-700 mt-1">
                Tu período de prueba está por expirar
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Planes disponibles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            features={planFeatures[plan.plan_type] || []}
            isCurrentPlan={company?.subscription_plan === plan.plan_type}
            onSelect={() => handleSelectPlan(plan.slug)}
            disabled={company?.subscription_plan === plan.plan_type}
          />
        ))}
      </div>

      {/* Información adicional */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Garantías */}
        <div className="bg-surface rounded-custom-xl p-6 border border-surface-border">
          <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <HiShieldCheck className="h-5 w-5 text-green-500" />
            Nuestras Garantías
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <HiCheck className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-text-primary">30 días de garantía</p>
                <p className="text-sm text-text-muted">
                  Si no estás satisfecho, te devolvemos tu dinero
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HiCheck className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-text-primary">Migración gratuita</p>
                <p className="text-sm text-text-muted">
                  Te ayudamos a migrar tus datos sin costo adicional
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HiCheck className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-text-primary">Soporte incluido</p>
                <p className="text-sm text-text-muted">
                  Acceso completo a nuestro equipo de soporte
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-surface rounded-custom-xl p-6 border border-surface-border">
          <h3 className="text-lg font-bold text-text-primary mb-4">
            Preguntas Frecuentes
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-text-primary mb-1">
                ¿Puedo cambiar de plan en cualquier momento?
              </h4>
              <p className="text-sm text-text-muted">
                Sí, puedes actualizar o degradar tu plan cuando lo necesites.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-text-primary mb-1">
                ¿Qué pasa con mis datos si cancelo?
              </h4>
              <p className="text-sm text-text-muted">
                Mantenemos tus datos por 30 días después de la cancelación.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-text-primary mb-1">
                ¿Ofrecen descuentos por pago anual?
              </h4>
              <p className="text-sm text-text-muted">
                Sí, ofrecemos 2 meses gratis al pagar anualmente.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showConfirmModal && selectedPlan && (
        <ConfirmModal
          planName={plans.find(p => p.slug === selectedPlan)?.name || ''}
          price={plans.find(p => p.slug === selectedPlan)?.price_display || ''}
          onConfirm={handleConfirmUpgrade}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
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

// Componente de tarjeta de plan
function PlanCard({ 
  plan, 
  features, 
  isCurrentPlan, 
  onSelect, 
  disabled 
}: {
  plan: SubscriptionPlan
  features: string[]
  isCurrentPlan: boolean
  onSelect: () => void
  disabled: boolean
}) {
  const isPopular = plan.is_popular || plan.plan_type === 'premium'
  
  return (
    <div className={`
      relative rounded-custom-xl border transition-all duration-300 hover:scale-105
      ${isPopular 
        ? 'border-primary-500 shadow-custom-lg bg-gradient-to-b from-primary-50 to-white' 
        : 'border-surface-border bg-surface hover:border-primary-300'
      }
      ${isCurrentPlan ? 'ring-2 ring-green-500 bg-green-50' : ''}
    `}>
      {/* Badge de popular */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <HiStar className="h-3 w-3" />
            Más Popular
          </div>
        </div>
      )}

      {/* Badge de plan actual */}
      {isCurrentPlan && (
        <div className="absolute -top-3 right-4">
          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <HiCheck className="h-3 w-3" />
            Plan Actual
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header del plan */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-text-primary mb-2">
            {plan.name}
          </h3>
          
          <div className="mb-4">
            {plan.plan_type === 'trial' ? (
              <div>
                <span className="text-3xl font-bold text-primary-600">Gratis</span>
                <span className="text-text-muted"> / 30 días</span>
              </div>
            ) : (
              <div>
                <span className="text-3xl font-bold text-primary-600">
                  {plan.price_display}
                </span>
                <span className="text-text-muted"> / mes</span>
                {plan.price_ars > 0 && (
                  <div className="text-sm text-text-muted mt-1">
                    ARG ${plan.price_ars.toLocaleString()}
                  </div>
                )}
              </div>
            )}
          </div>

          {plan.description && (
            <p className="text-sm text-text-muted">
              {plan.description}
            </p>
          )}
        </div>

        {/* Características */}
        <div className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <HiCheck className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-text-secondary">{feature}</span>
            </div>
          ))}
        </div>

        {/* Botón de acción */}
        <button
          onClick={onSelect}
          disabled={disabled}
          className={`
            w-full py-3 px-4 rounded-custom-lg font-semibold transition-all duration-300
            ${isCurrentPlan
              ? 'bg-green-100 text-green-700 cursor-default'
              : isPopular
                ? 'bg-gradient-primary text-white hover:shadow-custom-lg transform hover:-translate-y-0.5'
                : 'bg-surface-hover text-text-primary border border-surface-border hover:border-primary-500 hover:text-primary-600'
            }
            ${disabled && !isCurrentPlan ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {isCurrentPlan ? (
            <span className="flex items-center justify-center gap-2">
              <HiCheck className="h-5 w-5" />
              Plan Actual
            </span>
          ) : plan.plan_type === 'trial' ? (
            'Comenzar Prueba'
          ) : (
            <span className="flex items-center justify-center gap-2">
              Seleccionar Plan
              <HiArrowRight className="h-4 w-4" />
            </span>
          )}
        </button>
      </div>
    </div>
  )
}

// Modal de confirmación
function ConfirmModal({ 
  planName, 
  price, 
  onConfirm, 
  onCancel 
}: {
  planName: string
  price: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-custom-xl p-6 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiCreditCard className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2">
            Confirmar Actualización
          </h3>
          <p className="text-text-secondary">
            ¿Estás seguro que quieres actualizar al plan <strong>{planName}</strong>?
          </p>
        </div>

        <div className="bg-surface rounded-custom-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-text-muted">Plan seleccionado:</span>
            <span className="font-semibold text-text-primary">{planName}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-text-muted">Precio mensual:</span>
            <span className="font-bold text-primary-600 text-lg">{price}</span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-custom-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <HiInformationCircle className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800 font-medium mb-1">
                Información importante:
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• El cambio será efectivo inmediatamente</li>
                <li>• Se prorrateará el tiempo restante de tu plan actual</li>
                <li>• Recibirás un email de confirmación</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-custom-lg border border-surface-border text-text-secondary hover:bg-surface-hover transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 rounded-custom-lg bg-gradient-primary text-white hover:shadow-custom-lg transition-all duration-300"
          >
            Confirmar Upgrade
          </button>
        </div>
      </div>
    </div>
  )
}