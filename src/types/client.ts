export type ClientType = 'owner' | 'tenant' | 'both' | 'other';
export type ClientStatus = 'active' | 'inactive' | 'pending';

export interface ClientAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ClientContact {
  phone: string;
  email: string;
  alternativePhone?: string;
  preferredContact: 'phone' | 'email' | 'whatsapp';
}

export interface ClientProperties {
  owned: number; // Cantidad de propiedades que posee
  rented: number; // Cantidad de propiedades que alquila
  ownedIds?: string[]; // IDs de propiedades que posee
  rentedIds?: string[]; // IDs de propiedades que alquila
}

export interface Client {
  id: string;
  type: ClientType; // Propietario, Inquilino, Ambos u Otro
  status: ClientStatus;

  // Información personal
  fullName: string;
  dni: string;
  dateOfBirth?: string;
  nationality?: string;

  // Información de contacto
  contact: ClientContact;
  address: ClientAddress;

  // Información de propiedades
  properties: ClientProperties;

  // Información adicional
  notes?: string;
  tags?: string[];

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface ClientStats {
  totalClients: number;
  totalOwners: number;
  totalTenants: number;
  totalActive: number;
  totalInactive: number;
  newThisMonth: number;
}
