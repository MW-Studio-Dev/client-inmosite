// components/CreatePropertyForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateProperty } from '@/hooks/useCreateProperty';
import { CreatePropertyForm as FormData } from '@/types/property';

interface CreatePropertyFormProps {
  onSuccess?: (propertyId: string) => void;
  onCancel?: () => void;
}

const initialFormData: FormData = {
  // Información básica
  title: '',
  description: '',
  internal_code: '',
  
  // Precios
  price_usd: '',
  price_ars: '',
  
  // Tipo y estado
  operation_type: '',
  property_type: '',
  status: '',
  
  // Ubicación
  province: 'Buenos Aires',
  city: '',
  neighborhood: '',
  address: '',
  floor: '',
  unit: '',
  
  // Características físicas
  bedrooms: '',
  bathrooms: '',
  half_bathrooms: '',
  rooms: '',
  surface_total: '',
  surface_covered: '',
  surface_semicovered: '',
  surface_uncovered: '',
  age_years: '',
  orientation: '',
  garage_spaces: '',
  storage_spaces: '',
  
  // Configuración
  is_featured: false,
  is_published: false,
  
  // SEO
  meta_title: '',
  meta_description: '',
  
  // Características adicionales
  features: []
};

const PROPERTY_TYPES = [
  'departamento',
  'casa',
  'ph',
  'oficina',
  'local',
  'lote',
  'cochera',
  'quinta',
  'galpon',
  'otro'
];

const ORIENTATIONS = [
  'norte',
  'sur',
  'este',
  'oeste',
  'noreste',
  'noroeste',
  'sureste',
  'suroeste'
];

const COMMON_FEATURES = [
  'balcón',
  'terraza',
  'jardín',
  'patio',
  'pileta',
  'parrilla',
  'gimnasio',
  'sum',
  'portero',
  'ascensor',
  'calefacción central',
  'aire acondicionado',
  'calefacción individual',
  'gas natural',
  'agua caliente central',
  'baulera',
  'lavadero',
  'vestidor',
  'escritorio',
  'dependencia de servicio',
  'cerca del transporte',
  'zona comercial',
  'zona tranquila',
  'luminoso',
  'reciclado',
  'a estrenar'
];

