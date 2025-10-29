// components/PropertyUpdateForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, FormikHelpers } from 'formik';
import { useUpdateProperty } from '@/hooks/useUpdateProperty';
import { CreatePropertyForm as FormData, PropertyDetail } from '@/types/property';
import { propertyValidationSchema } from './validation/propertySchema';
import { useDashboardTheme } from '@/context/DashboardThemeContext';
import {
  TextInput,
  NumberInput,
  SelectInput,
  TextAreaInput,
  CheckboxInput,
  FeatureSelector
} from './form-fields';
import {
  HiHome,
  HiCurrencyDollar,
  HiLocationMarker,
  HiCheckCircle,
  HiX,
  HiChevronLeft,
  HiChevronRight,
  HiOutlineOfficeBuilding,
  HiOutlineHome,
  HiPlus,
  HiExclamationCircle,
  HiCog,
  HiPhotograph,
  HiUpload,
  HiTrash
} from 'react-icons/hi';

interface PropertyUpdateFormProps {
  property: PropertyDetail;
  onSuccess?: (propertyId: string) => void;
  onCancel?: () => void;
}

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

export const PropertyUpdateForm: React.FC<PropertyUpdateFormProps> = ({
  property,
  onSuccess,
  onCancel
}) => {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(0);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [featuredPreview, setFeaturedPreview] = useState<string | null>(
    property.featured_image_url || null
  );
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>(
    property.images || []
  );

  const { loading, error, updateProperty } = useUpdateProperty();
  const { theme } = useDashboardTheme();
  const isDark = theme === 'dark';

  const sections = [
    { id: 0, title: 'Información Básica', icon: HiOutlineOfficeBuilding },
    { id: 1, title: 'Precios', icon: HiCurrencyDollar },
    { id: 2, title: 'Ubicación', icon: HiLocationMarker },
    { id: 3, title: 'Características', icon: HiOutlineHome },
    { id: 4, title: 'Imágenes', icon: HiPhotograph },
    { id: 5, title: 'Configuración', icon: HiCog }
  ];

  // Convertir PropertyDetail a FormData inicial
  const initialFormData: FormData = {
    title: property.title || '',
    description: property.description || '',
    internal_code: property.internal_code || '',
    price_usd: property.price_usd ? parseFloat(property.price_usd) : '',
    price_ars: property.price_ars ? parseFloat(property.price_ars) : '',
    expenses: property.expenses_ars ? parseFloat(property.expenses_ars) : '',
    operation_type: property.operation_type || '',
    property_type: property.property_type || '',
    status: property.status || '',
    province: property.province || 'Buenos Aires',
    city: property.city || '',
    neighborhood: property.neighborhood || '',
    address: property.address || '',
    floor: property.floor ? parseInt(property.floor) : '',
    unit: property.unit || '',
    bedrooms: property.bedrooms || '',
    bathrooms: property.bathrooms || '',
    half_bathrooms: property.half_bathrooms || '',
    rooms: property.rooms || '',
    surface_total: property.surface_total ? parseFloat(property.surface_total) : '',
    surface_covered: property.surface_covered ? parseFloat(property.surface_covered) : '',
    surface_semicovered: property.surface_semicovered ? parseFloat(property.surface_semicovered) : '',
    surface_uncovered: property.surface_uncovered ? parseFloat(property.surface_uncovered) : '',
    age_years: property.age_years || '',
    orientation: property.orientation || '',
    garage_spaces: property.garage_spaces || '',
    storage_spaces: property.storage_spaces || '',
    is_featured: property.is_featured || false,
    is_published: property.is_published || false,
    meta_title: property.meta_title || '',
    meta_description: property.meta_description || '',
    features: property.features || [],
    featured_image: null,
    images: []
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
    setFeaturedPreview(property.featured_image_url);
    setFieldValue('featured_image', null);
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 10 - additionalImages.length;
    const filesToAdd = files.slice(0, remainingSlots);

    if (filesToAdd.length > 0) {
      const newImages = [...additionalImages, ...filesToAdd];
      setAdditionalImages(newImages);
      setFieldValue('images', newImages);

      // Generate previews
      filesToAdd.forEach(file => {
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

  const handleSubmit = async (values: FormData, actions: FormikHelpers<FormData>) => {
    // Solo permitir submit si estamos en la última sección
    if (currentSection !== sections.length - 1) {
      actions.setSubmitting(false);
      return;
    }

    // Sincronizar imágenes con el formulario antes de enviar
    const formDataWithImages = {
      ...values,
      featured_image: featuredImage,
      images: additionalImages
    };

    const result = await updateProperty(property.id, formDataWithImages);

    if (result.success && result.propertyId) {
      if (onSuccess) {
        onSuccess(result.propertyId);
      } else {
        router.push('/dashboard/properties');
      }
    }

    actions.setSubmitting(false);
  };

  const renderSection = (values: FormData, setFieldValue: (field: string, value: any) => void) => {
    switch (currentSection) {
      case 0: // Información Básica
        return (
          <div className="space-y-6">
            <TextInput
              label="Título de la propiedad"
              name="title"
              required
              placeholder="Ej: Departamento 2 ambientes en Palermo con balcón"
            />

            <TextAreaInput
              label="Descripción"
              name="description"
              required
              placeholder="Describe la propiedad, sus características y ubicación..."
              rows={5}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput
                label="Código interno"
                name="internal_code"
                placeholder="Ej: PAL001"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
              <p className="text-blue-800 dark:text-blue-300 text-xs flex items-center gap-1.5">
                <HiCurrencyDollar className="h-4 w-4" />
                Especifica al menos un precio (USD o ARS)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NumberInput
                label="Precio en USD"
                name="price_usd"
                placeholder="150000"
              />

              <NumberInput
                label="Precio en ARS"
                name="price_ars"
                placeholder="120000000"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NumberInput
                label="Expensas (ARS)"
                name="expenses"
                placeholder="50000"
              />
            </div>

            {(values.price_usd || values.price_ars || values.expenses) && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-md p-3">
                <div className="text-sm text-emerald-800 dark:text-emerald-300">
                  {values.price_usd && (
                    <p className="flex items-center gap-1.5">
                      <HiCheckCircle className="h-4 w-4" />
                      USD: ${values.price_usd}
                    </p>
                  )}
                  {values.price_ars && (
                    <p className="flex items-center gap-1.5 mt-1">
                      <HiCheckCircle className="h-4 w-4" />
                      ARS: ${values.price_ars}
                    </p>
                  )}
                  {values.expenses && (
                    <p className="flex items-center gap-1.5 mt-1">
                      <HiCheckCircle className="h-4 w-4" />
                      Expensas: ${values.expenses}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case 2: // Ubicación
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Barrio"
                name="neighborhood"
                required
                placeholder="Palermo"
              />

              <TextInput
                label="Dirección"
                name="address"
                required
                placeholder="Av. Santa Fe 3456"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
          </div>
        );

      case 3: // Características
        return (
          <div className="space-y-4">
            {/* Ambientes y habitaciones */}
            <div>
              <h4 className={`text-sm font-medium mb-3 flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                <HiOutlineHome className={`h-4 w-4 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`} />
                Ambientes y habitaciones
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
            </div>

            {/* Superficies */}
            <div>
              <h4 className={`text-sm font-medium mb-3 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Superficies (m²)</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <NumberInput
                  label="Superficie total"
                  name="surface_total"
                  required
                  placeholder="45.50"
                />

                <NumberInput
                  label="Superficie cubierta"
                  name="surface_covered"
                  placeholder="42.00"
                />

                <NumberInput
                  label="Superficie semicubierta"
                  name="surface_semicovered"
                  placeholder="3.50"
                />

                <NumberInput
                  label="Superficie descubierta"
                  name="surface_uncovered"
                  placeholder="80.00"
                />
              </div>
            </div>

            {/* Otras características */}
            <div>
              <h4 className={`text-sm font-medium mb-3 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Otras características</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <NumberInput
                  label="Antigüedad (años)"
                  name="age_years"
                  placeholder="15"
                />

                <SelectInput
                  label="Orientación"
                  name="orientation"
                  options={ORIENTATIONS}
                  placeholder="Seleccionar orientación"
                />

                <NumberInput
                  label="Cocheras"
                  name="garage_spaces"
                  placeholder="0"
                />

                <NumberInput
                  label="Bauleras"
                  name="storage_spaces"
                  placeholder="1"
                />
              </div>
            </div>

            {/* Características adicionales */}
            <FeatureSelector name="features" commonFeatures={COMMON_FEATURES} />
          </div>
        );

      case 4: // Imágenes
        return (
          <div className="space-y-4">
            {/* Imagen destacada */}
            <div>
              <h4 className={`text-sm font-medium mb-3 flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                <HiPhotograph className={`h-4 w-4 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`} />
                Imagen destacada
              </h4>
              <p className={`text-xs mb-3 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Esta imagen se mostrará como principal en el listado de propiedades</p>

              {!featuredPreview ? (
                <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-md cursor-pointer hover:border-red-500 transition-colors ${
                  isDark
                    ? 'border-slate-600 bg-slate-900 hover:bg-slate-800'
                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                }`}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <HiUpload className={`h-10 w-10 mb-3 ${
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                    <p className={`mb-2 text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <span className="font-medium">Click para subir</span> o arrastra y suelta
                    </p>
                    <p className={`text-xs ${
                      isDark ? 'text-gray-500' : 'text-gray-500'
                    }`}>PNG, JPG o WEBP (MAX. 5MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFeaturedImageChange(e, setFieldValue)}
                  />
                </label>
              ) : (
                <div className={`relative w-full h-48 border-2 rounded-md overflow-hidden ${
                  isDark ? 'border-slate-600' : 'border-gray-300'
                }`}>
                  <img
                    src={featuredPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeaturedImage(setFieldValue)}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition-colors"
                  >
                    <HiTrash className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Imágenes adicionales */}
            <div>
              <h4 className={`text-sm font-medium mb-3 flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                <HiPhotograph className={`h-4 w-4 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`} />
                Imágenes adicionales ({additionalPreviews.length}/10)
              </h4>
              <p className={`text-xs mb-3 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Puedes agregar hasta 10 imágenes adicionales</p>

              {additionalPreviews.length < 10 && (
                <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:border-red-500 transition-colors mb-3 ${
                  isDark
                    ? 'border-slate-600 bg-slate-900 hover:bg-slate-800'
                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                }`}>
                  <div className="flex flex-col items-center justify-center pt-3 pb-3">
                    <HiPlus className={`h-8 w-8 mb-2 ${
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                    <p className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <span className="font-medium">Agregar imágenes</span>
                    </p>
                    <p className={`text-xs ${
                      isDark ? 'text-gray-500' : 'text-gray-500'
                    }`}>Puedes seleccionar múltiples archivos</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleAdditionalImagesChange(e, setFieldValue)}
                  />
                </label>
              )}

              {additionalPreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {additionalPreviews.map((preview, index) => (
                    <div key={index} className={`relative aspect-square border-2 rounded-md overflow-hidden group ${
                      isDark ? 'border-slate-600' : 'border-gray-300'
                    }`}>
                      <img
                        src={preview}
                        alt={`Additional ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeAdditionalImage(index, setFieldValue)}
                        className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <HiTrash className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {additionalPreviews.length === 0 && (
                <div className={`text-center py-8 text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  No hay imágenes adicionales agregadas
                </div>
              )}
            </div>
          </div>
        );

      case 5: // Configuración
        return (
          <div className="space-y-4">
            {/* Configuración de publicación */}
            <div>
              <h4 className={`text-sm font-medium mb-3 flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                <HiCog className={`h-4 w-4 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`} />
                Configuración de publicación
              </h4>
              <div className={`space-y-3 border rounded-md p-3 ${
                isDark
                  ? 'bg-slate-900 border-slate-700'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <CheckboxInput
                  label="Propiedad destacada"
                  name="is_featured"
                />

                <CheckboxInput
                  label="Publicar propiedad"
                  name="is_published"
                />
              </div>
            </div>

            {/* SEO */}
            <div>
              <h4 className={`text-sm font-medium mb-3 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>SEO (Opcional)</h4>
              <div className="space-y-3">
                <TextInput
                  label="Título SEO"
                  name="meta_title"
                  placeholder="Ej: Departamento en Palermo - 2 ambientes con balcón"
                />

                <TextAreaInput
                  label="Descripción SEO"
                  name="meta_description"
                  placeholder="Descripción breve para motores de búsqueda..."
                  rows={3}
                  maxLength={160}
                  showCounter
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    // Prevenir submit cuando se presiona Enter en cualquier parte del formulario
    // excepto en textareas y cuando estamos en la última sección con el botón submit visible
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
      const isLastSection = currentSection === sections.length - 1;
      const isSubmitButton = (e.target as HTMLElement).getAttribute('type') === 'submit';

      if (!isLastSection || !isSubmitButton) {
        e.preventDefault();
      }
    }
  };

  return (
    <Formik
      initialValues={initialFormData}
      validationSchema={propertyValidationSchema}
      onSubmit={handleSubmit}
      validateOnChange={false}
      validateOnBlur={false}
      enableReinitialize
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <Form onKeyDown={handleFormKeyDown}>
          <div className={`max-w-6xl mx-auto rounded-lg border ${
            isDark
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-gray-200'
          }`}>
            {/* Header */}
            <div className={`px-6 py-4 border-b ${
              isDark ? 'border-slate-700' : 'border-gray-200'
            }`}>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className={`text-xl font-semibold flex items-center gap-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    <HiHome className={`h-5 w-5 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                    Editar Propiedad
                  </h2>
                  <p className={`text-sm mt-0.5 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>Actualiza la información de la propiedad</p>
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
                    Cancelar
                  </button>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className={`px-6 py-3 border-b ${
              isDark
                ? 'bg-slate-900 border-slate-700'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex justify-between items-center mb-2">
                {sections.map((section) => {
                  const IconComponent = section.icon;
                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => setCurrentSection(section.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        currentSection === section.id
                          ? 'bg-red-600 text-white'
                          : currentSection > section.id
                          ? isDark
                            ? 'bg-emerald-900 text-emerald-300 border border-emerald-700'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isDark
                          ? 'bg-slate-700 text-gray-300 hover:bg-slate-600 border border-slate-600'
                          : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <IconComponent className="h-3.5 w-3.5" />
                      <span className="hidden sm:block">{section.title}</span>
                    </button>
                  );
                })}
              </div>
              <div className={`w-full rounded-full h-1.5 ${
                isDark ? 'bg-slate-700' : 'bg-gray-200'
              }`}>
                <div
                  className="bg-red-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Form content */}
            <div className="px-6 py-5">
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

              {/* Current section */}
              {renderSection(values, setFieldValue)}

              {/* Navigation buttons */}
              <div className={`flex justify-between items-center mt-6 pt-5 border-t ${
                isDark ? 'border-slate-700' : 'border-gray-200'
              }`}>
                <button
                  type="button"
                  onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                  disabled={currentSection === 0}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    currentSection === 0
                      ? isDark
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : isDark
                      ? 'bg-slate-700 hover:bg-slate-600 text-gray-200'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <HiChevronLeft className="h-4 w-4" />
                  Anterior
                </button>

                <span className={`text-xs font-medium ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {currentSection + 1} de {sections.length}
                </span>

                {currentSection < sections.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-1.5"
                  >
                    Siguiente
                    <HiChevronRight className="h-4 w-4" />
                  </button>
                ) : (
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
                        Actualizando...
                      </>
                    ) : (
                      <>
                        <HiCheckCircle className="h-4 w-4" />
                        Actualizar Propiedad
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};
