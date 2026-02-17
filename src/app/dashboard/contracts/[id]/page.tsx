'use client';

// ============================================
// Página: Detalle de Contrato (Workflow)
// ============================================

import { ContractWorkflow } from '@/components/rent';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useDashboardTheme } from '@/context/DashboardThemeContext';

/**
 * Página de detalle de un contrato específico
 * 
 * Muestra el workflow completo del contrato:
 * - Estados: Draft → Generated → Signed → Active
 * - Acciones contextuales según el estado actual
 * - Vista previa del contenido generado
 * - Información de las partes (locador, locatario, inmueble)
 * - Botones de acción (generar, firmar, activar, cancelar)
 * 
 * URL: /dashboard/contracts/[id]
 */
export default function ContractDetailPage({
    params
}: {
    params: { id: string }
}) {
    const router = useRouter();
    const { theme } = useDashboardTheme();
    const isDark = theme === 'dark';

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-gray-50'
            }`}>
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Back Button */}
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

                {/* Contract Workflow Component */}
                <ContractWorkflow
                    contractId={params.id}
                    onUpdate={() => {
                        // Refrescar la página cuando se actualice el contrato
                        router.refresh();
                    }}
                />
            </div>
        </div>
    );
}
