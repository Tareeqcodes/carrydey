'use client';
import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '@/hooks/Authcontext';
import { useAgencyDeliveries } from '@/hooks/useAgencyDeliveries';
import { useDriverManagement } from '@/hooks/useDriverManagement';
import { useDeliveryManagement } from '@/hooks/useDeliveryManagement';
import Sidebar from './Sidebar';
import AssignmentModal from './AssignmentModal';
import DashboardPage from './DashboardPage';
import RequestsPage from './RequestsPage';
import ActiveDeliveriesPage from './ActiveDeliveriesPage';
import DriversPage from './DriversPage';
import TrackingPage from './TrackingPage';
import AddDriverModal from '../AddDriverModal';
import AgencySettingsPage from '../AgencySettingsPage';
import DeliveryHistory from './DeliveryHistory';

const TrackAgencyDelivery = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addDriverModalOpen, setAddDriverModalOpen] = useState(false);
  const { user } = useAuth();

  const {
    loading: requestsLoading,
    error: requestsError,
    agencyId,
    refreshRequests,
  } = useAgencyDeliveries(user?.$id);

  const {
    drivers,
    loading: driversLoading,
    error: driversError,
    addDriver,
    fetchDrivers,
    toggleDriverStatus,
    assignDriverToDelivery,
    updateDriverEarnings,
  } = useDriverManagement(user?.$id);

  const {
    completedDeliveries,
    deliveryRequests,
    activeDeliveries,
    acceptRequest,
    assignDelivery,
    updateDeliveryStatus,
    confirmPickup,
    confirmDelivery,
    loading: deliveriesLoading,
  } = useDeliveryManagement(agencyId);

  // Assignment modal state
  const [assignmentModal, setAssignmentModal] = useState({
    isOpen: false,
    deliveryId: null,
    selectedDriver: null,
    deliveryDetails: null,
  });


  useEffect(() => {
    if (activePage === 'drivers' && agencyId) {
      fetchDrivers();
    }
  }, [activePage, agencyId]);

  const handleAddDriverClick = () => {
    setAddDriverModalOpen(true);
  };

  const handleAcceptRequest = async (requestId) => {
    const result = await acceptRequest(requestId);

    if (result?.success) {
      // Open assignment modal immediately after accepting
      setAssignmentModal({
        isOpen: true,
        deliveryId: result.data.$id,
        selectedDriver: null,
        deliveryDetails: result.data,
      });
    }
    return result;
  };

  // const handleDeclineRequest = (requestId) => {
  //   if (confirm('Are you sure you want to decline this delivery request?')) {
  //     declineRequest(requestId);
  //   }
  // };

  // Complete driver assignment
  const handleCompleteAssignment = () => {
    if (!assignmentModal.selectedDriver || !assignmentModal.deliveryId) return;

    const selectedDriver = drivers.find(
      (d) =>
        d.$id === assignmentModal.selectedDriver ||
        d.id === assignmentModal.selectedDriver
    );

    if (selectedDriver) {
      assignDelivery(
        assignmentModal.deliveryId,
        selectedDriver.$id || selectedDriver.id,
        selectedDriver.name,
        selectedDriver.phone
      );

      assignDriverToDelivery(
        selectedDriver.$id || selectedDriver.id,
        assignmentModal.deliveryId
      );
    }

    setAssignmentModal({
      isOpen: false,
      deliveryId: null,
      selectedDriver: null,
      deliveryDetails: null,
    });
  };

  const handleUpdateDeliveryStatus = (deliveryId, newStatus) => {
    const delivery = updateDeliveryStatus(deliveryId, newStatus);

    if (newStatus === 'delivered' && delivery?.driverId) {
      const payout = parseFloat(delivery.payout?.replace(/[₦$,]/g, '') || 0);
      updateDriverEarnings(delivery.driverId, payout);
    }
  };

  // Open assignment modal for a specific delivery
  const handleOpenAssignmentModal = (delivery) => {
    setAssignmentModal({
      isOpen: true,
      deliveryId: delivery.id || delivery.$id,
      selectedDriver: null,
      deliveryDetails: delivery,
    });
  };

  const formatDriversForDisplay = () => {
    return drivers.map((driver) => ({
      id: driver.$id,
      name: driver.name,
      phone: driver.phone,
      status: driver.status,
      assignedDelivery: driver.assignedDelivery || null,
      vehicle: driver.vehicleType
        ? `Van #${driver.vehicleType.toUpperCase()}`
        : 'No vehicle',
      earningsToday: 0,
      deliveriesToday: 0,
      lastUpdate: 'Just now',
    }));
  };

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
            // onDecline={handleDeclineRequest}
          />
        );

      case 'active':
        return (
          <ActiveDeliveriesPage
            activeDeliveries={activeDeliveries}
            onAssign={handleOpenAssignmentModal}
            onUpdateStatus={handleUpdateDeliveryStatus}
            onNavigateToTracking={() => setActivePage('tracking')}
            onConfirmPickup={confirmPickup} 
            onConfirmDelivery={confirmDelivery}
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
            onToggleStatus={toggleDriverStatus}
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
    <div className="min-h-screen pb-14 bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8">
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
        <Sidebar
          activePage={activePage}
          onPageChange={(page) => {
            setActivePage(page);
            setSidebarOpen(false);
          }}
          drivers={drivers}
          isOpen={sidebarOpen}
        />

        {/* Main Content */}
        <main className="flex-1 p-0 lg:p-8">{renderPage()}</main>
      </div> 

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
          setAssignmentModal({
            isOpen: false,
            deliveryId: null,
            selectedDriver: null,
            deliveryDetails: null,
          })
        }
        onAddDriver={() => setAddDriverModalOpen(true)}
      />
      <AddDriverModal
        isOpen={addDriverModalOpen}
        onClose={() => setAddDriverModalOpen(false)}
        onAddDriver={addDriver}
        agencyId={agencyId}
        loading={driversLoading}
      />
    </div>
  );
};

export default TrackAgencyDelivery;