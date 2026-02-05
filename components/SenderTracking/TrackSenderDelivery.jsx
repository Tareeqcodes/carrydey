'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, } from 'lucide-react';
import { useAuth } from '@/hooks/Authcontext';
import { tablesDB, Query } from '@/lib/config/Appwriteconfig';
import Sendertrackingview from './Sendertrackingview';
import SenderSidebar from './SenderSidebar';
import SenderActiveDelivery from './SenderActiveDelivery';
import SenderHistory from './SenderHistory';
import Profile from '../setting/Profile';

const TrackSenderDelivery = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [activePage, setActivePage] = useState('active');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);

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

  const handleUpdateDelivery = async (deliveryId, newStatus) => {
    try {
      const response = await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        rowId: deliveryId,
        data: { status: newStatus },
      });

      setDeliveries((prev) =>
        prev.map((d) => (d.$id === deliveryId ? { ...d, ...response } : d))
      );

      if (selectedDelivery?.$id === deliveryId) {
        setSelectedDelivery((prev) => ({ ...prev, ...response }));
      }

      return response;
    } catch (error) {
      console.error('Error updating delivery:', error);
      throw error;
    }
  };

  const handleTrackDelivery = (delivery) => {
    setSelectedDelivery(delivery);
    setShowTrackingModal(true);
  };

  const activeDeliveries = deliveries.filter(
    (d) => !['delivered', 'cancelled'].includes(d.status)
  );

  const completedDeliveries = deliveries.filter((d) => d.status === 'delivered');

  const filteredActiveDeliveries = activeDeliveries.filter(
    (d) =>
      searchQuery === '' ||
      d.pickupAddress?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.dropoffAddress?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPage = () => {
    switch (activePage) {
      case 'active':
        return (
          <SenderActiveDelivery
            deliveries={filteredActiveDeliveries}
            allDeliveries={deliveries}
            completedDeliveries={completedDeliveries}
            loading={loading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onRefresh={fetchUserDeliveries}
            onTrackDelivery={handleTrackDelivery}
            onNewDelivery={() => router.push('/send')}
          />
        );

      case 'history':
        return (
          <SenderHistory
            deliveries={completedDeliveries}
            loading={loading}
            onTrackDelivery={handleTrackDelivery}
          />
        );

      case 'profile':
        return <Profile />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
              
            </div>

          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <SenderSidebar
          activePage={activePage}
          setActivePage={setActivePage}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
          {renderPage()}
        </main>
      </div>

      {/* Tracking Modal */}
      {showTrackingModal && selectedDelivery && (
        <Sendertrackingview
          delivery={selectedDelivery}
          onClose={() => {
            setShowTrackingModal(false);
            setSelectedDelivery(null);
            fetchUserDeliveries();
          }}
          onUpdateDelivery={handleUpdateDelivery}
        />
      )}
    </div>
  );
};

export default TrackSenderDelivery;