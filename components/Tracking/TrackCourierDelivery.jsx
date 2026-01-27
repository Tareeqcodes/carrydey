'use client';
import React, { useState } from 'react';
import { 
  Package, 
  MapPin, 
  Phone, 
  CheckCircle,
  DollarSign,
  Calendar,
  Menu,
  User,
  Clock,
} from 'lucide-react';

import { tablesDB } from '@/lib/config/Appwriteconfig';
import { useAuth } from '@/hooks/Authcontext';
import { formatNairaSimple } from '@/hooks/currency';
import { useCourierDelivery } from '@/hooks/useCourierDelivery';

const TrackCourierDelivery = () => {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState('deliveries');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
    const {
      courier,
      deliveries: assignedDeliveries,
      loading,
      // error,
      refresh,
    } = useCourierDelivery(user?.$id);


const updateDeliveryStatus = async (deliveryId, status) => {
    try {
      const timestamps = {
        picked_up: 'pickedUpAt',
        in_transit: 'inTransitAt',
        delivered: 'deliveredAt',
      };

      await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        rowId: deliveryId,
        data: {
          status,
          ...(timestamps[status] && {
            [timestamps[status]]: new Date().toISOString(),
          }),
        },
      });

      refresh();
    } catch (err) {
      console.error(err);
      alert('Failed to update delivery status');
    }
  };

  const acceptDelivery = async (deliveryId) => {
    try {
      await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        rowId: deliveryId,
        data: {
          status: 'assigned',
          $createdAt: new Date().toISOString(),
        },
      });

      refresh();
    } catch (err) {
      console.error(err);
      alert('Failed to accept delivery');
    }
  };

  const navItems = [
    { id: 'deliveries', label: 'My Deliveries', icon: Package },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      assigned: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Assigned' },
      picked_up: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Picked Up' },
      in_transit: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'In Transit' },
      delivered: { bg: 'bg-green-100', text: 'text-green-800', label: 'Delivered' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const renderPage = () => {
    switch (activePage) {
      case 'deliveries':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Courier Dashboard</h2>
              <p className="text-gray-500 text-sm">Track and manage your assigned deliveries</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Active</p>
                <p className="text-2xl font-bold text-blue-600">
                  {assignedDeliveries.filter(d => ['assigned', 'picked_up', 'in_transit'].includes(d.status)).length}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {assignedDeliveries.filter(d => d.status === 'pending').length}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">In Transit</p>
                <p className="text-2xl font-bold text-purple-600">
                  {assignedDeliveries.filter(d => d.status === 'in_transit').length}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Total Today</p>
                <p className="text-2xl font-bold text-green-600">
                  {assignedDeliveries.length}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-[#3A0A21] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : assignedDeliveries.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Deliveries Yet 😁</h3>
                <p className="text-gray-500">New deliveries will appear here when customers book your service</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {assignedDeliveries.map((delivery) => (
                  <div key={delivery.$id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs text-gray-500">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {new Date(delivery.$createdAt).toLocaleString()}
                        </p>
                      </div>
                      {getStatusBadge(delivery.status)}
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-start gap-2">
                        <div className="p-1 bg-green-100 rounded-full mt-0.5">
                          <MapPin className="w-3 h-3 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-500">Pickup</p>
                          <p className="text-sm text-gray-900">{delivery.pickupAddress}</p>
                          {delivery.pickupContactName && (
                            <p className="text-xs text-gray-500 mt-1">
                              Contact: {delivery.pickupContactName} • {delivery.pickupPhone}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="border-l-2 border-dashed border-gray-200 h-4 ml-3"></div>
                      
                      <div className="flex items-start gap-2">
                        <div className="p-1 bg-red-100 rounded-full mt-0.5">
                          <MapPin className="w-3 h-3 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-500">Dropoff</p>
                          <p className="text-sm text-gray-900">{delivery.dropoffAddress}</p>
                          {delivery.dropoffContactName && (
                            <p className="text-xs text-gray-500 mt-1">
                              Contact: {delivery.dropoffContactName} • {delivery.dropoffPhone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-gray-50 p-3 rounded-xl text-center">
                        <p className="text-xs text-gray-500 mb-1">Distance</p>
                        <p className="font-semibold">{(delivery.distance / 1000).toFixed(1)} km</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl text-center">
                        <p className="text-xs text-gray-500 mb-1">Duration</p>
                        <p className="font-semibold">{Math.round(delivery.duration / 60)} min</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-xl text-center">
                        <p className="text-xs text-gray-500 mb-1">Payout</p>
                        <p className="font-semibold text-green-600">{formatNairaSimple(delivery.offeredFare)}</p>
                      </div>
                    </div>

                    {delivery.packageDescription && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-xl">
                        <p className="text-xs text-gray-500 mb-1">Package Details</p>
                        <p className="text-sm text-gray-700">{delivery.packageDescription}</p>
                        {delivery.isFragile && (
                          <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                            ⚠️ Fragile
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2">
                      {delivery.status === 'pending' && (
                        <button
                          onClick={() => acceptDelivery(delivery.$id)}
                          className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          Accept Delivery
                        </button>
                      )}
                      {delivery.status === 'assigned' && (
                        <button
                          onClick={() => updateDeliveryStatus(delivery.$id, 'picked_up')}
                          className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Mark as Picked Up
                        </button>
                      )}
                      {delivery.status === 'picked_up' && (
                        <button
                          onClick={() => updateDeliveryStatus(delivery.$id, 'in_transit')}
                          className="flex-1 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors"
                        >
                          Start Delivery
                        </button>
                      )}
                      {delivery.status === 'in_transit' && (
                        <button
                          onClick={() => updateDeliveryStatus(delivery.$id, 'delivered')}
                          className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4 inline mr-1" />
                          Mark Delivered
                        </button>
                      )}
                      <button className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'earnings':
        const totalEarnings = assignedDeliveries
          .filter(d => d.status === 'delivered')
          .reduce((sum, d) => sum + (d.offeredFare || 0), 0);

        const todayEarnings = assignedDeliveries
          .filter(d => {
            const deliveredToday = new Date(d.$createdAt).toDateString() === new Date().toDateString();
            return d.status === 'delivered' && deliveredToday;
          })
          .reduce((sum, d) => sum + (d.offeredFare || 0), 0);

        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">My Earnings</h2>
              <p className="text-gray-500">Track your delivery earnings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Today's Earnings</p>
                    <p className="text-2xl font-bold">{formatNairaSimple(todayEarnings)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Earnings</p>
                    <p className="text-2xl font-bold">₦{formatNairaSimple(totalEarnings)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Completed</p>
                    <p className="text-2xl font-bold">
                      {assignedDeliveries.filter(d => d.status === 'delivered').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">My Profile</h2>
              <p className="text-gray-500">Manage your courier profile</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-semibold">{courier?.userName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold">{courier?.email || user?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-semibold">{courier?.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-semibold capitalize">{courier?.role || 'Courier'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    courier?.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {courier?.verified ? 'Verified' : 'Pending Verification'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-14 bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Overlay */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden ${
            sidebarOpen ? 'block' : 'hidden'
          }`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <aside
          className={`fixed lg:static left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-30 transform transition-transform duration-200 lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-6 mt-16 lg:mt-5">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activePage === item.id
                      ? 'bg-[#3A0A21] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{renderPage()}</main>
      </div>

      {/* Mobile Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 z-10">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                activePage === item.id ? 'text-[#3A0A21]' : 'text-gray-500'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default TrackCourierDelivery;