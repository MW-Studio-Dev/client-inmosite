// app/admin/suscripcion/page.tsx - Gestión de suscripciones
'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import axiosInstance from '@/lib/api'
import { useDashboardTheme } from '@/context/DashboardThemeContext'

import {
  HiCheck,
  HiStar,
  HiCreditCard,
  HiClock,
  HiExclamationCircle,
  HiInformationCircle,
  HiArrowRight,
  HiShieldCheck,
  HiCurrencyDollar,
  HiLightningBolt,
  HiLockClosed
} from 'react-icons/hi'
import { SiMercadopago, SiStripe, SiBitcoin } from 'react-icons/si'

import { subscriptionService } from '@/services/subscriptionService'
import type { Plan, UpgradeCalculation } from '@/types/subscription'
import CurrentSubscription from '@/components/subscription/CurrentSubscription'
import InvoicesList from '@/components/subscription/InvoicesList'

export default function SubscriptionPage() {
  const { company, user } = useAuth()
  const { theme } = useDashboardTheme()
  const isDark = theme === 'dark'
  const [plans, setPlans] = useState<Plan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [upgradeCalculation, setUpgradeCalculation] = useState<UpgradeCalculation | null>(null)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [loadingUpgrade, setLoadingUpgrade] = useState(false)

  // Cargar planes disponibles
  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const data = await subscriptionService.getPlans()
      setPlans(data || [])
    } catch (error) {
      console.error('Error fetching plans:', error)
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

  const handleSelectPlan = async (plan: Plan) => {
    setSelectedPlan(plan)

    // Si es el plan actual, no hacemos nada (o podríamos mostrar detalles)
    if (company?.subscription_plan === plan.plan_type) return

    // Si es un upgrade, calculamos el costo prorrateado
    if (plan.is_upgrade) {
      setLoadingUpgrade(true)
      try {
        // NUEVO: Determinar si es upgrade desde plan free o entre planes pagos
        const isFreePlan = company?.subscription_plan === 'trial' || company?.subscription_plan === 'free'

        if (isFreePlan) {
          // Upgrade desde plan gratuito: no calcular prorratea, solo mostrar modal
          setUpgradeCalculation(null)
          setShowCheckoutModal(true)
        } else {
          // Upgrade entre planes pagos: calcular prorratea
          const calculation = await subscriptionService.calculateUpgradeWithProrate(plan.slug)
          setUpgradeCalculation(calculation)
          setShowCheckoutModal(true)
        }
      } catch (error) {
        console.error('Error calculating upgrade:', error)
        // Fallback: mostrar modal sin cálculo o mostrar error
        setShowCheckoutModal(true)
      } finally {
        setLoadingUpgrade(false)
      }
    } else {
      // Downgrade o cambio simple (si aplica)
      setUpgradeCalculation(null)
      setShowCheckoutModal(true)
    }
  }



  return (
    <div className="space-y-10 pb-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className={`text-4xl font-extrabold mb-4 font-poppins tracking-tight ${isDark ? 'text-white' : 'text-gray-900'
          }`}>
          Elige el plan perfecto
        </h1>
        <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
          Potencia tu inmobiliaria con nuestras herramientas premium.
          <br className="hidden sm:block" />
          Cambia o cancela tu plan cuando quieras.
        </p>
      </div>

      {/* Estado actual - Solo si es trial y expira pronto */}
      {company?.subscription_plan === 'trial' && trialDaysLeft <= 7 && (
        <div className="max-w-3xl mx-auto">
          <div className={`rounded-2xl p-4 flex items-center gap-4 animate-pulse-slow border ${isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'
            }`}>
            <div className={`p-2 rounded-full ${isDark ? 'bg-red-900/40' : 'bg-red-100'
              }`}>
              <HiExclamationCircle className={`h-6 w-6 ${isDark ? 'text-red-400' : 'text-red-600'
                }`} />
            </div>
            <div>
              <p className={`font-bold ${isDark ? 'text-red-300' : 'text-red-800'
                }`}>¡Tu periodo de prueba termina pronto!</p>
              <p className={`text-sm ${isDark ? 'text-red-400' : 'text-red-700'
                }`}>
                Te quedan {trialDaysLeft} días. Suscríbete ahora para no perder acceso a tus propiedades.
              </p>
            </div>
          </div>
        </div>
      )}


      {/* Suscripción Actual y Facturas */}
      <CurrentSubscription />

      {/* Planes disponibles */}
      <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Planes Disponibles
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            features={planFeatures[plan.plan_type] || []}
            isCurrentPlan={company?.subscription_plan === plan.plan_type}
            onSelect={() => handleSelectPlan(plan)}
            disabled={company?.subscription_plan === plan.plan_type}
            isDark={isDark}
          />
        ))}
      </div>

      {/* Historial de Facturas */}
      <div className="mb-12">
        <InvoicesList />
      </div>

      {/* Botón de contacto con asesor */}
      <div className={`max-w-4xl mx-auto rounded-xl p-4 sm:p-6 border transition-all ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className={`font-bold text-base sm:text-lg mb-1 ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              ¿Necesitas un plan personalizado?
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
              Nuestros asesores pueden ayudarte a encontrar la mejor opción para tu inmobiliaria
            </p>
          </div>
          <a
            href={`https://wa.me/5491234567890?text=Hola,%20mi%20nombre%20es%20${encodeURIComponent(user?.first_name || '')}%20${encodeURIComponent(user?.last_name || '')}%20y%20quiero%20saber%20más%20acerca%20de%20sus%20suscripciones.`}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-bold text-sm transition-all shadow-md hover:shadow-lg whitespace-nowrap ${isDark
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Hablar con un asesor
          </a>
        </div>
      </div>

      {/* Información adicional */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Garantías */}
        <div className={`rounded-2xl p-8 hover:shadow-lg transition-all duration-300 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
          <h3 className={`text-xl font-bold mb-6 flex items-center gap-3 font-poppins ${isDark ? 'text-white' : 'text-gray-900'
            }`}>
            <div className={`p-2 rounded-lg ${isDark ? 'bg-green-900/30' : 'bg-green-100'
              }`}>
              <HiShieldCheck className={`h-6 w-6 ${isDark ? 'text-green-400' : 'text-green-600'
                }`} />
            </div>
            Nuestras Garantías
          </h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <HiCheck className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'
                  }`}>30 días de garantía</p>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  Si no estás satisfecho con el servicio, te devolvemos tu dinero sin preguntas.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <HiCheck className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'
                  }`}>Migración gratuita</p>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  Nuestro equipo técnico te ayuda a migrar todas tus propiedades y datos sin costo.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <HiCheck className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'
                  }`}>Soporte prioritario</p>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  Acceso directo a nuestro equipo de soporte técnico especializado vía chat y email.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className={`rounded-2xl p-8 hover:shadow-lg transition-all duration-300 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
          <h3 className={`text-xl font-bold mb-6 flex items-center gap-3 font-poppins ${isDark ? 'text-white' : 'text-gray-900'
            }`}>
            <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-900/30' : 'bg-blue-100'
              }`}>
              <HiInformationCircle className={`h-6 w-6 ${isDark ? 'text-blue-400' : 'text-blue-600'
                }`} />
            </div>
            Preguntas Frecuentes
          </h3>
          <div className="space-y-6">
            <div>
              <h4 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'
                }`}>
                ¿Puedo cambiar de plan en cualquier momento?
              </h4>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                Sí, puedes actualizar a un plan superior o cambiar a uno inferior cuando lo necesites. Los cambios se aplican inmediatamente.
              </p>
            </div>
            <div className={`w-full h-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`}></div>
            <div>
              <h4 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'
                }`}>
                ¿Qué pasa con mis datos si cancelo?
              </h4>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                Mantenemos tus datos seguros por 30 días después de la cancelación por si decides volver. Puedes solicitar una exportación completa antes de irte.
              </p>
            </div>
            <div className={`w-full h-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`}></div>
            <div>
              <h4 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'
                }`}>
                ¿Ofrecen descuentos por pago anual?
              </h4>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                ¡Sí! Al pagar anualmente obtienes 2 meses gratis en cualquier plan. Selecciona la opción anual en el checkout.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Checkout */}
      {showCheckoutModal && selectedPlan && (
        <CheckoutModal
          plan={selectedPlan}
          upgradeCalculation={upgradeCalculation}
          onClose={() => setShowCheckoutModal(false)}
          isDark={isDark}
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
  disabled,
  isDark = false
}: {
  plan: SubscriptionPlan 
  features: string[]
  isCurrentPlan: boolean
  onSelect: () => void
  disabled: boolean
  isDark?: boolean
}) {
  const isPopular = plan.is_popular || plan.plan_type === 'premium'

  return (
    <div className={`
      relative flex flex-col h-full transition-all duration-300 rounded-2xl overflow-hidden border
      ${isPopular
        ? isDark
          ? 'bg-gradient-to-b from-gray-800 to-gray-700 border-primary-600 shadow-xl hover:shadow-2xl transform hover:-translate-y-2'
          : 'bg-gradient-to-b from-white to-gray-50 border-primary-500 shadow-xl hover:shadow-2xl transform hover:-translate-y-2'
        : isDark
          ? 'bg-gray-800 border-gray-700 hover:border-primary-600 hover:shadow-lg'
          : 'bg-white border-gray-200 hover:border-primary-300 hover:shadow-lg'
      }
      ${isCurrentPlan
        ? isDark
          ? 'ring-2 ring-green-500 bg-green-900/10'
          : 'ring-2 ring-green-500 bg-green-50'
        : ''
      }
    `}>
      {/* Badge de popular */}
      {isPopular && (
        <div className="absolute top-0 right-0">
          <div className="bg-gradient-primary text-white px-4 py-1 rounded-bl-xl text-xs font-bold flex items-center gap-1 shadow-md">
            <HiStar className="h-3 w-3" />
            Más Popular
          </div>
        </div>
      )}

      {/* Badge de plan actual */}
      {isCurrentPlan && (
        <div className="absolute top-0 right-0">
          <div className="bg-green-500 text-white px-4 py-1 rounded-bl-xl text-xs font-bold flex items-center gap-1 shadow-md">
            <HiCheck className="h-3 w-3" />
            Plan Actual
          </div>
        </div>
      )}

      <div className="p-8 flex flex-col h-full">
        {/* Header del plan */}
        <div className="text-center mb-8">
          <h3 className={`text-xl font-bold mb-2 font-poppins ${isDark ? 'text-white' : 'text-gray-900'
            }`}>
            {plan.name}
          </h3>

          <div className="mb-4 flex items-baseline justify-center gap-1">
            {plan.plan_type === 'trial' ? (
              <div>
                <span className={`text-4xl font-extrabold ${isDark ? 'text-white' : 'text-primary-600'
                  }`}>Gratis</span>
                <span className={`text-sm font-medium ml-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>/ 30 días</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="flex items-baseline">
                  <span className={`text-4xl font-extrabold ${isDark ? 'text-white' : 'text-primary-600'
                    }`}>
                    ${plan.price_ars > 0 ? plan.price_ars.toLocaleString() : '0'}
                  </span>
                  <span className={`text-lg font-bold ml-1 ${isDark ? 'text-white' : 'text-primary-600'
                    }`}>ARS</span>
                  <span className={`text-sm font-medium ml-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>/ mes</span>
                </div>
                {/* Precio en USD como referencia */}
                <div className={`text-xs mt-1 font-medium px-2 py-0.5 rounded-full ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                  ≈ {plan.price_display}
                </div>
              </div>
            )}
          </div>

          {plan.description && (
            <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
              {plan.description}
            </p>
          )}
        </div>

        {/* Separator */}
        <div className={`w-full h-px mb-6 ${isDark ? 'bg-gray-700' : 'bg-gray-200'
          }`}></div>

        {/* Características */}
        <div className="space-y-4 mb-8 flex-grow">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="mt-0.5 min-w-[20px]">
                <HiCheck className="h-5 w-5 text-green-500" />
              </div>
              <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>{feature}</span>
            </div>
          ))}
        </div>

        {/* Botón de acción - Siempre abajo */}
        <div className="mt-auto pt-4">
          <button
            onClick={onSelect}
            disabled={disabled}
            className={`
              w-full py-3.5 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2
              ${isCurrentPlan
                ? isDark
                  ? 'bg-green-900/30 text-green-400 cursor-default border border-green-800'
                  : 'bg-green-100 text-green-700 cursor-default border border-green-200'
                : isPopular
                  ? 'bg-gradient-primary text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                  : isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-white border-2 border-gray-600 hover:border-primary-500'
                    : 'bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 hover:border-primary-500 hover:text-primary-600'
              }
              ${disabled && !isCurrentPlan ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isCurrentPlan ? (
              <>
                <HiCheck className="h-5 w-5" />
                Plan Actual
              </>
            ) : plan.plan_type === 'trial' ? (
              'Comenzar Prueba'
            ) : (
              <>
                Seleccionar Plan
                <HiArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// Checkout Modal con MercadoPago CardForm
function CheckoutModal({
  plan,
  upgradeCalculation,
  onClose,
  isDark = false
}: {
  plan: Plan
  upgradeCalculation: UpgradeCalculation | null
  onClose: () => void
  isDark?: boolean
}) {
  const { company, user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [brickReady, setBrickReady] = useState(false)
  const brickControllerRef = useRef<any>(null)

  // Determinar si es plan free
  const isFreePlan = company?.subscription_plan === 'trial' || company?.subscription_plan === 'free'

  // Calcular el monto a cobrar
  const amount = upgradeCalculation
    ? upgradeCalculation.pricing.upgrade_amount_ars
    : plan.price_ars

  useEffect(() => {
    // Solo inicializar Brick si es plan free
    if (!isFreePlan) return

    const initializeBrick = async () => {
      const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
      if (!publicKey || !window.MercadoPago) {
        setError('SDK de MercadoPago no disponible')
        return
      }

      try {
        const mp = new window.MercadoPago(publicKey, { locale: 'es-AR' })
        const bricksBuilder = mp.bricks()

        const settings = {
          initialization: {
            amount: amount,
            payer: {
              email: user?.email || '',
            },
          },
          customization: {
            visual: {
              style: {
                theme: isDark ? 'dark' : 'default',
              },
            },
            paymentMethods: {
              maxInstallments: 12,
            },
          },
          callbacks: {
            onReady: () => {
              setBrickReady(true)
            },
            onSubmit: async (cardFormData: any) => {
              setLoading(true)
              setError('')

              try {
                console.log('Card Form Data:', cardFormData)

                // Enviar todos los datos necesarios para la suscripción
                const response = await subscriptionService.upgradeFromFreeToPaid(
                  plan.slug,
                  cardFormData.token,
                  cardFormData.payment_method_id,
                  cardFormData.issuer_id,
                  cardFormData.payer?.email
                )

                if (response && response.preapproval_id) {
                  alert('¡Suscripción creada exitosamente! Tu plan se activará en breve.')
                  window.location.reload()
                } else {
                  setError('Error al procesar la suscripción')
                  setLoading(false)
                }
              } catch (error: any) {
                console.error('Error:', error)

                const errorData = error.response?.data
                const errorCode = errorData?.error_code

                let errorMessage = 'Hubo un error al procesar la solicitud.'

                switch (errorCode) {
                  case 'CARD_TOKEN_REQUIRED':
                    errorMessage = 'Falta el token de la tarjeta'
                    break
                  case 'NO_SUBSCRIPTION':
                    errorMessage = 'No tienes una suscripción activa'
                    break
                  case 'PLAN_NOT_FOUND':
                    errorMessage = 'El plan seleccionado no está disponible'
                    break
                  case 'NOT_AN_UPGRADE':
                    errorMessage = 'El plan debe ser superior al actual'
                    break
                  case 'MP_SUBSCRIPTION_ERROR':
                    errorMessage = 'Error al crear la suscripción en MercadoPago'
                    break
                  default:
                    errorMessage = errorData?.message || 'Error de conexión con el servidor'
                }

                setError(errorMessage)
                setLoading(false)
                throw error
              }
            },
            onError: (error: any) => {
              console.error('Brick error:', error)
              setError('Error en el formulario de pago')
            },
          },
        }

        const controller = await bricksBuilder.create(
          'cardPayment',
          'cardPaymentBrick_container',
          settings
        )

        brickControllerRef.current = controller
      } catch (error) {
        console.error('Error initializing brick:', error)
        setError('Error al cargar el formulario de pago')
      }
    }

    // Esperar a que el SDK esté cargado
    const checkSDK = setInterval(() => {
      if (window.MercadoPago) {
        clearInterval(checkSDK)
        initializeBrick()
      }
    }, 100)

    return () => {
      clearInterval(checkSDK)
      if (brickControllerRef.current) {
        try {
          brickControllerRef.current.unmount()
        } catch (e) {
          console.log('Error unmounting brick:', e)
        }
      }
    }
  }, [isFreePlan, amount, plan.slug, user?.email, isDark])

  const handlePaidToPaidUpgrade = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await subscriptionService.upgradePaidToPaid(
        plan.slug,
        'mercadopago'
      )

      if (response && response.preapproval_id) {
        alert('¡Suscripción actualizada exitosamente!')
        window.location.reload()
      } else {
        setError('Error al procesar la actualización')
        setLoading(false)
      }
    } catch (error: any) {
      console.error('Error:', error)

      const errorData = error.response?.data
      const errorCode = errorData?.error_code

      let errorMessage = 'Hubo un error al procesar la solicitud.'

      switch (errorCode) {
        case 'NO_SUBSCRIPTION':
          errorMessage = 'No tienes una suscripción activa'
          break
        case 'PLAN_NOT_FOUND':
          errorMessage = 'El plan seleccionado no está disponible'
          break
        case 'NOT_AN_UPGRADE':
          errorMessage = 'El plan debe ser superior al actual'
          break
        case 'MP_SUBSCRIPTION_ERROR':
          errorMessage = 'Error al actualizar la suscripción en MercadoPago'
          break
        default:
          errorMessage = errorData?.message || 'Error de conexión con el servidor'
      }

      setError(errorMessage)
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Header */}
        <div className={`sticky top-0 px-6 py-4 border-b flex justify-between items-center ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} z-10`}>
          <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {isFreePlan ? 'Suscríbete a' : 'Cambiar a'} {plan.name}
          </h3>
          <button
            onClick={onClose}
            disabled={loading}
            className={`p-1 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
          >
            <span className="sr-only">Cerrar</span>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Mensaje de Error */}
          {error && (
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}`}>
              <p className={`text-sm ${isDark ? 'text-red-300' : 'text-red-700'}`}>{error}</p>
            </div>
          )}

          {/* Resumen del plan */}
          <div className={`rounded-xl p-5 ${isDark ? 'bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-800/50' : 'bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200'}`}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  Plan seleccionado
                </p>
                <h4 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h4>
              </div>
              <div className="text-right">
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  ${amount.toLocaleString('es-AR')}
                </p>
                <p className={`text-sm font-medium ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                  {upgradeCalculation ? 'Hoy' : 'ARS / mes'}
                </p>
              </div>
            </div>

            {upgradeCalculation && (
              <div className={`mt-4 pt-4 border-t space-y-1.5 ${isDark ? 'border-blue-800/50' : 'border-blue-200'}`}>
                <div className={`flex justify-between text-sm ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>
                  <span>Precio completo:</span>
                  <span className="font-semibold">${upgradeCalculation.pricing.full_price_ars.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between text-sm text-green-500 font-medium">
                  <span>Crédito aplicado:</span>
                  <span>-${upgradeCalculation.pricing.credit_applied_ars.toLocaleString('es-AR')}</span>
                </div>
                <div className={`flex justify-between text-base font-bold pt-2 border-t ${isDark ? 'text-white border-blue-800/50' : 'text-gray-900 border-blue-200'}`}>
                  <span>Total a pagar hoy:</span>
                  <span>${amount.toLocaleString('es-AR')}</span>
                </div>
              </div>
            )}
          </div>

          {/* Formulario de pago o botón según el tipo de plan */}
          {isFreePlan ? (
            <div>
              {/* Checkout Brick de MercadoPago */}
              {!brickReady && (
                <div className={`flex items-center justify-center py-12 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto mb-3"></div>
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Cargando formulario de pago...</span>
                  </div>
                </div>
              )}
              <div id="cardPaymentBrick_container" className={!brickReady ? 'hidden' : ''}></div>

              {/* Info de seguridad */}
              <div className={`mt-4 flex items-center justify-center gap-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <HiLockClosed className="w-3.5 h-3.5" />
                <span>Pago 100% seguro procesado por</span>
                <SiMercadopago className="w-4 h-4" />
                <span className="font-semibold">MercadoPago</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className={`rounded-xl p-4 ${isDark ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'}`}>
                <div className="flex items-start gap-3">
                  <HiInformationCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  <p className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>
                    El cambio se aplicará <strong>inmediatamente</strong> y se cobrará el monto prorrateado correspondiente.
                  </p>
                </div>
              </div>

              <button
                onClick={handlePaidToPaidUpgrade}
                disabled={loading}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 ${
                  loading
                    ? 'opacity-70 cursor-wait bg-gray-400 text-white'
                    : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </>
                ) : (
                  <>
                    <HiCreditCard className="w-5 h-5" />
                    Confirmar cambio de plan
                    <HiArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}