// ============================================
// EJEMPLO DE USO - Página de Detalle de Contrato
// app/contracts/[id]/page.tsx
// ============================================

'use client';

import { ContractWorkflow } from '@/components/rent';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

/**
 * Página de detalle de un contrato específico
 * 
 * Esta página muestra el workflow completo de un contrato:
 * - Estados del workflow (Draft, Generated, Signed, Active)
 * - Acciones según el estado
 * - Vista previa del contenido
 * - Información de las partes
 * 
 * Para usar esta página:
 * 1. Crea la carpeta: app/contracts/[id]/
 * 2. Copia este archivo a: app/contracts/[id]/page.tsx
 * 3. Navega a /contracts/{contract-id} en tu aplicación
 */
export default function ContractDetailPage({
    params
}: {
    params: { id: string }
}) {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto p-6">
                {/* Back Button */}
                <button
                    onClick={() => router.push('/contracts')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a Contratos
                </button>

                {/* Contract Workflow Component */}
                <ContractWorkflow
                    contractId={params.id}
                    onUpdate={() => {
                        // Opcional: refrescar datos o realizar otra acción
                        router.refresh();
                    }}
                />
            </div>
        </div>
    );
}
