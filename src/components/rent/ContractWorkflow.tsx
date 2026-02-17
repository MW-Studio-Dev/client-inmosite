'use client';

// ============================================
// Componente: Contract Workflow
// Muestra el flujo completo de un contrato
// ============================================

import { useState, useEffect } from 'react';
import { contractService } from '@/services/contractService';
import { Contrato } from '@/types/rent-contracts';
import { toast } from 'sonner';
import {
    FileText,
    Check,
    PlayCircle,
    XCircle,
    Eye,
    RefreshCw,
    Loader2
} from 'lucide-react';

interface ContractWorkflowProps {
    contractId: string;
    onUpdate?: () => void;
}

export function ContractWorkflow({ contractId, onUpdate }: ContractWorkflowProps) {
    const [contract, setContract] = useState<Contrato | null>(null);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [previewContent, setPreviewContent] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        fetchContract();
    }, [contractId]);

    const fetchContract = async () => {
        setLoading(true);
        try {
            const response = await contractService.get(contractId);
            if (response.success) {
                setContract(response.data);
            }
        } catch (error) {
            toast.error('Error al cargar el contrato');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        setActionLoading(true);
        try {
            await contractService.generate(contractId);
            toast.success('Contenido generado exitosamente');
            await fetchContract();
            onUpdate?.();
        } catch (error) {
            toast.error('Error al generar el contenido');
        } finally {
            setActionLoading(false);
        }
    };

    const handleSign = async () => {
        setActionLoading(true);
        try {
            await contractService.sign(contractId);
            toast.success('Contrato firmado exitosamente');
            await fetchContract();
            onUpdate?.();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al firmar');
        } finally {
            setActionLoading(false);
        }
    };

    const handleActivate = async () => {
        setActionLoading(true);
        try {
            await contractService.activate(contractId);
            toast.success('Contrato activado exitosamente');
            await fetchContract();
            onUpdate?.();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al activar');
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!confirm('¿Estás seguro de cancelar este contrato?')) return;

        setActionLoading(true);
        try {
            await contractService.cancel(contractId);
            toast.success('Contrato cancelado');
            await fetchContract();
            onUpdate?.();
        } catch (error) {
            toast.error('Error al cancelar');
        } finally {
            setActionLoading(false);
        }
    };

    const handlePreview = async () => {
        setActionLoading(true);
        try {
            const response = await contractService.preview(contractId);
            if (response.success) {
                setPreviewContent(response.data.content);
                setShowPreview(true);
            }
        } catch (error) {
            toast.error('Error al cargar vista previa');
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'DRAFT': 'bg-gray-100 text-gray-800 border-gray-300',
            'GENERATED': 'bg-blue-100 text-blue-800 border-blue-300',
            'SIGNED': 'bg-purple-100 text-purple-800 border-purple-300',
            'ACTIVE': 'bg-green-100 text-green-800 border-green-300',
            'COMPLETED': 'bg-teal-100 text-teal-800 border-teal-300',
            'CANCELLED': 'bg-red-100 text-red-800 border-red-300',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!contract) {
        return (
            <div className="text-center p-12 text-gray-500">
                No se pudo cargar el contrato
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Contrato</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {contract.tenant_detail?.full_name} - {contract.landlord_data.direccion_inmueble}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(contract.status)}`}>
                        {contract.status}
                    </span>
                    <button
                        onClick={fetchContract}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        disabled={actionLoading}
                    >
                        <RefreshCw className={`h-4 w-4 ${actionLoading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Workflow Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Step 1: Generate */}
                <div className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <div className={`p-2 rounded-full ${contract.status !== 'DRAFT'
                                ? 'bg-green-100 text-green-600'
                                : 'bg-gray-100 text-gray-400'
                            }`}>
                            <FileText className="h-5 w-5" />
                        </div>
                        <h3 className="font-semibold text-gray-900">1. Generar</h3>
                    </div>

                    {contract.status === 'DRAFT' && (
                        <button
                            onClick={handleGenerate}
                            disabled={actionLoading}
                            className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {actionLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <FileText className="h-4 w-4" />
                            )}
                            Generar Contenido
                        </button>
                    )}

                    {contract.status !== 'DRAFT' && (
                        <div className="flex items-center gap-2 text-green-600">
                            <Check className="h-5 w-5" />
                            <span className="text-sm">Completado</span>
                        </div>
                    )}
                </div>

                {/* Step 2: Sign */}
                <div className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <div className={`p-2 rounded-full ${contract.is_signed
                                ? 'bg-green-100 text-green-600'
                                : 'bg-gray-100 text-gray-400'
                            }`}>
                            <Check className="h-5 w-5" />
                        </div>
                        <h3 className="font-semibold text-gray-900">2. Firmar</h3>
                    </div>

                    {contract.status === 'GENERATED' && (
                        <button
                            onClick={handleSign}
                            disabled={actionLoading}
                            className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {actionLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Check className="h-4 w-4" />
                            )}
                            Marcar como Firmado
                        </button>
                    )}

                    {contract.is_signed && (
                        <div className="flex items-center gap-2 text-green-600">
                            <Check className="h-5 w-5" />
                            <span className="text-sm">Firmado el {contract.signing_date}</span>
                        </div>
                    )}

                    {!contract.is_signed && contract.status === 'DRAFT' && (
                        <p className="text-sm text-gray-400">Primero genera el contenido</p>
                    )}
                </div>

                {/* Step 3: Activate */}
                <div className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <div className={`p-2 rounded-full ${contract.is_active
                                ? 'bg-green-100 text-green-600'
                                : 'bg-gray-100 text-gray-400'
                            }`}>
                            <PlayCircle className="h-5 w-5" />
                        </div>
                        <h3 className="font-semibold text-gray-900">3. Activar</h3>
                    </div>

                    {contract.status === 'SIGNED' && (
                        <button
                            onClick={handleActivate}
                            disabled={actionLoading}
                            className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {actionLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <PlayCircle className="h-4 w-4" />
                            )}
                            Activar Contrato
                        </button>
                    )}

                    {contract.is_active && (
                        <div className="flex items-center gap-2 text-green-600">
                            <Check className="h-5 w-5" />
                            <span className="text-sm">Contrato activo</span>
                        </div>
                    )}

                    {!contract.is_active && contract.status !== 'SIGNED' && (
                        <p className="text-sm text-gray-400">Primero firma el contrato</p>
                    )}
                </div>
            </div>

            {/* Contract Details */}
            {contract.generated_content && (
                <div className="border rounded-lg p-6 bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Vista Previa del Contrato</h3>
                        <button
                            onClick={handlePreview}
                            disabled={actionLoading}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                            <Eye className="h-4 w-4" />
                            Ver Completo
                        </button>
                    </div>
                    <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg border max-h-64 overflow-y-auto font-mono">
                        {contract.generated_content_preview || contract.generated_content.substring(0, 500) + '...'}
                    </pre>
                </div>
            )}

            {/* Contract Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 bg-white shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-3">Información del Contrato</h4>
                    <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-gray-600">Duración:</dt>
                            <dd className="font-medium">{contract.duration_years} años</dd>
                        </div>
                        {contract.guarantees && (
                            <div className="flex justify-between">
                                <dt className="text-gray-600">Garantías:</dt>
                                <dd className="font-medium">{contract.guarantees}</dd>
                            </div>
                        )}
                        {contract.special_clauses && (
                            <div className="flex flex-col gap-1">
                                <dt className="text-gray-600">Cláusulas especiales:</dt>
                                <dd className="font-medium">{contract.special_clauses}</dd>
                            </div>
                        )}
                    </dl>
                </div>

                <div className="border rounded-lg p-4 bg-white shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-3">Partes del Contrato</h4>
                    <dl className="space-y-2 text-sm">
                        <div className="flex flex-col gap-1">
                            <dt className="text-gray-600">Locador:</dt>
                            <dd className="font-medium">{contract.landlord_data.nombre}</dd>
                        </div>
                        <div className="flex flex-col gap-1">
                            <dt className="text-gray-600">Locatario:</dt>
                            <dd className="font-medium">{contract.tenant_data.nombre}</dd>
                        </div>
                        <div className="flex flex-col gap-1">
                            <dt className="text-gray-600">Inmueble:</dt>
                            <dd className="font-medium">{contract.landlord_data.direccion_inmueble}</dd>
                        </div>
                    </dl>
                </div>
            </div>

            {/* Actions */}
            {contract.status !== 'CANCELLED' && contract.status !== 'COMPLETED' && (
                <div className="flex justify-end">
                    <button
                        onClick={handleCancel}
                        disabled={actionLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <XCircle className="h-4 w-4" />
                        Cancelar Contrato
                    </button>
                </div>
            )}

            {/* Preview Modal */}
            {showPreview && previewContent && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="font-semibold text-lg">Contenido Completo del Contrato</h3>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <XCircle className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            <pre className="whitespace-pre-wrap text-sm font-mono">
                                {previewContent}
                            </pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
