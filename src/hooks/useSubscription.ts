// hooks/useSubscription.ts - Hook para gestión de suscripciones
'use client'

import { useEffect } from 'react'
import { useSubscriptionStore } from '@/store/subscriptionStore'

export function useSubscription() {
    const store = useSubscriptionStore()

    useEffect(() => {
        if (store.plans.length === 0) store.fetchPlans()
        if (!store.subscription) store.fetchSubscription()
    }, [])

    const handleUpgrade = async (planSlug: string) => {
        const checkoutUrl = await store.upgrade(planSlug)
        if (checkoutUrl) {
            window.location.href = checkoutUrl
        }
    }

    const isTrialExpiring = store.subscription?.is_trial && (store.subscription?.trial_days_remaining ?? 0) < 7
    const canUpgrade = store.subscription?.is_active ?? false

    return {
        ...store,
        handleUpgrade,
        isTrialExpiring,
        canUpgrade,
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

export const formatPrice = (priceArs: number): string => {
    if (priceArs === 0) return 'Gratis'
    return `$${priceArs.toLocaleString('es-AR')}`
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
