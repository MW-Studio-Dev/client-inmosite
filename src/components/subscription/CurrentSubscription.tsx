'use client'

import { useEffect, useState } from 'react'
import { subscriptionService } from '@/services/subscriptionService'
import { useSubscription } from '@/hooks/useSubscription'
import { useAuth } from '@/hooks/useAuth'
import type { Subscription, UsageInfo } from '@/types/subscription'
import { useDashboardTheme } from '@/context/DashboardThemeContext'
import { HiCheck, HiExclamationCircle, HiLightningBolt } from 'react-icons/hi'

export default function CurrentSubscription() {
    const { currentPlan, loading: subLoading } = useSubscription()
    // Necesitamos el objeto subscription completo, no solo el plan.
    // useSubscription devuelve currentPlan que es SubscriptionPlan.
    // Pero useAuth tiene user.company.subscription que es el objeto Subscription completo.
    // Vamos a usar useAuth directamente para obtener la subscription completa o modificar useSubscription para devolverla.
    // Revisando useSubscription.ts, no devuelve el objeto subscription completo, solo currentPlan.
    // Modificaré useSubscription.ts para devolver 'subscription' también.

    // Por ahora, usaré useAuth aquí para acceder a subscription.
    const { user, checkAuth } = useAuth()
    const subscription = user?.company?.subscription

    const [usage, setUsage] = useState<UsageInfo | null>(null)
    const [loadingUsage, setLoadingUsage] = useState(true)
    const { theme } = useDashboardTheme()
    const isDark = theme === 'dark'

    useEffect(() => {
        loadUsageData()
    }, [])

    const loadUsageData = async () => {
        try {
            const usageData = await subscriptionService.getUsage()
            setUsage(usageData)
        } catch (error) {
            console.error('Error loading usage:', error)
        } finally {
            setLoadingUsage(false)
        }
    }

    const loading = !subscription && loadingUsage // Si no hay suscripción cargada y estamos cargando uso

    const handleCancel = async () => {
        if (!confirm('¿Estás seguro de que deseas cancelar tu suscripción? Perderás acceso a las funciones premium al finalizar el período actual.')) return

        try {
            await subscriptionService.cancelSubscription(false, 'Usuario solicitó cancelación desde dashboard')
            alert('Suscripción cancelada. Tendrás acceso hasta el final del período actual.')
            await checkAuth()
        } catch (error) {
            console.error('Error canceling subscription:', error)
            alert('Error al cancelar la suscripción')
        }
    }

    const handleReactivate = async () => {
        try {
            await subscriptionService.reactivateSubscription()
            alert('¡Suscripción reactivada exitosamente!')
            await checkAuth()
        } catch (error) {
            console.error('Error reactivating subscription:', error)
            alert('Error al reactivar la suscripción')
        }
    }

    if (loading) {
        return (
            <div className={`rounded-2xl p-6 border animate-pulse ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
        )
    }

    if (!subscription) {
        return null // O mostrar un estado vacío si se prefiere
    }

    return (
        <div className={`rounded-2xl p-6 border shadow-sm mb-8 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h2 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <HiLightningBolt className="text-yellow-500" />
                        Tu Suscripción
                    </h2>
                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Gestiona tu plan actual y facturación
                    </p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${subscription.status === 'active'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : subscription.status === 'canceled'
                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                    {subscription.is_active ? 'Activa' : 'Inactiva'}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Detalles del Plan */}
                <div className="space-y-4">
                    <div>
                        <p className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Plan Actual</p>
                        <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{subscription.plan.name}</p>
                    </div>

                    <div>
                        <p className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Precio</p>
                        <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {subscription.current_price_display} <span className="text-sm font-normal text-gray-500">/ mes</span>
                        </p>
                    </div>

                    <div>
                        <p className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Próxima Facturación</p>
                        <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {new Date(subscription.current_period_end).toLocaleDateString()}
                        </p>
                        {subscription.cancel_at_period_end && (
                            <p className="text-sm text-orange-500 mt-1 flex items-center gap-1">
                                <HiExclamationCircle />
                                Termina al finalizar el período
                            </p>
                        )}
                    </div>
                </div>

                {/* Uso y Límites */}
                {usage && usage.usage_percentages && (
                    <div className={`rounded-xl p-5 ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                        <h3 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Uso del Plan</h3>
                        <div className="space-y-4">
                            {Object.entries(usage.usage_percentages).map(([key, metric]) => {
                                const label = key === 'properties' ? 'Propiedades' : key === 'leads' ? 'Leads' : key
                                return (
                                    <div key={key}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{label}</span>
                                            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                                                {metric.current} {metric.is_unlimited ? '' : `/ ${metric.limit}`}
                                            </span>
                                        </div>
                                        {!metric.is_unlimited && (
                                            <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${metric.percentage > 90 ? 'bg-red-500' : metric.percentage > 75 ? 'bg-yellow-500' : 'bg-green-500'
                                                        }`}
                                                    style={{ width: `${Math.min(metric.percentage, 100)}%` }}
                                                ></div>
                                            </div>
                                        )}
                                        {metric.is_unlimited && (
                                            <div className="text-xs text-green-500 font-medium flex items-center gap-1">
                                                <HiCheck className="w-3 h-3" /> Ilimitado
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Acciones */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                {subscription.cancel_at_period_end ? (
                    <button
                        onClick={handleReactivate}
                        className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors"
                    >
                        Reactivar Suscripción
                    </button>
                ) : (
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors"
                    >
                        Cancelar Suscripción
                    </button>
                )}
            </div>
        </div>
    )
}
