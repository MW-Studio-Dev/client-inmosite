// hooks/useSubscription.ts - Hook para gestión de suscripciones
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'

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

interface UseSubscriptionReturn {
  plans: SubscriptionPlan[]
  loading: boolean
  error: string | null
  currentPlan: SubscriptionPlan | null
  trialDaysLeft: number
  isTrialExpiringSoon: boolean
  canUpgrade: boolean
  canDowngrade: boolean
  fetchPlans: () => Promise<void>
  upgradePlan: (planSlug: string) => Promise<boolean>
  cancelSubscription: () => Promise<boolean>
  refreshSubscription: () => Promise<void>
}

export function useSubscription(): UseSubscriptionReturn {
  const { company, checkAuth } = useAuth()
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calcular días restantes del trial
  const getTrialDaysLeft = (): number => {
    if (!company?.trial_end_date) return 0
    const endDate = new Date(company.trial_end_date)
    const today = new Date()
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  const trialDaysLeft = getTrialDaysLeft()
  const isTrialExpiringSoon = trialDaysLeft <= 7 && company?.subscription_plan === 'trial'

  // Encontrar el plan actual
  const currentPlan = plans.find(plan => plan.plan_type === company?.subscription_plan) || null

  // Determinar si puede actualizar o degradar
  const planHierarchy = ['trial', 'basic', 'premium', 'enterprise']
  const currentPlanIndex = planHierarchy.indexOf(company?.subscription_plan || '')
  const canUpgrade = currentPlanIndex < planHierarchy.length - 1
  const canDowngrade = currentPlanIndex > 0

  // Cargar planes disponibles
  const fetchPlans = async (): Promise<void> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/subscriptions/plans/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        }
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al cargar planes')
      }
      
      if (data.success) {
        setPlans(data.data)
      } else {
        throw new Error(data.message || 'Error al procesar planes')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('Error fetching plans:', err)
    } finally {
      setLoading(false)
    }
  }

  // Actualizar plan
  const upgradePlan = async (planSlug: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/subscriptions/upgrade/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan_slug: planSlug
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar plan')
      }

      if (data.success) {
        // Refrescar perfil para obtener la información actualizada
        await checkAuth()
        return true
      } else {
        throw new Error(data.message || 'Error al procesar actualización')
      }
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
  const cancelSubscription = async (): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/subscriptions/cancel/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al cancelar suscripción')
      }

      if (data.success) {
        await checkAuth()
        return true
      } else {
        throw new Error(data.message || 'Error al procesar cancelación')
      }
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
    if (company) {
      fetchPlans()
    }
  }, [company])

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