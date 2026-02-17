'use client';

// ============================================
// Ejemplo de Página Completa: Contracts Dashboard
// Muestra cómo combinar múltiples componentes
// ============================================

import { useState, useEffect } from 'react';
import { useContracts } from '@/hooks/useContracts';
import { useContractTemplates } from '@/hooks/useContractTemplates';
import { ContractStatus } from '@/types/rent-contracts';
import {
    FileText,
    Plus,
    Filter,
    Search,
    Download,
    Eye,
    Edit,
    Trash2,
    CheckCircle,
    Clock,
    XCircle,
    Loader2,
} from 'lucide-react';

export default function ContractsDashboard() {
    const {
        contracts,
        loading,
        fetchContracts,
        deleteContract
    } = useContracts();

    const { defaultTemplate } = useContractTemplates();

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<ContractStatus | 'ALL'>('ALL');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        loadContracts();
    }, [statusFilter]);

    const loadContracts = () => {
        const params: any = {
            ordering: '-created_at',
        };

        if (statusFilter !== 'ALL') {
            params.status = statusFilter;
        }

        if (searchQuery) {
            params.search = searchQuery;
        }

        fetchContracts(params);
    };

    const handleSearch = () => {
        loadContracts();
    };

    const handleDelete = async (id: string, tenantName: string) => {
        if (!confirm(`¿Eliminar el contrato de ${tenantName}?`)) return;

        try {
            await deleteContract(id);
            loadContracts();
        } catch (error) {
            // Error handled in hook
        }
    };

    const getStatusInfo = (status: ContractStatus) => {
        const statusConfig = {
            DRAFT: {
                icon: Edit,
                color: 'bg-gray-100 text-gray-800',
                label: 'Borrador',
            },
            GENERATED: {
                icon: FileText,
                color: 'bg-blue-100 text-blue-800',
                label: 'Generado',
            },
            SIGNED: {
                icon: CheckCircle,
                color: 'bg-purple-100 text-purple-800',
                label: 'Firmado',
            },
            ACTIVE: {
                icon: CheckCircle,
                color: 'bg-green-100 text-green-800',
                label: 'Activo',
            },
            COMPLETED: {
                icon: CheckCircle,
                color: 'bg-teal-100 text-teal-800',
                label: 'Completado',
            },
            CANCELLED: {
                icon: XCircle,
                color: 'bg-red-100 text-red-800',
                label: 'Cancelado',
            },
        };

        return statusConfig[status];
    };

    const stats = {
        total: contracts.length,
        active: contracts.filter(c => c.status === 'ACTIVE').length,
        pending: contracts.filter(c => c.status === 'DRAFT' || c.status === 'GENERATED').length,
        signed: contracts.filter(c => c.is_signed).length,
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Contratos de Alquiler</h1>
                            <p className="text-gray-600 mt-1">Gestiona todos tus contratos de alquiler</p>
                        </div>
                        <button
                            onClick={() => window.location.href = '/dashboard/contracts/new'}
                            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                        >
                            <Plus className="h-5 w-5" />
                            Nuevo Contrato
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-600">Total</p>
                                    <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                                </div>
                                <FileText className="h-8 w-8 text-blue-600" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-600">Activos</p>
                                    <p className="text-2xl font-bold text-green-900">{stats.active}</p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-yellow-600">Pendientes</p>
                                    <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
                                </div>
                                <Clock className="h-8 w-8 text-yellow-600" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-600">Firmados</p>
                                    <p className="text-2xl font-bold text-purple-900">{stats.signed}</p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Buscar por inquilino o dirección..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as ContractStatus | 'ALL')}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="ALL">Todos los estados</option>
                            <option value="DRAFT">Borrador</option>
                            <option value="GENERATED">Generado</option>
                            <option value="SIGNED">Firmado</option>
                            <option value="ACTIVE">Activo</option>
                            <option value="COMPLETED">Completado</option>
                            <option value="CANCELLED">Cancelado</option>
                        </select>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Filter className="h-4 w-4" />
                            Filtros
                        </button>

                        <button
                            onClick={loadContracts}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Search className="h-4 w-4" />
                            )}
                            Buscar
                        </button>
                    </div>

                    {/* Default Template Info */}
                    {defaultTemplate && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <strong>Plantilla predeterminada:</strong> {defaultTemplate.name}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Contracts List */}
            <div className="container mx-auto px-6 py-6">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : contracts.length === 0 ? (
                    <div className="text-center py-12">
                        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium text-lg">No se encontraron contratos</p>
                        <p className="text-gray-500 text-sm mt-2">
                            {statusFilter !== 'ALL'
                                ? 'Intenta cambiar los filtros de búsqueda'
                                : 'Crea tu primer contrato para comenzar'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {contracts.map((contract) => {
                            const statusInfo = getStatusInfo(contract.status);
                            const StatusIcon = statusInfo.icon;

                            return (
                                <div
                                    key={contract.id}
                                    className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {contract.tenant_detail?.full_name || contract.tenant_data?.nombre || 'Sin inquilino'}
                                                </h3>
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                                    <StatusIcon className="h-3.5 w-3.5" />
                                                    {statusInfo.label}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-600 mb-1">Propiedad</p>
                                                    <p className="font-medium text-gray-900">
                                                        {contract.landlord_data?.direccion_inmueble || 'Sin dirección'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600 mb-1">Duración</p>
                                                    <p className="font-medium text-gray-900">{contract.duration_years} años</p>
                                                </div>
                                                {contract.signing_date && (
                                                    <div>
                                                        <p className="text-gray-600 mb-1">Fecha de firma</p>
                                                        <p className="font-medium text-gray-900">
                                                            {new Date(contract.signing_date).toLocaleDateString('es-AR')}
                                                        </p>
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-gray-600 mb-1">Creado</p>
                                                    <p className="font-medium text-gray-900">
                                                        {new Date(contract.created_at).toLocaleDateString('es-AR')}
                                                    </p>
                                                </div>
                                            </div>

                                            {contract.guarantees && (
                                                <div className="mt-3 text-sm">
                                                    <p className="text-gray-600">Garantías: <span className="text-gray-900">{contract.guarantees}</span></p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 ml-6">
                                            <button
                                                onClick={() => window.location.href = `/dashboard/contracts/${contract.id}`}
                                                className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Ver detalles"
                                            >
                                                <Eye className="h-5 w-5 text-blue-600" />
                                            </button>

                                            {contract.pdf_file && (
                                                <button
                                                    onClick={() => window.open(contract.pdf_file, '_blank')}
                                                    className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Descargar PDF"
                                                >
                                                    <Download className="h-5 w-5 text-green-600" />
                                                </button>
                                            )}

                                            {contract.status === 'DRAFT' && (
                                                <button
                                                    onClick={() => handleDelete(contract.id, contract.tenant_data?.nombre || 'este contrato')}
                                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="h-5 w-5 text-red-600" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
