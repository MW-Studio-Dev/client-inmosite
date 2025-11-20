'use client';

import React, { useState, useRef } from 'react';
import { useDashboardTheme } from '@/context/DashboardThemeContext';
import { useToast } from '@/components/common/Toast';
import {
  HiDocument,
  HiUpload,
  HiX,
  HiCheck,
  HiDownload,
  HiEye,
  HiTrash
} from 'react-icons/hi';
import {HiExclamationTriangle} from 'react-icons/hi2';

// Tipos de documentos
const DOCUMENT_TYPES = [
  { value: 'DNI', label: 'DNI' },
  { value: 'RECIBO_SUELDO', label: 'Recibo de Sueldo' },
  { value: 'GARANTIA', label: 'Garantía' },
  { value: 'OTRO', label: 'Otro' }
];

interface DocumentFile {
  file: File;
  type: string;
  description: string;
  preview?: string;
}

interface ClientDocument {
  id: string;
  document_type: string;
  document_type_display: string;
  file: string;
  description: string;
  file_size: number;
  file_size_formatted: string;
  created_at: string;
}

interface DocumentManagerProps {
  documents: ClientDocument[];
  onDocumentsChange?: (documentsToKeep: string[], newDocuments: DocumentFile[]) => void;
  maxDocuments?: number;
  disabled?: boolean;
  isEditing?: boolean;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({
  documents: existingDocuments = [],
  onDocumentsChange,
  maxDocuments = 12,
  disabled = false,
  isEditing = false
}) => {
  const { theme } = useDashboardTheme();
  const { showError, showSuccess } = useToast();
  const isDark = theme === 'dark';
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado para documentos nuevos
  const [newDocuments, setNewDocuments] = useState<DocumentFile[]>([]);
  const [documentsToKeep, setDocumentsToKeep] = useState<string[]>(
    existingDocuments.map(doc => doc.id)
  );
  const [dragOver, setDragOver] = useState(false);

  // Tipos de archivo permitidos
  const allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  // Validar archivo
  const validateFile = (file: File): string | null => {
    // Verificar extensión
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(extension)) {
      return `Tipo de archivo no permitido. Se permiten: ${allowedTypes.join(', ')}`;
    }

    // Verificar tamaño
    if (file.size > maxFileSize) {
      return 'El archivo es demasiado grande. El tamaño máximo permitido es 10MB.';
    }

    return null;
  };

