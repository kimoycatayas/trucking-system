'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import AuthLayout from '@/components/AuthLayout';
import { Address } from '@/types';

export default function CreateDeliveryPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { createDelivery } = useData();
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    // Origin
    originStreet: '',
    originCity: '',
    originState: '',
    originZipCode: '',
    originCountry: 'USA',
    
    // Destination
    destinationStreet: '',
    destinationCity: '',
    destinationState: '',
    destinationZipCode: '',
    destinationCountry: 'USA',
    
    // Cargo
    cargoDescription: '',
    cargoWeight: '',
    cargoDimensions: '',
    
    // Delivery details
    estimatedDelivery: '',
    assignedDriver: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const origin: Address = {
        street: formData.originStreet,
        city: formData.originCity,
        state: formData.originState,
        zipCode: formData.originZipCode,
        country: formData.originCountry,
      };

      const destination: Address = {
        street: formData.destinationStreet,
        city: formData.destinationCity,
        state: formData.destinationState,
        zipCode: formData.destinationZipCode,
        country: formData.destinationCountry,
      };

      const deliveryData = {
        status: 'pending' as const,
        origin,
        destination,
        assignedDriver: formData.assignedDriver || undefined,
        estimatedDelivery: new Date(formData.estimatedDelivery).toISOString(),
        cargo: {
          description: formData.cargoDescription,
          weight: parseFloat(formData.cargoWeight),
          dimensions: formData.cargoDimensions,
        },
      };

      const deliveryId = createDelivery(deliveryData);
      router.push(`/delivery-status?id=${deliveryId}`);
    } catch (err) {
      setError('Failed to create delivery. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Create New Delivery</h1>
            <p className="text-gray-600">Fill out the details for the new delivery request</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {/* Origin Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">📍 Pickup Location (Origin)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="originStreet"
                    required
                    value={formData.originStreet}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="123 Main Street"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="originCity"
                    required
                    value={formData.originCity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="Los Angeles"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="originState"
                    required
                    value={formData.originState}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="CA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="originZipCode"
                    required
                    value={formData.originZipCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="90210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="originCountry"
                    value={formData.originCountry}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="USA"
                  />
                </div>
              </div>
            </div>

            {/* Destination Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">🎯 Delivery Location (Destination)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="destinationStreet"
                    required
                    value={formData.destinationStreet}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="456 Oak Avenue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="destinationCity"
                    required
                    value={formData.destinationCity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="San Francisco"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="destinationState"
                    required
                    value={formData.destinationState}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="CA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="destinationZipCode"
                    required
                    value={formData.destinationZipCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="94102"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="destinationCountry"
                    value={formData.destinationCountry}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="USA"
                  />
                </div>
              </div>
            </div>

            {/* Cargo Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">📦 Cargo Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="cargoDescription"
                    required
                    rows={3}
                    value={formData.cargoDescription}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Electronics, furniture, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (lbs) *
                  </label>
                  <input
                    type="number"
                    name="cargoWeight"
                    required
                    min="0"
                    step="0.1"
                    value={formData.cargoWeight}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="150"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dimensions *
                  </label>
                  <input
                    type="text"
                    name="cargoDimensions"
                    required
                    value={formData.cargoDimensions}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="48&quot; x 40&quot; x 36&quot;"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Details Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">🚛 Delivery Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Delivery Date *
                  </label>
                  <input
                    type="datetime-local"
                    name="estimatedDelivery"
                    required
                    value={formData.estimatedDelivery}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned Driver (Optional)
                  </label>
                  <input
                    type="text"
                    name="assignedDriver"
                    value={formData.assignedDriver}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Driver name"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-md transition-colors"
              >
                {isLoading ? 'Creating Delivery...' : 'Create Delivery'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}