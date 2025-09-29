'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useData } from '@/contexts/DataContext';
import AuthLayout from '@/components/AuthLayout';
import { Delivery } from '@/types';

export default function DeliveriesPage() {
  const { deliveries } = useData();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
    const matchesSearch = !searchQuery || 
      delivery.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.origin.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.destination.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.cargo.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusCounts = {
    all: deliveries.length,
    pending: deliveries.filter(d => d.status === 'pending').length,
    in_transit: deliveries.filter(d => d.status === 'in_transit').length,
    delivered: deliveries.filter(d => d.status === 'delivered').length,
    cancelled: deliveries.filter(d => d.status === 'cancelled').length,
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Deliveries</h1>
            <p className="text-gray-600">Manage and track all delivery requests</p>
          </div>
          <Link
            href="/create-delivery"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            ➕ Create Delivery
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Status Filter */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(statusCounts).map(([status, count]) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'All' : formatStatus(status)} ({count})
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search deliveries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full lg:w-80"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>
          </div>
        </div>

        {/* Deliveries Grid/List */}
        {filteredDeliveries.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No deliveries found</h3>
            <p className="text-gray-600 mb-6">
              {deliveries.length === 0
                ? "You haven't created any deliveries yet."
                : "No deliveries match your current filters."}
            </p>
            {deliveries.length === 0 && (
              <Link
                href="/create-delivery"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors inline-block"
              >
                Create Your First Delivery
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredDeliveries.map((delivery) => (
              <div key={delivery.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-lg font-semibold text-gray-900">
                        {delivery.trackingNumber}
                      </span>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(delivery.status)}`}>
                        {formatStatus(delivery.status)}
                      </span>
                    </div>
                    <Link
                      href={`/delivery-status?id=${delivery.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      View Details →
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
                    {/* Origin */}
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">📍</span>
                        <span className="font-medium text-gray-900">From</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>{delivery.origin.street}</p>
                        <p>{delivery.origin.city}, {delivery.origin.state} {delivery.origin.zipCode}</p>
                      </div>
                    </div>

                    {/* Destination */}
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">🎯</span>
                        <span className="font-medium text-gray-900">To</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>{delivery.destination.street}</p>
                        <p>{delivery.destination.city}, {delivery.destination.state} {delivery.destination.zipCode}</p>
                      </div>
                    </div>

                    {/* Cargo & Details */}
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">📦</span>
                        <span className="font-medium text-gray-900">Cargo</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>{delivery.cargo.description}</p>
                        <p>{delivery.cargo.weight} lbs • {delivery.cargo.dimensions}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      {delivery.assignedDriver && (
                        <div>
                          <span className="font-medium">Driver:</span> {delivery.assignedDriver}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Created:</span> {formatDate(delivery.createdAt)}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Est. Delivery:</span> {formatDate(delivery.estimatedDelivery)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Summary */}
        {filteredDeliveries.length > 0 && (
          <div className="text-center text-sm text-gray-600">
            Showing {filteredDeliveries.length} of {deliveries.length} deliveries
          </div>
        )}
      </div>
    </AuthLayout>
  );
}