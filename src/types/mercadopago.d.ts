// Tipos para MercadoPago SDK v2
declare global {
  interface Window {
    MercadoPago: new (publicKey: string, options?: any) => MercadoPagoInstance;
  }
}

interface MercadoPagoInstance {
  cardForm(options: CardFormOptions): CardFormInstance;
  getIdentificationTypes(): Promise<IdentificationType[]>;
  getPaymentMethods(options: { bin: string }): Promise<PaymentMethod[]>;
  getIssuers(options: { paymentMethodId: string; bin: string }): Promise<Issuer[]>;
  getInstallments(options: {
    amount: string;
    bin: string;
    paymentTypeId?: string;
  }): Promise<InstallmentOption[]>;
}

interface CardFormOptions {
  amount: string;
  iframe?: boolean;
  form: {
    id: string;
    cardNumber: { id: string; placeholder: string };
    expirationDate: { id: string; placeholder: string };
    securityCode: { id: string; placeholder: string };
    cardholderName: { id: string; placeholder: string };
    issuer?: { id: string; placeholder: string };
    installments?: { id: string; placeholder: string };
    identificationType?: { id: string; placeholder: string };
    identificationNumber?: { id: string; placeholder: string };
    cardholderEmail: { id: string; placeholder: string };
  };
  callbacks: {
    onFormMounted?: (error: any) => void;
    onSubmit: (event: Event) => Promise<void> | void;
    onFetching?: (resource: string) => (() => void) | void;
    onCardTokenReceived?: (error: any, token: string) => void;
    onPaymentMethodsReceived?: (error: any, paymentMethods: any[]) => void;
    onIssuersReceived?: (error: any, issuers: any[]) => void;
    onInstallmentsReceived?: (error: any, installments: any[]) => void;
  };
}

interface CardFormInstance {
  getCardFormData(): Promise<CardFormData>;
  createCardToken(): Promise<{ token: string }>;
  unmount(): void;
  update(field: string, value: any): void;
}

interface CardFormData {
  token: string;
  paymentMethodId: string;
  issuerId: string;
  cardholderEmail: string;
  amount: string;
  installments: string;
  identificationNumber: string;
  identificationType: string;
}

interface IdentificationType {
  id: string;
  name: string;
  type: string;
  min_length: number;
  max_length: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  payment_type_id: string;
  thumbnail: string;
  secure_thumbnail: string;
  status: string;
}

interface Issuer {
  id: string;
  name: string;
  thumbnail: string;
  processing_mode: string;
}

interface InstallmentOption {
  payment_method_id: string;
  payment_type_id: string;
  issuer: {
    id: string;
    name: string;
  };
  payer_costs: PayerCost[];
}

interface PayerCost {
  installments: number;
  installment_rate: number;
  discount_rate: number;
  reimbursement_rate: number | null;
  labels: string[];
  installment_rate_collector: string[];
  min_allowed_amount: number;
  max_allowed_amount: number;
  recommended_message: string;
  installment_amount: number;
  total_amount: number;
  payment_method_option_id: string;
}

export {};
