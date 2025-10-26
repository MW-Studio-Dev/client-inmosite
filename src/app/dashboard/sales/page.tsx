'use client';

import { Suspense, useState } from 'react';
import { useProperties } from '@/hooks/useProperties';
import { useAuth } from '@/hooks/useAuth';
import { Property } from '@/types/property';
import Link from 'next/link';
import Image from 'next/image';
import {
  HiHome,
  HiCurrencyDollar,
  HiLocationMarker,
  HiCheckCircle,
  HiFilter,
  HiSearch,
  HiRefresh,
  HiEye,
  HiPencil,
  HiTrash,
  HiChartBar,
} from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function SalesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'disponible' | 'vendido' | 'reservado' | ''>('');
  const { company } = useAuth();

  const { properties, loading, error, refetch, totalProperties } = useProperties({
    filters: {
      operation_type: 'venta',
      ...(statusFilter && { status: statusFilter }),
    },
    subdomain: company?.subdomain || '',
  });

  // Filtrar por término de búsqueda en el cliente
  const filteredProperties = properties.filter((property) =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location_display.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const soldProperties = properties.filter((p) => p.status === 'vendido');
  const availableProperties = properties.filter((p) => p.status === 'disponible');
  const reservedProperties = properties.filter((p) => p.status === 'reservado');

  const totalRevenue = soldProperties.reduce((acc, property) => {
    const price = parseFloat(property.price_usd.replace(/[^0-9.-]+/g, ''));
    return acc + (isNaN(price) ? 0 : price);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Header moderno */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-red-700 to-red-800 p-8 text-white shadow-2xl">
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute -top-12 -right-12 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-12 -left-12 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

            <div className="relative z-10">
              <div className="mb-3 flex items-center gap-3">
                <HiCurrencyDollar className="h-8 w-8 text-red-200" />
                <h1 className="text-4xl font-black">Ventas</h1>
              </div>
              <p className="mb-6 text-xl font-medium text-white/90">
                Gestiona todas tus propiedades en venta
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
                  <HiHome className="h-5 w-5" />
                  <span className="font-medium">{totalProperties} propiedades</span>
                </div>
                <div className="flex items-center gap-3 rounded-full border border-red-300/30 bg-red-400/20 px-4 py-2 backdrop-blur-sm">
                  <HiCheckCircle className="h-5 w-5 text-red-200" />
                  <span className="font-medium">{soldProperties.length} vendidas</span>
                </div>
                <div className="flex items-center gap-3 rounded-full border border-green-300/30 bg-green-400/20 px-4 py-2 backdrop-blur-sm">
                  <HiChartBar className="h-5 w-5 text-green-200" />
                  <span className="font-medium">{availableProperties.length} disponibles</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total en Venta"
              value={availableProperties.length.toString()}
              subtitle="Propiedades activas"
              icon={<HiHome className="h-6 w-6" />}
              color="blue"
            />
            <StatCard
              title="Vendidas"
              value={soldProperties.length.toString()}
              subtitle="Este período"
              icon={<HiCheckCircle className="h-6 w-6" />}
              color="green"
            />
            <StatCard
              title="Reservadas"
              value={reservedProperties.length.toString()}
              subtitle="En proceso"
              icon={<HiCurrencyDollar className="h-6 w-6" />}
              color="yellow"
            />
            <StatCard
              title="Ingresos Totales"
              value={`$${(totalRevenue / 1000).toFixed(0)}K`}
              subtitle="USD de ventas"
              icon={<HiChartBar className="h-6 w-6" />}
              color="red"
            />
          </div>

          {/* Filtros y búsqueda */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HiFilter className="h-5 w-5 text-red-600" />
                Búsqueda y Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="relative">
                  <HiSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar propiedad..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-10 w-full rounded-lg border-2 border-gray-300 bg-white pl-10 pr-4 text-sm transition-all focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="h-10 rounded-lg border-2 border-gray-300 bg-white px-4 text-sm transition-all focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                >
                  <option value="">Todos los estados</option>
                  <option value="disponible">Disponible</option>
                  <option value="reservado">Reservado</option>
                  <option value="vendido">Vendido</option>
                </select>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('');
                    refetch();
                  }}
                  className="gap-2"
                >
                  <HiRefresh className="h-4 w-4" />
                  Limpiar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full rounded-none" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="flex flex-col items-center py-12">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <HiTrash className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-red-800">Error al cargar</h3>
                <p className="mb-6 text-red-600">{error}</p>
                <Button onClick={() => refetch()} className="gap-2">
                  <HiRefresh className="h-4 w-4" />
                  Reintentar
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Properties Grid */}
          {!loading && !error && filteredProperties.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredProperties.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center py-12">
                <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                  <HiHome className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  No se encontraron propiedades
                </h3>
                <p className="mb-6 max-w-md text-center text-gray-600">
                  {searchTerm || statusFilter
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'Comienza agregando propiedades en venta'}
                </p>
                <Link href="/dashboard/properties/new">
                  <Button className="gap-2">
                    <HiHome className="h-4 w-4" />
                    Agregar Propiedad
                  </Button>
                </Link>
              </CardContent>
            </Card>
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
  color = 'red',
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color?: 'red' | 'blue' | 'green' | 'yellow';
}) {
  const colorClasses = {
    red: 'from-red-500 to-red-600 text-white',
    blue: 'from-blue-500 to-blue-600 text-white',
    green: 'from-green-500 to-green-600 text-white',
    yellow: 'from-yellow-500 to-yellow-600 text-white',
  };

  return (
    <Card className="overflow-hidden border-0 shadow-lg transition-all hover:scale-105 hover:shadow-xl">
      <div className={`bg-gradient-to-br p-6 ${colorClasses[color]}`}>
        <div className="mb-4 flex items-start justify-between">
          <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">{icon}</div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-wider opacity-90">{title}</p>
          <p className="text-3xl font-black">{value}</p>
          <p className="text-sm font-medium opacity-90">{subtitle}</p>
        </div>
      </div>
    </Card>
  );
}

