// app/admin/suscripcion/page.tsx - Gestión de suscripciones
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { subscriptionService } from '@/services/subscriptionService'
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

export interface SubscriptionPlan {
  id: string
  slug: string
  name: string
  plan_type: string
  billing_cycle: string
  price_usd: number | string
  price_ars: number | string
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
  const [error, setError] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const URL = process.env.NEXT_PUBLIC_API_URL

  const fetchPlans = async () => {
    try {
      setError(null)
      const response = await fetch(`${URL}/subscriptions/plans/`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data.success) {
        setPlans(data.data)
      } else {
        setError(data.message || 'Error al cargar los planes')
      }
    } catch (error) {
      console.error('Error fetching plans:', error)
      setError('Error de conexión. Por favor, intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }
  // Cargar planes disponibles
  useEffect(() => {
    fetchPlans()
  }, [])

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
    if (!selectedPlan) return;

    try {
      setShowConfirmModal(false);
      setLoading(true);
      setError(null);

      // Verificar si el usuario ya tiene una suscripción activa
      const currentSubscription = company?.subscription_id;

      if (!currentSubscription || company?.subscription_plan === 'trial' || company?.subscription_plan === 'free') {
        // Usuario sin suscripción o en trial/free -> Crear nueva suscripción con preapproval
        const result = await subscriptionService.startSubscription(selectedPlan, 'credit_card');

        if (result.success && result.init_point) {
          // Redirigir a MercadoPago para autorizar la suscripción
          window.location.href = result.init_point;
        } else {
          setError('No se pudo iniciar la suscripción. Intenta nuevamente.');
        }
      } else {
        // Usuario con suscripción activa -> Upgrade con preapproval
        const result = await subscriptionService.upgradeWithPreapproval(
          currentSubscription,
          selectedPlan
        );

        if (result.success && result.init_point) {
          // Redirigir a MercadoPago para autorizar el upgrade
          window.location.href = result.init_point;
        } else {
          setError('No se pudo procesar el upgrade. Intenta nuevamente.');
        }
      }
    } catch (error: any) {
      console.error('Error upgrading plan:', error);
      setError(error.response?.data?.message || 'Error al procesar la solicitud');
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
        <p className="text-text-secondary">Cargando planes disponibles...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 space-y-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <HiExclamationCircle className="h-8 w-8 text-red-600" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-text-primary mb-2">Error al cargar planes</h3>
          <p className="text-text-secondary mb-4">{error}</p>
          <button
            onClick={fetchPlans}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  const displayedPlans = plans.filter(p => p.billing_cycle === billingCycle || p.plan_type === 'trial')

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

      {/* Toggle Anual/Mensual */}
      <div className="flex justify-center mt-6">
        <div className="bg-gray-100 p-1 rounded-xl inline-flex relative">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${billingCycle === 'monthly' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Mensual
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Anual
            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">15% OFF</span>
          </button>
        </div>
      </div>

      {/* Planes disponibles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {displayedPlans.map((plan) => (
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

      {/* Comparación de planes */}
      {displayedPlans.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
            Comparación de Planes
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Características</th>
                  {displayedPlans.map((plan) => (
                    <th key={plan.id} className="text-center py-3 px-4 font-semibold text-gray-700">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-600">Precio {billingCycle === 'yearly' ? 'anual' : 'mensual'}</td>
                  {displayedPlans.map((plan) => (
                    <td key={plan.id} className="text-center py-3 px-4">
                      <span className="font-semibold text-blue-600">
                        {plan.plan_type === 'trial' ? 'Gratis' : plan.plan_type === 'enterprise' ? 'Consultar' : plan.price_display}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-600">Duración</td>
                  {displayedPlans.map((plan) => (
                    <td key={plan.id} className="text-center py-3 px-4">
                      {plan.duration_days} días
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-600">Tipo de plan</td>
                  {displayedPlans.map((plan) => (
                    <td key={plan.id} className="text-center py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${plan.plan_type === 'trial' ? 'bg-gray-100 text-gray-700' :
                        plan.plan_type === 'basic' ? 'bg-blue-100 text-blue-700' :
                          plan.plan_type === 'premium' ? 'bg-purple-100 text-purple-700' :
                            'bg-green-100 text-green-700'
                        }`}>
                        {plan.plan_type}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-600">Popular</td>
                  {displayedPlans.map((plan) => (
                    <td key={plan.id} className="text-center py-3 px-4">
                      {plan.is_popular ? (
                        <HiStar className="h-5 w-5 text-yellow-500 mx-auto" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Garantías */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <HiShieldCheck className="h-5 w-5 text-green-500" />
            Nuestras Garantías
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <HiCheck className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">30 días de garantía</p>
                <p className="text-sm text-gray-600">
                  Si no estás satisfecho, te devolvemos tu dinero
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HiCheck className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Migración gratuita</p>
                <p className="text-sm text-gray-600">
                  Te ayudamos a migrar tus datos sin costo adicional
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HiCheck className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Soporte incluido</p>
                <p className="text-sm text-gray-600">
                  Acceso completo a nuestro equipo de soporte
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Preguntas Frecuentes
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">
                ¿Puedo cambiar de plan en cualquier momento?
              </h4>
              <p className="text-sm text-gray-600">
                Sí, puedes actualizar o degradar tu plan cuando lo necesites.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">
                ¿Qué pasa con mis datos si cancelo?
              </h4>
              <p className="text-sm text-gray-600">
                Mantenemos tus datos por 30 días después de la cancelación.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">
                ¿Ofrecen descuentos por pago anual?
              </h4>
              <p className="text-sm text-gray-600">
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
  const isEnterprise = plan.plan_type === 'enterprise'

  return (
    <div className={`
      relative rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-xl
      ${isPopular
        ? 'border-blue-500 shadow-lg bg-gradient-to-b from-blue-50 to-white'
        : 'border-gray-200 bg-white hover:border-blue-300'
      }
      ${isCurrentPlan ? 'ring-2 ring-green-500 bg-green-50' : ''}
    `}>
      {/* Badge de popular */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
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
                <span className="text-3xl font-bold text-blue-600">Gratis</span>
                <span className="text-gray-500"> / {plan.duration_days} días</span>
              </div>
            ) : isEnterprise ? (
              <div>
                <span className="text-3xl font-bold text-blue-600">Consultar</span>
              </div>
            ) : (
              <div>
                <span className="text-3xl font-bold text-blue-600">
                  {plan.price_display}
                </span>
                <span className="text-gray-500"> / {plan.billing_cycle === 'yearly' ? 'año' : 'mes'}</span>
                {Number(plan.price_ars) > 0 && (
                  <div className="text-sm text-gray-500 mt-1">
                    ARG ${Number(plan.price_ars).toLocaleString()}
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
          {(plan.features_list && plan.features_list.length > 0 ? plan.features_list : features).map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <HiCheck className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-text-secondary">{feature}</span>
            </div>
          ))}
        </div>

        {/* Botón de acción */}
        {isEnterprise ? (
          <a
            href="mailto:info@inmosite.com.ar?subject=Consulta Plan Enterprise"
            className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 bg-gray-900 text-white hover:bg-black block text-center"
          >
            Consultar
          </a>
        ) : (
          <button
            onClick={onSelect}
            disabled={disabled}
            className={`
              w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300
              ${isCurrentPlan
                ? 'bg-green-100 text-green-700 cursor-default'
                : isPopular
                  ? 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg transform hover:-translate-y-0.5'
                  : 'bg-gray-100 text-gray-700 border border-gray-300 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50'
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
                Seleccionar
                <HiArrowRight className="h-4 w-4" />
              </span>
            )}
          </button>
        )}
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
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiCreditCard className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Confirmar Actualización
          </h3>
          <p className="text-gray-600">
            ¿Estás seguro que quieres actualizar al plan <strong>{planName}</strong>?
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Plan seleccionado:</span>
            <span className="font-semibold text-gray-900">{planName}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600">Precio mensual:</span>
            <span className="font-bold text-blue-600 text-lg">{price}</span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
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
            className="flex-1 py-3 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 rounded-lg bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg transition-all duration-300"
          >
            Confirmar Upgrade
          </button>
        </div>
      </div>
    </div>
  )
}
