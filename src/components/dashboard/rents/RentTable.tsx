'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Rent, PaymentStatus, RentStatus, AdjustmentIndex } from '@/types/rent';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/button';
import {
  HiEye,
  HiPencil,
  HiDocumentText,
  HiCurrencyDollar,
  HiTrash,
  HiPhone,
  HiMail,
  HiHome,
  HiTrendingUp,
} from 'react-icons/hi';
import { useDashboardTheme } from '@/context/DashboardThemeContext';

interface RentTableProps {
  rents: Rent[];
}

export function RentTable({ rents }: RentTableProps) {
  const router = useRouter();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const { theme } = useDashboardTheme();
  const isDark = theme === 'dark';

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    const variants = {
      paid: { variant: 'success' as const, label: 'Pagado' },
      pending: { variant: 'warning' as const, label: 'Pendiente' },
      late: { variant: 'error' as const, label: 'Vencido' },
      partial: { variant: 'outline' as const, label: 'Parcial' },
    };
    return variants[status];
  };

  const getRentStatusBadge = (status: RentStatus) => {
    const variants = {
      active: { variant: 'success' as const, label: 'Activo' },
      expired: { variant: 'error' as const, label: 'Vencido' },
      cancelled: { variant: 'outline' as const, label: 'Cancelado' },
      pending: { variant: 'warning' as const, label: 'Pendiente' },
    };
    return variants[status];
  };

  const getIndexBadgeColor = (indexType: AdjustmentIndex) => {
    const colors = {
      IPC: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      ICL: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      fixed: 'bg-green-500/10 text-green-400 border-green-500/20',
      percentage: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      none: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    };
    return colors[indexType];
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${currency} ${amount.toLocaleString('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const formatDate = (dateString: string) => {
    if (dateString === 'N/A') return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatShortDate = (dateString: string) => {
    if (dateString === 'N/A') return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
    });
  };

  return (
    <div className={`overflow-hidden rounded-lg border shadow-xl transition-colors duration-300 ${
      isDark
        ? 'border-slate-700/50 bg-slate-900'
        : 'border-gray-200 bg-white'
    }`}>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className={`border-b transition-colors duration-300 ${
            isDark
              ? 'bg-slate-800/80 border-slate-700'
              : 'bg-gray-50 border-gray-200'
          }`}>
            <tr>
              <th className={`px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                isDark ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Propiedad
              </th>
              <th className={`px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                isDark ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Dueño
              </th>
              <th className={`px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                isDark ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Inquilino
              </th>
              <th className={`px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                isDark ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Monto
              </th>
              <th className={`px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                isDark ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Estado
              </th>
              <th className={`px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                isDark ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Pago
              </th>
              <th className={`px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                isDark ? 'text-slate-300' : 'text-gray-700'
              }`}>
                <div className="flex items-center gap-1">
                  <HiTrendingUp className="h-3.5 w-3.5" />
                  Próximo Aumento
                </div>
              </th>
              <th className={`px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                isDark ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y transition-colors duration-300 ${
            isDark ? 'divide-slate-700/50' : 'divide-gray-200'
          }`}>
            {rents.map((rent) => {
              const paymentBadge = getPaymentStatusBadge(rent.payment.status);
              const statusBadge = getRentStatusBadge(rent.status);
              const isExpanded = expandedRow === rent.id;
              const nextAdj = rent.contract.nextAdjustment;

              return (
                <>
                  <tr
                    key={rent.id}
                    className={`cursor-pointer transition-colors duration-200 ${
                      isDark ? 'hover:bg-slate-800/40' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setExpandedRow(isExpanded ? null : rent.id)}
                  >
                    {/* Propiedad */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg transition-colors duration-300 ${
                          isDark ? 'bg-slate-800' : 'bg-gray-100'
                        }`}>
                          {rent.propertyImage ? (
                            <Image
                              src={rent.propertyImage}
                              alt={rent.propertyTitle}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <HiHome className={`h-5 w-5 transition-colors duration-300 ${
                                isDark ? 'text-slate-600' : 'text-gray-400'
                              }`} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 max-w-[180px]">
                          <p className={`truncate font-semibold text-sm transition-colors duration-300 ${
                            isDark ? 'text-slate-100' : 'text-gray-900'
                          }`}>
                            {rent.propertyTitle}
                          </p>
                          <p className={`truncate text-xs transition-colors duration-300 ${
                            isDark ? 'text-slate-400' : 'text-gray-500'
                          }`}>
                            {rent.propertyAddress}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Dueño */}
                    <td className="px-3 py-3">
                      <div className="max-w-[140px]">
                        <p className={`truncate font-medium text-sm transition-colors duration-300 ${
                          isDark ? 'text-slate-200' : 'text-gray-900'
                        }`}>{rent.owner.name}</p>
                        <p className={`truncate text-xs transition-colors duration-300 ${
                          isDark ? 'text-slate-400' : 'text-gray-500'
                        }`}>{rent.owner.phone}</p>
                      </div>
                    </td>

                    {/* Inquilino */}
                    <td className="px-3 py-3">
                      <div className="max-w-[140px]">
                        <p className={`truncate font-medium text-sm transition-colors duration-300 ${
                          isDark ? 'text-slate-200' : 'text-gray-900'
                        }`}>{rent.tenant.name}</p>
                        <p className={`truncate text-xs transition-colors duration-300 ${
                          isDark ? 'text-slate-400' : 'text-gray-500'
                        }`}>{rent.tenant.phone}</p>
                      </div>
                    </td>

                    {/* Monto */}
                    <td className="px-3 py-3">
                      <div className="space-y-0.5">
                        <p className={`text-sm font-bold transition-colors duration-300 ${
                          isDark ? 'text-emerald-400' : 'text-emerald-600'
                        }`}>
                          {formatCurrency(rent.contract.monthlyAmount, rent.contract.currency)}
                        </p>
                        <p className={`text-xs transition-colors duration-300 ${
                          isDark ? 'text-slate-500' : 'text-gray-500'
                        }`}>
                          {rent.payment.paidMonths}/{rent.payment.totalMonths} meses
                        </p>
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="px-3 py-3">
                      <Badge {...statusBadge} rounded size="sm">
                        {statusBadge.label}
                      </Badge>
                    </td>

                    {/* Pago */}
                    <td className="px-3 py-3">
                      <Badge {...paymentBadge} rounded size="sm">
                        {paymentBadge.label}
                      </Badge>
                    </td>

                    {/* Próximo Aumento */}
                    <td className="px-3 py-3">
                      {nextAdj ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${getIndexBadgeColor(nextAdj.indexType)}`}>
                              {nextAdj.indexType}
                            </span>
                            {nextAdj.percentage && (
                              <span className={`text-xs font-semibold transition-colors duration-300 ${
                                isDark ? 'text-orange-400' : 'text-orange-500'
                              }`}>
                                +{nextAdj.percentage}%
                              </span>
                            )}
                          </div>
                          <p className={`text-xs transition-colors duration-300 ${
                            isDark ? 'text-slate-400' : 'text-gray-500'
                          }`}>
                            {formatShortDate(nextAdj.date)}
                          </p>
                        </div>
                      ) : (
                        <span className={`text-xs transition-colors duration-300 ${
                          isDark ? 'text-slate-500' : 'text-gray-500'
                        }`}>Sin ajuste</span>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="px-3 py-3">
                      <div className="flex justify-end gap-1.5">
                        <Button
                            variant="outline"
                            size="sm"
                            title="Ver detalle"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/dashboard/rents/${rent.id}`);
                            }}
                          >
                            <HiEye className="h-3.5 w-3.5" />
                          </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Editar', rent.id);
                          }}
                          title="Editar"
                          className="h-8 w-8 p-0"
                        >
                          <HiPencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Registrar pago', rent.id);
                          }}
                          title="Registrar pago"
                          className="h-8 w-8 p-0"
                        >
                          <HiCurrencyDollar className={`h-3.5 w-3.5 transition-colors duration-300 ${
                            isDark ? 'text-emerald-400' : 'text-emerald-600'
                          }`} />
                        </Button>
                      </div>
                    </td>
                  </tr>

                  {/* Fila expandida con más detalles */}
                  {isExpanded && (
                    <tr className={`transition-colors duration-300 ${
                      isDark ? 'bg-slate-800/60' : 'bg-gray-50'
                    }`}>
                      <td colSpan={8} className="px-4 py-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          {/* Información del dueño */}
                          <div className={`rounded-lg border p-4 transition-colors duration-300 ${
                            isDark
                              ? 'border-slate-700 bg-slate-800/80'
                              : 'border-gray-200 bg-white'
                          }`}>
                            <h4 className={`mb-3 flex items-center gap-2 text-sm font-bold transition-colors duration-300 ${
                              isDark ? 'text-slate-200' : 'text-gray-900'
                            }`}>
                              <HiDocumentText className={`h-4 w-4 transition-colors duration-300 ${
                                isDark ? 'text-blue-400' : 'text-blue-500'
                              }`} />
                              Información del Dueño
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p className={`transition-colors duration-300 ${
                                isDark ? 'text-slate-300' : 'text-gray-700'
                              }`}>
                                <span className={`font-semibold transition-colors duration-300 ${
                                  isDark ? 'text-slate-200' : 'text-gray-900'
                                }`}>Nombre:</span> {rent.owner.name}
                              </p>
                              <div className="flex items-center gap-2">
                                <HiMail className={`h-4 w-4 transition-colors duration-300 ${
                                  isDark ? 'text-slate-500' : 'text-gray-400'
                                }`} />
                                <a
                                  href={`mailto:${rent.owner.email}`}
                                  className={`hover:underline transition-colors duration-300 ${
                                    isDark ? 'text-blue-400' : 'text-blue-600'
                                  }`}
                                >
                                  {rent.owner.email}
                                </a>
                              </div>
                              <div className="flex items-center gap-2">
                                <HiPhone className={`h-4 w-4 transition-colors duration-300 ${
                                  isDark ? 'text-slate-500' : 'text-gray-400'
                                }`} />
                                <a
                                  href={`tel:${rent.owner.phone}`}
                                  className={`hover:underline transition-colors duration-300 ${
                                    isDark ? 'text-blue-400' : 'text-blue-600'
                                  }`}
                                >
                                  {rent.owner.phone}
                                </a>
                              </div>
                            </div>
                          </div>

                          {/* Información del inquilino */}
                          <div className={`rounded-lg border p-4 transition-colors duration-300 ${
                            isDark
                              ? 'border-slate-700 bg-slate-800/80'
                              : 'border-gray-200 bg-white'
                          }`}>
                            <h4 className={`mb-3 flex items-center gap-2 text-sm font-bold transition-colors duration-300 ${
                              isDark ? 'text-slate-200' : 'text-gray-900'
                            }`}>
                              <HiDocumentText className={`h-4 w-4 transition-colors duration-300 ${
                                isDark ? 'text-green-400' : 'text-green-600'
                              }`} />
                              Información del Inquilino
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p className={`transition-colors duration-300 ${
                                isDark ? 'text-slate-300' : 'text-gray-700'
                              }`}>
                                <span className={`font-semibold transition-colors duration-300 ${
                                  isDark ? 'text-slate-200' : 'text-gray-900'
                                }`}>Nombre:</span> {rent.tenant.name}
                              </p>
                              <div className="flex items-center gap-2">
                                <HiMail className={`h-4 w-4 transition-colors duration-300 ${
                                  isDark ? 'text-slate-500' : 'text-gray-400'
                                }`} />
                                <a
                                  href={`mailto:${rent.tenant.email}`}
                                  className={`hover:underline transition-colors duration-300 ${
                                    isDark ? 'text-blue-400' : 'text-blue-600'
                                  }`}
                                >
                                  {rent.tenant.email}
                                </a>
                              </div>
                              <div className="flex items-center gap-2">
                                <HiPhone className={`h-4 w-4 transition-colors duration-300 ${
                                  isDark ? 'text-slate-500' : 'text-gray-400'
                                }`} />
                                <a
                                  href={`tel:${rent.tenant.phone}`}
                                  className={`hover:underline transition-colors duration-300 ${
                                    isDark ? 'text-blue-400' : 'text-blue-600'
                                  }`}
                                >
                                  {rent.tenant.phone}
                                </a>
                              </div>
                            </div>
                          </div>

                          {/* Detalles del contrato y pago */}
                          <div className={`rounded-lg border p-4 transition-colors duration-300 ${
                            isDark
                              ? 'border-slate-700 bg-slate-800/80'
                              : 'border-gray-200 bg-white'
                          }`}>
                            <h4 className={`mb-3 flex items-center gap-2 text-sm font-bold transition-colors duration-300 ${
                              isDark ? 'text-slate-200' : 'text-gray-900'
                            }`}>
                              <HiCurrencyDollar className={`h-4 w-4 transition-colors duration-300 ${
                                isDark ? 'text-yellow-400' : 'text-yellow-600'
                              }`} />
                              Detalles del Contrato
                            </h4>
                            <div className={`space-y-2 text-sm transition-colors duration-300 ${
                              isDark ? 'text-slate-300' : 'text-gray-700'
                            }`}>
                              <p>
                                <span className={`font-semibold transition-colors duration-300 ${
                                  isDark ? 'text-slate-200' : 'text-gray-900'
                                }`}>Inicio:</span>{' '}
                                {formatDate(rent.contract.startDate)}
                              </p>
                              <p>
                                <span className={`font-semibold transition-colors duration-300 ${
                                  isDark ? 'text-slate-200' : 'text-gray-900'
                                }`}>Fin:</span>{' '}
                                {formatDate(rent.contract.endDate)}
                              </p>
                              <p>
                                <span className={`font-semibold transition-colors duration-300 ${
                                  isDark ? 'text-slate-200' : 'text-gray-900'
                                }`}>Monto mensual:</span>{' '}
                                {formatCurrency(
                                  rent.contract.monthlyAmount,
                                  rent.contract.currency
                                )}
                              </p>
                              <p>
                                <span className={`font-semibold transition-colors duration-300 ${
                                  isDark ? 'text-slate-200' : 'text-gray-900'
                                }`}>Depósito:</span>{' '}
                                {formatCurrency(rent.contract.deposit, rent.contract.currency)}
                              </p>
                              <p>
                                <span className={`font-semibold transition-colors duration-300 ${
                                  isDark ? 'text-slate-200' : 'text-gray-900'
                                }`}>Día de vencimiento:</span>{' '}
                                {rent.contract.dueDay}
                              </p>
                              <p>
                                <span className={`font-semibold transition-colors duration-300 ${
                                  isDark ? 'text-slate-200' : 'text-gray-900'
                                }`}>Próximo pago:</span>{' '}
                                {formatDate(rent.payment.nextPaymentDate)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {rents.length === 0 && (
        <div className="py-12 text-center">
          <p className={`transition-colors duration-300 ${
            isDark ? 'text-slate-400' : 'text-gray-500'
          }`}>No hay alquileres registrados</p>
        </div>
      )}
    </div>
  );
}
