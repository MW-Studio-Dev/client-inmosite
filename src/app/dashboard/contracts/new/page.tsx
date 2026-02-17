'use client';

// ============================================
// Página: Crear Nuevo Contrato
// ============================================

import { CreateContractForm } from '@/components/rent';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useDashboardTheme } from '@/context/DashboardThemeContext';

/**
 * Página para crear un nuevo contrato de alquiler
 * 
 * Características:
 * - Formulario completo de creación
 * - Selección de alquiler y plantilla
 * - Configuración de duración y garantías
 * - Generación automática opcional
 * - Validación de campos
 * 
 * URL: /dashboard/contracts/new
 */
export default function NewContractPage() {
    const router = useRouter();
    const { theme } = useDashboardTheme();
    const isDark = theme === 'dark';

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-gray-50'
            }`}>
            <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
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

                {/* Form Card */}
                <div className={`rounded-lg border shadow-xl transition-colors duration-300 ${isDark
                        ? 'border-slate-700/50 bg-slate-900'
                        : 'border-gray-200 bg-white'
                    } p-6`}>
                    <CreateContractForm
                        onSuccess={(contractId) => {
                            // Redirigir al detalle del contrato creado
                            router.push(`/dashboard/contracts/${contractId}`);
                        }}
                        onCancel={() => {
                            // Volver a la lista de contratos
                            router.push('/dashboard/contracts');
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
