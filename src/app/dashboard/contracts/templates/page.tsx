'use client';

// ============================================
// Página: Gestión de Plantillas de Contratos
// ============================================

import { ContractTemplatesList } from '@/components/rent';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDashboardTheme } from '@/context/DashboardThemeContext';

/**
 * Página de gestión de plantillas de contratos
 * 
 * Características:
 * - Lista de todas las plantillas activas e inactivas
 * - Indicador visual de plantilla predeterminada  
 * - Validación de placeholders en tiempo real
 * - Vista previa del contenido de la plantilla
 * - Acciones: establecer como default, editar, eliminar
 * - Botón para crear nueva plantilla
 * 
 * URL: /dashboard/contracts/templates
 */
export default function TemplatesPage() {
    const router = useRouter();
    const { theme } = useDashboardTheme();
    const isDark = theme === 'dark';

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-gray-50'
            }`}>
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => router.push('/dashboard/contracts')}
                        className={`flex items-center gap-2 transition-colors ${isDark
                                ? 'text-slate-400 hover:text-slate-200'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver a Contratos
                    </button>
                </div>

                {/* Templates List Component */}
                <div className={`rounded-lg border shadow-xl transition-colors duration-300 ${isDark
                        ? 'border-slate-700/50 bg-slate-900'
                        : 'border-gray-200 bg-white'
                    } p-6`}>
                    <ContractTemplatesList />
                </div>
            </div>
        </div>
    );
}
