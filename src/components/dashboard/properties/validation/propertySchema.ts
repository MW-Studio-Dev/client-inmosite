import * as Yup from 'yup';

export const propertyValidationSchema = Yup.object({
  // Información básica
  title: Yup.string()
    .min(10, 'El título debe tener al menos 10 caracteres')
    .max(200, 'El título no puede exceder 200 caracteres')
    .required('El título es obligatorio'),

  description: Yup.string()
    .min(50, 'La descripción debe tener al menos 50 caracteres')
    .max(2000, 'La descripción no puede exceder 2000 caracteres')
    .required('La descripción es obligatoria'),

  internal_code: Yup.string()
    .max(50, 'El código interno no puede exceder 50 caracteres'),

  // Precios - Al menos uno debe estar presente
  price_usd: Yup.string()
    .test('at-least-one-price', 'Debe especificar al menos un precio (USD o ARS)', function(value) {
      const { price_ars } = this.parent;
      return !!(value || price_ars);
    })
    .test('valid-number', 'Debe ser un número válido', function(value) {
      if (!value) return true;
      return !isNaN(Number(value)) && Number(value) > 0;
    }),

  price_ars: Yup.string()
    .test('valid-number', 'Debe ser un número válido', function(value) {
      if (!value) return true;
      return !isNaN(Number(value)) && Number(value) > 0;
    }),

  expenses: Yup.string()
    .test('valid-number', 'Debe ser un número válido', function(value) {
      if (!value) return true;
      return !isNaN(Number(value)) && Number(value) >= 0;
    }),

  // Tipo y estado
  operation_type: Yup.string()
    .oneOf(['venta', 'alquiler'], 'Tipo de operación inválido')
    .required('El tipo de operación es obligatorio'),

  property_type: Yup.string()
    .oneOf(['departamento', 'casa', 'ph', 'oficina', 'local', 'lote', 'cochera', 'quinta', 'galpon', 'otro'], 'Tipo de propiedad inválido')
    .required('El tipo de propiedad es obligatorio'),

  status: Yup.string()
    .oneOf(['disponible', 'reservado', 'vendido', 'no_disponible'], 'Estado inválido')
    .required('El estado es obligatorio'),

  // Ubicación
  province: Yup.string()
    .min(2, 'La provincia debe tener al menos 2 caracteres')
    .max(100, 'La provincia no puede exceder 100 caracteres')
    .required('La provincia es obligatoria'),

  city: Yup.string()
    .min(2, 'La ciudad debe tener al menos 2 caracteres')
    .max(100, 'La ciudad no puede exceder 100 caracteres')
    .required('La ciudad es obligatoria'),

  neighborhood: Yup.string()
    .min(2, 'El barrio debe tener al menos 2 caracteres')
    .max(100, 'El barrio no puede exceder 100 caracteres')
    .required('El barrio es obligatorio'),

  address: Yup.string()
    .min(5, 'La dirección debe tener al menos 5 caracteres')
    .max(200, 'La dirección no puede exceder 200 caracteres')
    .required('La dirección es obligatoria'),

  floor: Yup.string()
    .max(10, 'El piso no puede exceder 10 caracteres'),

  unit: Yup.string()
    .max(10, 'La unidad no puede exceder 10 caracteres'),

  // Características físicas
  bedrooms: Yup.string()
    .test('valid-number', 'Debe ser un número válido', function(value) {
      if (!value) return true;
      return !isNaN(Number(value)) && Number(value) >= 0;
    }),

  bathrooms: Yup.string()
    .test('valid-number', 'Debe ser un número válido', function(value) {
      if (!value) return true;
      return !isNaN(Number(value)) && Number(value) >= 0;
    }),

  half_bathrooms: Yup.string()
    .test('valid-number', 'Debe ser un número válido', function(value) {
      if (!value) return true;
      return !isNaN(Number(value)) && Number(value) >= 0;
    }),

  rooms: Yup.string()
    .test('valid-number', 'Debe ser un número válido', function(value) {
      if (!value) return true;
      return !isNaN(Number(value)) && Number(value) >= 0;
    })
    .required('El número de ambientes es obligatorio'),

  surface_total: Yup.string()
    .test('valid-number', 'Debe ser un número válido', function(value) {
      if (!value) return true;
      return !isNaN(Number(value)) && Number(value) > 0;
    })
    .required('La superficie total es obligatoria'),

  surface_covered: Yup.string()
    .test('valid-number', 'Debe ser un número válido', function(value) {
      if (!value) return true;
      return !isNaN(Number(value)) && Number(value) >= 0;
    }),

  surface_semicovered: Yup.string()
    .test('valid-number', 'Debe ser un número válido', function(value) {
      if (!value) return true;
      return !isNaN(Number(value)) && Number(value) >= 0;
    }),

  surface_uncovered: Yup.string()
    .test('valid-number', 'Debe ser un número válido', function(value) {
      if (!value) return true;
      return !isNaN(Number(value)) && Number(value) >= 0;
    }),

  age_years: Yup.string()
    .test('valid-number', 'Debe ser un número válido', function(value) {
      if (!value) return true;
      return !isNaN(Number(value)) && Number(value) >= 0;
    }),

  orientation: Yup.string()
    .oneOf(['norte', 'sur', 'este', 'oeste', 'noreste', 'noroeste', 'sureste', 'suroeste', ''], 'Orientación inválida'),

  garage_spaces: Yup.string()
    .test('valid-number', 'Debe ser un número válido', function(value) {
      if (!value) return true;
      return !isNaN(Number(value)) && Number(value) >= 0;
    }),

  storage_spaces: Yup.string()
    .test('valid-number', 'Debe ser un número válido', function(value) {
      if (!value) return true;
      return !isNaN(Number(value)) && Number(value) >= 0;
    }),

  // Configuración
  is_featured: Yup.boolean(),
  is_published: Yup.boolean(),

  // SEO
  meta_title: Yup.string()
    .max(60, 'El título SEO no puede exceder 60 caracteres'),

  meta_description: Yup.string()
    .max(160, 'La descripción SEO no puede exceder 160 caracteres'),

  // Características adicionales
  features: Yup.array().of(Yup.string())
});
