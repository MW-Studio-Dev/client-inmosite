// ============================================
// Hook para Rentals (Alquileres)
// ============================================

import { useState, useCallback } from 'react';
import { rentalService, Rental, ListParams } from '@/services/rentalService';
import { toast } from 'sonner';

interface UseRentalsOptions {
    autoFetch?: boolean;
    initialFilters?: ListParams;
}

export function useRentals(options: UseRentalsOptions = {}) {
    const { autoFetch = false, initialFilters } = options;

    const [rentals, setRentals] = useState<Rental[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState({
        total_active: 0,
        total_completed: 0,
        total_cancelled: 0,
        monthly_revenue: 0,
    });

    const fetchRentals = useCallback(async (params?: ListParams) => {
        setLoading(true);
        setError(null);
        try {
            const response = await rentalService.list(params);
            if (response.success) {
                setRentals(response.data.results);
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al cargar alquileres';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchStats = useCallback(async () => {
        try {
            const response = await rentalService.getStats();
            if (response.success) {
                setStats(response.data);
            }
        } catch (err: any) {
            console.error('Error al cargar estadísticas:', err);
        }
    }, []);

    const createRental = useCallback(async (data: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await rentalService.create(data);
            if (response.success) {
                toast.success(response.message || 'Alquiler creado exitosamente');
                await fetchRentals(initialFilters);
                return response.data;
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al crear alquiler';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchRentals, initialFilters]);

    const updateRental = useCallback(async (id: string, data: Partial<Rental>) => {
        setLoading(true);
        setError(null);
        try {
            const response = await rentalService.update(id, data);
            if (response.success) {
                toast.success(response.message || 'Alquiler actualizado exitosamente');
                await fetchRentals(initialFilters);
                return response.data;
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al actualizar alquiler';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchRentals, initialFilters]);

    const deleteRental = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await rentalService.delete(id);
            toast.success('Alquiler eliminado exitosamente');
            await fetchRentals(initialFilters);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al eliminar alquiler';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchRentals, initialFilters]);

    return {
        rentals,
        stats,
        loading,
        error,
        fetchRentals,
        fetchStats,
        createRental,
        updateRental,
        deleteRental,
    };
}
