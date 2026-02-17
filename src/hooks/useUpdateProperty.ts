// hooks/useUpdateProperty.ts
import { useState } from 'react';
import axiosInstance, { axiosInstanceMultipart } from '@/lib/api';
import axios from 'axios';
import {
  CreatePropertyForm,
  CreatePropertyPayload,
  CreatePropertyResponse,
  FormValidationErrors
} from '@/types/property';

interface UseUpdatePropertyReturn {
  loading: boolean;
  error: string | null;
  fieldErrors: FormValidationErrors;
  updateProperty: (propertyId: string, formData: CreatePropertyForm) => Promise<{ success: boolean; propertyId?: string }>;
  validateForm: (formData: CreatePropertyForm) => FormValidationErrors;
  clearErrors: () => void;
}

export const useUpdateProperty = (): UseUpdatePropertyReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormValidationErrors>({});

  const validateForm = (formData: CreatePropertyForm): FormValidationErrors => {
    const errors: FormValidationErrors = {};

    // Validaciones requeridas
    if (!formData.title.trim()) {
      errors.title = 'El título es requerido';
    }

    if (!formData.description.trim()) {
      errors.description = 'La descripción es requerida';
    }

    if (!formData.operation_type) {
      errors.operation_type = 'El tipo de operación es requerido';
    }

    if (!formData.property_type.trim()) {
      errors.property_type = 'El tipo de propiedad es requerido';
    }

    if (!formData.status) {
      errors.status = 'El estado es requerido';
    }

    // Validación de precios
    if (!formData.price_usd && !formData.price_ars) {
      errors.price_usd = 'Debe especificar al menos un precio (USD o ARS)';
      errors.price_ars = 'Debe especificar al menos un precio (USD o ARS)';
    }

    if (formData.price_usd && formData.price_usd <= 0) {
      errors.price_usd = 'El precio en USD debe ser mayor a 0';
    }

    if (formData.price_ars && formData.price_ars <= 0) {
      errors.price_ars = 'El precio en ARS debe ser mayor a 0';
    }

    // Validaciones de ubicación
    if (!formData.province.trim()) {
      errors.province = 'La provincia es requerida';
    }

    if (!formData.city.trim()) {
      errors.city = 'La ciudad es requerida';
    }

    if (!formData.neighborhood.trim()) {
      errors.neighborhood = 'El barrio es requerido';
    }

    if (!formData.address.trim()) {
      errors.address = 'La dirección es requerida';
    }

    // Validaciones de características físicas
    if (!formData.rooms || formData.rooms <= 0) {
      errors.rooms = 'El número de ambientes debe ser mayor a 0';
    }

    if (!formData.surface_total || formData.surface_total <= 0) {
      errors.surface_total = 'La superficie total debe ser mayor a 0';
    }

    // Validaciones numéricas
    if (formData.bedrooms && formData.bedrooms < 0) {
      errors.bedrooms = 'El número de dormitorios no puede ser negativo';
    }

    if (formData.bathrooms && formData.bathrooms < 0) {
      errors.bathrooms = 'El número de baños no puede ser negativo';
    }

    if (formData.garage_spaces && formData.garage_spaces < 0) {
      errors.garage_spaces = 'El número de cocheras no puede ser negativo';
    }

    // Validación de superficies
    if (formData.surface_covered && formData.surface_total) {
      if (formData.surface_covered > formData.surface_total) {
        errors.surface_covered = 'La superficie cubierta no puede ser mayor a la superficie total';
      }
    }

    return errors;
  };

  const updateProperty = async (propertyId: string, formData: CreatePropertyForm): Promise<{ success: boolean; propertyId?: string }> => {
    try {
      setLoading(true);
      setError(null);
      setFieldErrors({});

      // Validar formulario
      const validationErrors = validateForm(formData);
      if (Object.keys(validationErrors).length > 0) {
        setFieldErrors(validationErrors);
        return { success: false };
      }

      // Preparar payload
      const payload: CreatePropertyPayload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        internal_code: formData.internal_code.trim(),
        price_usd: Number(formData.price_usd) || 0,
        price_ars: Number(formData.price_ars) || 0,
        operation_type: formData.operation_type as 'venta' | 'alquiler',
        property_type: formData.property_type.trim(),
        status: formData.status as 'disponible' | 'vendido' | 'reservado' | 'no_disponible',
        province: formData.province.trim(),
        city: formData.city.trim(),
        neighborhood: formData.neighborhood.trim(),
        address: formData.address.trim(),
        bedrooms: Number(formData.bedrooms) || 0,
        bathrooms: Number(formData.bathrooms) || 0,
        half_bathrooms: Number(formData.half_bathrooms) || 0,
        rooms: Number(formData.rooms) || 0,
        surface_total: Number(formData.surface_total) || 0,
        garage_spaces: Number(formData.garage_spaces) || 0,
        storage_spaces: Number(formData.storage_spaces) || 0,
        is_featured: formData.is_featured,
        is_published: formData.is_published,
        features: formData.features.filter(f => f.trim() !== ''),
        featured_image: formData.featured_image || null,
        images: formData.images || [],
        zip_code: formData.zip_code || '',
      };

      // Agregar campos opcionales solo si tienen valor
      if (formData.floor) payload.floor = Number(formData.floor);
      if (formData.unit) payload.unit = formData.unit.trim();
      if (formData.surface_covered) payload.surface_covered = Number(formData.surface_covered);
      if (formData.surface_semicovered) payload.surface_semicovered = Number(formData.surface_semicovered);
      if (formData.surface_uncovered) payload.surface_uncovered = Number(formData.surface_uncovered);
      if (formData.age_years) payload.age_years = Number(formData.age_years);
      if (formData.orientation) payload.orientation = formData.orientation.trim();
      if (formData.meta_title) payload.meta_title = formData.meta_title.trim();
      if (formData.meta_description) payload.meta_description = formData.meta_description.trim();

      // Crear FormData para enviar archivos
      const formDataToSend = new FormData();

      // Agregar todos los campos del payload como strings o números
      // Agregar todos los campos del payload como strings o números
      Object.entries(payload).forEach(([key, value]) => {
        if (key === 'featured_image' || key === 'images') {
          // Estas las agregaremos después
          return;
        }

        // Skip null or undefined
        if (value === null || value === undefined) {
          return;
        }

        if (Array.isArray(value)) {
          // Para arrays como features, agregar cada item con el mismo nombre (formato Django)
          value.forEach((item) => {
            formDataToSend.append(key, String(item));
          });
        } else if (typeof value === 'boolean') {
          formDataToSend.append(key, value ? 'true' : 'false');
        } else {
          // Ensure value is string
          const stringValue = String(value);
          if (stringValue.trim() !== '') {
            formDataToSend.append(key, stringValue);
          }
        }
      });

      // Agregar featured_image si existe y es un archivo nuevo
      if (payload.featured_image && payload.featured_image instanceof File) {
        formDataToSend.append('featured_image', payload.featured_image);
      }

      // Agregar imágenes adicionales si existen y son archivos nuevos
      if (payload.images && Array.isArray(payload.images)) {
        payload.images.forEach((image) => {
          if (image instanceof File) {
            formDataToSend.append('additional_images', image);
          }
        });
      }

      // Usar PATCH o PUT para actualizar (dependiendo de tu API)
      const response = await axiosInstanceMultipart.patch<CreatePropertyResponse>(
        `/properties/properties/${propertyId}/`,
        formDataToSend
      );

      if (response.data.success) {
        return {
          success: true,
          propertyId: response.data.data?.id
        };
      } else {
        // Manejar errores de validación del backend
        if (response.data.errors) {
          const backendErrors: FormValidationErrors = {};
          Object.entries(response.data.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              backendErrors[field] = messages[0];
            }
          });
          setFieldErrors(backendErrors);
        } else {
          setError(response.data.message || 'Error al actualizar la propiedad');
        }
        return { success: false };
      }
    } catch (err) {
      console.error('Error updating property:', err);

      if (axios.isAxiosError(err)) {
        const data = err.response?.data;
        if (data?.errors) {
          const backendErrors: FormValidationErrors = {};
          Object.entries(data.errors).forEach(([field, messages]: [string, unknown]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              backendErrors[field] = messages[0];
            }
          });
          setFieldErrors(backendErrors);
        } else {
          setError(data?.message || err.message || 'Error de conexión al servidor');
        }
      } else {
        setError(err instanceof Error ? err.message : 'Error de conexión al servidor');
      }

      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const clearErrors = () => {
    setError(null);
    setFieldErrors({});
  };

  return {
    loading,
    error,
    fieldErrors,
    updateProperty,
    validateForm,
    clearErrors
  };
};
