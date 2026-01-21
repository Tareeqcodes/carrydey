'use client';
import React, { useState, useEffect } from 'react';
import { 
  Package, 
  MapPin, 
  Phone, 
  CheckCircle,
  DollarSign,
  Calendar,
  Menu,
  User,
} from 'lucide-react';
import { useAuth } from '@/hooks/Authcontext';
import { tablesDB, Query } from '@/lib/config/Appwriteconfig';
import { formatNairaSimple } from '@/hooks/currency';

const TrackCourierDelivery = () => {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState('deliveries');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courierData, setCourierData] = useState(null);
  const [assignedDeliveries, setAssignedDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCourierData();
    }
  }, [user]);

  const fetchCourierData = async () => {
    try {
      // Fetch courier profile
      const courierResponse = await tablesDB.listRows({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DRIVERS_COLLECTION_ID,
        queries: [Query.equal('userId', user.$id)],
      });

      if (courierResponse.rows.length > 0) {
        const courier = courierResponse.rows[0];
        setCourierData(courier);

        // Fetch assigned deliveries
        const deliveriesResponse = await tablesDB.listRows({
          databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
          queries: [
            Query.equal('assignedDriverId', courier.$id),
            Query.notEqual('status', 'delivered'),
            Query.orderDesc('$createdAt'),
          ],
        });

        setAssignedDeliveries(deliveriesResponse.rows || []);
      }
    } catch (error) {
      console.error('Error fetching courier data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateDeliveryStatus = async (deliveryId, newStatus) => {
    try {
      await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        rowId: deliveryId,
        data: {
          status: newStatus,
          [`${newStatus}At`]: new Date().toISOString(),
        },
      });

      fetchCourierData();
      alert('Status updated successfully!');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const navItems = [
    { id: 'deliveries', label: 'My Deliveries', icon: Package },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const renderPage = () => {
    switch (activePage) {
      case 'deliveries':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">My Deliveries</h2>
              <p className="text-gray-500">Track and manage your assigned deliveries</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-[#3A0A21] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : assignedDeliveries.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Deliveries Yet</h3>
                <p className="text-gray-500">New deliveries will appear here when assigned</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assignedDeliveries.map((delivery) => (
                  <div key={delivery.$id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold">Delivery #{delivery.$id.slice(0, 8)}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        delivery.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' :
                        delivery.status === 'picked_up' ? 'bg-blue-100 text-blue-800' :
                        delivery.status === 'in_transit' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {delivery.status}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-green-600 mt-1" />
                        <div>
                          <p className="text-sm font-medium">Pickup</p>
                          <p className="text-sm text-gray-600">{delivery.pickupAddress}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-red-600 mt-1" />
                        <div>
                          <p className="text-sm font-medium">Dropoff</p>
                          <p className="text-sm text-gray-600">{delivery.dropoffAddress}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-50 p-3 rounded-xl">
                        <p className="text-xs text-gray-500">Distance</p>
                        <p className="font-semibold">{(delivery.distance / 1000).toFixed(1)} km</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl">
                        <p className="text-xs text-gray-500">Payout</p>
                        <p className="font-semibold text-green-600">₦{formatNairaSimple(delivery.offeredFare)}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {delivery.status === 'assigned' && (
                        <button
                          onClick={() => updateDeliveryStatus(delivery.$id, 'picked_up')}
                          className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700"
                        >
                          Mark as Picked Up
                        </button>
                      )}
                      {delivery.status === 'picked_up' && (
                        <button
                          onClick={() => updateDeliveryStatus(delivery.$id, 'in_transit')}
                          className="flex-1 py-2 bg-purple-600 text-white rounded-xl text-sm hover:bg-purple-700"
                        >
                          Start Delivery
                        </button>
                      )}
                      {delivery.status === 'in_transit' && (
                        <button
                          onClick={() => updateDeliveryStatus(delivery.$id, 'delivered')}
                          className="flex-1 py-2 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700"
                        >
                          Mark Delivered
                        </button>
                      )}
                      <button className="px-4 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50">
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
                    <p className="text-2xl font-bold">₦{courierData?.earningsToday || 0}</p>
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
                    <p className="text-2xl font-bold">₦{courierData?.earningsTotal || 0}</p>
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
                    <p className="text-2xl font-bold">{courierData?.deliveriesCompleted || 0}</p>
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
                  <p className="font-semibold">{courierData?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-semibold">{courierData?.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vehicle</p>
                  <p className="font-semibold">{courierData?.vehicle}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    courierData?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {courierData?.status}
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
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Courier Dashboard</h1>
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
          <div className="p-6 mt-16 md:mt-0">
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
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex flex-col items-center p-2 rounded-lg ${
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