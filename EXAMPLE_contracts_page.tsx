// ============================================
// EJEMPLO DE USO - Página de Contratos
// app/contracts/page.tsx
// ============================================

'use client';

import { ContractsDashboard } from '@/components/rent';

/**
 * Página principal de gestión de contratos
 * 
 * Esta página muestra el dashboard completo de contratos con:
 * - Estadísticas generales
 * - Búsqueda y filtros
 * - Lista de todos los contratos
 * - Acciones rápidas
 * 
 * Para usar esta página:
 * 1. Copia este archivo a: app/contracts/page.tsx
 * 2. Asegúrate de tener el backend corriendo
 * 3. Navega a /contracts en tu aplicación
 */
export default function ContractsPage() {
    return <ContractsDashboard />;
}
