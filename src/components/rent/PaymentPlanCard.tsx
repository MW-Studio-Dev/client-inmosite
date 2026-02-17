'use client';

// ============================================
// Componente: Payment Plan Card
// Muestra un plan de pago con sus cuotas
// ============================================

import { PlanDePagos, Cuota } from '@/types/rent-contracts';
import { Calendar, DollarSign, CheckCircle, AlertCircle, Clock, TrendingUp } from 'lucide-react';

interface PaymentPlanCardProps {
    plan: PlanDePagos;
    onViewDetails?: (planId: string) => void;
    onPayInstallment?: (installmentId: string) => void;
}

export function PaymentPlanCard({ plan, onViewDetails, onPayInstallment }: PaymentPlanCardProps) {
    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'ACTIVO': 'bg-green-100 text-green-800 border-green-300',
            'COMPLETADO': 'bg-blue-100 text-blue-800 border-blue-300',
            'SUSPENDIDO': 'bg-orange-100 text-orange-800 border-orange-300',
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    const getInstallmentStatusColor = (estado: string) => {
        const colors: Record<string, string> = {
            'PENDIENTE': 'text-yellow-600 bg-yellow-50',
            'PAGADA': 'text-green-600 bg-green-50',
            'VENCIDA': 'text-red-600 bg-red-50',
            'PARCIAL': 'text-orange-600 bg-orange-50',
        };
        return colors[estado] || 'text-gray-600 bg-gray-50';
    };

    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(parseFloat(amount));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{plan.tenant_name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{plan.property_address}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(plan.estado_general)}`}>
                        {plan.estado_general}
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-2">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Progreso del plan</span>
                        <span className="font-medium">{plan.completion_percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-primary rounded-full h-2 transition-all"
                            style={{ width: `${plan.completion_percentage}%` }}
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-3 text-xs">
                    <div className="text-center">
                        <div className="text-gray-600">Total</div>
                        <div className="font-semibold text-gray-900">{plan.total_installments}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-green-600">Pagadas</div>
                        <div className="font-semibold text-green-700">{plan.paid_installments}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-yellow-600">Pendientes</div>
                        <div className="font-semibold text-yellow-700">{plan.pending_installments}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-red-600">Vencidas</div>
                        <div className="font-semibold text-red-700">{plan.overdue_installments}</div>
                    </div>
                </div>
            </div>

            {/* Plan Details */}
            <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <div>
                            <div className="text-xs text-gray-600">Monto mensual</div>
                            <div className="font-semibold text-gray-900">{formatCurrency(plan.monto_cuota)}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                            <div className="text-xs text-gray-600">Inicio</div>
                            <div className="font-semibold text-gray-900">
                                {new Date(plan.fecha_inicio).toLocaleDateString('es-AR')}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <div>
                            <div className="text-xs text-gray-600">Total pagado</div>
                            <div className="font-semibold text-green-700">{formatCurrency(plan.total_paid_amount)}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        <div>
                            <div className="text-xs text-gray-600">Pendiente</div>
                            <div className="font-semibold text-yellow-700">{formatCurrency(plan.total_pending_amount)}</div>
                        </div>
                    </div>
                </div>

                {plan.aplicar_ajuste_automatico && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span className="text-xs text-blue-700 font-medium">Ajuste automático activado</span>
                    </div>
                )}
            </div>

            {/* Recent Installments */}
            {plan.installments && plan.installments.length > 0 && (
                <div className="border-t">
                    <div className="p-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Próximas cuotas</h4>
                        <div className="space-y-2">
                            {plan.installments.slice(0, 3).map((installment) => (
                                <div
                                    key={installment.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className={`p-1.5 rounded-full ${getInstallmentStatusColor(installment.estado)}`}>
                                            {installment.estado === 'PAGADA' ? (
                                                <CheckCircle className="h-4 w-4" />
                                            ) : installment.estado === 'VENCIDA' ? (
                                                <AlertCircle className="h-4 w-4" />
                                            ) : (
                                                <Clock className="h-4 w-4" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-gray-900">
                                                Cuota #{installment.numero_cuota}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                Vence: {formatDate(installment.fecha_vencimiento)}
                                                {installment.is_overdue && (
                                                    <span className="ml-2 text-red-600 font-medium">
                                                        (Vencida hace {Math.abs(installment.days_to_due)} días)
                                                    </span>
                                                )}
                                                {!installment.is_overdue && installment.days_to_due > 0 && (
                                                    <span className="ml-2 text-gray-500">
                                                        (En {installment.days_to_due} días)
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-semibold text-gray-900">
                                                {formatCurrency(installment.monto)}
                                            </div>
                                            {installment.estado === 'PARCIAL' && installment.monto_pagado && (
                                                <div className="text-xs text-green-600">
                                                    Pagado: {formatCurrency(installment.monto_pagado)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {installment.estado !== 'PAGADA' && onPayInstallment && (
                                        <button
                                            onClick={() => onPayInstallment(installment.id)}
                                            className="ml-3 px-3 py-1 text-xs bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                                        >
                                            Pagar
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Actions */}
            {onViewDetails && (
                <div className="border-t p-4">
                    <button
                        onClick={() => onViewDetails(plan.id)}
                        className="w-full px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                        Ver detalles completos
                    </button>
                </div>
            )}
        </div>
    );
}
