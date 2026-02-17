// ============================================
// EJEMPLO DE USO - Página de Nueva Contrato
// app/contracts/new/page.tsx
// ============================================

'use client';

import { CreateContractForm } from '@/components/rent';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

/**
 * Página para crear un nuevo contrato
 * 
 * Esta página muestra el formulario completo para crear contratos:
 * - Selección de alquiler
 * - Selección de plantilla
 * - Duración del contrato
 * - Garantías y cláusulas especiales
 * - Generación automática opcional
 * 
 * Para usar esta página:
 * 1. Crea la carpeta: app/contracts/new/
 * 2. Copia este archivo a: app/contracts/new/page.tsx
 * 3. Navega a /contracts/new en tu aplicación
 */
export default function NewContractPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto max-w-4xl p-6">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => router.push('/contracts')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver a Contratos
                    </button>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <CreateContractForm
                        onSuccess={(contractId) => {
                            // Redirigir al detalle del contrato creado
                            router.push(`/contracts/${contractId}`);
                        }}
                        onCancel={() => {
                            // Volver a la lista de contratos
                            router.push('/contracts');
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
