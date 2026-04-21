'use client';
import { useState, useEffect, useRef } from 'react';
import { ChevronRight, DollarSign, Calendar, CheckCircle } from 'lucide-react';
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

  // ── Edge swipe ─────────────────────────────────────────────────────────────
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

  const {
    courier,
    deliveries: allDeliveries,
    loading,
    confirmPickup,
    confirmDelivery,
    updateDeliveryStatus,
    refresh,
  } = useCourierDelivery(user?.$id);

  // incomingOffer shape: { deliveryId, expiresAt, queueId, fare?, distance?, pickup? }
  // The fare/distance/pickup fields are populated by useDispatchOffer when it
  // reads them from the dispatch_queue doc's rankedCouriersJson and the delivery
  // data payload forwarded from the FCM push.
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
      console.log('Foreground notification:', payload.notification?.title),
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
              {[
                {
                  label: "Today's Earnings",
                  sub: 'Current day income',
                  value: formatNairaSimple(todayEarnings),
                  icon: DollarSign,
                  color: 'text-emerald-500',
                  bg: 'bg-emerald-500/20',
                },
                {
                  label: 'Total Earnings',
                  sub: 'All-time income',
                  value: formatNairaSimple(totalEarnings),
                  icon: Calendar,
                  color: 'text-blue-500',
                  bg: 'bg-blue-500/20',
                },
                {
                  label: 'Completed Jobs',
                  sub: 'Total deliveries',
                  value: completedDeliveries.filter(
                    (d) => d.status === 'delivered'
                  ).length,
                  icon: CheckCircle,
                  color: 'text-purple-500',
                  bg: 'bg-purple-500/20',
                },
              ].map(({ label, sub, value, icon: Icon, color, bg }) => (
                <div
                  key={label}
                  className="bg-black/5 dark:bg-white/5 rounded-3xl p-6 border border-black/10 dark:border-white/10 shadow-md"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-3 ${bg} rounded-2xl`}>
                      <Icon className={`w-6 h-6 ${color}`} />
                    </div>
                    <p className="text-3xl font-bold text-black dark:text-white">
                      {value}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-black dark:text-white">
                    {label}
                  </p>
                  <p className="text-xs text-black/50 dark:text-white/50 mt-1">
                    {sub}
                  </p>
                </div>
              ))}
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

      {/* ── OfferBanner ────────────────────────────────────────────────────────
          offer={incomingOffer} passes fare/distance/pickup into the banner
          so the courier sees the delivery details before accepting.
          Previously this prop was missing — the banner showed but had no
          delivery info (no fare amount, no distance pill, no pickup label).
      ──────────────────────────────────────────────────────────────────────── */}
      {(incomingOffer || accepting) && (
        <OfferBanner
          offerCountdown={offerCountdown}
          onAccept={handleAcceptOffer}
          onDecline={declineOffer}
          offer={incomingOffer}
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
