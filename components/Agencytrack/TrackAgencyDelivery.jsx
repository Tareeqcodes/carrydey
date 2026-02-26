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
import AgencySettingsPage from './AgencySettingsPage';
import DeliveryHistory from './DeliveryHistory';

const TrackAgencyDelivery = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addDriverModalOpen, setAddDriverModalOpen] = useState(false);
  const [driverToEdit, setDriverToEdit] = useState(null);
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
    // updateDeliveryStatus,
    // confirmDelivery,
    // refreshDeliveries,
  } = useDeliveryManagement(agencyId, freeDriverFromDelivery);

  const [assignmentModal, setAssignmentModal] = useState({
    isOpen: false,
    deliveryId: null,
    selectedDriver: null,
    deliveryDetails: null,
  });

  useEffect(() => {
    if (activePage === 'drivers' && agencyId) fetchDrivers();
  }, [activePage, agencyId]);

  useEffect(() => {
    if (agencyId) fetchDrivers();
  }, [activeDeliveries.length, completedDeliveries.length]);

  const handleAddDriverClick = () => {
    setDriverToEdit(null);
    setAddDriverModalOpen(true);
  };

  const handleEditDriverClick = (driver) => {
    setDriverToEdit(driver);
    setAddDriverModalOpen(true);
  };

  const handleCloseDriverModal = () => {
    setAddDriverModalOpen(false);
    setDriverToEdit(null);
  };

  const handleDriverModalSubmit = async (driverData) => {
    if (driverToEdit) {
      return await updateDriver(driverToEdit.$id, driverData);
    }
    return await addDriver(driverData);
  };

  // ← Delete handler passed down to AddDriverModal and DriversPage
  const handleDeleteDriver = async (driverId) => {
    const result = await deleteDriver(driverId);
    if (result.success) {
      handleCloseDriverModal();
    }
    return result;
  };

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

  if (selectedDriver) {
    await assignDelivery(
      assignmentModal.deliveryId,
      selectedDriver.$id,
      selectedDriver.name,
      selectedDriver.phone
    );
    await assignDriverToDelivery(selectedDriver.$id, assignmentModal.deliveryId);
  }

  setAssignmentModal({ isOpen: false, deliveryId: null, selectedDriver: null, deliveryDetails: null });
};

  // const handleUpdateDeliveryStatus = async (deliveryId, newStatus) => {
  //   const result = await updateDeliveryStatus(deliveryId, newStatus);
  //   if (result?.success && (newStatus === 'delivered' || newStatus === 'cancelled')) {
  //     await refreshDeliveries();
  //   }
  //   return result;
  // };

  // const handleConfirmDelivery = async (deliveryId, otp) => {
  //    freeDriverFromDelivery is called inside useDeliveryManagement now
  //   return await confirmDelivery(deliveryId, otp);
  // };

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
        ? `${driver.vehicleType.charAt(0).toUpperCase() + driver.vehicleType.slice(1)}`
        : 'No vehicle',
      
    }));

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
          onPageChange={(page) => {
            setActivePage(page);
            setSidebarOpen(false);
          }}
          drivers={drivers}
          isOpen={sidebarOpen}
        />
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
