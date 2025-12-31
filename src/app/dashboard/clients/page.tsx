'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  HiUsers,
  HiSearch,
  HiFilter,
  HiPlus,
  HiRefresh,
  HiOfficeBuilding,
  HiUserGroup,
  HiClock,
  HiExclamationCircle,
} from 'react-icons/hi';
import { useClients, ClientStats, fetchClientStats } from '@/hooks/useClients';
import { ClientTable } from '@/components/dashboard/clients/ClientTable';
import { useDashboardTheme } from '@/context/DashboardThemeContext';

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { theme } = useDashboardTheme();
  const isDark = theme === 'dark';

  // Hook para cargar clientes
  const {
    clients,
    loading,
    error,
    pagination,
    fetchClients,
    refetch
  } = useClients({
    search: debouncedSearch,
    status: statusFilter,
    clientType: typeFilter,
    autoFetch: true
  });

  // Estado local para manejar actualizaciones en tiempo real
  const [updatedClients, setUpdatedClients] = useState(clients);

  // Sincronizar estado local cuando cambian los clientes del hook
  useEffect(() => {
    setUpdatedClients(clients);
  }, [clients]);

  // Estado para estadísticas
  const [stats, setStats] = useState<ClientStats>({
    overview: {
      total_clients: 0,
      active_clients: 0,
      inactive_clients: 0,
      active_percentage: 0
    },
    by_type: {},
    by_activity: {},
    investors: {
      total_investors: 0,
      with_properties: 0,
      seeking_investments: 0,
      actively_investing: 0,
      available_for_investment: 0
    },
    growth: {
      last_30_days: 0,
      previous_30_days: 0,
      growth_trend_percentage: 0,
      growth_trend_label: 'estable'
    }
  });
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Cargar estadísticas
  useEffect(() => {
    const loadStats = async () => {
      setStatsLoading(true);
      setStatsError(null);
      try {
        const statsData = await fetchClientStats();
        setStats(statsData);
      } catch (err: any) {
        setStatsError(err.message || 'Error al cargar estadísticas');
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, []);

  // Filtrar clientes localmente (si es necesario)
  const filteredClients = updatedClients.filter((client) => {
    const matchesSearch = !searchTerm ||
      client.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.includes(searchTerm);

    const matchesStatus = !statusFilter || client.status === statusFilter;
    const matchesType = !typeFilter || client.client_type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (

    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className={`text-2xl font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              Clientes
            </h1>
            <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
              Gestiona los clientes y sus propiedades
            </p>
          </div>
          <Link href="/dashboard/clients/new">
            <button className={`px-4 py-2 rounded-lg border text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 flex items-center gap-2 ${isDark
              ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
              : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
              }`}>
              <HiPlus className="h-4 w-4" />
              Nuevo Cliente
            </button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Clientes"
            value={stats.overview.total_clients.toString()}
            subtitle="En la base de datos"
            icon={<HiUsers className="h-6 w-6" />}
            color="blue"
            loading={statsLoading}
          />
          <StatCard
            title="Propietarios"
            value={stats.by_type.PROPIETARIO?.count?.toString() || "0"}
            subtitle="Con propiedades registradas"
            icon={<HiOfficeBuilding className="h-6 w-6" />}
            color="emerald"
            loading={statsLoading}
          />
          <StatCard
            title="Inquilinos"
            value={stats.by_type.INQUILINO?.count?.toString() || "0"}
            subtitle="Buscando o alquilando"
            icon={<HiUserGroup className="h-6 w-6" />}
            color="yellow"
            loading={statsLoading}
          />
          <StatCard
            title="Nuevos Este Mes"
            value={stats.growth.last_30_days.toString()}
            subtitle="Últimos 30 días"
            icon={<HiClock className="h-6 w-6" />}
            color="red"
            loading={statsLoading}
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="relative md:col-span-2">
                <HiSearch className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-gray-400'
                  }`} />
                <input
                  type="text"
                  placeholder="Buscar por nombre, email, teléfono o DNI..."
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
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`h-10 rounded-lg border px-4 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${isDark
                  ? 'border-slate-700 bg-slate-800 text-slate-200'
                  : 'border-gray-300 bg-white text-gray-900'
                  }`}
              >
                <option value="">Todos los estados</option>
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className={`h-10 rounded-lg border px-4 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${isDark
                  ? 'border-slate-700 bg-slate-800 text-slate-200'
                  : 'border-gray-300 bg-white text-gray-900'
                  }`}
              >
                <option value="">Todos los tipos</option>
                <option value="PROPIETARIO">Propietario</option>
                <option value="INQUILINO">Inquilino</option>
                <option value="INVERSOR">Inversor</option>
                <option value="GARANTE">Garante</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-4">
              <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-gray-600'
                }`}>
                {loading ? (
                  'Cargando...'
                ) : (
                  <>
                    Mostrando <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-gray-900'
                      }`}>{filteredClients.length}</span> de{' '}
                    <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-gray-900'
                      }`}>{clients.length}</span> clientes
                  </>
                )}
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setTypeFilter('');
                  refetch();
                }}
                className={`px-4 py-2 rounded-lg border text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 flex items-center gap-2 ${isDark
                  ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                  : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                  }`}
              >
                <HiRefresh className="h-4 w-4" />
                Limpiar filtros
              </button>
            </div>

          </div>
        </div>

        {/* Error */}
        {error && (
          <div className={`rounded-lg border shadow-xl transition-colors duration-300 ${isDark
            ? 'border-red-500/50 bg-red-500/10'
            : 'border-red-200 bg-red-50'
            }`}>
            <div className="p-6">
              <div className="flex items-center gap-3">
                <HiExclamationCircle className={`h-6 w-6 ${isDark ? 'text-red-400' : 'text-red-600'
                  }`} />
                <div>
                  <h3 className={`font-semibold ${isDark ? 'text-red-400' : 'text-red-800'
                    }`}>
                    Error al cargar clientes
                  </h3>
                  <p className={`text-sm mt-1 ${isDark ? 'text-red-300' : 'text-red-700'
                    }`}>
                    {error}
                  </p>
                  <button
                    onClick={refetch}
                    className={`mt-2 px-3 py-1 rounded text-sm transition-colors ${isDark
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                  >
                    Reintentar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabla de Clientes */}
        <ClientTable
          clients={filteredClients}
          loading={loading}
          pagination={pagination}
          onPageChange={(page) => fetchClients({ page })}
          onDocumentDelete={async (clientId: string, documentId: string) => {
            try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/documents/${documentId}/`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
              });

              if (response.ok) {
                // Actualizar el cliente localmente
                const updatedClients = clients.map(client => {
                  if (client.id === clientId) {
                    return {
                      ...client,
                      documents: client.documents.filter((doc: any) => doc.id !== documentId),
                      documents_count: client.documents_count - 1
                    };
                  }
                  return client;
                });
                // Actualizar el estado local para reflejar los cambios inmediatamente
                setUpdatedClients(updatedClients);
              } else {
                console.error('Error al eliminar documento');
              }
            } catch (error) {
              console.error('Error al eliminar documento:', error);
            }
          }}
        />


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
  loading = false,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color?: 'emerald' | 'blue' | 'yellow' | 'red';
  loading?: boolean;
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
          <div className={`mt-2 text-3xl font-bold transition-colors duration-300 ${isDark ? 'text-slate-100' : 'text-gray-900'
            }`}>
            {loading ? (
              <div className="animate-pulse h-8 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
            ) : (
              value
            )}
          </div>
          <p className={`mt-1 text-sm transition-colors duration-300 ${isDark ? 'text-slate-500' : 'text-gray-500'
            }`}>{subtitle}</p>
        </div>
        <div className={`rounded-lg border p-3 transition-colors duration-300 ${colorClasses[color]}`}>{icon}</div>
      </div>
    </div>
  );
}
