'use client';

import { useState, useEffect } from 'react';
import {
  HiKey,
  HiCheckCircle,
  HiFilter,
  HiSearch,
  HiRefresh,
  HiChartBar,
  HiClock,
  HiExclamationCircle,
  HiCurrencyDollar,
} from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RentTable } from '@/components/dashboard/rents/RentTable';
import { useRentals } from '@/hooks/useRentals';
import { useDashboardTheme } from '@/context/DashboardThemeContext';
import { Rent } from '@/types/rent';
import { Rental } from '@/services/rentalService';

export default function RentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ACTIVE' | 'COMPLETED' | 'CANCELLED' | ''>('');
  const { theme } = useDashboardTheme();
  const isDark = theme === 'dark';

  // Usar hook para obtener datos de la API
  const {
    rentals,
    stats: apiStats,
    loading,
    fetchRentals,
    fetchStats,
  } = useRentals();

  // Cargar datos al montar el componente
  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const loadData = async () => {
    const params: any = {
      ordering: '-created_at',
    };

    if (statusFilter) {
      params.status = statusFilter;
    }

    if (searchTerm) {
      params.search = searchTerm;
    }

    await fetchRentals(params);
    await fetchStats();
  };

  // Filtrar alquileres localmente (búsqueda en tiempo real)
  const filteredRents = rentals.filter((rent) => {
    if (!searchTerm) return true;

    const matchesSearch =
      rent.property_detail?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rent.property_detail?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rent.owner_detail?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rent.tenant_detail?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Calcular estadísticas locales para mostrar
  const stats = {
    totalActive: apiStats.total_active,
    monthlyRevenue: apiStats.monthly_revenue,
    pendingThisMonth: filteredRents.filter(r => r.status === 'ACTIVE').length,
    latePayments: 0, // Esto vendría de un endpoint de cuotas vencidas
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-gray-50'
      }`}>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">


          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Alquileres Activos"
              value={stats.totalActive.toString()}
              subtitle="Contratos vigentes"
              icon={<HiCheckCircle className="h-6 w-6" />}
              color="emerald"
            />
            <StatCard
              title="Ingreso Mensual"
              value={`$${(stats.monthlyRevenue / 1000).toFixed(1)}K`}
              subtitle="USD por mes"
              icon={<HiCurrencyDollar className="h-6 w-6" />}
              color="blue"
            />
            <StatCard
              title="Pendientes de Pago"
              value={stats.pendingThisMonth.toString()}
              subtitle="Este mes"
              icon={<HiClock className="h-6 w-6" />}
              color="yellow"
            />
            <StatCard
              title="Pagos Vencidos"
              value={stats.latePayments.toString()}
              subtitle="Requieren atención"
              icon={<HiExclamationCircle className="h-6 w-6" />}
              color="red"
            />
          </div>

          {/* Filtros */}
          <div className={`rounded-lg border shadow-xl transition-colors duration-300 ${isDark
            ? 'border-slate-700/50 bg-slate-900'
            : 'border-gray-200 bg-white'
            }`}>
            <div className={`border-b px-6 py-4 transition-colors duration-300 ${isDark ? 'border-slate-700/50' : 'border-gray-200'
              }`}>
              <h3 className={`flex items-center gap-2 text-lg font-semibold transition-colors duration-300 ${isDark ? 'text-slate-200' : 'text-gray-900'
                }`}>
                <HiFilter className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                Búsqueda y Filtros
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="relative md:col-span-2">
                  <HiSearch className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-gray-400'
                    }`} />
                  <input
                    type="text"
                    placeholder="Buscar por propiedad, dueño o inquilino..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`h-10 w-full rounded-lg border pl-10 pr-4 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${isDark
                      ? 'border-slate-700 bg-slate-800 text-slate-200 placeholder-slate-400'
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                      }`}
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className={`h-10 rounded-lg border px-4 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${isDark
                    ? 'border-slate-700 bg-slate-800 text-slate-200'
                    : 'border-gray-300 bg-white text-gray-900'
                    }`}
                >
                  <option value="">Todos los estados</option>
                  <option value="ACTIVE">Activo</option>
                  <option value="COMPLETED">Completado</option>
                  <option value="CANCELLED">Cancelado</option>
                </select>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-gray-600'
                  }`}>
                  Mostrando <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-gray-900'
                    }`}>{filteredRents.length}</span> de{' '}
                  <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-gray-900'
                    }`}>{rentals.length}</span> alquileres
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('');
                    loadData();
                  }}
                  className="gap-2"
                >
                  <HiRefresh className="h-4 w-4" />
                  Limpiar filtros
                </Button>
              </div>
            </div>
          </div>

          {/* Tabla de Alquileres */}
          {loading ? (
            <div className={`rounded-lg border shadow-xl transition-colors duration-300 ${isDark
              ? 'border-slate-700/50 bg-slate-900'
              : 'border-gray-200 bg-white'
              }`}>
              <div className="flex flex-col items-center py-12">
                <HiRefresh className={`h-12 w-12 animate-spin transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-gray-400'
                  }`} />
                <p className={`mt-4 text-sm transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-gray-600'
                  }`}>
                  Cargando alquileres...
                </p>
              </div>
            </div>
          ) : filteredRents.length > 0 ? (
            <RentTable rents={filteredRents as Rental[]} />
          ) : (
            <div className={`rounded-lg border shadow-xl transition-colors duration-300 ${isDark
              ? 'border-slate-700/50 bg-slate-900'
              : 'border-gray-200 bg-white'
              }`}>
              <div className="flex flex-col items-center py-12">
                <div className={`mb-4 flex h-24 w-24 items-center justify-center rounded-full transition-colors duration-300 ${isDark ? 'bg-slate-800' : 'bg-gray-100'
                  }`}>
                  <HiKey className={`h-12 w-12 transition-colors duration-300 ${isDark ? 'text-slate-600' : 'text-gray-400'
                    }`} />
                </div>
                <h3 className={`mb-2 text-xl font-bold transition-colors duration-300 ${isDark ? 'text-slate-200' : 'text-gray-900'
                  }`}>
                  No se encontraron alquileres
                </h3>
                <p className={`mb-6 max-w-md text-center transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-gray-600'
                  }`}>
                  {searchTerm || statusFilter
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'Comienza agregando alquileres al sistema'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente StatCard
function StatCard({
  title,
  value,
  subtitle,
  icon,
  color = 'blue',
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color?: 'emerald' | 'blue' | 'yellow' | 'red';
}) {
  const { theme } = useDashboardTheme();
  const isDark = theme === 'dark';

  const colorClasses = {
    emerald: isDark
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      : 'bg-emerald-50 text-emerald-600 border-emerald-200',
    blue: isDark
      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      : 'bg-blue-50 text-blue-600 border-blue-200',
    yellow: isDark
      ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      : 'bg-yellow-50 text-yellow-600 border-yellow-200',
    red: isDark
      ? 'bg-red-500/10 text-red-400 border-red-500/20'
      : 'bg-red-50 text-red-600 border-red-200',
  };

  return (
    <div className={`rounded-lg border p-6 shadow-xl transition-all hover:shadow-2xl ${isDark
      ? 'border-slate-700/50 bg-slate-900 hover:border-slate-600'
      : 'border-gray-200 bg-white hover:border-gray-300'
      }`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-gray-600'
            }`}>{title}</p>
          <p className={`mt-2 text-3xl font-bold transition-colors duration-300 ${isDark ? 'text-slate-100' : 'text-gray-900'
            }`}>{value}</p>
          <p className={`mt-1 text-sm transition-colors duration-300 ${isDark ? 'text-slate-500' : 'text-gray-500'
            }`}>{subtitle}</p>
        </div>
        <div className={`rounded-lg border p-3 transition-colors duration-300 ${colorClasses[color]}`}>{icon}</div>
      </div>
    </div>
  );
}
