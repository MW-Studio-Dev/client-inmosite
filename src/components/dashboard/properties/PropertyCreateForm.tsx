// components/CreatePropertyForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form } from 'formik';
import { useCreateProperty } from '@/hooks/useCreateProperty';
import { CreatePropertyForm as FormData } from '@/types/property';
import { propertyValidationSchema } from './validation/propertySchema';
import { useDashboardTheme } from '@/context/DashboardThemeContext';
import { useToast, ToastContainer } from '@/hooks/useToast';
import {
  TextInput,
  NumberInput,
  SelectInput,
  TextAreaInput,
  CheckboxInput,
  FeatureSelector,
  AddressAutocomplete
} from './form-fields';
import {
  HiHome,
  HiCurrencyDollar,
  HiLocationMarker,
  HiCheckCircle,
  HiX,
  HiOutlineOfficeBuilding,
  HiOutlineHome,
  HiPlus,
  HiExclamationCircle,
  HiCog,
  HiPhotograph,
  HiUpload,
  HiTrash,
  HiChevronDown,
  HiChevronUp
} from 'react-icons/hi';

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
  expenses: '',

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
  zip_code: '',
  currency: '',

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
  features: [],
  //imagenes
  featured_image: null,
  images: []
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

const CURRENCIES = [
  { value: 'USD', label: 'USD - Dólar Americano' },
  { value: 'ARS', label: 'ARS - Peso Argentino' },
  { value: 'EUR', label: 'EUR - Euro' }
];

