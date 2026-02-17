'use client';

// ============================================
// Componente: Pay Installment Modal
// Modal para registrar el pago de una cuota
// ============================================

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { installmentService } from '@/services/installmentService';
import { Cuota, PaymentMethod } from '@/types/rent-contracts';
import { toast } from 'sonner';
import {
    DollarSign,
    Calendar,
    CreditCard,
    Upload,
    X,
    Loader2,
    FileText,
    CheckCircle
} from 'lucide-react';

interface PayInstallmentModalProps {
    installment: Cuota;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

interface FormData {
    monto_pagado: string;
    fecha_pago: string;
    metodo_pago: PaymentMethod;
    observaciones?: string;
    comprobante?: FileList;
}

const paymentMethods: { value: PaymentMethod; label: string }[] = [
    { value: 'EFECTIVO', label: 'Efectivo' },
    { value: 'TRANSFERENCIA', label: 'Transferencia' },
    { value: 'CHEQUE', label: 'Cheque' },
    { value: 'DEBITO', label: 'Débito Automático' },
    { value: 'MERCADOPAGO', label: 'MercadoPago' },
    { value: 'OTRO', label: 'Otro' },
];

export function PayInstallmentModal({
    installment,
    isOpen,
    onClose,
    onSuccess,
}: PayInstallmentModalProps) {
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState<string>('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<FormData>({
        defaultValues: {
            monto_pagado: installment.balance_pending || installment.monto,
            fecha_pago: new Date().toISOString().split('T')[0],
            metodo_pago: 'TRANSFERENCIA',
        },
    });

    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(parseFloat(amount));
    };

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            const paymentData = {
                monto_pagado: data.monto_pagado,
                fecha_pago: data.fecha_pago,
                metodo_pago: data.metodo_pago,
                observaciones: data.observaciones,
                comprobante: data.comprobante?.[0],
            };

            const response = await installmentService.pay(installment.id, paymentData);

            if (response.success) {
                toast.success('Pago registrado exitosamente');
                reset();
                onSuccess?.();
                onClose();
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al registrar el pago';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
        }
    };

    const handleClose = () => {
        if (!loading) {
            reset();
            setFileName('');
            onClose();
        }
    };

    if (!isOpen) return null;

    const montoPagado = watch('monto_pagado');
    const montoRestante = parseFloat(installment.monto) - parseFloat(montoPagado || '0');

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg text-gray-900">Registrar Pago</h3>
                            <p className="text-sm text-gray-600">Cuota #{installment.numero_cuota}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Installment Info */}
                <div className="p-6 bg-gray-50 border-b">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-xs text-gray-600 mb-1">Monto de la cuota</div>
                            <div className="font-semibold text-gray-900">{formatCurrency(installment.monto)}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-600 mb-1">Fecha de vencimiento</div>
                            <div className="font-semibold text-gray-900">
                                {new Date(installment.fecha_vencimiento).toLocaleDateString('es-AR')}
                            </div>
                        </div>
                        {installment.monto_pagado && (
                            <>
                                <div>
                                    <div className="text-xs text-gray-600 mb-1">Ya pagado</div>
                                    <div className="font-semibold text-green-600">
                                        {formatCurrency(installment.monto_pagado)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-600 mb-1">Saldo pendiente</div>
                                    <div className="font-semibold text-orange-600">
                                        {formatCurrency(installment.balance_pending)}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-4">
                        {/* Monto Pagado */}
                        <div>
                            <label htmlFor="monto_pagado" className="block text-sm font-medium text-gray-700 mb-2">
                                Monto a Pagar <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="number"
                                    id="monto_pagado"
                                    step="0.01"
                                    {...register('monto_pagado', {
                                        required: 'El monto es requerido',
                                        min: { value: 0.01, message: 'El monto debe ser mayor a 0' },
                                        max: {
                                            value: parseFloat(installment.balance_pending || installment.monto),
                                            message: 'El monto no puede ser mayor al saldo pendiente',
                                        },
                                    })}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="0.00"
                                />
                            </div>
                            {errors.monto_pagado && (
                                <p className="mt-1 text-sm text-red-600">{errors.monto_pagado.message}</p>
                            )}
                            {montoPagado && montoRestante > 0 && (
                                <p className="mt-1 text-xs text-orange-600">
                                    Quedará un saldo pendiente de {formatCurrency(montoRestante.toString())}
                                </p>
                            )}
                            {montoPagado && montoRestante === 0 && (
                                <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    La cuota quedará totalmente pagada
                                </p>
                            )}
                        </div>

                        {/* Fecha de Pago */}
                        <div>
                            <label htmlFor="fecha_pago" className="block text-sm font-medium text-gray-700 mb-2">
                                Fecha de Pago <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="date"
                                    id="fecha_pago"
                                    {...register('fecha_pago', { required: 'La fecha es requerida' })}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            {errors.fecha_pago && (
                                <p className="mt-1 text-sm text-red-600">{errors.fecha_pago.message}</p>
                            )}
                        </div>

                        {/* Método de Pago */}
                        <div>
                            <label htmlFor="metodo_pago" className="block text-sm font-medium text-gray-700 mb-2">
                                Método de Pago <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <select
                                    id="metodo_pago"
                                    {...register('metodo_pago', { required: 'El método de pago es requerido' })}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                >
                                    {paymentMethods.map((method) => (
                                        <option key={method.value} value={method.value}>
                                            {method.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errors.metodo_pago && (
                                <p className="mt-1 text-sm text-red-600">{errors.metodo_pago.message}</p>
                            )}
                        </div>

                        {/* Comprobante */}
                        <div>
                            <label htmlFor="comprobante" className="block text-sm font-medium text-gray-700 mb-2">
                                Comprobante (opcional)
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    id="comprobante"
                                    {...register('comprobante')}
                                    onChange={handleFileChange}
                                    accept="image/*,.pdf"
                                    className="hidden"
                                />
                                <label
                                    htmlFor="comprobante"
                                    className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
                                >
                                    <Upload className="h-5 w-5 text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                        {fileName || 'Subir comprobante (imagen o PDF)'}
                                    </span>
                                </label>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Sube una imagen o PDF del comprobante de pago
                            </p>
                        </div>

                        {/* Observaciones */}
                        <div>
                            <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-2">
                                Observaciones
                            </label>
                            <textarea
                                id="observaciones"
                                {...register('observaciones')}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                placeholder="Notas adicionales sobre el pago..."
                            />
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit(onSubmit)}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Registrando...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="h-4 w-4" />
                                Registrar Pago
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
