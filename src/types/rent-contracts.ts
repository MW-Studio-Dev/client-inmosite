// ============================================
// Tipos para el Módulo de Contratos de Alquileres (Rent Module)
// ============================================

/**
 * Plantilla de Contrato
 */
export interface ContractTemplate {
  id: string; // UUID
  company: string; // UUID de la empresa
  name: string;
  description?: string;
  template_content: string; // Contenido con placeholders {{placeholder}}
  is_default: boolean;
  is_active: boolean;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
  placeholders_validation?: {
    valid: boolean;
    missing: string[];
    found: string[];
  };
  is_valid_template?: boolean;
}

/**
 * Versión listada de Contract Template (simplified)
 */
export interface ContractTemplateListSerializer {
  id: string;
  name: string;
  description?: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
}

/**
 * Cliente (simplified para referencias)
 */
export interface ClientListSerializer {
  id: string;
  full_name: string;
  email: string;
  phone: string;
}

/**
 * Estados del Contrato
 */
export type ContractStatus = 'DRAFT' | 'GENERATED' | 'SIGNED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

/**
 * Contrato de Alquiler
 */
export interface Contrato {
  id: string; // UUID
  rental: string; // UUID del alquiler (Alquiler)
  tenant: string; // UUID del inquilino (Client)
  tenant_detail?: ClientListSerializer;
  template?: string; // UUID de la plantilla
  template_detail?: ContractTemplateListSerializer;
  template_content: string; // Plantilla usada
  generated_content: string; // Contenido generado con datos reales
  generated_content_preview?: string; // Preview truncado
  
  // Datos del contrato
  duration_years: number; // Default: 2
  guarantees?: string;
  special_clauses?: string;
  
  // Datos auto-poblados (JSON)
  real_estate_data: {
    nombre: string;
    cuit: string;
    direccion: string;
    telefono: string;
    email: string;
    lugar_pago: string;
    jurisdiccion: string;
    provincia: string;
  };
  
  landlord_data: {
    nombre: string;
    dni: string;
    cuit: string;
    direccion: string;
    ciudad: string;
    provincia: string;
    telefono: string;
    email: string;
    descripcion_inmueble: string;
    direccion_inmueble: string;
  };
  
  tenant_data: {
    nombre: string;
    cuit: string;
    direccion: string;
    ciudad: string;
    provincia: string;
    telefono: string;
    email: string;
  };
  
  guarantor_data?: {
    garantes: Array<{
      nombre: string;
      dni: string;
      cuil: string;
      direccion: string;
      empleador: string;
      legajo: string;
    }>;
  };
  
  // Fechas y estado
  signing_date?: string; // ISO 8601
  status: ContractStatus;
  pdf_file?: string; // URL del PDF
  
  // Campos calculados
  is_signed: boolean;
  is_active: boolean;
  company_id: string;
  
  created_at: string;
  updated_at: string;
}

/**
 * Versión listada de Contrato (simplified)
 */
export interface ContratoListSerializer {
  id: string;
  rental: string;
  tenant: string;
  tenant_name: string;
  property_address: string;
  status: ContractStatus;
  status_display: string;
  signing_date?: string;
  duration_years: number;
  is_signed: boolean;
  is_active: boolean;
  created_at: string;
}

/**
 * Método de Pago
 */
export type PaymentMethod = 'EFECTIVO' | 'TRANSFERENCIA' | 'CHEQUE' | 'DEBITO' | 'MERCADOPAGO' | 'OTRO';

/**
 * Estado de Cuota
 */
export type InstallmentStatus = 'PENDIENTE' | 'PAGADA' | 'VENCIDA' | 'PARCIAL';

/**
 * Cuota (Installment)
 */
export interface Cuota {
  id: string; // UUID
  plan_pagos: string; // UUID del plan
  numero_cuota: number;
  fecha_vencimiento: string; // ISO 8601 Date
  monto: string; // Decimal
  
  // Estado y pago
  estado: InstallmentStatus;
  status_display: string;
  monto_pagado?: string; // Decimal
  fecha_pago?: string; // ISO 8601 Date
  metodo_pago?: PaymentMethod;
  payment_method_display?: string;
  comprobante?: string; // URL del archivo
  observaciones?: string;
  
  // Campos calculados
  is_overdue: boolean;
  days_to_due: number;
  balance_pending: string; // Decimal
  
  created_at: string;
  updated_at: string;
}

/**
 * Estado del Plan de Pagos
 */
export type PaymentPlanStatus = 'ACTIVO' | 'COMPLETADO' | 'SUSPENDIDO';

/**
 * Plan de Pagos (Payment Plan)
 */
export interface PlanDePagos {
  id: string; // UUID
  contrato: string; // UUID del contrato
  contract_detail?: ContratoListSerializer;
  inquilino: string; // UUID del inquilino
  tenant_name: string;
  rental_property: string; // UUID de la propiedad
  property_address: string;
  
  // Detalles del plan
  duracion_meses: number;
  monto_cuota: string; // Decimal
  fecha_inicio: string; // ISO 8601 Date
  
  // Ajuste
  ajuste?: string; // UUID de AjusteAlquiler
  aplicar_ajuste_automatico: boolean;
  
  // Estado
  estado_general: PaymentPlanStatus;
  
  // Campos calculados
  total_installments: number;
  paid_installments: number;
  pending_installments: number;
  overdue_installments: number;
  completion_percentage: number;
  total_paid_amount: string; // Decimal
  total_pending_amount: string; // Decimal
  
  // Cuotas relacionadas
  installments?: Cuota[];
  
  created_at: string;
  updated_at: string;
}

/**
 * API Response genérico
 */
export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Respuesta paginada
 */
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * Error API Response
 */
export interface APIErrorResponse {
  success: false;
  error_code: string;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Códigos de error comunes
 */
export enum ErrorCode {
  TEMPLATE_IN_USE = 'TEMPLATE_IN_USE',
  NO_DEFAULT_TEMPLATE = 'NO_DEFAULT_TEMPLATE',
  INVALID_STATUS = 'INVALID_STATUS',
  CONTRACT_LOCKED = 'CONTRACT_LOCKED',
  NOT_GENERATED = 'NOT_GENERATED',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

/**
 * Placeholders disponibles
 */
export interface PlaceholdersData {
  client: string[];
  property: string[];
  contract: string[];
  company: string[];
  landlord: string[];
  tenant: string[];
  guarantor: string[];
}

/**
 * Datos para crear un Contract Template
 */
export interface CreateContractTemplateData {
  name: string;
  description?: string;
  template_content: string;
  is_default?: boolean;
  is_active?: boolean;
}

/**
 * Datos para crear un Contrato
 */
export interface CreateContractData {
  rental: string;
  template?: string;
  tenant?: string;
  duration_years?: number;
  guarantees?: string;
  special_clauses?: string;
}

/**
 * Response de generación de contrato
 */
export interface GenerateContractResponse {
  contract_id: string;
  generated: boolean;
  message: string;
  content: string;
}

/**
 * Response de preview de contrato
 */
export interface ContractPreviewResponse {
  contract_id: string;
  content: string;
  status: string;
}

/**
 * Datos para registrar pago de cuota
 */
export interface PayInstallmentData {
  monto_pagado: string;
  fecha_pago?: string;
  metodo_pago?: PaymentMethod;
  comprobante?: File;
  observaciones?: string;
}
