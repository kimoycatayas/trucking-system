'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Delivery, Address } from '@/types';
import { mockDeliveries } from '@/data/mockData';

interface DataContextType {
  deliveries: Delivery[];
  getDelivery: (id: string) => Delivery | undefined;
  createDelivery: (deliveryData: Omit<Delivery, 'id' | 'trackingNumber' | 'createdAt' | 'updatedAt'>) => string;
  updateDeliveryStatus: (id: string, status: Delivery['status'], actualDelivery?: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [deliveries, setDeliveries] = useState<Delivery[]>(mockDeliveries);

  useEffect(() => {
    // Load deliveries from localStorage on mount
    const storedDeliveries = localStorage.getItem('trucking_deliveries');
    if (storedDeliveries) {
      try {
        const deliveriesData = JSON.parse(storedDeliveries);
        setDeliveries(deliveriesData);
      } catch (error) {
        console.error('Failed to parse stored deliveries:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save deliveries to localStorage whenever they change
    localStorage.setItem('trucking_deliveries', JSON.stringify(deliveries));
  }, [deliveries]);

  const generateTrackingNumber = (): string => {
    const prefix = 'TRK';
    const timestamp = Date.now().toString().slice(-6);
    const year = new Date().getFullYear();
    return `${prefix}-${timestamp}-${year}`;
  };

  const getDelivery = (id: string): Delivery | undefined => {
    return deliveries.find(delivery => delivery.id === id);
  };

  const createDelivery = (deliveryData: Omit<Delivery, 'id' | 'trackingNumber' | 'createdAt' | 'updatedAt'>): string => {
    const newDelivery: Delivery = {
      ...deliveryData,
      id: Date.now().toString(),
      trackingNumber: generateTrackingNumber(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDeliveries(prev => [...prev, newDelivery]);
    return newDelivery.id;
  };

  const updateDeliveryStatus = (id: string, status: Delivery['status'], actualDelivery?: string) => {
    setDeliveries(prev => 
      prev.map(delivery => 
        delivery.id === id 
          ? { 
              ...delivery, 
              status, 
              actualDelivery: actualDelivery || delivery.actualDelivery,
              updatedAt: new Date().toISOString() 
            }
          : delivery
      )
    );
  };

  const value: DataContextType = {
    deliveries,
    getDelivery,
    createDelivery,
    updateDeliveryStatus,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};