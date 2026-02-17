'use client'

import { useAuth } from '@/hooks/useAuth'
import { useSubscription } from '@/hooks/useSubscription'
import { useDashboardTheme } from '@/context/DashboardThemeContext'
import {
    HiCheck,
    HiExclamationCircle,
    HiInformationCircle,
    HiShieldCheck,
} from 'react-icons/hi'
import { PlanCard } from '@/components/subscription/PlanCard'
import CurrentSubscription from '@/components/subscription/CurrentSubscription'

export default function SubscriptionPage() {
    const { user } = useAuth()
    const { plans, subscription, isLoading, error, handleUpgrade, isTrialExpiring } = useSubscription()
    const { theme } = useDashboardTheme()
    const isDark = theme === 'dark'

    const currentPlanPrice = subscription?.current_price_ars ?? 0

    return (
        <div className="space-y-10 pb-10">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto">
                <h1 className={`text-4xl font-extrabold mb-4 font-poppins tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Elige el plan perfecto
                </h1>
                <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Potencia tu inmobiliaria con nuestras herramientas premium.
                    <br className="hidden sm:block" />
                    Cambia o cancela tu plan cuando quieras.
                </p>
            </div>

            {/* Trial expiring warning */}
            {isTrialExpiring && subscription && (
                <div className="max-w-3xl mx-auto">
                    <div className={`rounded-2xl p-4 flex items-center gap-4 border ${isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}`}>
                        <div className={`p-2 rounded-full ${isDark ? 'bg-red-900/40' : 'bg-red-100'}`}>
                            <HiExclamationCircle className={`h-6 w-6 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                        </div>
                        <div>
                            <p className={`font-bold ${isDark ? 'text-red-300' : 'text-red-800'}`}>
                                ¡Tu periodo de prueba termina pronto!
                            </p>
                            <p className={`text-sm ${isDark ? 'text-red-400' : 'text-red-700'}`}>
                                Te quedan {subscription.trial_days_remaining} días. Suscríbete ahora para no perder acceso.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Suscripción Actual */}
            <CurrentSubscription />

            {/* Error */}
            {error && (
                <div className={`max-w-3xl mx-auto rounded-xl p-4 border ${isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}`}>
                    <p className={`text-sm ${isDark ? 'text-red-300' : 'text-red-700'}`}>{error}</p>
                </div>
            )}

            {/* Planes disponibles */}
            <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Planes Disponibles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {plans?.map((plan) => (
                    <PlanCard
                        key={plan.id}
                        plan={plan}
                        currentPlanPrice={currentPlanPrice}
                        onUpgrade={handleUpgrade}
                        isLoading={isLoading}
                        isDark={isDark}
                    />
                ))}
            </div>

            {/* Contacto con asesor */}
            <div className={`max-w-4xl mx-auto rounded-xl p-4 sm:p-6 border transition-all ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                        <h3 className={`font-bold text-base sm:text-lg mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            ¿Necesitas un plan personalizado?
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Nuestros asesores pueden ayudarte a encontrar la mejor opción para tu inmobiliaria
                        </p>
                    </div>
                    <a
                        href={`https://wa.me/5491234567890?text=Hola,%20mi%20nombre%20es%20${encodeURIComponent(user?.first_name || '')}%20y%20quiero%20saber%20más%20acerca%20de%20sus%20suscripciones.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-bold text-sm transition-all shadow-md hover:shadow-lg whitespace-nowrap bg-green-600 hover:bg-green-700 text-white"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        Hablar con un asesor
                    </a>
                </div>
            </div>

            {/* Garantías y FAQ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`rounded-2xl p-8 hover:shadow-lg transition-all duration-300 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <h3 className={`text-xl font-bold mb-6 flex items-center gap-3 font-poppins ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-green-900/30' : 'bg-green-100'}`}>
                            <HiShieldCheck className={`h-6 w-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                        </div>
                        Nuestras Garantías
                    </h3>
                    <div className="space-y-6">
                        {[
                            { title: '30 días de garantía', desc: 'Si no estás satisfecho con el servicio, te devolvemos tu dinero sin preguntas.' },
                            { title: 'Migración gratuita', desc: 'Nuestro equipo técnico te ayuda a migrar todas tus propiedades y datos sin costo.' },
                            { title: 'Soporte prioritario', desc: 'Acceso directo a nuestro equipo de soporte técnico especializado vía chat y email.' },
                        ].map((item) => (
                            <div key={item.title} className="flex items-start gap-4">
                                <HiCheck className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                <div>
                                    <p className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</p>
                                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`rounded-2xl p-8 hover:shadow-lg transition-all duration-300 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <h3 className={`text-xl font-bold mb-6 flex items-center gap-3 font-poppins ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                            <HiInformationCircle className={`h-6 w-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                        </div>
                        Preguntas Frecuentes
                    </h3>
                    <div className="space-y-6">
                        {[
                            { q: '¿Puedo cambiar de plan en cualquier momento?', a: 'Sí, puedes actualizar a un plan superior cuando lo necesites. Los cambios se aplican inmediatamente.' },
                            { q: '¿Qué pasa con mis datos si cancelo?', a: 'Mantenemos tus datos seguros por 30 días después de la cancelación por si decides volver.' },
                            { q: '¿Ofrecen descuentos por pago anual?', a: '¡Sí! Al pagar anualmente obtienes 2 meses gratis en cualquier plan.' },
                        ].map((item, i) => (
                            <div key={i}>
                                {i > 0 && <div className={`w-full h-px mb-6 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />}
                                <h4 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.q}</h4>
                                <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
