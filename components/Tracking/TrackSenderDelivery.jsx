'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package,
  MapPin,
  Clock,
  Phone,
  Plus,
  Search,
  Filter,
  Truck,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Menu,
  User,
  History,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '@/hooks/Authcontext';
import { tablesDB, Query } from '@/lib/config/Appwriteconfig';
import { formatNairaSimple } from '@/hooks/currency';

const TrackSenderDelivery = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [activePage, setActivePage] = useState('active');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserDeliveries();
    }
  }, [user]);

  const fetchUserDeliveries = async () => {
    try {
      setLoading(true);
      const response = await tablesDB.listRows({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        queries: [
          Query.equal('userId', user.$id),
          Query.orderDesc('$createdAt'),
          Query.limit(50),
        ],
      });

      setDeliveries(response.rows || []);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeDeliveries = deliveries.filter(
    (d) => !['delivered', 'cancelled'].includes(d.status)
  );

  const completedDeliveries = deliveries.filter(
    (d) => d.status === 'delivered'
  );

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      picked_up: 'bg-purple-100 text-purple-800',
      in_transit: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'assigned':
      case 'picked_up':
      case 'in_transit':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const navItems = [
    { id: 'active', label: 'Active Deliveries', icon: Truck },
    
    { id: 'history', label: 'Delivery History', icon: History },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const renderDeliveryCard = (delivery) => (
    <div
      key={delivery.$id}
      className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-sm transition"
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            delivery.status
          )}`}
        >
          {getStatusIcon(delivery.status)}
          {delivery.status.replace('_', ' ')}
        </span>

        <p className="text-xs text-gray-400">
          {new Date(delivery.$createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Middle content */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500">Delivery fee</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatNairaSimple(delivery.offeredFare || delivery.suggestedFare)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-500">Package</p>
          <p className="text-sm font-medium">
            {delivery.packageSize || 'Standard'}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between mb-4">
        {/* {delivery.pickupCode && (
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900 font-medium">Pickup Code</p>
            <p className="text-lg font-mono font-bold text-blue-900">
              {delivery.pickupCode}
            </p>
          </div>
        )} */}

        {delivery.isFragile && (
          <span className="inline-block mb-3 px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full">
            Fragile
          </span>
        )}
      </div>

      {/* Primary action */}
      <button
        onClick={() => router.push(`/delivery/${delivery.$id}`)}
        className="w-full py-2.5 bg-[#3A0A21] text-white rounded-xl text-sm font-medium hover:bg-[#4A0A31] transition"
      >
        Track delivery
      </button>
    </div>
  );

  const renderPage = () => {
    switch (activePage) {
      case 'active':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm md:text-xl font-bold">
                  {' '}
                  Track your ongoing deliveries
                </h2>
              </div>
              <button
                onClick={() => router.push('/send')}
                className="px-2 md:px-4 text-xs py-2 bg-[#3A0A21] text-white rounded-xl hover:bg-[#4A0A31] transition-colors flex items-center gap-2"
              >
                <p className="flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  <span className="text-xs">New Delivery</span>
                </p>
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Truck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Active</p>
                    <p className="text-2xl font-bold">
                      {activeDeliveries.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Completed</p>
                    <p className="text-2xl font-bold">
                      {completedDeliveries.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Spent</p>
                    <p className="text-2xl font-bold">
                      ₦
                      {deliveries
                        .reduce(
                          (sum, d) =>
                            sum + (d.offeredFare || d.suggestedFare || 0),
                          0
                        )
                        .toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search deliveries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3A0A21] focus:border-transparent"
                />
              </div>
              <button
                onClick={fetchUserDeliveries}
                className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                <RefreshCw
                  className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
                />
              </button>
            </div>

            {/* Deliveries List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-[#3A0A21] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : activeDeliveries.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Active Deliveries
                </h3>
                <p className="text-gray-500 mb-6">
                  Start by creating your first delivery
                </p>
                <button
                  onClick={() => router.push('/send')}
                  className="px-6 py-3 bg-[#3A0A21] text-white rounded-xl hover:bg-[#4A0A31] transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Delivery
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeDeliveries
                  .filter(
                    (d) =>
                      searchQuery === '' ||
                      d.pickupAddress
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      d.dropoffAddress
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                  )
                  .map(renderDeliveryCard)}
              </div>
            )}
          </div>
        );

      case 'history':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Delivery History</h2>
              <p className="text-gray-500">View all your past deliveries</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-[#3A0A21] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : completedDeliveries.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center">
                <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Delivery History
                </h3>
                <p className="text-gray-500">
                  Completed deliveries will appear here
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedDeliveries.map(renderDeliveryCard)}
              </div>
            )}
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">My Profile</h2>
              <p className="text-gray-500">Manage your account information</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-semibold">{user?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold">{user?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Deliveries</p>
                  <p className="font-semibold">{deliveries.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-semibold">
                    {new Date(user?.$createdAt).toLocaleDateString()}
                  </p>
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
    <div className="min-h-screen pb-32 md:pb-14 bg-gray-50">
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

export default TrackSenderDelivery;
