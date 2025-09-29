import { User, Delivery } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@trucking.com',
    name: 'John Admin',
    role: 'admin',
  },
  {
    id: '2',
    email: 'driver@trucking.com',
    name: 'Mike Driver',
    role: 'driver',
  },
  {
    id: '3',
    email: 'dispatcher@trucking.com',
    name: 'Sarah Dispatcher',
    role: 'dispatcher',
  },
];

export const mockDeliveries: Delivery[] = [
  {
    id: '1',
    trackingNumber: 'TRK-001-2024',
    status: 'pending',
    origin: {
      street: '123 Warehouse St',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA',
    },
    destination: {
      street: '456 Customer Ave',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'USA',
    },
    assignedDriver: 'Mike Driver',
    estimatedDelivery: '2024-01-15T14:00:00Z',
    cargo: {
      description: 'Electronics shipment',
      weight: 150,
      dimensions: '48" x 40" x 36"',
    },
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
  },
  {
    id: '2',
    trackingNumber: 'TRK-002-2024',
    status: 'in_transit',
    origin: {
      street: '789 Distribution Center',
      city: 'Phoenix',
      state: 'AZ',
      zipCode: '85001',
      country: 'USA',
    },
    destination: {
      street: '321 Retail Store',
      city: 'Denver',
      state: 'CO',
      zipCode: '80202',
      country: 'USA',
    },
    assignedDriver: 'Mike Driver',
    estimatedDelivery: '2024-01-14T16:00:00Z',
    cargo: {
      description: 'Clothing inventory',
      weight: 200,
      dimensions: '60" x 48" x 42"',
    },
    createdAt: '2024-01-08T08:00:00Z',
    updatedAt: '2024-01-12T12:00:00Z',
  },
  {
    id: '3',
    trackingNumber: 'TRK-003-2024',
    status: 'delivered',
    origin: {
      street: '555 Factory Rd',
      city: 'Detroit',
      state: 'MI',
      zipCode: '48201',
      country: 'USA',
    },
    destination: {
      street: '777 Business Plaza',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
    },
    assignedDriver: 'Mike Driver',
    estimatedDelivery: '2024-01-10T12:00:00Z',
    actualDelivery: '2024-01-10T11:30:00Z',
    cargo: {
      description: 'Auto parts',
      weight: 300,
      dimensions: '72" x 48" x 48"',
    },
    createdAt: '2024-01-05T09:00:00Z',
    updatedAt: '2024-01-10T11:30:00Z',
  },
];