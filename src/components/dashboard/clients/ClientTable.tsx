'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Client, ClientType, ClientStatus } from '@/types/client';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/button';
import {
  HiEye,
  HiPencil,
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiUserCircle,
  HiOfficeBuilding,
} from 'react-icons/hi';
import { useDashboardTheme } from '@/context/DashboardThemeContext';

interface ClientTableProps {
  clients: Client[];
}

export function ClientTable({ clients }: ClientTableProps) {
  const router = useRouter();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const { theme } = useDashboardTheme();
  const isDark = theme === 'dark';

  const getClientTypeBadge = (type: ClientType) => {
    const variants = {
      owner: { variant: 'success' as const, label: 'Propietario' },
      tenant: { variant: 'warning' as const, label: 'Inquilino' },
      both: { variant: 'outline' as const, label: 'Ambos' },
      other: { variant: 'default' as const, label: 'Otro' },
    };
    return variants[type];
  };

  const getClientStatusBadge = (status: ClientStatus) => {
    const variants = {
      active: { variant: 'success' as const, label: 'Activo' },
      inactive: { variant: 'error' as const, label: 'Inactivo' },
      pending: { variant: 'warning' as const, label: 'Pendiente' },
    };
    return variants[status];
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
                Cliente
              </th>
              <th className={`px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                isDark ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Contacto
              </th>
              <th className={`px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                isDark ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Tipo
              </th>
              <th className={`px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                isDark ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Propiedades
              </th>
              <th className={`px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                isDark ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Estado
              </th>
              <th className={`px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                isDark ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Registrado
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
            {clients.map((client) => {
              const typeBadge = getClientTypeBadge(client.type);
              const statusBadge = getClientStatusBadge(client.status);
              const isExpanded = expandedRow === client.id;

              return (
                <>
                  <tr
                    key={client.id}
                    className={`cursor-pointer transition-colors duration-200 ${
                      isDark ? 'hover:bg-slate-800/40' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setExpandedRow(isExpanded ? null : client.id)}
                  >
                    {/* Cliente */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                          isDark ? 'bg-slate-800' : 'bg-gray-100'
                        }`}>
                          <HiUserCircle className={`h-6 w-6 transition-colors duration-300 ${
                            isDark ? 'text-slate-400' : 'text-gray-500'
                          }`} />
                        </div>
                        <div className="min-w-0 max-w-[180px]">
                          <p className={`truncate font-semibold text-sm transition-colors duration-300 ${
                            isDark ? 'text-slate-100' : 'text-gray-900'
                          }`}>
                            {client.fullName}
                          </p>
                          <p className={`truncate text-xs transition-colors duration-300 ${
                            isDark ? 'text-slate-400' : 'text-gray-500'
                          }`}>
                            DNI: {client.dni}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contacto */}
                    <td className="px-3 py-3">
                      <div className="max-w-[140px] space-y-1">
                        <div className="flex items-center gap-1.5">
                          <HiPhone className={`h-3.5 w-3.5 transition-colors duration-300 ${
                            isDark ? 'text-slate-500' : 'text-gray-400'
                          }`} />
                          <p className={`truncate text-xs transition-colors duration-300 ${
                            isDark ? 'text-slate-300' : 'text-gray-700'
                          }`}>
                            {client.contact.phone}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <HiMail className={`h-3.5 w-3.5 transition-colors duration-300 ${
                            isDark ? 'text-slate-500' : 'text-gray-400'
                          }`} />
                          <p className={`truncate text-xs transition-colors duration-300 ${
                            isDark ? 'text-slate-300' : 'text-gray-700'
                          }`}>
                            {client.contact.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Tipo */}
                    <td className="px-3 py-3">
                      <Badge {...typeBadge} rounded size="sm">
                        {typeBadge.label}
                      </Badge>
                    </td>

                    {/* Propiedades */}
                    <td className="px-3 py-3">
                      <div className="space-y-0.5">
                        {client.properties.owned > 0 && (
                          <div className="flex items-center gap-1.5">
                            <HiOfficeBuilding className={`h-3.5 w-3.5 transition-colors duration-300 ${
                              isDark ? 'text-emerald-400' : 'text-emerald-600'
                            }`} />
                            <span className={`text-xs font-medium transition-colors duration-300 ${
                              isDark ? 'text-emerald-400' : 'text-emerald-600'
                            }`}>
                              {client.properties.owned} propias
                            </span>
                          </div>
                        )}
                        {client.properties.rented > 0 && (
                          <div className="flex items-center gap-1.5">
                            <HiOfficeBuilding className={`h-3.5 w-3.5 transition-colors duration-300 ${
                              isDark ? 'text-blue-400' : 'text-blue-600'
                            }`} />
                            <span className={`text-xs font-medium transition-colors duration-300 ${
                              isDark ? 'text-blue-400' : 'text-blue-600'
                            }`}>
                              {client.properties.rented} alquiladas
                            </span>
                          </div>
                        )}
                        {client.properties.owned === 0 && client.properties.rented === 0 && (
                          <span className={`text-xs transition-colors duration-300 ${
                            isDark ? 'text-slate-500' : 'text-gray-500'
                          }`}>
                            Sin propiedades
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="px-3 py-3">
                      <Badge {...statusBadge} rounded size="sm">
                        {statusBadge.label}
                      </Badge>
                    </td>

                    {/* Registrado */}
                    <td className="px-3 py-3">
                      <div className="space-y-0.5">
                        <p className={`text-xs transition-colors duration-300 ${
                          isDark ? 'text-slate-300' : 'text-gray-700'
                        }`}>
                          {formatDate(client.createdAt)}
                        </p>
                        <p className={`text-xs transition-colors duration-300 ${
                          isDark ? 'text-slate-500' : 'text-gray-500'
                        }`}>
                          {client.tags && client.tags.length > 0 && (
                            <span className="inline-flex items-center gap-1">
                              {client.tags.slice(0, 2).map((tag, index) => (
                                <span key={index} className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                                  tag === 'VIP' 
                                    ? isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-800'
                                    : isDark ? 'bg-slate-600 text-slate-300' : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {tag}
                                </span>
                              ))}
                              {client.tags.length > 2 && (
                                <span className={`text-xs transition-colors duration-300 ${
                                  isDark ? 'text-slate-500' : 'text-gray-500'
                                }`}>
                                  +{client.tags.length - 2}
                                </span>
                              )}
                            </span>
                          )}
                        </p>
                      </div>
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
                              router.push(`/dashboard/clients/${client.id}`);
                            }}
                          >
                            <HiEye className="h-3.5 w-3.5" />
                          </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Editar', client.id);
                          }}
                          title="Editar"
                          className="h-8 w-8 p-0"
                        >
                          <HiPencil className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>

                  {/* Fila expandida con más detalles */}
                  {isExpanded && (
                    <tr className={`transition-colors duration-300 ${
                      isDark ? 'bg-slate-800/60' : 'bg-gray-50'
                    }`}>
                      <td colSpan={7} className="px-4 py-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          {/* Información Personal */}
                          <div className={`rounded-lg border p-4 transition-colors duration-300 ${
                            isDark
                              ? 'border-slate-700 bg-slate-800/80'
                              : 'border-gray-200 bg-white'
                          }`}>
                            <h4 className={`mb-3 flex items-center gap-2 text-sm font-bold transition-colors duration-300 ${
                              isDark ? 'text-slate-200' : 'text-gray-900'
                            }`}>
                              <HiUserCircle className={`h-4 w-4 transition-colors duration-300 ${
                                isDark ? 'text-blue-400' : 'text-blue-500'
                              }`} />
                              Información Personal
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p className={`transition-colors duration-300 ${
                                isDark ? 'text-slate-300' : 'text-gray-700'
                              }`}>
                                <span className={`font-semibold transition-colors duration-300 ${
                                  isDark ? 'text-slate-200' : 'text-gray-900'
                                }`}>DNI:</span> {client.dni}
                              </p>
                              {client.dateOfBirth && (
                                <p className={`transition-colors duration-300 ${
                                  isDark ? 'text-slate-300' : 'text-gray-700'
                                }`}>
                                  <span className={`font-semibold transition-colors duration-300 ${
                                    isDark ? 'text-slate-200' : 'text-gray-900'
                                  }`}>Fecha de Nacimiento:</span> {formatDate(client.dateOfBirth)}
                                </p>
                              )}
                              {client.nationality && (
                                <p className={`transition-colors duration-300 ${
                                  isDark ? 'text-slate-300' : 'text-gray-700'
                                }`}>
                                  <span className={`font-semibold transition-colors duration-300 ${
                                    isDark ? 'text-slate-200' : 'text-gray-900'
                                  }`}>Nacionalidad:</span> {client.nationality}
                                </p>
                              )}
                              <p className={`transition-colors duration-300 ${
                                isDark ? 'text-slate-300' : 'text-gray-700'
                              }`}>
                                <span className={`font-semibold transition-colors duration-300 ${
                                  isDark ? 'text-slate-200' : 'text-gray-900'
                                }`}>Registrado:</span> {formatDate(client.createdAt)}
                              </p>
                            </div>
                          </div>

                          {/* Información de Contacto Completa */}
                          <div className={`rounded-lg border p-4 transition-colors duration-300 ${
                            isDark
                              ? 'border-slate-700 bg-slate-800/80'
                              : 'border-gray-200 bg-white'
                          }`}>
                            <h4 className={`mb-3 flex items-center gap-2 text-sm font-bold transition-colors duration-300 ${
                              isDark ? 'text-slate-200' : 'text-gray-900'
                            }`}>
                              <HiPhone className={`h-4 w-4 transition-colors duration-300 ${
                                isDark ? 'text-green-400' : 'text-green-600'
                              }`} />
                              Contacto Completo
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <HiPhone className={`h-4 w-4 transition-colors duration-300 ${
                                  isDark ? 'text-slate-500' : 'text-gray-400'
                                }`} />
                                <a
                                  href={`tel:${client.contact.phone}`}
                                  className={`hover:underline transition-colors duration-300 ${
                                    isDark ? 'text-blue-400' : 'text-blue-600'
                                  }`}
                                >
                                  {client.contact.phone}
                                </a>
                              </div>
                              {client.contact.alternativePhone && (
                                <div className="flex items-center gap-2">
                                  <HiPhone className={`h-4 w-4 transition-colors duration-300 ${
                                    isDark ? 'text-slate-500' : 'text-gray-400'
                                  }`} />
                                  <a
                                    href={`tel:${client.contact.alternativePhone}`}
                                    className={`hover:underline transition-colors duration-300 ${
                                      isDark ? 'text-blue-400' : 'text-blue-600'
                                    }`}
                                  >
                                    {client.contact.alternativePhone}
                                  </a>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <HiMail className={`h-4 w-4 transition-colors duration-300 ${
                                  isDark ? 'text-slate-500' : 'text-gray-400'
                                }`} />
                                <a
                                  href={`mailto:${client.contact.email}`}
                                  className={`hover:underline transition-colors duration-300 ${
                                    isDark ? 'text-blue-400' : 'text-blue-600'
                                  }`}
                                >
                                  {client.contact.email}
                                </a>
                              </div>
                              <p className={`transition-colors duration-300 ${
                                isDark ? 'text-slate-400' : 'text-gray-600'
                              }`}>
                                <span className={`font-semibold transition-colors duration-300 ${
                                  isDark ? 'text-slate-300' : 'text-gray-700'
                                }`}>Contacto preferido:</span> {client.contact.preferredContact}
                              </p>
                            </div>
                          </div>

                          {/* Dirección y Propiedades */}
                          <div className={`rounded-lg border p-4 transition-colors duration-300 ${
                            isDark
                              ? 'border-slate-700 bg-slate-800/80'
                              : 'border-gray-200 bg-white'
                          }`}>
                            <h4 className={`mb-3 flex items-center gap-2 text-sm font-bold transition-colors duration-300 ${
                              isDark ? 'text-slate-200' : 'text-gray-900'
                            }`}>
                              <HiLocationMarker className={`h-4 w-4 transition-colors duration-300 ${
                                isDark ? 'text-purple-400' : 'text-purple-600'
                              }`} />
                              Dirección y Propiedades
                            </h4>
                            <div className={`space-y-2 text-sm transition-colors duration-300 ${
                              isDark ? 'text-slate-300' : 'text-gray-700'
                            }`}>
                              <div className="flex items-start gap-2">
                                <HiLocationMarker className={`h-4 w-4 mt-0.5 flex-shrink-0 transition-colors duration-300 ${
                                  isDark ? 'text-slate-500' : 'text-gray-400'
                                }`} />
                                <div>
                                  <p>{client.address.street}</p>
                                  <p>{client.address.city}, {client.address.state}</p>
                                  <p>CP: {client.address.zipCode}</p>
                                </div>
                              </div>
                              <div className="mt-3 pt-3 border-t border-slate-700">
                                <p className={`font-semibold transition-colors duration-300 ${
                                  isDark ? 'text-slate-200' : 'text-gray-900'
                                }`}>Propiedades:</p>
                                <div className="mt-1 space-y-1">
                                  {client.properties.owned > 0 && (
                                    <p className={`text-xs transition-colors duration-300 ${
                                      isDark ? 'text-emerald-400' : 'text-emerald-600'
                                    }`}>
                                      • {client.properties.owned} en propiedad
                                    </p>
                                  )}
                                  {client.properties.rented > 0 && (
                                    <p className={`text-xs transition-colors duration-300 ${
                                      isDark ? 'text-blue-400' : 'text-blue-600'
                                    }`}>
                                      • {client.properties.rented} alquiladas
                                    </p>
                                  )}
                                </div>
                              </div>
                              {client.notes && (
                                <div className="mt-3 pt-3 border-t border-slate-700">
                                  <p className={`font-semibold transition-colors duration-300 ${
                                    isDark ? 'text-slate-200' : 'text-gray-900'
                                  }`}>Notas:</p>
                                  <p className="mt-1 text-xs">{client.notes}</p>
                                </div>
                              )}
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

      {clients.length === 0 && (
        <div className="py-12 text-center">
          <p className={`transition-colors duration-300 ${
            isDark ? 'text-slate-400' : 'text-gray-500'
          }`}>No hay clientes registrados</p>
        </div>
      )}
    </div>
  );
}
