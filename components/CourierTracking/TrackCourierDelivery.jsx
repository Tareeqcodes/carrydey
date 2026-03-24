'use client';
import { useState, useRef, useEffect } from 'react';
import { Menu, DollarSign, Calendar, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/Authcontext';
import { formatNairaSimple } from '@/hooks/currency';
import { useCourierDelivery } from '@/hooks/useCourierDelivery';
import { useDispatchOffer } from '@/hooks/useDispatchOffer';
import { tablesDB } from '@/lib/config/Appwriteconfig';
import Profile from '../setting/Profile';
import PickupCodeModal from '../Agencytrack/PickupCodeModal';
import DropoffOTPModal from '../Agencytrack/DropoffOTPModal';
import Couriersidebar from './Couriersidebar';
import Courierpendingdelivery from './Courierpendingdelivery';
import CourierActiveDelivery from './CourierActiveDelivery';
import CourierHistory from './CourierHistory';
import OfferBanner from '@/components/OfferBanner';

const DB    = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const USERS = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID;

const TrackCourierDelivery = () => { 
  const { user } = useAuth();
  const locationIntervalRef = useRef(null);

  const [activePage, setActivePage]     = useState('earnings');
  const [isAccepting, setIsAccepting]   = useState(false);
  const [accepting, setAccepting]       = useState(false);
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [copiedCode, setCopiedCode]     = useState(null);
  const [selectedDeliveryForPickup, setSelectedDeliveryForPickup]   = useState(null);
  const [selectedDeliveryForDropoff, setSelectedDeliveryForDropoff] = useState(null);

  const {
    courier,
    deliveries: allDeliveries,
    loading,
    acceptRequest,
    confirmPickup,
    confirmDelivery,
    updateDeliveryStatus,
    refresh,
  } = useCourierDelivery(user?.$id);

  const { incomingOffer, offerCountdown, acceptOffer, declineOffer } =
    useDispatchOffer(courier?.$id, USERS, {
      onAccepted: () => refresh(),
    });

  // ── Wrap acceptOffer to show confirmation state before closing ──
  const handleAcceptOffer = async () => {
    setAccepting(true);
    await acceptOffer();
    // Keep confirmation screen visible while refresh() loads the new delivery
    setTimeout(() => {
      setAccepting(false);
      setActivePage('active'); // auto-switch to active tab so courier sees it
    }, 2000);
  };

  //  Location ping 
  useEffect(() => {
    if (!courier?.$id) return;

    const pingLocation = () => {
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          await tablesDB.updateRow({
            databaseId: DB,
            tableId: USERS,
            rowId: courier.$id,
            data: {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              lastSeen: new Date().toISOString(),
              isAvailable: true,
            },
          });
        } catch (e) {
          console.error('Location ping failed:', e);
        }
      });
    };

    pingLocation();
    locationIntervalRef.current = setInterval(pingLocation, 15_000);

    return () => {
      clearInterval(locationIntervalRef.current);
      tablesDB.updateRow({
        databaseId: DB,
        tableId: USERS,
        rowId: courier.$id,
        data: { isOnline: false, isAvailable: false },
      }).catch(() => {});
    };
  }, [courier?.$id]);

  const pendingDeliveries   = allDeliveries.filter((d) => d.status === 'pending');
  const activeDeliveries    = allDeliveries.filter((d) =>
    ['accepted', 'assigned', 'picked_up', 'in_transit'].includes(d.status)
  );
  const completedDeliveries = allDeliveries.filter((d) =>
    ['delivered', 'cancelled'].includes(d.status)
  );

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleAcceptDelivery = async (deliveryId) => {
    setIsAccepting(true);
    try {
      const result = await acceptRequest(deliveryId);
      if (result.success) refresh();
      else alert(result.error || 'Failed to accept delivery');
    } catch (err) {
      console.error(err);
    } finally {
      setIsAccepting(false);
    }
  };

  const handleConfirmPickup = async (deliveryId, pickupCode) => {
    const result = await confirmPickup(deliveryId, pickupCode);
    if (result.success) refresh();
    else alert(result.error || 'Invalid pickup code');
  };

  const handleConfirmDelivery = async (deliveryId, otp) => {
    const result = await confirmDelivery(deliveryId, otp);
    if (result.success) refresh();
    else alert(result.error || 'Invalid OTP code');
  };

  const handleUpdateStatus = async (deliveryId, status) => {
    const result = await updateDeliveryStatus(deliveryId, status);
    if (result.success) refresh();
    else alert(result.error || 'Failed to update status');
  };

  const renderPage = () => {
    switch (activePage) {
      // case 'deliveries':
      //   return (
      //     <Courierpendingdelivery
      //       deliveries={pendingDeliveries}
      //       allDeliveries={allDeliveries}
      //       loading={loading}
      //       isAccepting={isAccepting}
      //       onAcceptDelivery={handleAcceptDelivery}
      //     />
      //   );
      case 'active':
        return (
          <CourierActiveDelivery
            deliveries={activeDeliveries}
            allDeliveries={allDeliveries}
            loading={loading}
            copiedCode={copiedCode}
            onCopyCode={copyToClipboard}
            onConfirmPickup={(id) => setSelectedDeliveryForPickup(id)}
            onStartDelivery={(id) => handleUpdateStatus(id, 'in_transit')}
            onConfirmDelivery={(id) => setSelectedDeliveryForDropoff(id)}
          />
        );
      case 'history':
        return <CourierHistory deliveries={completedDeliveries} loading={loading} />;

      case 'earnings': {
        const totalEarnings = completedDeliveries
          .filter((d) => d.status === 'delivered')
          .reduce((sum, d) => sum + (d.offeredFare || 0), 0);

        const todayEarnings = completedDeliveries
          .filter((d) => {
            const isToday =
              new Date(d.deliveredAt || d.$createdAt).toDateString() ===
              new Date().toDateString();
            return d.status === 'delivered' && isToday;
          })
          .reduce((sum, d) => sum + (d.offeredFare || 0), 0);

        return (
          <div className="space-y-8">
            <p className="text-gray-900 text-lg md:text-xl font-semibold">
              Track your earnings and income
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-3xl p-6 border border-emerald-200/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-white rounded-2xl shadow-sm">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                  </div>
                  <p className="text-3xl font-bold text-emerald-900">{formatNairaSimple(todayEarnings)}</p>
                </div>
                <p className="text-sm font-semibold text-emerald-900">Today's Earnings</p>
                <p className="text-xs text-emerald-700 mt-1">Current day income</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-3xl p-6 border border-blue-200/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-white rounded-2xl shadow-sm">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-3xl font-bold text-blue-900">{formatNairaSimple(totalEarnings)}</p>
                </div>
                <p className="text-sm font-semibold text-blue-900">Total Earnings</p>
                <p className="text-xs text-blue-700 mt-1">All-time income</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-3xl p-6 border border-purple-200/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-white rounded-2xl shadow-sm">
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-3xl font-bold text-purple-900">
                    {completedDeliveries.filter((d) => d.status === 'delivered').length}
                  </p>
                </div>
                <p className="text-sm font-semibold text-purple-900">Completed Jobs</p>
                <p className="text-xs text-purple-700 mt-1">Total deliveries</p>
              </div>
            </div>
          </div>
        );
      }

      case 'profile':
        return <div className="mb-6"><Profile /></div>;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <Couriersidebar
          activePage={activePage}
          setActivePage={setActivePage}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
          {renderPage()}
        </main>
      </div>

      {/* ── Shared offer banner — stays mounted during accepting state ── */}
      {(incomingOffer || accepting) && (
        <OfferBanner
          offerCountdown={offerCountdown}
          onAccept={handleAcceptOffer}
          onDecline={declineOffer}
          accepting={accepting}
        />
      )}

      <PickupCodeModal
        isOpen={selectedDeliveryForPickup !== null}
        onClose={() => setSelectedDeliveryForPickup(null)}
        onConfirm={handleConfirmPickup}
        deliveryId={selectedDeliveryForPickup}
      />
      <DropoffOTPModal
        isOpen={selectedDeliveryForDropoff !== null}
        onClose={() => setSelectedDeliveryForDropoff(null)}
        onConfirm={handleConfirmDelivery}
        deliveryId={selectedDeliveryForDropoff}
      />
    </div>
  );
};

export default TrackCourierDelivery;