export const CreatePropertyForm: React.FC<CreatePropertyFormProps> = ({
  onSuccess,
  onCancel
}) => {
  const router = useRouter();
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [featuredPreview, setFeaturedPreview] = useState<string | null>(null);
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState({
    basic: true, // Iniciar con la sección básica expandida
    prices: false,
    location: false,
    features: false,
    images: false,
    config: false
  });

  const { loading, error, createProperty } = useCreateProperty();
  const { theme } = useDashboardTheme();
  const toastHook = useToast();
  const addToast = toastHook.addToast;
  const removeToast = toastHook.removeToast;
  const toasts = toastHook.toasts;
  const isDark = theme === 'dark';

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFeaturedImageChange = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImage(file);
      setFieldValue('featured_image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeaturedPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFeaturedImage = (setFieldValue: (field: string, value: any) => void) => {
    setFeaturedImage(null);
    setFeaturedPreview(null);
    setFieldValue('featured_image', null);
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newImages = [...additionalImages, ...files];
      setAdditionalImages(newImages);
      setFieldValue('images', newImages);

      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAdditionalPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeAdditionalImage = (index: number, setFieldValue: (field: string, value: any) => void) => {
    const newImages = additionalImages.filter((_, i) => i !== index);
    setAdditionalImages(newImages);
    setAdditionalPreviews(prev => prev.filter((_, i) => i !== index));
    setFieldValue('images', newImages);
  };

  return (
    <>
    <Formik
      initialValues={initialFormData}
      validationSchema={propertyValidationSchema}
      onSubmit={async (values, actions) => {
        try {
          const formDataWithImages = {
            ...values,
            featured_image: featuredImage,
            images: additionalImages
          };

          console.log('Enviando formulario con datos:', formDataWithImages);
          const result = await createProperty(formDataWithImages);

          if (result.success && result.propertyId) {
            // Mostrar toast de éxito
            addToast('¡Propiedad creada exitosamente!', 'success');

            // Redirigir después de un breve delay para que el usuario vea el toast
            setTimeout(() => {
              if (onSuccess) {
                onSuccess(result!.propertyId!);
              } else {
                router.push('/dashboard/propiedades');
              }
            }, 1500);
          }
        } catch (error) {
          console.error('Error en el submit del formulario:', error);
          addToast('Error al crear la propiedad. Por favor, intenta nuevamente.', 'error');
        } finally {
          actions.setSubmitting(false);
        }
      }}
      validateOnChange={true}
      validateOnBlur={true}
    >
      {({ setFieldValue, isSubmitting, values }) => (
        <Form>
          <div className={`max-w-4xl mx-auto rounded-lg border ${
            isDark
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-gray-200'
          } mx-2 sm:mx-4 lg:mx-auto`}>
            {/* Header */}
            <div className={`px-4 sm:px-6 py-4 border-b ${
              isDark ? 'border-slate-700' : 'border-gray-200'
            }`}>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className={`text-lg sm:text-xl font-semibold flex items-center gap-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    <HiHome className={`h-5 w-5 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                    Nueva Propiedad
                  </h2>
                  <p className={`text-xs sm:text-sm mt-0.5 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>Completa la información de la nueva propiedad</p>
                </div>
                {onCancel && (
                  <button
                    type="button"
                    onClick={onCancel}
                    className={`px-3 py-1.5 text-sm transition-colors flex items-center gap-1 ${
                      isDark
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <HiX className="h-4 w-4" />
                    <span className="hidden sm:inline">Cancelar</span>
                  </button>
                )}
              </div>
            </div>

            {/* Form content */}
            <div className="px-4 sm:px-6 py-5">
              {/* Error general */}
              {error && (
                <div className={`mb-4 border rounded-md p-3 ${
                  isDark
                    ? 'bg-red-900/20 border-red-800'
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <HiExclamationCircle className={`h-4 w-4 ${
                      isDark ? 'text-red-400' : 'text-red-600'
                    }`} />
                    <span className={`text-sm ${
                      isDark ? 'text-red-300' : 'text-red-800'
                    }`}>{error}</span>
                  </div>
                </div>
              )}

              {/* Información Básica */}
              <div className="mb-8">
                <button
                  type="button"
                  onClick={() => toggleSection('basic')}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    isDark
                      ? 'border-slate-700 hover:bg-slate-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <h3 className={`text-lg font-medium flex items-center gap-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    <HiOutlineOfficeBuilding className="h-5 w-5 text-red-500" />
                    Información Básica
                  </h3>
                  {expandedSections.basic ? (
                    <HiChevronUp className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                  ) : (
                    <HiChevronDown className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                  )}
                </button>

                {expandedSections.basic && (
                  <div className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextInput
                        label="Título de la propiedad"
                        name="title"
                        required
                        placeholder="Ej: Departamento 2 ambientes en Palermo con balcón"
                      />
                      <SelectInput
                        label="Tipo de operación"
                        name="operation_type"
                        options={[
                          { value: 'venta', label: 'Venta' },
                          { value: 'alquiler', label: 'Alquiler' }
                        ]}
                        required
                      />
                    </div>
                    <TextAreaInput
                      label="Descripción"
                      name="description"
                      required
                      placeholder="Describe la propiedad, sus características y ubicación..."
                      rows={3}
                      className="mt-4"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <TextInput
                        label="Código interno"
                        name="internal_code"
                        placeholder="Ej: PAL001"
                      />
                      <SelectInput
                        label="Tipo de propiedad"
                        name="property_type"
                        options={PROPERTY_TYPES}
                        required
                      />
                      <SelectInput
                        label="Estado"
                        name="status"
                        options={[
                          { value: 'disponible', label: 'Disponible' },
                          { value: 'reservado', label: 'Reservado' },
                          { value: 'vendado', label: 'Vendido' },
                          { value: 'no_disponible', label: 'No Disponible' }
                        ]}
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Precios */}
              <div className="mb-8">
                <button
                  type="button"
                  onClick={() => toggleSection('prices')}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    isDark
                      ? 'border-slate-700 hover:bg-slate-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <h3 className={`text-lg font-medium flex items-center gap-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    <HiCurrencyDollar className="h-5 w-5 text-red-500" />
                    Precios
                  </h3>
                  {expandedSections.prices ? (
                    <HiChevronUp className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                  ) : (
                    <HiChevronDown className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                  )}
                </button>

                {expandedSections.prices && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SelectInput
                      label="Moneda"
                      name="currency"
                      options={CURRENCIES}
                      required
                      placeholder="Seleccionar moneda"
                    />
                    {values.currency === 'USD' && (
                      <NumberInput
                        label="Precio en USD"
                        name="price_usd"
                        placeholder="150000"
                      />
                    )}
                    {values.currency === 'ARS' && (
                      <NumberInput
                        label="Precio en ARS"
                        name="price_ars"
                        placeholder="120000000"
                      />
                    )}
                    {values.currency === 'EUR' && (
                      <NumberInput
                        label="Precio en EUR"
                        name="price_usd"
                        placeholder="150000"
                      />
                    )}
                    <NumberInput
                      label="Expensas (ARS)"
                      name="expenses"
                      placeholder="50000"
                    />
                  </div>
                )}
              </div>

              {/* Ubicación */}
              <div className="mb-8">
                <button
                  type="button"
                  onClick={() => toggleSection('location')}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    isDark
                      ? 'border-slate-700 hover:bg-slate-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <h3 className={`text-lg font-medium flex items-center gap-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    <HiLocationMarker className="h-5 w-5 text-red-500" />
                    Ubicación
                  </h3>
                  {expandedSections.location ? (
                    <HiChevronUp className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                  ) : (
                    <HiChevronDown className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                  )}
                </button>

                {expandedSections.location && (
                  <div className="mt-4">
                    <AddressAutocomplete setFieldValue={setFieldValue}>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <TextInput
                          label="Provincia"
                          name="province"
                          required
                          placeholder="Buenos Aires"
                        />
                        <TextInput
                          label="Ciudad"
                          name="city"
                          required
                          placeholder="CABA"
                        />
                        <TextInput
                          label="Barrio"
                          name="neighborhood"
                          required
                          placeholder="Palermo"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                        <TextInput
                          label="Dirección"
                          name="address"
                          required
                          placeholder="Av. Santa Fe 3456"
                        />
                        <NumberInput
                          label="Piso"
                          name="floor"
                          placeholder="3"
                        />
                        <TextInput
                          label="Unidad/Depto"
                          name="unit"
                          placeholder="A"
                        />
                        <TextInput
                          label="Código Postal"
                          name="zip_code"
                          placeholder="C1000ABC"
                        />
                      </div>
                    </AddressAutocomplete>
                  </div>
                )}
              </div>

              {/* Características */}
              <div className="mb-8">
                <button
                  type="button"
                  onClick={() => toggleSection('features')}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    isDark
                      ? 'border-slate-700 hover:bg-slate-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <h3 className={`text-lg font-medium flex items-center gap-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    <HiOutlineHome className="h-5 w-5 text-red-500" />
                    Características
                  </h3>
                  {expandedSections.features ? (
                    <HiChevronUp className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                  ) : (
                    <HiChevronDown className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                  )}
                </button>

                {expandedSections.features && (
                  <div className="mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <NumberInput
                        label="Ambientes"
                        name="rooms"
                        required
                        placeholder="2"
                      />
                      <NumberInput
                        label="Dormitorios"
                        name="bedrooms"
                        placeholder="1"
                      />
                      <NumberInput
                        label="Baños"
                        name="bathrooms"
                        placeholder="1"
                      />
                      <NumberInput
                        label="Toilettes"
                        name="half_bathrooms"
                        placeholder="0"
                      />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <NumberInput
                        label="Superficie total (m²)"
                        name="surface_total"
                        required
                        placeholder="45.50"
                      />
                      <NumberInput
                        label="Superficie cubierta (m²)"
                        name="surface_covered"
                        placeholder="42.00"
                      />
                      <NumberInput
                        label="Antigüedad (años)"
                        name="age_years"
                        placeholder="15"
                      />
                      <NumberInput
                        label="Cocheras"
                        name="garage_spaces"
                        placeholder="0"
                      />
                    </div>
                    <FeatureSelector name="features" commonFeatures={COMMON_FEATURES} />
                  </div>
                )}
              </div>

              {/* Imágenes */}
              <div className="mb-8">
                <button
                  type="button"
                  onClick={() => toggleSection('images')}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    isDark
                      ? 'border-slate-700 hover:bg-slate-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <h3 className={`text-lg font-medium flex items-center gap-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    <HiPhotograph className="h-5 w-5 text-red-500" />
                    Imágenes
                  </h3>
                  {expandedSections.images ? (
                    <HiChevronUp className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                  ) : (
                    <HiChevronDown className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                  )}
                </button>

                {expandedSections.images && (
                  <div className="mt-4">
                    {/* Imagen destacada */}
                    <div className="mb-6">
                      <h4 className={`text-sm font-medium mb-2 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>Imagen destacada</h4>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {featuredPreview && (
                          <div className={`relative group aspect-square rounded-md overflow-hidden border-2 ${
                            isDark ? 'border-slate-600' : 'border-gray-300'
                          }`}>
                            <img
                              src={featuredPreview}
                              alt="Imagen destacada"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeFeaturedImage(setFieldValue)}
                              className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-md transition-opacity opacity-0 group-hover:opacity-100"
                            >
                              <HiTrash className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                        {!featuredPreview && (
                          <label className={`flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-md cursor-pointer hover:border-red-500 transition-colors ${
                            isDark
                              ? 'border-slate-600 bg-slate-900 hover:bg-slate-800'
                              : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                          }`}>
                            <HiUpload className={`h-6 w-6 ${
                              isDark ? 'text-gray-500' : 'text-gray-400'
                            }`} />
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => handleFeaturedImageChange(e, setFieldValue)}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Imágenes adicionales */}
                    <div>
                      <h4 className={`text-sm font-medium mb-2 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>Imágenes adicionales</h4>

                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {/* Previews de imágenes cargadas */}
                        {additionalPreviews.map((preview, index) => (
                          <div
                            key={index}
                            className={`relative group aspect-square rounded-md overflow-hidden border-2 ${
                              isDark ? 'border-slate-600' : 'border-gray-300'
                            }`}
                          >
                            <img
                              src={preview}
                              alt={`Imagen ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeAdditionalImage(index, setFieldValue)}
                              className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-md transition-opacity opacity-0 group-hover:opacity-100"
                            >
                              <HiTrash className="h-3 w-3" />
                            </button>
                          </div>
                        ))}

                        {/* Botón para agregar más */}
                        <label className={`flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-md cursor-pointer hover:border-red-500 transition-colors ${
                          isDark
                            ? 'border-slate-600 bg-slate-900 hover:bg-slate-800'
                            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                        }`}>
                          <HiPlus className={`h-6 w-6 ${
                            isDark ? 'text-gray-500' : 'text-gray-400'
                          }`} />
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleAdditionalImagesChange(e, setFieldValue)}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Configuración */}
              <div className="mb-8">
                <button
                  type="button"
                  onClick={() => toggleSection('config')}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    isDark
                      ? 'border-slate-700 hover:bg-slate-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <h3 className={`text-lg font-medium flex items-center gap-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    <HiCog className="h-5 w-5 text-red-500" />
                    Configuración
                  </h3>
                  {expandedSections.config ? (
                    <HiChevronUp className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                  ) : (
                    <HiChevronDown className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                  )}
                </button>

                {expandedSections.config && (
                  <div className="mt-4 space-y-3">
                    <CheckboxInput
                      label="Propiedad destacada"
                      name="is_featured"
                    />
                    <CheckboxInput
                      label="Publicar propiedad"
                      name="is_published"
                    />
                  </div>
                )}
              </div>

              {/* Submit button */}
              <div className={`flex justify-end pt-5 border-t ${
                isDark ? 'border-slate-700' : 'border-gray-200'
              }`}>
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    isSubmitting || loading
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {isSubmitting || loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Creando...
                    </>
                  ) : (
                    <>
                      <HiCheckCircle className="h-4 w-4" />
                      Crear Propiedad
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>

    {/* Contenedor de Toasts */}
    <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
};