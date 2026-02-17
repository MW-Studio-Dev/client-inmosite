'use client'

import { HiXCircle } from 'react-icons/hi2'
import { useRouter } from 'next/navigation'
import { useDashboardTheme } from '@/context/DashboardThemeContext'
import Link from 'next/link'

export default function SubscriptionFailurePage() {
    const router = useRouter()
    const { theme } = useDashboardTheme()
    const isDark = theme === 'dark'

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <div className={`rounded-2xl p-8 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-lg'}`}>
                <div className="text-center">
                    <div className="mb-6">
                        <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center ${isDark ? 'bg-red-900/30' : 'bg-red-100'}`}>
                            <HiXCircle className={`w-12 h-12 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                        </div>
                    </div>

                    <h1 className={`text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Pago Rechazado
                    </h1>
                    <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        No se pudo procesar tu pago. Por favor intentá nuevamente.
                    </p>

                    <div className={`rounded-lg p-6 mb-6 border text-left ${isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}`}>
                        <p className={`font-medium mb-2 text-sm ${isDark ? 'text-red-300' : 'text-red-800'}`}>
                            Posibles razones:
                        </p>
                        <ul className={`text-sm list-disc list-inside space-y-1 ${isDark ? 'text-red-400' : 'text-red-700'}`}>
                            <li>Tarjeta sin fondos suficientes</li>
                            <li>Datos de tarjeta incorrectos</li>
                            <li>Tarjeta no habilitada para pagos online</li>
                            <li>Problema con el emisor de la tarjeta</li>
                        </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => router.push('/dashboard/subscription')}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                        >
                            Intentar nuevamente
                        </button>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className={`flex-1 font-medium py-3 px-6 rounded-lg transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                        >
                            Volver al Dashboard
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-6 text-center">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    ¿Necesitas ayuda?{' '}
                    <Link href="/dashboard/subscription" className="text-red-600 hover:text-red-700 font-medium">
                        Contactar Soporte
                    </Link>
                </p>
            </div>
        </div>
    )
}