  // Generar preview para imágenes
  const generatePreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        resolve(undefined);
      }
    });
  };

  // Agregar documentos
  const addDocuments = async (files: FileList) => {
    if (disabled) return;

    const filesArray = Array.from(files);
    const availableSlots = maxDocuments - documentsToKeep.length - newDocuments.length;

    if (filesArray.length > availableSlots) {
      showError(`Solo puedes agregar ${availableSlots} documento(s) más. Límite: ${maxDocuments}`);
      return;
    }

    const validDocuments: DocumentFile[] = [];

    for (const file of filesArray) {
      const error = validateFile(file);
      if (error) {
        showError(error);
        continue;
      }

      const preview = await generatePreview(file);
      validDocuments.push({
        file,
        type: 'OTRO',
        description: '',
        preview
      });
    }

    if (validDocuments.length > 0) {
      setNewDocuments(prev => [...prev, ...validDocuments]);
      showSuccess(`${validDocuments.length} documento(s) agregado(s)`);
    }
  };

  // Manejar drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) {
      addDocuments(e.dataTransfer.files);
    }
  };

  // Actualizar documento nuevo
  const updateNewDocument = (index: number, field: 'type' | 'description', value: string) => {
    setNewDocuments(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Eliminar documento nuevo
  const removeNewDocument = (index: number) => {
    setNewDocuments(prev => prev.filter((_, i) => i !== index));
  };

  // Toggle documento existente a mantener
  const toggleDocumentToKeep = (documentId: string) => {
    setDocumentsToKeep(prev => {
      if (prev.includes(documentId)) {
        return prev.filter(id => id !== documentId);
      } else {
        if (prev.length + newDocuments.length >= maxDocuments) {
          showError('Has alcanzado el límite máximo de documentos');
          return prev;
        }
        return [...prev, documentId];
      }
    });
  };

  // Notificar cambios
  React.useEffect(() => {
    if (onDocumentsChange) {
      onDocumentsChange(documentsToKeep, newDocuments);
    }
  }, [documentsToKeep, newDocuments, onDocumentsChange]);

  const totalDocuments = documentsToKeep.length + newDocuments.length;
  const canAddMore = totalDocuments < maxDocuments;

  return (
    <div className={`space-y-6 ${disabled ? 'opacity-75 pointer-events-none' : ''}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className={`text-lg font-medium flex items-center gap-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            <HiDocument className="h-5 w-5 text-red-600" />
            Documentos
          </h3>
          <p className={`text-sm mt-1 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Gestiona los documentos del cliente ({totalDocuments}/{maxDocuments})
          </p>
        </div>
        {!isEditing && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-700'
          }`}>
            Creación
          </span>
        )}
      </div>

      {/* Documentos Existentes (solo en modo edición) */}
      {isEditing && existingDocuments.length > 0 && (
        <div className="space-y-3">
          <h4 className={`text-sm font-medium ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Documentos Actuales
          </h4>
          <div className="space-y-2">
            {existingDocuments.map((doc) => {
              const willKeep = documentsToKeep.includes(doc.id);
              return (
                <div
                  key={doc.id}
                  className={`p-3 rounded-lg border transition-all ${
                    willKeep
                      ? isDark
                        ? 'bg-slate-800 border-slate-600'
                        : 'bg-white border-gray-200'
                      : isDark
                        ? 'bg-slate-900/50 border-slate-700 opacity-50'
                        : 'bg-gray-50 border-gray-200 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={willKeep}
                        onChange={() => toggleDocumentToKeep(doc.id)}
                        className={`h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded ${
                          isDark ? 'bg-slate-800 border-slate-600' : ''
                        }`}
                      />
                      <div>
                        <p className={`text-sm font-medium ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {doc.document_type_display}
                        </p>
                        {doc.description && (
                          <p className={`text-xs ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {doc.description}
                          </p>
                        )}
                        <p className={`text-xs ${
                          isDark ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          {doc.file_size_formatted} • {new Date(doc.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.file && (
                        <button
                          type="button"
                          onClick={() => window.open(doc.file, '_blank')}
                          className={`p-1.5 rounded transition-colors ${
                            isDark
                              ? 'hover:bg-slate-700 text-gray-400'
                              : 'hover:bg-gray-100 text-gray-600'
                          }`}
                          title="Ver documento"
                        >
                          <HiEye className="h-4 w-4" />
                        </button>
                      )}
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        willKeep
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {willKeep ? <HiCheck className="h-3 w-3" /> : <HiX className="h-3 w-3" />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Documentos Nuevos */}
      {newDocuments.length > 0 && (
        <div className="space-y-3">
          <h4 className={`text-sm font-medium ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Nuevos Documentos ({newDocuments.length})
          </h4>
          <div className="space-y-3">
            {newDocuments.map((doc, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  isDark
                    ? 'bg-slate-800 border-slate-600'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Preview */}
                  <div className={`w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isDark ? 'bg-slate-700' : 'bg-gray-100'
                  }`}>
                    {doc.preview ? (
                      <img
                        src={doc.preview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <HiDocument className={`h-8 w-8 ${
                        isDark ? 'text-slate-500' : 'text-gray-400'
                      }`} />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {doc.file.name}
                    </p>
                    <p className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {(doc.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>

                    {/* Campos de metadata */}
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className={`block text-xs font-medium mb-1 ${
                          isDark ? 'text-gray-400' : 'text-gray-700'
                        }`}>
                          Tipo de Documento
                        </label>
                        <select
                          value={doc.type}
                          onChange={(e) => updateNewDocument(index, 'type', e.target.value)}
                          className={`w-full px-2 py-1.5 text-xs rounded-md border ${
                            isDark
                              ? 'bg-slate-700 border-slate-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:outline-none focus:ring-1 focus:ring-red-500`}
                        >
                          {DOCUMENT_TYPES.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1 ${
                          isDark ? 'text-gray-400' : 'text-gray-700'
                        }`}>
                          Descripción
                        </label>
                        <input
                          type="text"
                          value={doc.description}
                          onChange={(e) => updateNewDocument(index, 'description', e.target.value)}
                          placeholder="Opcional"
                          className={`w-full px-2 py-1.5 text-xs rounded-md border ${
                            isDark
                              ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          } focus:outline-none focus:ring-1 focus:ring-red-500`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Botón eliminar */}
                  <button
                    type="button"
                    onClick={() => removeNewDocument(index)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isDark
                        ? 'hover:bg-slate-700 text-gray-400'
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <HiTrash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Área de Upload */}
      {canAddMore && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragOver
              ? isDark
                ? 'border-red-500 bg-slate-800'
                : 'border-red-500 bg-red-50'
              : isDark
                ? 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/50'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={allowedTypes.join(',')}
            onChange={(e) => e.target.files && addDocuments(e.target.files)}
            className="hidden"
          />
          <HiUpload className={`mx-auto h-12 w-12 ${
            dragOver
              ? 'text-red-500'
              : isDark
                ? 'text-gray-400'
                : 'text-gray-400'
          }`} />
          <p className={`mt-2 text-sm ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Arrastra archivos aquí o haz clic para seleccionar
          </p>
          <p className={`text-xs mt-1 ${
            isDark ? 'text-gray-500' : 'text-gray-500'
          }`}>
            PDF, Word, imágenes • Máx. {maxFileSize / 1024 / 1024}MB • {maxDocuments - totalDocuments} disponibles
          </p>
        </div>
      )}

      {/* Límite alcanzado */}
      {!canAddMore && (
        <div className={`p-4 rounded-lg border ${
          isDark
            ? 'bg-slate-800 border-slate-600'
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center gap-2">
            <HiExclamationTriangle className="h-5 w-5 text-yellow-500" />
            <p className={`text-sm ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Has alcanzado el límite máximo de {maxDocuments} documentos.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentManager;