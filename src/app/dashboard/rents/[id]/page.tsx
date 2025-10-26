'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  HiArrowLeft,
  HiHome,
  HiUser,
  HiDocumentText,
  HiCurrencyDollar,
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiCalendar,
  HiExclamationCircle,
  HiPencil,
} from 'react-icons/hi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { mockRents } from '@/data/mockRents';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function RentDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const rent = mockRents.find((r) => r.id === id);

  if (!rent) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-12 text-center">
            <HiExclamationCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Alquiler no encontrado</h2>
            <p className="mb-6 text-gray-600">No se pudo encontrar el alquiler con ID: {id}</p>
            <Button onClick={() => router.push('/dashboard/rents')}>Volver a alquileres</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatCurrency = (amount: number, currency: string) => {
    const formatted = amount.toLocaleString('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return `${currency} ${formatted}`;
  };

  const formatDate = (dateString: string) => {
    if (dateString === 'N/A') return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getPaymentStatusBadge = () => {
    const variants = {
      paid: { variant: 'success' as const, label: 'Pagado' },
      pending: { variant: 'warning' as const, label: 'Pendiente' },
      late: { variant: 'error' as const, label: 'Vencido' },
      partial: { variant: 'outline' as const, label: 'Parcial' },
    };
    return variants[rent.payment.status];
  };

  const getRentStatusBadge = () => {
    const variants = {
      active: { variant: 'success' as const, label: 'Activo' },
      expired: { variant: 'error' as const, label: 'Vencido' },
      cancelled: { variant: 'outline' as const, label: 'Cancelado' },
      pending: { variant: 'warning' as const, label: 'Pendiente' },
    };
    return variants[rent.status];
  };

  const paymentBadge = getPaymentStatusBadge();
  const statusBadge = getRentStatusBadge();
  const paymentProgress = (rent.payment.paidMonths / rent.payment.totalMonths) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/dashboard/rents')}
              className="gap-2"
            >
              <HiArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Detalle del Alquiler</h1>
              <p className="text-sm text-gray-500">ID: {rent.id}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <HiPencil className="h-4 w-4" />
              Editar
            </Button>
            <Button className="gap-2">
              <HiCurrencyDollar className="h-4 w-4" />
              Registrar Pago
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600">Estado del alquiler:</div>
                  <Badge {...statusBadge} size="lg">
                    {statusBadge.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600">Estado del pago:</div>
                  <Badge {...paymentBadge} size="lg">
                    {paymentBadge.label}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HiHome className="h-5 w-5 text-blue-600" />
                Informacion de la Propiedad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="relative h-64 overflow-hidden rounded-lg bg-gray-100">
                  {rent.propertyImage ? (
                    <Image
                      src={rent.propertyImage}
                      alt={rent.propertyTitle}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <HiHome className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{rent.propertyTitle}</h3>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600">
                    <HiLocationMarker className="mt-1 h-5 w-5 flex-shrink-0" />
                    <span>{rent.propertyAddress}</span>
                  </div>
                  <div className="pt-4">
                    <Link href={`/dashboard/properties/${rent.propertyId}`}>
                      <Button variant="outline" className="gap-2">
                        <HiHome className="h-4 w-4" />
                        Ver propiedad completa
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HiUser className="h-5 w-5 text-blue-600" />
                  Propietario
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nombre completo</p>
                  <p className="text-lg font-semibold text-gray-900">{rent.owner.name}</p>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <HiMail className="h-5 w-5" />
                  <a href={`mailto:${rent.owner.email}`} className="hover:text-blue-600">
                    {rent.owner.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <HiPhone className="h-5 w-5" />
                  <a href={`tel:${rent.owner.phone}`} className="hover:text-blue-600">
                    {rent.owner.phone}
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HiUser className="h-5 w-5 text-green-600" />
                  Inquilino
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nombre completo</p>
                  <p className="text-lg font-semibold text-gray-900">{rent.tenant.name}</p>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <HiMail className="h-5 w-5" />
                  <a href={`mailto:${rent.tenant.email}`} className="hover:text-blue-600">
                    {rent.tenant.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <HiPhone className="h-5 w-5" />
                  <a href={`tel:${rent.tenant.phone}`} className="hover:text-blue-600">
                    {rent.tenant.phone}
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HiDocumentText className="h-5 w-5 text-blue-600" />
                Detalles del Contrato
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Fecha de inicio</p>
                    <div className="flex items-center gap-2 text-gray-900">
                      <HiCalendar className="h-5 w-5 text-blue-600" />
                      <p className="text-lg font-semibold">{formatDate(rent.contract.startDate)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Fecha de fin</p>
                    <div className="flex items-center gap-2 text-gray-900">
                      <HiCalendar className="h-5 w-5 text-red-600" />
                      <p className="text-lg font-semibold">{formatDate(rent.contract.endDate)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Monto mensual</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(rent.contract.monthlyAmount, rent.contract.currency)}
                    </p>
                  </div>
                  {rent.contract.monthlyAdjustment && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Ajuste mensual</p>
                      <p className="text-lg font-semibold text-green-600">
                        +{rent.contract.monthlyAdjustment}%
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Deposito</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(rent.contract.deposit, rent.contract.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Dia de vencimiento</p>
                    <p className="text-lg font-semibold text-gray-900">
                      Dia {rent.contract.dueDay} de cada mes
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Link href={`/dashboard/contracts/${rent.contract.id}`}>
                  <Button variant="outline" className="gap-2">
                    <HiDocumentText className="h-4 w-4" />
                    Ver contrato completo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HiCurrencyDollar className="h-5 w-5 text-blue-600" />
                Estado de Pagos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Periodo actual</p>
                  <p className="text-lg font-semibold text-gray-900">{rent.payment.currentMonth}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Proximo pago</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDate(rent.payment.nextPaymentDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Monto adeudado</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(rent.payment.amountDue, rent.contract.currency)}
                  </p>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">Progreso de pagos</span>
                  <span className="font-semibold text-gray-900">
                    {rent.payment.paidMonths} / {rent.payment.totalMonths} meses
                  </span>
                </div>
                <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                    style={{ width: `${paymentProgress}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">{paymentProgress.toFixed(0)}% completado</p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                <Button className="gap-2">
                  <HiCurrencyDollar className="h-4 w-4" />
                  Registrar nuevo pago
                </Button>
                <Button variant="outline" className="gap-2">
                  <HiDocumentText className="h-4 w-4" />
                  Ver historial de pagos
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
