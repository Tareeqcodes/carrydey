'use client';
import { useState } from 'react';
import { Menu, DollarSign, Calendar, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/Authcontext';
import { formatNairaSimple } from '@/hooks/currency';
import { useCourierDelivery } from '@/hooks/useCourierDelivery';
import Profile from '../setting/Profile';
import PickupCodeModal from '../Agencytrack/PickupCodeModal';
import DropoffOTPModal from '../Agencytrack/DropoffOTPModal';
import Couriersidebar from './Couriersidebar';
import Courierpendingdelivery from './Courierpendingdelivery';
import CourierActiveDelivery from './Courieractivedelivery';
import CourierHistory from './CourierHistory';

const TrackCourierDelivery = () => {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState('deliveries');
  const [isAccepting, setIsAccepting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const [selectedDeliveryForPickup, setSelectedDeliveryForPickup] = useState(null);
  const [selectedDeliveryForDropoff, setSelectedDeliveryForDropoff] = useState(null);

  const {
    deliveries: allDeliveries,
    loading,
    acceptRequest,
    confirmPickup,
    confirmDelivery,
    updateDeliveryStatus,
    refresh,
  } = useCourierDelivery(user?.$id);

  // Separate deliveries by status
  const pendingDeliveries = allDeliveries.filter((d) => d.status === 'pending');
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

  const handleAcceptDelivery = async (deliveryId) => {
    setIsAccepting(true);
    try {
      const result = await acceptRequest(deliveryId);

      if (result.success) {
        alert(
          `Delivery accepted!\nPickup Code: ${result.pickupCode}\nDropoff OTP: ${result.dropoffOTP}`
        );
        refresh();
      } else {
        alert(result.error || 'Failed to accept delivery');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to accept delivery');
    } finally {
      setIsAccepting(false);
    }
  };

  const handleConfirmPickup = async (deliveryId, pickupCode) => {
    const result = await confirmPickup(deliveryId, pickupCode);

    if (result.success) {
      alert('Pickup confirmed successfully!');
      refresh();
    } else {
      alert(result.error || 'Invalid pickup code');
    }
  };

  const handleConfirmDelivery = async (deliveryId, otp) => {
    const result = await confirmDelivery(deliveryId, otp);

    if (result.success) {
      alert('Delivery completed successfully!');
      refresh();
    } else {
      alert(result.error || 'Invalid OTP code');
    }
  };

  const handleUpdateStatus = async (deliveryId, status) => {
    const result = await updateDeliveryStatus(deliveryId, status);

    if (result.success) {
      refresh();
    } else {
      alert(result.error || 'Failed to update delivery status');
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case 'deliveries':
        return (
          <Courierpendingdelivery
            deliveries={pendingDeliveries}
            allDeliveries={allDeliveries}
            loading={loading}
            isAccepting={isAccepting}
            onAcceptDelivery={handleAcceptDelivery}
          />
        );

      case 'active':
        return (
          <CourierActiveDelivery
            deliveries={activeDeliveries}
            allDeliveries={allDeliveries}
            loading={loading}
            copiedCode={copiedCode}
            onCopyCode={copyToClipboard}
            onConfirmPickup={(deliveryId) => setSelectedDeliveryForPickup(deliveryId)}
            onStartDelivery={(deliveryId) => handleUpdateStatus(deliveryId, 'in_transit')}
            onConfirmDelivery={(deliveryId) => setSelectedDeliveryForDropoff(deliveryId)}
          />
        );

      case 'history':
        return (
          <CourierHistory
            deliveries={completedDeliveries}
            loading={loading}
          />
        );

      case 'earnings':
        const totalEarnings = completedDeliveries
          .filter((d) => d.status === 'delivered')
          .reduce((sum, d) => sum + (d.offeredFare || 0), 0);

        const todayEarnings = completedDeliveries
          .filter((d) => {
            const deliveredToday =
              new Date(d.deliveredAt || d.$createdAt).toDateString() ===
              new Date().toDateString();
            return d.status === 'delivered' && deliveredToday;
          })
          .reduce((sum, d) => sum + (d.offeredFare || 0), 0);

        return (
          <div className="space-y-8">
            <div>
              <p className="text-gray-900 text-lg md:text-xl font-semibold">
                Track your earnings and income
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-3xl p-6 border border-emerald-200/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-white rounded-2xl shadow-sm">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-emerald-900">
                      {formatNairaSimple(todayEarnings)}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-emerald-900">Today's Earnings</p>
                <p className="text-xs text-emerald-700 mt-1">Current day income</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-3xl p-6 border border-blue-200/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-white rounded-2xl shadow-sm">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-blue-900">
                      {formatNairaSimple(totalEarnings)}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-blue-900">Total Earnings</p>
                <p className="text-xs text-blue-700 mt-1">All-time income</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-3xl p-6 border border-purple-200/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-white rounded-2xl shadow-sm">
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-purple-900">
                      {completedDeliveries.filter((d) => d.status === 'delivered').length}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-purple-900">Completed Jobs</p>
                <p className="text-xs text-purple-700 mt-1">Total deliveries</p>
              </div>
            </div>
          </div>
        );

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
        <Couriersidebar
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

      {/* Pickup Code Confirmation Modal */}
      <PickupCodeModal
        isOpen={selectedDeliveryForPickup !== null}
        onClose={() => setSelectedDeliveryForPickup(null)}
        onConfirm={handleConfirmPickup}
        deliveryId={selectedDeliveryForPickup}
      />

      {/* Dropoff OTP Confirmation Modal */}
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