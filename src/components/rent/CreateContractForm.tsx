'use client';

// ============================================
// Componente: Create Contract Form
// Formulario para crear un nuevo contrato
// ============================================

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { contractService } from '@/services/contractService';
import { contractTemplateService } from '@/services/contractTemplateService';
import { ContractTemplate, CreateContractData } from '@/types/rent-contracts';
import { toast } from 'sonner';
import { Loader2, FileText, Save, X } from 'lucide-react';

interface CreateContractFormProps {
    rentalId?: string;
    tenantId?: string;
    onSuccess?: (contractId: string) => void;
    onCancel?: () => void;
}

interface FormData extends CreateContractData {
    auto_generate?: boolean;
}

export function CreateContractForm({
    rentalId,
    tenantId,
    onSuccess,
    onCancel
}: CreateContractFormProps) {
    const [loading, setLoading] = useState(false);
    const [templates, setTemplates] = useState<ContractTemplate[]>([]);
    const [defaultTemplate, setDefaultTemplate] = useState<ContractTemplate | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<FormData>({
        defaultValues: {
            rental: rentalId || '',
            tenant: tenantId || '',
            duration_years: 2,
            auto_generate: true,
        },
    });

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const [templatesResponse, defaultResponse] = await Promise.all([
                contractTemplateService.list({ is_active: true }),
                contractTemplateService.getDefault().catch(() => null),
            ]);

            if (templatesResponse.success) {
                setTemplates(templatesResponse.data.results);
            }

            if (defaultResponse?.success) {
                setDefaultTemplate(defaultResponse.data);
                setValue('template', defaultResponse.data.id);
            }
        } catch (error) {
            toast.error('Error al cargar plantillas');
        }
    };

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            // Crear el contrato
            const { auto_generate, ...contractData } = data;
            const response = await contractService.create(contractData);

            if (response.success) {
                const contractId = response.data.id;
                toast.success('Contrato creado exitosamente');

                // Si auto_generate está activado, generar el contenido
                if (auto_generate) {
                    try {
                        await contractService.generate(contractId);
                        toast.success('Contenido generado automáticamente');
                    } catch (error) {
                        toast.warning('Contrato creado pero fallo la generación automática');
                    }
                }

                onSuccess?.(contractId);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al crear el contrato';
            toast.error(errorMessage);

            // Mostrar errores de validación específicos
            if (error.response?.data?.errors) {
                Object.entries(error.response.data.errors).forEach(([field, messages]) => {
                    toast.error(`${field}: ${(messages as string[]).join(', ')}`);
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const selectedTemplateId = watch('template');
    const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Nuevo Contrato</h2>
                        <p className="text-sm text-gray-500">Complete los datos del contrato</p>
                    </div>
                </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Rental */}
                <div>
                    <label htmlFor="rental" className="block text-sm font-medium text-gray-700 mb-2">
                        Alquiler <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="rental"
                        {...register('rental', { required: 'El alquiler es requerido' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="UUID del alquiler"
                        disabled={!!rentalId}
                    />
                    {errors.rental && (
                        <p className="mt-1 text-sm text-red-600">{errors.rental.message}</p>
                    )}
                </div>

                {/* Tenant */}
                <div>
                    <label htmlFor="tenant" className="block text-sm font-medium text-gray-700 mb-2">
                        Inquilino
                    </label>
                    <input
                        type="text"
                        id="tenant"
                        {...register('tenant')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="UUID del inquilino (opcional)"
                        disabled={!!tenantId}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Se auto-poblará desde el alquiler si no se especifica
                    </p>
                </div>

                {/* Template */}
                <div>
                    <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-2">
                        Plantilla
                    </label>
                    <select
                        id="template"
                        {...register('template')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                        <option value="">Usar plantilla por defecto</option>
                        {templates.map((template) => (
                            <option key={template.id} value={template.id}>
                                {template.name}
                                {template.is_default && ' (Por defecto)'}
                                {!template.is_active && ' (Inactiva)'}
                            </option>
                        ))}
                    </select>
                    {selectedTemplate && selectedTemplate.description && (
                        <p className="mt-1 text-xs text-gray-600">{selectedTemplate.description}</p>
                    )}
                </div>

                {/* Duration */}
                <div>
                    <label htmlFor="duration_years" className="block text-sm font-medium text-gray-700 mb-2">
                        Duración (años)
                    </label>
                    <input
                        type="number"
                        id="duration_years"
                        {...register('duration_years', {
                            required: 'La duración es requerida',
                            min: { value: 1, message: 'Mínimo 1 año' },
                            max: { value: 10, message: 'Máximo 10 años' },
                        })}
                        min={1}
                        max={10}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    {errors.duration_years && (
                        <p className="mt-1 text-sm text-red-600">{errors.duration_years.message}</p>
                    )}
                </div>
            </div>

            {/* Guarantees */}
            <div>
                <label htmlFor="guarantees" className="block text-sm font-medium text-gray-700 mb-2">
                    Garantías
                </label>
                <textarea
                    id="guarantees"
                    {...register('guarantees')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Ej: Anticipo de 2 meses, Garantía propietaria"
                />
            </div>

            {/* Special Clauses */}
            <div>
                <label htmlFor="special_clauses" className="block text-sm font-medium text-gray-700 mb-2">
                    Cláusulas Especiales
                </label>
                <textarea
                    id="special_clauses"
                    {...register('special_clauses')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Ej: Permite mascotas pequeñas, Prohibido fumar"
                />
            </div>

            {/* Auto Generate */}
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <input
                    type="checkbox"
                    id="auto_generate"
                    {...register('auto_generate')}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="auto_generate" className="text-sm text-blue-900">
                    <span className="font-medium">Generar contenido automáticamente</span>
                    <p className="text-xs text-blue-700 mt-0.5">
                        El contenido del contrato se generará inmediatamente usando la plantilla seleccionada
                    </p>
                </label>
            </div>

            {/* Template Preview */}
            {selectedTemplate && (
                <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                        Vista previa de la plantilla
                    </h3>
                    <p className="text-xs text-gray-600 mb-2">
                        {selectedTemplate.name}
                        {selectedTemplate.description && ` - ${selectedTemplate.description}`}
                    </p>
                    {selectedTemplate.placeholders_validation && (
                        <div className="flex items-center gap-2 text-xs">
                            <span className="text-green-600">
                                ✓ {selectedTemplate.placeholders_validation.found.length} placeholders
                            </span>
                            {selectedTemplate.placeholders_validation.missing.length > 0 && (
                                <span className="text-red-600">
                                    ⚠ {selectedTemplate.placeholders_validation.missing.length} faltantes
                                </span>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <X className="h-4 w-4 inline mr-2" />
                        Cancelar
                    </button>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Creando...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4" />
                            Crear Contrato
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
