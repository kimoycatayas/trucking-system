'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import AuthLayout from '@/components/AuthLayout';

export default function DashboardPage() {
  const { user } = useAuth();
  const { deliveries } = useData();

  const stats = {
    total: deliveries.length,
    pending: deliveries.filter(d => d.status === 'pending').length,
    inTransit: deliveries.filter(d => d.status === 'in_transit').length,
    delivered: deliveries.filter(d => d.status === 'delivered').length,
    cancelled: deliveries.filter(d => d.status === 'cancelled').length,
  };

  const recentDeliveries = deliveries
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

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

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600 capitalize">
                {user?.role} Dashboard
              </p>
            </div>
            <div className="text-4xl">
              {user?.role === 'driver' ? '🚚' : user?.role === 'dispatcher' ? '📋' : '👨‍💼'}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-500 rounded-md">
                <span className="text-white text-xl">📦</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Deliveries</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-500 rounded-md">
                <span className="text-white text-xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-600 rounded-md">
                <span className="text-white text-xl">🚛</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.inTransit}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-500 rounded-md">
                <span className="text-white text-xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.delivered}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-500 rounded-md">
                <span className="text-white text-xl">❌</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.cancelled}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Deliveries */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Recent Deliveries</h2>
              <Link 
                href="/deliveries"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View all →
              </Link>
            </div>
          </div>
          
          {recentDeliveries.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No deliveries found. 
              <Link href="/create-delivery" className="text-blue-600 hover:text-blue-700 ml-1">
                Create your first delivery
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recentDeliveries.map((delivery) => (
                <div key={delivery.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-sm font-medium text-gray-900">
                          {delivery.trackingNumber}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(delivery.status)}`}>
                          {formatStatus(delivery.status)}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <p>
                          From: {delivery.origin.city}, {delivery.origin.state}
                        </p>
                        <p>
                          To: {delivery.destination.city}, {delivery.destination.state}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/delivery-status?id=${delivery.id}`}
                      className="ml-4 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/create-delivery"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-6 text-center transition-colors"
          >
            <div className="text-3xl mb-2">➕</div>
            <h3 className="text-lg font-semibold">Create Delivery</h3>
            <p className="text-blue-100">Add a new delivery request</p>
          </Link>

          <Link
            href="/deliveries"
            className="bg-green-600 hover:bg-green-700 text-white rounded-lg p-6 text-center transition-colors"
          >
            <div className="text-3xl mb-2">📦</div>
            <h3 className="text-lg font-semibold">View Deliveries</h3>
            <p className="text-green-100">Browse all deliveries</p>
          </Link>

          <Link
            href="/delivery-status"
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg p-6 text-center transition-colors"
          >
            <div className="text-3xl mb-2">🔍</div>
            <h3 className="text-lg font-semibold">Track Delivery</h3>
            <p className="text-purple-100">Check delivery status</p>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}