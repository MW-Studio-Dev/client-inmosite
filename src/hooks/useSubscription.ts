// hooks/useSubscription.ts - Hook para gestión de suscripciones
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { subscriptionService } from '@/services/subscriptionService'
import type { Plan } from '@/types/subscription'

interface UseSubscriptionReturn {
  plans: Plan[]
  loading: boolean
  error: string | null
  currentPlan: Plan | null
  trialDaysLeft: number
  isTrialExpiringSoon: boolean
  canUpgrade: boolean
  canDowngrade: boolean
  fetchPlans: () => Promise<void>
  upgradePlan: (planSlug: string, paymentMethod?: string) => Promise<boolean>
  cancelSubscription: (immediately?: boolean, reason?: string) => Promise<boolean>
  refreshSubscription: () => Promise<void>
}

export function useSubscription(): UseSubscriptionReturn {
  const { user, checkAuth } = useAuth()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const subscription = user?.company?.subscription

  const trialDaysLeft = subscription?.days_remaining || 0
  const isTrialExpiringSoon = (subscription?.is_trial && trialDaysLeft <= 7) || false

  // Encontrar el plan actual
  const currentPlan = subscription?.plan || plans.find(plan => plan.slug === user?.selected_plan_slug) || null

  // Determinar si puede actualizar o degradar
  const planHierarchy = ['free', 'basic', 'premium', 'enterprise']
  const currentPlanSlug = subscription?.plan?.slug || 'free'
  const currentPlanIndex = planHierarchy.indexOf(currentPlanSlug)

  const canUpgrade = currentPlanIndex < planHierarchy.length - 1
  const canDowngrade = currentPlanIndex > 0

  // Cargar planes disponibles
  const fetchPlans = async (): Promise<void> => {
    // Si ya tenemos planes cargados, no recargar a menos que sea forzado
    if (plans.length > 0) return

    setLoading(true)
    setError(null)

    try {
      const data = await subscriptionService.getPlans()
      setPlans(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('Error fetching plans:', err)
    } finally {
      setLoading(false)
    }
  }

  // Actualizar plan
  const upgradePlan = async (planSlug: string, paymentMethod: string = 'mercadopago'): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const result = await subscriptionService.upgradeWithProrate(planSlug, paymentMethod)

      if (result.payment_url) {
        window.location.href = result.payment_url
        return true
      }

      // Si no hay URL, asumimos éxito inmediato
      await checkAuth()
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('Error upgrading plan:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Cancelar suscripción
  const cancelSubscription = async (immediately: boolean = false, reason?: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      await subscriptionService.cancelSubscription(immediately, reason)
      await checkAuth()
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('Error canceling subscription:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Refrescar información de suscripción
  const refreshSubscription = async (): Promise<void> => {
    await Promise.all([
      fetchPlans(),
      checkAuth()
    ])
  }

  // Cargar planes al montar el componente
  useEffect(() => {
    if (user) {
      fetchPlans()
    }
  }, [user])

  return {
    plans,
    loading,
    error,
    currentPlan,
    trialDaysLeft,
    isTrialExpiringSoon,
    canUpgrade,
    canDowngrade,
    fetchPlans,
    upgradePlan,
    cancelSubscription,
    refreshSubscription
  }
}

// Hook adicional para obtener características por plan
export function usePlanFeatures() {
  const planFeatures: Record<string, string[]> = {
    trial: [
      'Hasta 10 propiedades',
      'Sitio web básico con subdominios',
      'Formularios de contacto',
      'Galería de imágenes',
      'Soporte por email',
      'Analytics básicos',
      '30 días de prueba gratuita'
    ],
    basic: [
      'Hasta 50 propiedades',
      'Sitio web personalizable',
      'Dominio personalizado',
      'SEO básico optimizado',
      'Formularios avanzados',
      'Analytics detallados',
      'Soporte prioritario',
      'Sin marca InmoSite',
      'Integración WhatsApp'
    ],
    premium: [
      'Hasta 200 propiedades',
      'Sitio web totalmente personalizable',
      'Múltiples dominios',
      'SEO avanzado',
      'CRM integrado para leads',
      'Analytics completos',
      'Herramientas de marketing',
      'API access',
      'Soporte 24/7',
      'Integraciones con portales',
      'Reportes automáticos'
    ],
    enterprise: [
      'Propiedades ilimitadas',
      'Sitio web premium multi-idioma',
      'Dominios ilimitados',
      'SEO enterprise',
      'CRM completo con automatización',
      'Analytics avanzados con IA',
      'Suite completa de marketing',
      'API completa y webhooks',
      'Manager de cuenta dedicado',
      'Integraciones personalizadas',
      'White label completo',
      'Backup y seguridad avanzada',
      'SLA garantizado'
    ]
  }

  const getPlanFeatures = (planType: string): string[] => {
    return planFeatures[planType] || []
  }

  const comparePlans = (planType1: string, planType2: string) => {
    const features1 = getPlanFeatures(planType1)
    const features2 = getPlanFeatures(planType2)

    return {
      plan1: {
        type: planType1,
        features: features1,
        uniqueFeatures: features1.filter(f => !features2.includes(f))
      },
      plan2: {
        type: planType2,
        features: features2,
        uniqueFeatures: features2.filter(f => !features1.includes(f))
      }
    }
  }

  return {
    planFeatures,
    getPlanFeatures,
    comparePlans
  }
}

// Utilidades para formatting
export const formatPlanName = (planType: string): string => {
  const planNames: Record<string, string> = {
    trial: 'Prueba Gratuita',
    basic: 'Plan Básico',
    premium: 'Plan Premium',
    enterprise: 'Plan Enterprise'
  }
  return planNames[planType] || 'Plan Desconocido'
}

export const formatPrice = (priceUsd: number, priceArs: number): string => {
  if (priceUsd === 0) return 'Gratis'
  return `USD $${priceUsd} / ARG $${priceArs.toLocaleString()}`
}

export const getPlanColor = (planType: string): string => {
  const colors: Record<string, string> = {
    trial: 'gray',
    basic: 'blue',
    premium: 'purple',
    enterprise: 'gold'
  }
  return colors[planType] || 'gray'
}