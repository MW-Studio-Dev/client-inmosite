'use client'

import { useEffect, useState } from 'react'
import { HiClock } from 'react-icons/hi2'
import { useRouter } from 'next/navigation'
import { useSubscription } from '@/hooks/useSubscription'
import { useDashboardTheme } from '@/context/DashboardThemeContext'
import Link from 'next/link'

export default function SubscriptionPendingPage() {
    const router = useRouter()
    const { subscription, fetchSubscription } = useSubscription()
    const { theme } = useDashboardTheme()
    const isDark = theme === 'dark'

    const [checking, setChecking] = useState(false)

    const handleCheckStatus = async () => {
        setChecking(true)
        await fetchSubscription()
        setChecking(false)

        if (subscription?.status === 'active') {
            router.push('/subscription/success')
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <div className={`rounded-2xl p-8 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-lg'}`}>
                <div className="text-center">
                    <div className="mb-6">
                        <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center ${isDark ? 'bg-yellow-900/30' : 'bg-yellow-100'}`}>
                            <HiClock className={`w-12 h-12 animate-pulse ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
                        </div>
                    </div>

                    <h1 className={`text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Pago Pendiente
                    </h1>
                    <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Tu pago está siendo procesado.
                    </p>

                    <div className={`rounded-lg p-6 mb-6 border ${isDark ? 'bg-yellow-900/20 border-yellow-800' : 'bg-yellow-50 border-yellow-200'}`}>
                        <p className={`text-sm ${isDark ? 'text-yellow-300' : 'text-yellow-800'}`}>
                            Estamos validando tu información de pago. Esto puede tomar unos minutos.
                            Recibirás un email cuando tu suscripción esté activa.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleCheckStatus}
                            disabled={checking}
                            className="flex-1 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                        >
                            {checking ? 'Verificando...' : 'Verificar estado'}
                        </button>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className={`flex-1 font-medium py-3 px-6 rounded-lg transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                        >
                            Ir al Dashboard
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-6 text-center">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    ¿Necesitas ayuda?{' '}
                    <Link href="/subscription" className="text-yellow-600 hover:text-yellow-700 font-medium">
                        Contactar Soporte
                    </Link>
                </p>
            </div>
        </div>
    )
}
