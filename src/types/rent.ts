export type PaymentStatus = 'paid' | 'pending' | 'late' | 'partial';
export type RentStatus = 'active' | 'expired' | 'cancelled' | 'pending';
export type AdjustmentIndex = 'IPC' | 'ICL' | 'fixed' | 'percentage' | 'none';

export interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface NextAdjustment {
  month: string; // "Enero 2026"
  indexType: AdjustmentIndex; // IPC, ICL, etc.
  percentage?: number; // Porcentaje estimado o fijo
  date: string; // Fecha del próximo ajuste
}

export interface Contract {
  id: string;
  startDate: string;
  endDate: string;
  monthlyAmount: number;
  currency: 'USD' | 'ARS';
  deposit: number;
  dueDay: number; // Día de vencimiento (1-31)
  monthlyAdjustment?: number; // Porcentaje de ajuste mensual
  adjustmentType?: 'percentage' | 'fixed'; // Tipo de ajuste
  adjustmentIndex?: AdjustmentIndex; // Índice de ajuste
  nextAdjustment?: NextAdjustment; // Próximo aumento programado
}

export interface PaymentInfo {
  status: PaymentStatus;
  currentMonth: string; // "Enero 2025"
  paidMonths: number;
  totalMonths: number;
  nextPaymentDate: string;
  amountDue: number;
}

export interface Rent {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  propertyImage?: string; // URL de la imagen de la propiedad
  owner: Owner;
  tenant: Tenant;
  contract: Contract;
  payment: PaymentInfo;
  status: RentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RentStats {
  totalActive: number;
  totalExpired: number;
  totalPending: number;
  monthlyRevenue: number;
  paidThisMonth: number;
  pendingThisMonth: number;
  latePayments: number;
}
