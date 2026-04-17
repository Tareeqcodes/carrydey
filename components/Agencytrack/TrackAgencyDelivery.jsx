'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '@/hooks/Authcontext';
import { useAgencyDeliveries } from '@/hooks/useAgencyDeliveries';
import {
  useDriverManagement,
  triggerDriverSMS,
} from '@/hooks/useDriverManagement';
import { useDeliveryManagement } from '@/hooks/useDeliveryManagement';
import { useDispatchOffer } from '@/hooks/useDispatchOffer';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { tablesDB } from '@/lib/config/Appwriteconfig';
import Sidebar from './Sidebar';
import AssignmentModal from './AssignmentModal';
import DashboardPage from './DashboardPage';
import RequestsPage from './RequestsPage';
import ActiveDeliveriesPage from './ActiveDeliveriesPage';
import DriversPage from './DriversPage';
import TrackingPage from './TrackingPage';
import AddDriverModal from '../AddDriverModal';
import AgencySettingsPage from './AgencySettingsPage';
import DeliveryHistory from './DeliveryHistory';
import OfferBanner from '@/components/OfferBanner';

const DB = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const ORGS = process.env.NEXT_PUBLIC_APPWRITE_ORGANISATION_COLLECTION_ID;

function pickBestDriver(drivers) {
  const available = drivers.filter((d) => d.status === 'available');
  if (!available.length) return null;
  return available
    .map((d) => ({
      driver: d,
      score: Math.max(
        0,
        100 - (d.assignedDelivery || '').split(',').filter(Boolean).length * 25
      ),
    }))
    .sort((a, b) => b.score - a.score)[0].driver;
}

