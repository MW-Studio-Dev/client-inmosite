// ============================================
// EJEMPLO DE USO - Página de Plantillas
// app/contracts/templates/page.tsx
// ============================================

'use client';

import { ContractTemplatesList } from '@/components/rent';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * Página de gestión de plantillas de contratos
 * 
 * Esta página muestra todas las plantillas disponibles:
 * - Lista de plantillas activas e inactivas
 * - Indicador de plantilla predeterminada
 * - Validación de placeholders
 * - Vista previa de contenido
 * - Acciones: establecer como predeterminada, editar, eliminar
 * 
 * Para usar esta página:
 * 1. Crea la carpeta: app/contracts/templates/
 * 2. Copia este archivo a: app/contracts/templates/page.tsx
 * 3. Navega a /contracts/templates en tu aplicación
 */
export default function TemplatesPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto p-6">
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

                {/* Templates List Component */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <ContractTemplatesList />
                </div>
            </div>
        </div>
    );
}