// Componente PropertyCard
function PropertyCard({ property }: { property: Property }) {
  const getStatusBadge = (status: Property['status']) => {
    const variants = {
      disponible: { variant: 'success' as const, label: 'Disponible' },
      vendido: { variant: 'secondary' as const, label: 'Vendido' },
      reservado: { variant: 'warning' as const, label: 'Reservado' },
      no_disponible: { variant: 'error' as const, label: 'No Disponible' },
    };
    return variants[status];
  };

  const statusBadge = getStatusBadge(property.status);

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-xl">
      <div className="relative h-48 w-full overflow-hidden bg-gray-200">
        {property.featured_image_url ? (
          <Image
            src={property.featured_image_url}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <HiHome className="h-16 w-16 text-gray-400" />
          </div>
        )}
        <div className="absolute right-3 top-3">
          <Badge {...statusBadge} rounded>
            {statusBadge.label}
          </Badge>
        </div>
      </div>

      <CardContent className="space-y-3 p-6">
        <div>
          <h3 className="mb-1 text-lg font-bold text-gray-900 line-clamp-1">{property.title}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <HiLocationMarker className="h-4 w-4" />
            <span className="line-clamp-1">{property.location_display}</span>
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-red-600">{property.price_display}</span>
          <span className="text-sm font-medium text-gray-500">USD</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          {property.bedrooms > 0 && <span>{property.bedrooms} dorm</span>}
          {property.bathrooms > 0 && <span>{property.bathrooms} baños</span>}
          {property.surface_total && <span>{property.surface_total} m²</span>}
        </div>

        <div className="flex gap-2 pt-4">
          <Link href={`/dashboard/properties/${property.id}`} className="flex-1">
            <Button variant="outline" size="sm" fullWidth className="gap-2">
              <HiEye className="h-4 w-4" />
              Ver
            </Button>
          </Link>
          <Link href={`/dashboard/properties/${property.id}/edit`} className="flex-1">
            <Button size="sm" fullWidth className="gap-2">
              <HiPencil className="h-4 w-4" />
              Editar
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
