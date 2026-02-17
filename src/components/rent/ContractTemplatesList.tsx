'use client';

// ============================================
// Componente: Contract Templates List
// Lista y gestión de plantillas de contratos
// ============================================

import { useContractTemplates } from '@/hooks/useContractTemplates';
import { ContractTemplate } from '@/types/rent-contracts';
import { Star, Trash2, Edit, Eye, Plus, Loader2 } from 'lucide-react';
import { useState } from 'react';

export function ContractTemplatesList() {
    const {
        templates,
        defaultTemplate,
        loading,
        error,
        deleteTemplate,
        setAsDefault,
    } = useContractTemplates();

    const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`¿Eliminar la plantilla "${name}"?`)) return;
        try {
            await deleteTemplate(id);
        } catch (error) {
            // Error already handled in hook
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            await setAsDefault(id);
        } catch (error) {
            // Error already handled in hook
        }
    };

    const handlePreview = (template: ContractTemplate) => {
        setSelectedTemplate(template);
        setShowPreview(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Plantillas de Contratos</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {templates.length} plantilla{templates.length !== 1 ? 's' : ''} disponible{templates.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                    <Plus className="h-4 w-4" />
                    Nueva Plantilla
                </button>
            </div>

            {/* Templates Grid */}
            <div className="grid gap-4">
                {templates.length === 0 ? (
                    <div className="text-center p-12 border rounded-lg bg-gray-50">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 font-medium">No hay plantillas disponibles</p>
                        <p className="text-sm text-gray-500 mt-1">Crea tu primera plantilla de contrato</p>
                    </div>
                ) : (
                    templates.map((template) => (
                        <div
                            key={template.id}
                            className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-semibold text-gray-900">{template.name}</h3>

                                        {template.is_default && (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                                <Star className="h-3 w-3 fill-current" />
                                                Por defecto
                                            </span>
                                        )}

                                        {!template.is_active && (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                                Inactiva
                                            </span>
                                        )}

                                        {template.is_valid_template === false && (
                                            <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                                                Tiene errores
                                            </span>
                                        )}
                                    </div>

                                    {template.description && (
                                        <p className="text-sm text-gray-600 mb-3">
                                            {template.description}
                                        </p>
                                    )}

                                    {template.placeholders_validation && (
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span>
                                                {template.placeholders_validation.found.length} placeholders encontrados
                                            </span>
                                            {template.placeholders_validation.missing.length > 0 && (
                                                <span className="text-red-600">
                                                    {template.placeholders_validation.missing.length} faltantes
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 ml-4">
                                    <button
                                        onClick={() => handlePreview(template)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        title="Vista previa"
                                    >
                                        <Eye className="h-4 w-4 text-gray-600" />
                                    </button>

                                    {!template.is_default && template.is_active && (
                                        <button
                                            onClick={() => handleSetDefault(template.id)}
                                            className="p-2 hover:bg-yellow-50 rounded-lg transition-colors"
                                            title="Establecer como predeterminada"
                                        >
                                            <Star className="h-4 w-4 text-yellow-600" />
                                        </button>
                                    )}

                                    <button
                                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Editar"
                                    >
                                        <Edit className="h-4 w-4 text-blue-600" />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(template.id, template.name)}
                                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Eliminar"
                                    >
                                        <Trash2 className="h-4 w-4 text-red-600" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Preview Modal */}
            {showPreview && selectedTemplate && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b">
                            <div>
                                <h3 className="font-semibold text-lg">{selectedTemplate.name}</h3>
                                {selectedTemplate.description && (
                                    <p className="text-sm text-gray-600 mt-1">{selectedTemplate.description}</p>
                                )}
                            </div>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                ×
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            <pre className="whitespace-pre-wrap text-sm font-mono bg-gray-50 p-4 rounded-lg border">
                                {selectedTemplate.template_content}
                            </pre>

                            {selectedTemplate.placeholders_validation && (
                                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <h4 className="font-medium text-sm text-blue-900 mb-2">Placeholders detectados:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedTemplate.placeholders_validation.found.map((placeholder) => (
                                            <span
                                                key={placeholder}
                                                className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono"
                                            >
                                                {placeholder}
                                            </span>
                                        ))}
                                    </div>

                                    {selectedTemplate.placeholders_validation.missing.length > 0 && (
                                        <div className="mt-3">
                                            <h4 className="font-medium text-sm text-red-900 mb-2">Placeholders faltantes:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedTemplate.placeholders_validation.missing.map((placeholder) => (
                                                    <span
                                                        key={placeholder}
                                                        className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-mono"
                                                    >
                                                        {placeholder}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Add missing import
import { FileText } from 'lucide-react';