const TrackAgencyDelivery = () => {
  const { user } = useAuth();
  const locationIntervalRef = useRef(null);
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accepting, setAccepting] = useState(false);
const [assigning, setAssigning] = useState(false);

  const [assignmentModal, setAssignmentModal] = useState({
    isOpen: false,
    deliveryId: null,
    selectedDriver: null,
    deliveryDetails: null,
  });

  const closeAssignmentModal = () =>
    setAssignmentModal({
      isOpen: false,
      deliveryId: null,
      selectedDriver: null,
      deliveryDetails: null,
    });

  const openAssignmentModal = (delivery, preSelectedDriverId = null) =>
    setAssignmentModal({
      isOpen: true,
      deliveryId: delivery.$id,
      selectedDriver: preSelectedDriverId,
      deliveryDetails: delivery,
    });

  const { agencyId } = useAgencyDeliveries(user?.$id);

  const {
    drivers,
    formattedDrivers,
    loading: driversLoading,
    error: driversError,
    deleteDriver,
    toggleDriverStatus,
    assignDriverToDelivery,
    freeDriverFromDelivery,
    fetchDrivers,
    modalOpen: driverModalOpen,
    driverToEdit,
    openAddModal: openAddDriverModal,
    openEditModal: openEditDriverModal,
    closeModal: closeDriverModal,
    handleModalSubmit: handleDriverModalSubmit,
  } = useDriverManagement(agencyId);

  const {
    deliveryRequests,
    activeDeliveries,
    completedDeliveries,
    loading: deliveriesLoading,
    acceptRequest,
    assignDelivery,
    refreshDeliveries,
  } = useDeliveryManagement(agencyId, freeDriverFromDelivery);

  const completeAssignment = useCallback(
    async (deliveryId, driver) => {
      await assignDelivery(deliveryId, driver.$id, driver.name, driver.phone);
      await assignDriverToDelivery(driver.$id, deliveryId);
      if (driver.phoneType === 'keypad') {
        triggerDriverSMS(deliveryId, driver.$id);
      }
    },
    [assignDelivery, assignDriverToDelivery]
  );

  const handleDispatchAccepted = useCallback(
    async (deliveryId) => {
      await refreshDeliveries();
      const bestDriver = pickBestDriver(drivers);

      if (!bestDriver) {
        try {
          const delivery = await tablesDB.getRow({
            databaseId: DB,
            tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
            rowId: deliveryId,
          });
          setAssignmentModal({
            isOpen: true,
            deliveryId,
            selectedDriver: null,
            deliveryDetails: delivery,
          });
        } catch (e) {
          console.error('Could not load delivery for manual assignment:', e);
        }
        return;
      }

      try {
        await completeAssignment(deliveryId, bestDriver);
      } catch (e) {
        console.error('Auto-assign failed, falling back to modal:', e);
        try {
          const delivery = await tablesDB.getRow({
            databaseId: DB,
            tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
            rowId: deliveryId,
          });
          setAssignmentModal({
            isOpen: true,
            deliveryId,
            selectedDriver: null,
            deliveryDetails: delivery,
          });
        } catch (_) {}
      }
    },
    [drivers, completeAssignment, refreshDeliveries]
  );

  const { incomingOffer, offerCountdown, acceptOffer, declineOffer } =
    useDispatchOffer(agencyId, ORGS, { onAccepted: handleDispatchAccepted });

  const handleAcceptOffer = useCallback(async () => {
    setAccepting(true);
    await acceptOffer();
    setTimeout(() => {
      setAccepting(false);
      setActivePage('active'); 
    }, 2000);
  }, [acceptOffer]);

  usePushNotifications({
    enabled: !!user?.$id,
  onForegroundMessage: (payload) => {
    console.log('Foreground notification:', payload.notification.title);
  },
});

  const handleAcceptRequest = async (requestId) => {
    const result = await acceptRequest(requestId);
    if (result?.success) {
      setAssignmentModal({
        isOpen: true,
        deliveryId: result.data.$id,
        selectedDriver: null,
        deliveryDetails: result.data,
      });
    }
    return result;
  };

  const handleCompleteAssignment = async () => {
  if (!assignmentModal.selectedDriver || !assignmentModal.deliveryId) return;
  const driver = drivers.find(
    (d) => d.$id === assignmentModal.selectedDriver || d.id === assignmentModal.selectedDriver
  );
  if (!driver) return;
  setAssigning(true);
  try {
    await completeAssignment(assignmentModal.deliveryId, driver);
    closeAssignmentModal();
  } finally {
    setAssigning(false);
  }
};

  //  Location ping 
  useEffect(() => {
    if (!agencyId) return;

    const ping = () => {
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(async ({ coords }) => {
        try {
          await tablesDB.updateRow({
            databaseId: DB,
            tableId: ORGS,
            rowId: agencyId,
            data: {
              lat: coords.latitude,
              lng: coords.longitude,
              lastSeen: new Date().toISOString(),
              isAvailable: true,
            },
          });
        } catch (e) {
          console.error('Location ping failed:', e);
        }
      });
    };

    ping();
    locationIntervalRef.current = setInterval(ping, 15_000);

    return () => {
      clearInterval(locationIntervalRef.current);
      tablesDB
        .updateRow({
          databaseId: DB,
          tableId: ORGS,
          rowId: agencyId,
          data: { isOnline: false, isAvailable: false },
        })
        .catch(() => {});
    };
  }, [agencyId]);

  useEffect(() => {
    if (agencyId) fetchDrivers();
  }, [activeDeliveries.length, completedDeliveries.length]);

  useEffect(() => {
    if (activePage === 'drivers' && agencyId) fetchDrivers();
  }, [activePage, agencyId]);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <DashboardPage
            activeDeliveries={activeDeliveries}
            drivers={formattedDrivers}
            onNavigateToTracking={() => setActivePage('tracking')}
          />
        );
      case 'requests':
        return (
          <RequestsPage
            deliveryRequests={deliveryRequests}
            loading={deliveriesLoading}
            agencyId={agencyId}
            onRefresh={refreshDeliveries}
            onAccept={handleAcceptRequest}
          />
        );
      case 'active':
        return (
          <ActiveDeliveriesPage
            activeDeliveries={activeDeliveries}
            onAssign={openAssignmentModal}
          />
        );
      case 'drivers':
        return (
          <DriversPage
            drivers={drivers}
            loading={driversLoading}
            error={driversError}
            activeDeliveries={activeDeliveries}
            onAddDriver={openAddDriverModal}
            onToggleStatus={toggleDriverStatus}
            onEditDriver={openEditDriverModal}
            onDeleteDriver={deleteDriver}
            onAssignDelivery={openAssignmentModal}
          />
        );
      case 'tracking':
        return (
          <TrackingPage
            activeDeliveries={activeDeliveries}
            drivers={formattedDrivers}
          />
        );
      case 'settings':
        return <AgencySettingsPage />;
      case 'history':
        return (
          <DeliveryHistory
            completedDeliveries={completedDeliveries}
            loading={deliveriesLoading}
          />
        );
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
            <p className="text-gray-500">Select a page from the navigation</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen pb-16 bg-white dark:bg-black ">
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
          onClick={() => setSidebarOpen(false)}
        />
        <Sidebar
          activePage={activePage}
          onPageChange={(page) => {
            setActivePage(page);
            setSidebarOpen(false);
          }}
          drivers={drivers}
          isOpen={sidebarOpen}
        />
        <main className="flex-1 p-0 lg:p-8">{renderPage()}</main>
      </div>

      {/* ── Offer banner — stays mounted during accepting confirmation ── */}
      {(incomingOffer || accepting) && (
        <OfferBanner
          offerCountdown={offerCountdown}
          onAccept={handleAcceptOffer}
          onDecline={declineOffer}
          accepting={accepting}
          label="A new delivery offer has been matched to your agency."
        />
      )}

      <AssignmentModal
        isOpen={assignmentModal.isOpen}
        deliveryDetails={assignmentModal.deliveryDetails}
        drivers={formattedDrivers}
        selectedDriver={assignmentModal.selectedDriver}
        onSelectDriver={(driverId) =>
          setAssignmentModal((prev) => ({ ...prev, selectedDriver: driverId }))
        }
        onConfirm={handleCompleteAssignment}
        onCancel={closeAssignmentModal}
        onAddDriver={openAddDriverModal}
        assigning={assigning}
      />

      <AddDriverModal
        isOpen={driverModalOpen}
        onClose={closeDriverModal}
        onAddDriver={handleDriverModalSubmit}
        onDeleteDriver={deleteDriver}
        agencyId={agencyId}
        loading={driversLoading}
        driverToEdit={driverToEdit}
      />
    </div>
  );
};

export default TrackAgencyDelivery;
