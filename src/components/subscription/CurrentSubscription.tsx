'use client'

import { useState } from 'react'
import { useSubscription } from '@/hooks/useSubscription'
import { useDashboardTheme } from '@/context/DashboardThemeContext'
import { HiExclamationCircle, HiLightningBolt } from 'react-icons/hi'

export default function CurrentSubscription() {
    const { subscription, cancel, isLoading } = useSubscription()
    const { theme } = useDashboardTheme()
    const isDark = theme === 'dark'
    const [showCancelConfirm, setShowCancelConfirm] = useState(false)

    if (!subscription) return null

    const statusConfig: Record<string, { label: string; className: string }> = {
        active: {
            label: 'Activa',
            className: isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700',
        },
        trialing: {
            label: 'Período de prueba',
            className: isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700',
        },
        canceled: {
            label: 'Cancelada',
            className: isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700',
        },
        past_due: {
            label: 'Vencida',
            className: isDark ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-700',
        },
    }

    const status = statusConfig[subscription.status] || statusConfig.active

    const handleCancel = async () => {
        const success = await cancel(false)
        if (success) setShowCancelConfirm(false)
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
                <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${status.className}`}>
                    {status.label}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <p className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Plan Actual</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {subscription.plan.name}
                    </p>
                </div>

                <div>
                    <p className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Precio</p>
                    <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {subscription.current_price_ars === 0
                            ? 'Gratis'
                            : `$${Number(subscription.current_price_ars).toLocaleString('es-AR')}`
                        }
                        <span className="text-sm font-normal text-gray-500"> / mes</span>
                    </p>
                </div>

                <div>
                    <p className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {subscription.is_trial ? 'Días restantes de prueba' : 'Próximo vencimiento'}
                    </p>
                    <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {subscription.is_trial
                            ? `${subscription.trial_days_remaining} días`
                            : new Date(subscription.current_period_end).toLocaleDateString('es-AR')
                        }
                    </p>
                    {subscription.cancel_at_period_end && (
                        <p className="text-sm text-orange-500 mt-1 flex items-center gap-1">
                            <HiExclamationCircle />
                            Termina al finalizar el período
                        </p>
                    )}
                </div>
            </div>

            {/* Acciones */}
            {subscription.is_active && !subscription.cancel_at_period_end && subscription.status !== 'canceled' && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    {!showCancelConfirm ? (
                        <button
                            onClick={() => setShowCancelConfirm(true)}
                            className="px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors"
                        >
                            Cancelar Suscripción
                        </button>
                    ) : (
                        <div className="flex items-center gap-3">
                            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                ¿Seguro? Tendrás acceso hasta el fin del período.
                            </span>
                            <button
                                onClick={handleCancel}
                                disabled={isLoading}
                                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-50"
                            >
                                {isLoading ? 'Cancelando...' : 'Confirmar'}
                            </button>
                            <button
                                onClick={() => setShowCancelConfirm(false)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                            >
                                Volver
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
