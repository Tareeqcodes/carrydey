'use client';
import { useState, useEffect, useRef } from 'react';
import { Menu, DollarSign, Calendar, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/Authcontext';
import { formatNairaSimple } from '@/hooks/currency';
import { useCourierDelivery } from '@/hooks/useCourierDelivery';
import { useDispatchOffer } from '@/hooks/useDispatchOffer';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { tablesDB } from '@/lib/config/Appwriteconfig';
import Profile from '../setting/Profile';
import PickupCodeModal from '../Agencytrack/PickupCodeModal';
import DropoffOTPModal from '../Agencytrack/DropoffOTPModal';
import Couriersidebar from './Couriersidebar';
import CourierActiveDelivery from './CourierActiveDelivery';
import CourierHistory from './CourierHistory';
import OfferBanner from '@/components/OfferBanner';

const DB = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const USERS = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID;

const TrackCourierDelivery = () => {
  const { user } = useAuth();
  const locationIntervalRef = useRef(null);

  const [activePage, setActivePage] = useState('earnings');
  const [accepting, setAccepting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const [selectedDeliveryForPickup, setSelectedDeliveryForPickup] =
    useState(null);
  const [selectedDeliveryForDropoff, setSelectedDeliveryForDropoff] =
    useState(null);

  const {
    courier,
    deliveries: allDeliveries,
    loading,
    confirmPickup,
    confirmDelivery,
    updateDeliveryStatus,
    refresh,
  } = useCourierDelivery(user?.$id);
  const { incomingOffer, offerCountdown, acceptOffer, declineOffer } =
    useDispatchOffer(courier?.$id, USERS, { onAccepted: () => refresh() });

  const handleAdvanceStop = async (deliveryId, nextStopIdx) => {
    const result = await updateDeliveryStatus(deliveryId, 'in_transit', {
      currentStopIdx: nextStopIdx,
    });
    if (result.success) refresh();
  };

  const handleAcceptOffer = async () => {
    setAccepting(true);
    await acceptOffer();
    setTimeout(() => {
      setAccepting(false);
      setActivePage('active');
    }, 2000);
  };

  usePushNotifications({
    enabled: !!user?.$id,
    onForegroundMessage: (payload) =>
      console.log('Foreground notification:', payload.notification.title),
  });

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
      tablesDB
        .updateRow({
          databaseId: DB,
          tableId: USERS,
          rowId: courier.$id,
          data: { isOnline: false, isAvailable: false },
        })
        .catch(() => {});
    };
  }, [courier?.$id]);

  const activeDeliveries = allDeliveries.filter((d) =>
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
  const handleConfirmPickup = async (deliveryId, pickupCode) => {
    const r = await confirmPickup(deliveryId, pickupCode);
    if (r.success) refresh();
    else alert(r.error || 'Invalid pickup code');
  };
  const handleConfirmDelivery = async (deliveryId, otp) => {
    const r = await confirmDelivery(deliveryId, otp);
    if (r.success) refresh();
    else alert(r.error || 'Invalid OTP code');
  };
  const handleUpdateStatus = async (deliveryId, status) => {
    const r = await updateDeliveryStatus(deliveryId, status);
    if (r.success) refresh();
    else alert(r.error || 'Failed to update status');
  };

  const renderPage = () => {
    switch (activePage) {
      case 'active':
        return (
          <CourierActiveDelivery
            deliveries={activeDeliveries}
            allDeliveries={allDeliveries}
            loading={loading}
            copiedCode={copiedCode}
            onCopyCode={copyToClipboard}
            onAdvanceStop={handleAdvanceStop}
            onConfirmPickup={(id) => setSelectedDeliveryForPickup(id)}
            onStartDelivery={(id) => handleUpdateStatus(id, 'in_transit')}
            onConfirmDelivery={(id) => setSelectedDeliveryForDropoff(id)}
          />
        );
      case 'history':
        return (
          <CourierHistory deliveries={completedDeliveries} loading={loading} />
        );

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
            <h2
              className="text-[20px] font-black text-black dark:text-white leading-[1.08] tracking-[-0.02em]"
              style={{ fontFamily: 'Fraunces, Georgia, serif' }}
            >
              Track your earnings and income
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/5 dark:bg-white/5 rounded-3xl p-6 border border-black/10 dark:border-white/10 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-emerald-500/20 rounded-2xl">
                    <DollarSign className="w-6 h-6 text-emerald-500" />
                  </div>
                  <p className="text-3xl font-bold text-black dark:text-white">
                    {formatNairaSimple(todayEarnings)}
                  </p>
                </div>
                <p className="text-sm font-semibold text-black dark:text-white">
                  Today's Earnings
                </p>
                <p className="text-xs text-black/50 dark:text-white/50 mt-1">
                  Current day income
                </p>
              </div>
              <div className="bg-black/5 dark:bg-white/5 rounded-3xl p-6 border border-black/10 dark:border-white/10 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-blue-500/20 rounded-2xl">
                    <Calendar className="w-6 h-6 text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold text-black dark:text-white">
                    {formatNairaSimple(totalEarnings)}
                  </p>
                </div>
                <p className="text-sm font-semibold text-black dark:text-white">
                  Total Earnings
                </p>
                <p className="text-xs text-black/50 dark:text-white/50 mt-1">
                  All-time income
                </p>
              </div>
              <div className="bg-black/5 dark:bg-white/5 rounded-3xl p-6 border border-black/10 dark:border-white/10 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-purple-500/20 rounded-2xl">
                    <CheckCircle className="w-6 h-6 text-purple-500" />
                  </div>
                  <p className="text-3xl font-bold text-black dark:text-white">
                    {
                      completedDeliveries.filter(
                        (d) => d.status === 'delivered'
                      ).length
                    }
                  </p>
                </div>
                <p className="text-sm font-semibold text-black dark:text-white">
                  Completed Jobs
                </p>
                <p className="text-xs text-black/50 dark:text-white/50 mt-1">
                  Total deliveries
                </p>
              </div>
            </div>
          </div>
        );
      }

      case 'profile':
        return (
          <div className="mb-6">
            <Profile />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-black/5 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              <Menu className="w-6 h-6 text-black dark:text-gray-300" />
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
