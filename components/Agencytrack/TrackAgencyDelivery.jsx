'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '@/hooks/Authcontext';
import { useAgencyDeliveries } from '@/hooks/useAgencyDeliveries';
import { useDriverManagement } from '@/hooks/useDriverManagement';
import { useDeliveryManagement } from '@/hooks/useDeliveryManagement';
import { useDispatchOffer } from '@/hooks/Usedispatchoffer';
import { tablesDB, Query } from '@/lib/config/Appwriteconfig';
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

const DB   = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const ORGS = process.env.NEXT_PUBLIC_APPWRITE_ORGANISATION_COLLECTION_ID;

// ── Auto-assign: pick the best available driver for an accepted offer ────────
// Mirrors the scoring in the Appwrite dispatch function so the agency
// always gets a sensible assignment without needing to open a modal.
function pickBestDriver(drivers) {
  const available = drivers.filter((d) => d.status === 'available');
  if (available.length === 0) return null;

  // Simple score: prefer drivers with no active deliveries
  // You can extend this with distance, rating etc. later
  const scored = available.map((d) => {
    const activeCount = (d.assignedDelivery || '')
      .split(',')
      .filter(Boolean).length;
    return { driver: d, score: Math.max(0, 100 - activeCount * 25) };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0].driver;
}

const TrackAgencyDelivery = () => {
  const [activePage, setActivePage]       = useState('dashboard');
  const [sidebarOpen, setSidebarOpen]     = useState(false);
  const [addDriverModalOpen, setAddDriverModalOpen] = useState(false);
  const [driverToEdit, setDriverToEdit]   = useState(null);

  const { user } = useAuth();
  const locationIntervalRef = useRef(null);

  const {
    loading: requestsLoading,
    error: requestsError,
    agencyId,
    refreshRequests,
  } = useAgencyDeliveries(user?.$id);

  const [assignmentModal, setAssignmentModal] = useState({
    isOpen: false,
    deliveryId: null,
    selectedDriver: null,
    deliveryDetails: null,
  });

  const {
    drivers,
    loading: driversLoading,
    error: driversError,
    addDriver,
    updateDriver,
    deleteDriver,
    freeDriverFromDelivery,
    fetchDrivers,
    toggleDriverStatus,
    assignDriverToDelivery,
  } = useDriverManagement(agencyId);

  const {
    completedDeliveries,
    deliveryRequests,
    activeDeliveries,
    acceptRequest,
    assignDelivery,
    loading: deliveriesLoading,
  } = useDeliveryManagement(agencyId, freeDriverFromDelivery);

  // ── Auto-assign handler called when an offer is accepted via dispatch ──────
  const handleDispatchAccepted = useCallback(async (deliveryId) => {
    // 1. Pick the best available driver right now
    const bestDriver = pickBestDriver(drivers);

    if (!bestDriver) {
      // No drivers available — fall back to manual AssignmentModal
      // First, fetch the delivery details for the modal
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

    // 2. Assign automatically — same logic as handleCompleteAssignment
    try {
      await assignDelivery(
        deliveryId,
        bestDriver.$id,
        bestDriver.name,
        bestDriver.phone,
      );
      await assignDriverToDelivery(bestDriver.$id, deliveryId);

      // 3. SMS for keypad drivers
      if (bestDriver.phoneType === 'keypad') {
        const endpoint  = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT?.replace(/\/$/, '');
        const functionId = process.env.NEXT_PUBLIC_APPWRITE_SMS_FUNCTION_ID;
        const projectId  = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

        fetch(`${endpoint}/v1/functions/${functionId}/executions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': projectId,
          },
          body: JSON.stringify({
            body: JSON.stringify({ deliveryId, driverId: bestDriver.$id }),
            async: true,
          }),
        }).catch((err) =>
          console.warn('SMS trigger failed (non-critical):', err.message)
        );
      }
    } catch (e) {
      console.error('Auto-assign failed, opening manual modal:', e);
      // Graceful fallback: open the modal so the agency can still assign
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
  }, [drivers, assignDelivery, assignDriverToDelivery]);

  // ── Dispatch offer hook (replaces all the duplicated offer logic) ──────────
  const { incomingOffer, offerCountdown, acceptOffer, declineOffer } =
    useDispatchOffer(agencyId, ORGS, {
      onAccepted: handleDispatchAccepted,
    });

  // ── Location ping ─────────────────────────────────────────────────────────
  useEffect(() => {
    const pingLocation = async () => {
      if (!navigator.geolocation || !agencyId) return;

      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          await tablesDB.updateRow({
            databaseId: DB,
            tableId: ORGS,
            rowId: agencyId,
            data: {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              lastSeen: new Date().toISOString(),
              isAvailable: true,
            },
          });
        } catch (e) {
          console.error('Agency location ping failed:', e);
        }
      });
    };

    if (!agencyId) return;

    pingLocation();
    locationIntervalRef.current = setInterval(pingLocation, 15_000);

    return () => {
      clearInterval(locationIntervalRef.current);
      tablesDB.updateRow({
        databaseId: DB,
        tableId: ORGS,
        rowId: agencyId,
        data: { isOnline: false, isAvailable: false },
      }).catch(() => {});
    };
  }, [agencyId]);

  // ── Driver page refresh ───────────────────────────────────────────────────
  useEffect(() => {
    if (activePage === 'drivers' && agencyId) fetchDrivers();
  }, [activePage, agencyId]);

  useEffect(() => {
    if (agencyId) fetchDrivers();
  }, [activeDeliveries.length, completedDeliveries.length]);

  // ── Manual assignment (from RequestsPage / ActiveDeliveriesPage) ──────────
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

    const selectedDriver = drivers.find(
      (d) => d.$id === assignmentModal.selectedDriver || d.id === assignmentModal.selectedDriver
    );
    if (!selectedDriver) return;

    await assignDelivery(
      assignmentModal.deliveryId,
      selectedDriver.$id,
      selectedDriver.name,
      selectedDriver.phone,
    );
    await assignDriverToDelivery(selectedDriver.$id, assignmentModal.deliveryId);

    if (selectedDriver.phoneType === 'keypad') {
      try {
        const endpoint   = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT?.replace(/\/$/, '');
        const functionId = process.env.NEXT_PUBLIC_APPWRITE_SMS_FUNCTION_ID;
        const projectId  = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

        await fetch(`${endpoint}/v1/functions/${functionId}/executions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': projectId,
          },
          body: JSON.stringify({
            body: JSON.stringify({
              deliveryId: assignmentModal.deliveryId,
              driverId:   selectedDriver.$id,
            }),
            async: true,
          }),
        });
      } catch (smsErr) {
        console.warn('SMS trigger failed (non-critical):', smsErr.message);
      }
    }

    setAssignmentModal({ isOpen: false, deliveryId: null, selectedDriver: null, deliveryDetails: null });
  };

  // ── Driver modal helpers ──────────────────────────────────────────────────
  const handleAddDriverClick    = () => { setDriverToEdit(null); setAddDriverModalOpen(true); };
  const handleEditDriverClick   = (driver) => { setDriverToEdit(driver); setAddDriverModalOpen(true); };
  const handleCloseDriverModal  = () => { setAddDriverModalOpen(false); setDriverToEdit(null); };

  const handleDriverModalSubmit = async (driverData) => {
    if (driverToEdit) return await updateDriver(driverToEdit.$id, driverData);
    return await addDriver(driverData);
  };

  const handleDeleteDriver = async (driverId) => {
    const result = await deleteDriver(driverId);
    if (result.success) handleCloseDriverModal();
    return result;
  };

  const handleOpenAssignmentModal = (delivery, preSelectedDriverId = null) => {
    setAssignmentModal({
      isOpen: true,
      deliveryId: delivery.$id,
      selectedDriver: preSelectedDriverId,
      deliveryDetails: delivery,
    });
  };

  const formatDriversForDisplay = () =>
    drivers.map((driver) => ({
      id: driver.$id,
      name: driver.name,
      phone: driver.phone,
      phoneType: driver.phoneType || 'android',
      status: driver.status,
      assignedDelivery: driver.assignedDelivery || null,
      vehicle: driver.vehicleType
        ? driver.vehicleType.charAt(0).toUpperCase() + driver.vehicleType.slice(1)
        : 'No vehicle',
    }));

  // ── Page renderer ─────────────────────────────────────────────────────────
  const renderPage = () => {
    const formattedDrivers = formatDriversForDisplay();

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
            loading={requestsLoading}
            error={requestsError}
            agencyId={agencyId}
            onRefresh={refreshRequests}
            onAccept={handleAcceptRequest}
          />
        );
      case 'active':
        return (
          <ActiveDeliveriesPage
            activeDeliveries={activeDeliveries}
            onAssign={handleOpenAssignmentModal}
          />
        );
      case 'drivers':
        return (
          <DriversPage
            drivers={drivers}
            loading={driversLoading}
            error={driversError}
            activeDeliveries={activeDeliveries}
            onAddDriver={handleAddDriverClick}
            onClose={handleCloseDriverModal}
            onToggleStatus={toggleDriverStatus}
            onEditDriver={handleEditDriverClick}
            onDeleteDriver={handleDeleteDriver}
            onAssignDelivery={handleOpenAssignmentModal}
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
    <div className="min-h-screen pb-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

      <div className="flex max-w-7xl mx-auto">
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
          onClick={() => setSidebarOpen(false)}
        />
        <Sidebar
          activePage={activePage}
          onPageChange={(page) => { setActivePage(page); setSidebarOpen(false); }}
          drivers={drivers}
          isOpen={sidebarOpen}
        />
        <main className="flex-1 p-0 lg:p-8">{renderPage()}</main>
      </div>

      {/* ── Shared offer banner ── */}
      {incomingOffer && (
        <OfferBanner
          offerCountdown={offerCountdown}
          onAccept={acceptOffer}
          onDecline={declineOffer}
          label="A new delivery offer has been matched to your agency."
        />
      )}

      <AssignmentModal
        isOpen={assignmentModal.isOpen}
        deliveryDetails={assignmentModal.deliveryDetails}
        drivers={formatDriversForDisplay()}
        selectedDriver={assignmentModal.selectedDriver}
        onSelectDriver={(driverId) =>
          setAssignmentModal((prev) => ({ ...prev, selectedDriver: driverId }))
        }
        onConfirm={handleCompleteAssignment}
        onCancel={() =>
          setAssignmentModal({ isOpen: false, deliveryId: null, selectedDriver: null, deliveryDetails: null })
        }
        onAddDriver={handleAddDriverClick}
      />

      <AddDriverModal
        isOpen={addDriverModalOpen}
        onClose={handleCloseDriverModal}
        onAddDriver={handleDriverModalSubmit}
        onDeleteDriver={handleDeleteDriver}
        agencyId={agencyId}
        loading={driversLoading}
        driverToEdit={driverToEdit}
      />
    </div>
  );
};

export default TrackAgencyDelivery;