export interface User {
  id: string;
  email: string;
  name: string;
  role: 'driver' | 'dispatcher' | 'admin';
}

export interface Delivery {
  id: string;
  trackingNumber: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  origin: Address;
  destination: Address;
  assignedDriver?: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  cargo: {
    description: string;
    weight: number;
    dimensions: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}