"use client";

import React from 'react';
import { HiCheck, HiStar, HiArrowRight } from 'react-icons/hi';
import type { Plan } from '@/types/subscription';

interface PlanCardProps {
    plan: Plan;
    currentPlanPrice: number;
    onUpgrade: (planSlug: string) => void;
    isLoading?: boolean;
    isDark?: boolean;
}

export const PlanCard: React.FC<PlanCardProps> = ({
    plan,
    currentPlanPrice,
    onUpgrade,
    isLoading = false,
    isDark = false,
}) => {
    const isCurrent = plan.is_current;
    const isDowngrade = plan.price_ars < currentPlanPrice && !isCurrent;
    const isPopular = plan.is_popular;
    const isEnterprise = plan.plan_type === 'enterprise';

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
            ${isCurrent
                ? isDark
                    ? 'ring-2 ring-green-500 bg-green-900/10 shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)]'
                    : 'ring-2 ring-green-500 bg-green-50 shadow-[0_0_15px_rgba(34,197,94,0.5)] hover:shadow-[0_0_25px_rgba(34,197,94,0.6)]'
                : ''
            }
        `}>
            {plan.highlight_text && !isCurrent && (
                <div className="absolute top-0 right-0">
                    <div className="bg-gradient-primary text-white px-4 py-1 rounded-bl-xl text-xs font-medium flex items-center gap-1 shadow-md">
                        <HiStar className="h-3 w-3" />
                        {plan.highlight_text.replace(/[⭐🏆]/g, '').trim()}
                    </div>
                </div>
            )}

            {isCurrent && (
                <div className="absolute top-0 right-0">
                    <div className="bg-green-500 text-white px-4 py-1 rounded-bl-xl text-xs font-medium flex items-center gap-1 shadow-md">
                        <HiCheck className="h-3 w-3" />
                        Plan Actual
                    </div>
                </div>
            )}

            <div className="p-8 flex flex-col h-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {plan.name}
                    </h3>

                    <div className="mb-4 flex items-baseline justify-center gap-1">
                        {plan.price_ars === 0 ? (
                            <div>
                                <span className={`text-4xl font-medium ${isDark ? 'text-white' : 'text-primary-600'}`}>Gratis</span>
                                <span className={`text-sm font-medium ml-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>/ {plan.duration_days} días</span>
                            </div>
                        ) : plan.price_ars == null || isNaN(Number(plan.price_ars)) ? (
                            <div>
                                <span className={`text-4xl font-medium ${isDark ? 'text-white' : 'text-primary-600'}`}>Consultar</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="flex items-baseline">
                                    <span className={`text-4xl font-medium ${isDark ? 'text-white' : 'text-primary-600'}`}>
                                        ${Number(plan.price_ars).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {plan.description && (
                        <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {plan.description}
                        </p>
                    )}
                </div>

                <div className={`w-full h-px mb-6 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />

                {/* Features */}
                <div className="space-y-4 mb-8 flex-grow">
                    {plan.features && Object.entries(plan.features as Record<string, any>).map(([key, value]) => {
                        if (value === false) return null;

                        let text = '';
                        switch (key) {
                            case 'agents':
                                text = value === 'Ilimitados' ? 'Agentes Ilimitados' : `${value} ${value === '1' ? 'Agente' : 'Agentes'}`;
                                break;
                            case 'contacts':
                                text = value === 'Ilimitados' ? 'Contactos Ilimitados' : `${value} Contactos`;
                                break;
                            case 'properties':
                                if (value === null) text = 'Propiedades Ilimitadas';
                                else text = `${value} Propiedades`;
                                break;
                            case 'analytics':
                                if (value) text = 'Análisis Avanzado';
                                break;
                            case 'api_access':
                                if (value) text = 'Acceso a API';
                                break;
                            case 'integrations':
                                if (value) text = 'Integraciones Premium';
                                break;
                            case 'custom_domain':
                                if (value) text = 'Dominio Personalizado';
                                break;
                            case 'priority_support':
                                if (value) text = 'Soporte Prioritario';
                                break;
                            default:
                                text = String(value);
                        }

                        if (!text) return null;

                        return (
                            <div key={key} className="flex items-start gap-3">
                                <HiCheck className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {text}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* CTA */}
                <div className="mt-auto pt-4">
                    {isEnterprise ? (
                        <a
                            href={`https://wa.me/5491234567890?text=Hola,%20quisiera%20consultar%20sobre%20el%20Plan%20Enterprise.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`
                                w-full py-3.5 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2
                                ${isDark
                                    ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg'
                                    : 'bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg'
                                }
                            `}
                        >
                            Consultar<HiArrowRight className="h-4 w-4" />
                        </a>
                    ) : (
                        <button
                            onClick={() => onUpgrade(plan.slug)}
                            disabled={isCurrent || isDowngrade || isLoading}
                            className={`
                                w-full py-3.5 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2
                                ${isCurrent
                                    ? isDark
                                        ? 'bg-green-900/30 text-green-400 cursor-default border border-green-800'
                                        : 'bg-green-100 text-green-700 cursor-default border border-green-200'
                                    : isDowngrade
                                        ? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-500'
                                        : 'bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg'
                                }
                            `}
                        >
                            {isCurrent ? (
                                <><HiCheck className="h-5 w-5" /> Plan Actual</>
                            ) : isDowngrade ? (
                                'No disponible'
                            ) : isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Procesando...
                                </>
                            ) : (
                                <>Seleccionar<HiArrowRight className="h-4 w-4" /></>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
