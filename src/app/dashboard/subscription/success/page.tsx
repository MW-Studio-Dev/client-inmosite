'use client'

import { useEffect, useState } from 'react'
import { HiCheckCircle } from 'react-icons/hi2'
import { useRouter } from 'next/navigation'
import { useSubscription } from '@/hooks/useSubscription'
import { useDashboardTheme } from '@/context/DashboardThemeContext'
import Link from 'next/link'

export default function SubscriptionSuccessPage() {
    const router = useRouter()
    const { subscription, fetchSubscription } = useSubscription()
    const { theme } = useDashboardTheme()
    const isDark = theme === 'dark'

    const [isRefreshing, setIsRefreshing] = useState(true)

    useEffect(() => {
        const refresh = async () => {
            await fetchSubscription()
            setIsRefreshing(false)
        }
        refresh()
    }, [])

    if (isRefreshing) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4" />
                    <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                        Procesando tu suscripción...
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <div className={`rounded-2xl p-8 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-lg'}`}>
                <div className="text-center">
                    <div className="mb-6">
                        <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center ${isDark ? 'bg-green-900/30' : 'bg-green-100'}`}>
                            <HiCheckCircle className={`w-12 h-12 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                        </div>
                    </div>

                    <h1 className={`text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        ¡Suscripción Activada!
                    </h1>
                    <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Tu suscripción ha sido procesada exitosamente.
                    </p>

                    {subscription && (
                        <div className={`rounded-lg p-6 mb-6 border ${isDark ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'}`}>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Plan:</span>
                                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {subscription.plan.name}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Precio:</span>
                                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        ${subscription.current_price_ars.toLocaleString('es-AR')} ARS
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Próximo cobro:</span>
                                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {new Date(subscription.current_period_end).toLocaleDateString('es-AR')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={`rounded-lg p-4 mb-6 border ${isDark ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
                        <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                            Los cobros se realizarán automáticamente. Recibirás un email de confirmación antes de cada cargo.
                            Puedes cancelar tu suscripción en cualquier momento.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                        >
                            Ir al Dashboard
                        </button>
                        <button
                            onClick={() => router.push('/dashboard/subscription')}
                            className={`flex-1 font-medium py-3 px-6 rounded-lg transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                        >
                            Ver mi Suscripción
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-6 text-center">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    ¿Necesitas ayuda?{' '}
                    <Link href="/dashboard/subscription" className="text-green-600 hover:text-green-700 font-medium">
                        Contactar Soporte
                    </Link>
                </p>
            </div>
        </div>
    )
}
