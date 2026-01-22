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

const TrackAgencyDelivery = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addDriverModalOpen, setAddDriverModalOpen] = useState(false); // ADD THIS
  const { user } = useAuth();

  const {
    requests,
    loading: requestsLoading,
    error: requestsError,
    refreshRequests,
  } = useAgencyDeliveries(user?.$id);

  // Driver management hook
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

  // Delivery management hook
  const {
    deliveryRequests,
    activeDeliveries,
    acceptRequest,
    declineRequest,
    assignDelivery,
    updateDeliveryStatus,
  } = useDeliveryManagement(requests);

  // Assignment modal state
  const [assignmentModal, setAssignmentModal] = useState({
    isOpen: false,
    deliveryId: null,
    selectedDriver: null,
    deliveryDetails: null,
  });

  useEffect(() => {
    console.log('Active page changed to:', activePage);
    if (activePage === 'drivers' && user?.$id) {
      console.log('Refetching drivers for page:', user.$id);
      fetchDrivers();
    }
  }, [activePage, user?.$id]);


  const handleAddDriverClick = () => {
    setAddDriverModalOpen(true);
  };

  // Handle accept delivery request
  const handleAcceptRequest = (requestId) => {
    const newDelivery = acceptRequest(requestId);

    if (newDelivery) {
      setTimeout(() => {
        setAssignmentModal({
          isOpen: true,
          deliveryId: newDelivery.id,
          selectedDriver: null,
          deliveryDetails: newDelivery,
        });
      }, 300);
    }
  };

  // Handle decline delivery request
  const handleDeclineRequest = (requestId) => {
    if (confirm('Are you sure you want to decline this delivery request?')) {
      declineRequest(requestId);
    }
  };

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
        selectedDriver.name
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

  // Handle delivery status update
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
      deliveryId: delivery.id,
      selectedDriver: null,
      deliveryDetails: delivery,
    });
  };

  // Handle toggle driver status
  // const handleToggleDriverStatus = async (driverId) => {
  //   const driver = drivers.find((d) => d.$id === driverId || d.id === driverId);
  //   if (driver) {
  //     await toggleDriverStatus(driver.$id || driver.id, driver.status);
  //   }
  // };

  // Format drivers for display (to match the DriversPage component expectations)
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
      earningsToday: 0, // You'll need to add this field to your schema
      deliveriesToday: 0, // You'll need to add this field to your schema
      lastUpdate: 'Just now', // You'll need to calculate this from $updatedAt
      // Add other fields as needed
    }));
  };

  // Render current page
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
            onRefresh={refreshRequests}
            onAccept={handleAcceptRequest}
            onDecline={handleDeclineRequest}
          />
        );

      case 'active':
        return (
          <ActiveDeliveriesPage
            activeDeliveries={activeDeliveries}
            onAssign={handleOpenAssignmentModal}
            onUpdateStatus={handleUpdateDeliveryStatus}
            onNavigateToTracking={() => setActivePage('tracking')}
          />
        );

      case 'drivers':
        return (
          <DriversPage
            drivers={drivers}
            loading={driversLoading} // ADD THIS
            error={driversError} // ADD THIS
            activeDeliveries={activeDeliveries}
            onAddDriver={handleAddDriverClick} // CHANGE THIS
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{renderPage()}</main>
      </div>

      {/* Assignment Modal */}
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

      {/* Add Driver Modal */}
      <AddDriverModal
        isOpen={addDriverModalOpen}
        onClose={() => setAddDriverModalOpen(false)}
        onAddDriver={addDriver}
        agencyId={user?.$id}
        loading={driversLoading}
      />
    </div>
  );
};

export default TrackAgencyDelivery;
