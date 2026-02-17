'use client';

// ============================================
// Página: Dashboard de Contratos
// ============================================

import { ContractsDashboard } from '@/components/rent';

/**
 * Página principal de gestión de contratos de alquiler
 * 
 * Características:
 * - Estadísticas generales (total, activos, pendientes, firmados)
 * - Búsqueda y filtros por estado
 * - Lista completa de contratos
 * - Acciones rápidas por contrato
 * - Botón para crear nuevo contrato
 * 
 * URL: /dashboard/contracts
 */
export default function ContractsPage() {
    return <ContractsDashboard />;
}
