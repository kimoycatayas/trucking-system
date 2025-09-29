'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import AuthLayout from '@/components/AuthLayout';
import Link from 'next/link';
import { Delivery } from '@/types';

function DeliveryStatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getDelivery, updateDeliveryStatus, deliveries } = useData();
  const { user } = useAuth();
  const [trackingInput, setTrackingInput] = useState('');
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get delivery ID from URL params
  const deliveryId = searchParams.get('id');

  useEffect(() => {
    if (deliveryId) {
      const foundDelivery = getDelivery(deliveryId);
      setDelivery(foundDelivery || null);
    }
  }, [deliveryId, getDelivery]);

  const handleTrackingSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Find delivery by tracking number
    const foundDelivery = deliveries.find(
      d => d.trackingNumber.toLowerCase() === trackingInput.toLowerCase()
    );
    
    if (foundDelivery) {
      setDelivery(foundDelivery);
      // Update URL
      router.push(`/delivery-status?id=${foundDelivery.id}`);
    } else {
      setDelivery(null);
    }
    setIsLoading(false);
  };

  const handleStatusUpdate = (newStatus: Delivery['status']) => {
    if (!delivery) return;
    
    const actualDelivery = newStatus === 'delivered' ? new Date().toISOString() : undefined;
    updateDeliveryStatus(delivery.id, newStatus, actualDelivery);
    
    // Refresh delivery data
    const updatedDelivery = getDelivery(delivery.id);
    setDelivery(updatedDelivery || null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'in_transit': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusSteps = (currentStatus: string) => {
    const statuses = [
      { key: 'pending', label: 'Order Placed', icon: '📋' },
      { key: 'in_transit', label: 'In Transit', icon: '🚛' },
      { key: 'delivered', label: 'Delivered', icon: '✅' }
    ];

    const statusOrder = ['pending', 'in_transit', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    
    return statuses.map((status, index) => ({
      ...status,
      completed: currentStatus === 'cancelled' ? false : index <= currentIndex,
      active: status.key === currentStatus && currentStatus !== 'cancelled'
    }));
  };

  return (
    <AuthLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Delivery Status</h1>
          <p className="text-gray-600">Track your delivery or search by tracking number</p>
        </div>

        {/* Tracking Search */}
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleTrackingSearch} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Enter tracking number (e.g., TRK-001-2024)"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              {isLoading ? 'Searching...' : 'Track 🔍'}
            </button>
          </form>
        </div>

        {/* Delivery Details */}
        {delivery ? (
          <div className="space-y-6">
            {/* Status Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Tracking: {delivery.trackingNumber}
                  </h2>
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(delivery.status)}`}>
                    {formatStatus(delivery.status)}
                  </span>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <div>Created: {formatDate(delivery.createdAt)}</div>
                  <div>Updated: {formatDate(delivery.updatedAt)}</div>
                </div>
              </div>

              {/* Progress Steps */}
              {delivery.status !== 'cancelled' && (
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    {getStatusSteps(delivery.status).map((step, index, array) => (
                      <div key={step.key} className="flex-1 flex items-center">
                        <div className="flex flex-col items-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 ${
                            step.completed 
                              ? 'bg-green-500 border-green-500 text-white' 
                              : step.active
                              ? 'bg-blue-500 border-blue-500 text-white'
                              : 'bg-gray-200 border-gray-300 text-gray-500'
                          }`}>
                            {step.icon}
                          </div>
                          <span className={`mt-2 text-sm font-medium ${
                            step.completed || step.active ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {step.label}
                          </span>
                        </div>
                        {index < array.length - 1 && (
                          <div className={`flex-1 h-1 mx-4 ${
                            step.completed ? 'bg-green-500' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cancelled Status */}
              {delivery.status === 'cancelled' && (
                <div className="mb-8 p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">❌</span>
                    <div>
                      <h3 className="font-semibold text-red-800">Delivery Cancelled</h3>
                      <p className="text-red-600">This delivery has been cancelled and will not be completed.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Management (for authorized users) */}
              {(user?.role === 'admin' || user?.role === 'dispatcher') && delivery.status !== 'delivered' && delivery.status !== 'cancelled' && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-3">Update Status</h3>
                  <div className="flex gap-2">
                    {delivery.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate('in_transit')}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          Mark In Transit
                        </button>
                        <button
                          onClick={() => handleStatusUpdate('cancelled')}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          Cancel Delivery
                        </button>
                      </>
                    )}
                    {delivery.status === 'in_transit' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate('delivered')}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          Mark Delivered
                        </button>
                        <button
                          onClick={() => handleStatusUpdate('cancelled')}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          Cancel Delivery
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Route Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🗺️ Route Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="text-lg mr-3">📍</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Pickup Location</div>
                      <div className="text-sm text-gray-600">
                        <p>{delivery.origin.street}</p>
                        <p>{delivery.origin.city}, {delivery.origin.state} {delivery.origin.zipCode}</p>
                        <p>{delivery.origin.country}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center py-2">
                    <div className="w-full h-px bg-gray-300"></div>
                    <span className="px-3 text-gray-500">⬇</span>
                    <div className="w-full h-px bg-gray-300"></div>
                  </div>

                  <div className="flex items-start">
                    <span className="text-lg mr-3">🎯</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Delivery Location</div>
                      <div className="text-sm text-gray-600">
                        <p>{delivery.destination.street}</p>
                        <p>{delivery.destination.city}, {delivery.destination.state} {delivery.destination.zipCode}</p>
                        <p>{delivery.destination.country}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📦 Delivery Details</h3>
                
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Cargo Description:</span>
                    <p className="text-gray-600">{delivery.cargo.description}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Weight:</span>
                    <p className="text-gray-600">{delivery.cargo.weight} lbs</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Dimensions:</span>
                    <p className="text-gray-600">{delivery.cargo.dimensions}</p>
                  </div>
                  {delivery.assignedDriver && (
                    <div>
                      <span className="font-medium text-gray-700">Assigned Driver:</span>
                      <p className="text-gray-600">{delivery.assignedDriver}</p>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-700">Estimated Delivery:</span>
                    <p className="text-gray-600">{formatDate(delivery.estimatedDelivery)}</p>
                  </div>
                  {delivery.actualDelivery && (
                    <div>
                      <span className="font-medium text-gray-700">Actual Delivery:</span>
                      <p className="text-green-600 font-medium">{formatDate(delivery.actualDelivery)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : trackingInput && !isLoading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-6xl mb-4">❓</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Delivery Not Found</h3>
            <p className="text-gray-600 mb-4">
              No delivery found with tracking number: <span className="font-mono">{trackingInput}</span>
            </p>
            <p className="text-sm text-gray-500">
              Please check the tracking number and try again.
            </p>
          </div>
        ) : !delivery && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Your Delivery</h3>
            <p className="text-gray-600 mb-6">
              Enter a tracking number above to get real-time status updates on your delivery.
            </p>
            <Link
              href="/deliveries"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View all deliveries →
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}

export default function DeliveryStatusPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚛</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h1>
          <p className="text-gray-600">Please wait while we load the delivery status page.</p>
        </div>
      </div>
    }>
      <DeliveryStatusContent />
    </Suspense>
  );
}