export const CreatePropertyForm: React.FC<CreatePropertyFormProps> = ({
  onSuccess,
  onCancel
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentSection, setCurrentSection] = useState(0);
  const [newFeature, setNewFeature] = useState('');
  
  const { loading, error, fieldErrors, createProperty, clearErrors } = useCreateProperty();

  const sections = [
    { id: 0, title: 'Información Básica', icon: '📝' },
    { id: 1, title: 'Precios', icon: '💰' },
    { id: 2, title: 'Ubicación', icon: '📍' },
    { id: 3, title: 'Características', icon: '🏠' },
    { id: 4, title: 'Configuración', icon: '⚙️' }
  ];

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    clearErrors();
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  const addCommonFeature = (feature: string) => {
    if (!formData.features.includes(feature)) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, feature]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await createProperty(formData);
    
    if (result.success && result.propertyId) {
      if (onSuccess) {
        onSuccess(result.propertyId);
      } else {
        router.push('/dashboard/propiedades');
      }
    }
  };

  const InputField = ({ 
    label, 
    field, 
    type = 'text', 
    required = false, 
    placeholder = '',
    className = ''
  }: {
    label: string;
    field: keyof FormData;
    type?: string;
    required?: boolean;
    placeholder?: string;
    className?: string;
  }) => (
    <div className={className}>
      <label className="block text-sm font-medium text-text-secondary mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={formData[field] as string | number}
        onChange={(e) => updateField(field, type === 'number' ? Number(e.target.value) || '' : e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
          fieldErrors[field as string] ? 'border-red-500' : 'border-surface-border'
        }`}
      />
      {fieldErrors[field as string] && (
        <p className="text-red-500 text-sm mt-1">{fieldErrors[field as string]}</p>
      )}
    </div>
  );

  const SelectField = ({ 
    label, 
    field, 
    options, 
    required = false,
    placeholder = 'Seleccionar...',
    className = ''
  }: {
    label: string;
    field: keyof FormData;
    options: string[] | { value: string; label: string }[];
    required?: boolean;
    placeholder?: string;
    className?: string;
  }) => (
    <div className={className}>
      <label className="block text-sm font-medium text-text-secondary mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={formData[field] as string}
        onChange={(e) => updateField(field, e.target.value)}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
          fieldErrors[field as string] ? 'border-red-500' : 'border-surface-border'
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => {
          const value = typeof option === 'string' ? option : option.value;
          const label = typeof option === 'string' ? option.charAt(0).toUpperCase() + option.slice(1) : option.label;
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
      {fieldErrors[field as string] && (
        <p className="text-red-500 text-sm mt-1">{fieldErrors[field as string]}</p>
      )}
    </div>
  );

  const renderSection = () => {
    switch (currentSection) {
      case 0: // Información Básica
        return (
          <div className="space-y-6">
            <InputField
              label="Título de la propiedad"
              field="title"
              required
              placeholder="Ej: Departamento 2 ambientes en Palermo con balcón"
            />
            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Describe la propiedad, sus características y ubicación..."
                rows={6}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  fieldErrors.description ? 'border-red-500' : 'border-surface-border'
                }`}
              />
              {fieldErrors.description && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Código interno"
                field="internal_code"
                placeholder="Ej: PAL001"
              />
              
              <SelectField
                label="Tipo de operación"
                field="operation_type"
                options={[
                  { value: 'venta', label: 'Venta' },
                  { value: 'alquiler', label: 'Alquiler' }
                ]}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                label="Tipo de propiedad"
                field="property_type"
                options={PROPERTY_TYPES}
                required
              />
              
              <SelectField
                label="Estado"
                field="status"
                options={[
                  { value: 'disponible', label: 'Disponible' },
                  { value: 'reservado', label: 'Reservado' },
                  { value: 'vendido', label: 'Vendido' },
                  { value: 'no_disponible', label: 'No Disponible' }
                ]}
                required
              />
            </div>
          </div>
        );

      case 1: // Precios
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">💡 Información sobre precios</h4>
              <p className="text-blue-700 text-sm">
                Puedes especificar el precio en dólares, en pesos argentinos, o ambos. 
                Al menos uno de los campos es requerido.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Precio en USD"
                field="price_usd"
                type="number"
                placeholder="150000"
              />
              
              <InputField
                label="Precio en ARS"
                field="price_ars"
                type="number"
                placeholder="120000000"
              />
            </div>

            {(formData.price_usd || formData.price_ars) && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">💰 Vista previa del precio</h4>
                <div className="text-green-700">
                  {formData.price_usd && (
                    <p>USD: ${Number(formData.price_usd).toLocaleString('es-AR')}</p>
                  )}
                  {formData.price_ars && (
                    <p>ARS: ${Number(formData.price_ars).toLocaleString('es-AR')}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case 2: // Ubicación
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Provincia"
                field="province"
                required
                placeholder="Buenos Aires"
              />
              
              <InputField
                label="Ciudad"
                field="city"
                required
                placeholder="CABA"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Barrio"
                field="neighborhood"
                required
                placeholder="Palermo"
              />
              
              <InputField
                label="Dirección"
                field="address"
                required
                placeholder="Av. Santa Fe 3456"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Piso"
                field="floor"
                type="number"
                placeholder="3"
              />
              
              <InputField
                label="Unidad/Depto"
                field="unit"
                placeholder="A"
              />
            </div>
          </div>
        );

      case 3: // Características
        return (
          <div className="space-y-6">
            {/* Ambientes y habitaciones */}
            <div>
              <h4 className="text-lg font-semibold text-text-primary mb-4">🏠 Ambientes y habitaciones</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InputField
                  label="Ambientes"
                  field="rooms"
                  type="number"
                  required
                  placeholder="2"
                />
                
                <InputField
                  label="Dormitorios"
                  field="bedrooms"
                  type="number"
                  placeholder="1"
                />
                
                <InputField
                  label="Baños"
                  field="bathrooms"
                  type="number"
                  placeholder="1"
                />
                
                <InputField
                  label="Toilettes"
                  field="half_bathrooms"
                  type="number"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Superficies */}
            <div>
              <h4 className="text-lg font-semibold text-text-primary mb-4">📐 Superficies (m²)</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InputField
                  label="Superficie total"
                  field="surface_total"
                  type="number"
                  required
                  placeholder="45.50"
                />
                
                <InputField
                  label="Superficie cubierta"
                  field="surface_covered"
                  type="number"
                  placeholder="42.00"
                />
                
                <InputField
                  label="Superficie semicubierta"
                  field="surface_semicovered"
                  type="number"
                  placeholder="3.50"
                />
                
                <InputField
                  label="Superficie descubierta"
                  field="surface_uncovered"
                  type="number"
                  placeholder="80.00"
                />
              </div>
            </div>

            {/* Otras características */}
            <div>
              <h4 className="text-lg font-semibold text-text-primary mb-4">🚗 Otras características</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InputField
                  label="Antigüedad (años)"
                  field="age_years"
                  type="number"
                  placeholder="15"
                />
                
                <SelectField
                  label="Orientación"
                  field="orientation"
                  options={ORIENTATIONS}
                  placeholder="Seleccionar orientación"
                />
                
                <InputField
                  label="Cocheras"
                  field="garage_spaces"
                  type="number"
                  placeholder="0"
                />
                
                <InputField
                  label="Bauleras"
                  field="storage_spaces"
                  type="number"
                  placeholder="1"
                />
              </div>
            </div>

            {/* Características adicionales */}
            <div>
              <h4 className="text-lg font-semibold text-text-primary mb-4">✨ Características adicionales</h4>
              
              {/* Características comunes */}
              <div className="mb-4">
                <p className="text-sm text-text-secondary mb-2">Selecciona características comunes:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {COMMON_FEATURES.map((feature) => (
                    <button
                      key={feature}
                      type="button"
                      onClick={() => addCommonFeature(feature)}
                      disabled={formData.features.includes(feature)}
                      className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        formData.features.includes(feature)
                          ? 'bg-green-100 text-green-800 cursor-not-allowed'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {formData.features.includes(feature) ? '✓ ' : '+ '}{feature}
                    </button>
                  ))}
                </div>
              </div>

              {/* Agregar característica personalizada */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Agregar característica personalizada..."
                  className="flex-1 px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-2 bg-primary hover:bg-primary-600 text-white rounded-lg transition-colors"
                >
                  Agregar
                </button>
              </div>

              {/* Características seleccionadas */}
              {formData.features.length > 0 && (
                <div>
                  <p className="text-sm text-text-secondary mb-2">Características seleccionadas:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-primary-50 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(feature)}
                          className="text-primary-400 hover:text-primary-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 4: // Configuración
        return (
          <div className="space-y-6">
            {/* Configuración de publicación */}
            <div>
              <h4 className="text-lg font-semibold text-text-primary mb-4">⚙️ Configuración de publicación</h4>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => updateField('is_featured', e.target.checked)}
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="is_featured" className="ml-2 text-text-primary">
                    ⭐ Propiedad destacada
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={formData.is_published}
                    onChange={(e) => updateField('is_published', e.target.checked)}
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="is_published" className="ml-2 text-text-primary">
                    🌐 Publicar propiedad
                  </label>
                </div>
              </div>
            </div>

            {/* SEO */}
            <div>
              <h4 className="text-lg font-semibold text-text-primary mb-4">🔍 SEO (Opcional)</h4>
              <div className="space-y-4">
                <InputField
                  label="Título SEO"
                  field="meta_title"
                  placeholder="Ej: Departamento en Palermo - 2 ambientes con balcón"
                />
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Descripción SEO
                  </label>
                  <textarea
                    value={formData.meta_description}
                    onChange={(e) => updateField('meta_description', e.target.value)}
                    placeholder="Descripción breve para motores de búsqueda..."
                    rows={3}
                    maxLength={160}
                    className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p className="text-xs text-text-secondary mt-1">
                    {formData.meta_description.length}/160 caracteres
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-surface rounded-custom-xl border border-surface-border">
      {/* Header */}
      <div className="px-6 py-4 border-b border-surface-border">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Nueva Propiedad</h2>
            <p className="text-text-secondary">Completa la información de la nueva propiedad</p>
          </div>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              ✕ Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-6 py-4 bg-gray-50">
        <div className="flex justify-between items-center mb-2">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setCurrentSection(section.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                currentSection === section.id
                  ? 'bg-primary text-white'
                  : currentSection > section.id
                  ? 'bg-green-100 text-green-800'
                  : 'bg-white text-text-secondary hover:bg-gray-100'
              }`}
            >
              <span>{section.icon}</span>
              <span className="hidden sm:block">{section.title}</span>
            </button>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 py-6">
        {/* Error general */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <span className="text-red-500">❌</span>
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Current section */}
        {renderSection()}

        {/* Navigation buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-surface-border">
          <button
            type="button"
            onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
            disabled={currentSection === 0}
            className={`px-6 py-2 rounded-lg transition-colors ${
              currentSection === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            ← Anterior
          </button>

          <span className="text-text-secondary">
            {currentSection + 1} de {sections.length}
          </span>

          {currentSection < sections.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
              className="px-6 py-2 bg-primary hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              Siguiente →
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-primary hover:scale-105'
              } text-white`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creando...
                </span>
              ) : (
                '🏠 Crear Propiedad'
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};