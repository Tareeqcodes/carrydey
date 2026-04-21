'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
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

  // ── Edge swipe ────────────────────────────────────────────────────────────
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  useEffect(() => {
    const onTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };
    const onTouchEnd = (e) => {
      if (touchStartX.current === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
      if (dy < 60) {
        if (dx > 50 && touchStartX.current < 30) setSidebarOpen(true);
        if (dx < -50 && sidebarOpen) setSidebarOpen(false);
      }
      touchStartX.current = null;
      touchStartY.current = null;
    };
    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [sidebarOpen]);

  useEffect(() => {
    if (user) fetchUserDeliveries();
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
      if (selectedDelivery?.$id === deliveryId)
        setSelectedDelivery((prev) => ({ ...prev, ...response }));
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
  const completedDeliveries = deliveries.filter(
    (d) => d.status === 'delivered'
  );
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
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="flex max-w-7xl mx-auto">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <SenderSidebar
          activePage={activePage}
          setActivePage={setActivePage}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 pb-40 lg:pb-8">
          {renderPage()}
        </main>
      </div>

      {/* Edge pull tab — mobile only */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed left-0 top-1/2 -translate-y-1/2 z-30"
          aria-label="Open navigation"
        >
          <div className="bg-[#00C896] text-black rounded-r-xl pl-0.5 pr-1.5 py-6 shadow-lg flex flex-col items-center gap-1">
            <ChevronRight className="w-3.5 h-3.5" />
            <div className="flex flex-col gap-0.5">
              <div className="w-1 h-1 rounded-full bg-black/60" />
              <div className="w-1 h-1 rounded-full bg-black/60" />
              <div className="w-1 h-1 rounded-full bg-black/60" />
            </div>
          </div>
        </button>
      )}

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
