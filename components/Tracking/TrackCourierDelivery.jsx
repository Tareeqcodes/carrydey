'use client';
import { useState } from 'react';
import { 
  Package, 
  MapPin, 
  CheckCircle,
  DollarSign,
  Calendar, 
  Menu,
  User,
  Clock,
  Truck,
  History,
  Copy,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/hooks/Authcontext';
import { formatNairaSimple } from '@/hooks/currency';
import { useCourierDelivery } from '@/hooks/useCourierDelivery';
import Profile from '../setting/Profile';

const TrackCourierDelivery = () => {
  const { user } = useAuth(); 
  const [activePage, setActivePage] = useState('deliveries');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const [otpInput, setOtpInput] = useState('');
  const [pickupCodeInput, setPickupCodeInput] = useState('');
  const [selectedDeliveryForOTP, setSelectedDeliveryForOTP] = useState(null);
  
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

  // Separate deliveries by status
  const pendingDeliveries = allDeliveries.filter(d => d.status === 'pending');
  const activeDeliveries = allDeliveries.filter(d => 
    ['accepted', 'assigned', 'picked_up', 'in_transit'].includes(d.status)
  );
  const completedDeliveries = allDeliveries.filter(d => 
    ['delivered', 'cancelled'].includes(d.status)
  );

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleAcceptDelivery = async (deliveryId) => {
    try {
      const result = await acceptRequest(deliveryId);
      
      if (result.success) {
        alert(`Delivery accepted!\nPickup Code: ${result.pickupCode}\nDropoff OTP: ${result.dropoffOTP}`);
        refresh();
      } else {
        alert(result.error || 'Failed to accept delivery');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to accept delivery');
    }
  };

  const confirmPickupWithCode = async (deliveryId) => {
    if (pickupCodeInput.length !== 6) {
      alert('Please enter the complete 6-character pickup code');
      return;
    }

    const result = await confirmPickup(deliveryId, pickupCodeInput);
    
    if (result.success) {
      alert('Pickup confirmed successfully!');
      setPickupCodeInput('');
      setSelectedDeliveryForOTP(null);
    } else {
      alert(result.error || 'Invalid pickup code');
    }
  };

  const confirmDeliveryWithOTP = async (deliveryId) => {
    if (otpInput.length !== 6) {
      alert('Please enter the complete 6-digit OTP');
      return;
    }

    const result = await confirmDelivery(deliveryId, otpInput);
    
    if (result.success) {
      alert('Delivery completed successfully!');
      setOtpInput('');
      setSelectedDeliveryForOTP(null);
    } else {
      alert(result.error || 'Invalid OTP code');
    }
  };

  const handleUpdateStatus = async (deliveryId, status) => {
    const result = await updateDeliveryStatus(deliveryId, status);
    
    if (!result.success) {
      alert(result.error || 'Failed to update delivery status');
    }
  };

  const navItems = [
    { id: 'deliveries', label: 'Pending', icon: Package },
    { id: 'active', label: 'Active', icon: Truck },
    { id: 'history', label: 'History', icon: History },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      accepted: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Accepted' },
      assigned: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Assigned' },
      picked_up: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Picked Up' },
      in_transit: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'In Transit' },
      delivered: { bg: 'bg-green-100', text: 'text-green-800', label: 'Delivered' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const renderDeliveryCard = (delivery, showActions = true) => (
    <div key={delivery.$id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-gray-500">
            <Clock className="w-3 h-3 inline mr-1" />
            {new Date(delivery.$createdAt).toLocaleString()}
          </p>
        </div>
        {getStatusBadge(delivery.status)}
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-2">
          <div className="p-1 bg-green-100 rounded-full mt-0.5">
            <MapPin className="w-3 h-3 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500">Pickup</p>
            <p className="text-sm text-gray-900">{delivery.pickupAddress}</p>
            {delivery.pickupContactName && (
              <p className="text-xs text-gray-500 mt-1">
                Contact: {delivery.pickupContactName} • {delivery.pickupPhone}
              </p>
            )}
          </div>
        </div>
        
        <div className="border-l-2 border-dashed border-gray-200 h-4 ml-3"></div>
        
        <div className="flex items-start gap-2">
          <div className="p-1 bg-red-100 rounded-full mt-0.5">
            <MapPin className="w-3 h-3 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500">Dropoff</p>
            <p className="text-sm text-gray-900">{delivery.dropoffAddress}</p>
            {delivery.dropoffContactName && (
              <p className="text-xs text-gray-500 mt-1">
                Contact: {delivery.dropoffContactName} • {delivery.dropoffPhone}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-50 p-3 rounded-xl text-center">
          <p className="text-xs text-gray-500 mb-1">Distance</p>
          <p className="font-semibold">{(delivery.distance / 1000).toFixed(1)} km</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-xl text-center">
          <p className="text-xs text-gray-500 mb-1">Duration</p>
          <p className="font-semibold">{Math.round(delivery.duration / 60)} min</p>
        </div>
        <div className="bg-green-50 p-3 rounded-xl text-center">
          <p className="text-xs text-gray-500 mb-1">Payout</p>
          <p className="font-semibold text-green-600">{formatNairaSimple(delivery.offeredFare)}</p>
        </div>
      </div>

      {delivery.packageDescription && (
        <div className="mb-4 p-3 bg-blue-50 rounded-xl">
          <p className="text-xs text-gray-500 mb-1">Package Details</p>
          <p className="text-sm text-gray-700">{delivery.packageDescription}</p>
          {delivery.isFragile && (
            <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
              ⚠️ Fragile
            </span>
          )}
        </div>
      )}

      {showActions && renderActions(delivery)}
    </div>
  );

  const renderActions = (delivery) => {
    if (delivery.status === 'pending') {
      return (
        <button
          onClick={() => handleAcceptDelivery(delivery.$id)}
          className="w-full py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
        >
          Accept Delivery
        </button>
      );
    }

    if (delivery.status === 'accepted' || delivery.status === 'assigned') {
      return (
        <div className="space-y-2">
          {delivery.pickupCode && (
            <div className="bg-blue-50 p-3 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-700">Pickup Code</p>
                <button
                  onClick={() => copyToClipboard(delivery.pickupCode, 'pickup')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {copiedCode === 'pickup' ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-2xl font-bold text-blue-600 tracking-wider">
                {delivery.pickupCode}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Show this code to the sender
              </p>
            </div>
          )}
          
          <button
            onClick={() => {
              setSelectedDeliveryForOTP(delivery.$id);
              setPickupCodeInput('');
            }}
            className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Confirm Pickup
          </button>
        </div>
      );
    }

    if (delivery.status === 'picked_up') {
      return (
        <button
          onClick={() => handleUpdateStatus(delivery.$id, 'in_transit')}
          className="w-full py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors"
        >
          Start Delivery
        </button>
      );
    }

    if (delivery.status === 'in_transit') {
      return (
        <div className="space-y-2">
          {delivery.dropoffOTP && (
            <div className="bg-green-50 p-3 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-700">Dropoff OTP</p>
                <button
                  onClick={() => copyToClipboard(delivery.dropoffOTP, 'dropoff')}
                  className="text-green-600 hover:text-green-700"
                >
                  {copiedCode === 'dropoff' ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-2xl font-bold text-green-600 tracking-wider">
                {delivery.dropoffOTP}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Ask the recipient for this code
              </p>
            </div>
          )}
          
          <button
            onClick={() => {
              setSelectedDeliveryForOTP(delivery.$id);
              setOtpInput('');
            }}
            className="w-full py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Confirm Delivery
          </button>
        </div>
      );
    }

    return null;
  };

  const renderPage = () => {
    switch (activePage) {
      case 'deliveries':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Pending Deliveries</h2>
              <p className="text-gray-500 text-sm">New delivery requests waiting for acceptance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Pending Requests</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {pendingDeliveries.length}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Total Value</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatNairaSimple(pendingDeliveries.reduce((sum, d) => sum + (d.offeredFare || 0), 0))}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-[#3A0A21] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : pendingDeliveries.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Deliveries</h3>
                <p className="text-gray-500">New delivery requests will appear here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pendingDeliveries.map(delivery => renderDeliveryCard(delivery))}
              </div>
            )}
          </div>
        );

      case 'active':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Active Deliveries</h2>
              <p className="text-gray-500 text-sm">Track your ongoing deliveries with pickup and dropoff codes</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Active</p>
                <p className="text-2xl font-bold text-blue-600">
                  {activeDeliveries.length}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Picked Up</p>
                <p className="text-2xl font-bold text-purple-600">
                  {activeDeliveries.filter(d => d.status === 'picked_up').length}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">In Transit</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {activeDeliveries.filter(d => d.status === 'in_transit').length}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Total Value</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatNairaSimple(activeDeliveries.reduce((sum, d) => sum + (d.offeredFare || 0), 0))}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-[#3A0A21] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : activeDeliveries.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center">
                <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Deliveries</h3>
                <p className="text-gray-500">Accept pending deliveries to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {activeDeliveries.map(delivery => (
                  <div key={delivery.$id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs text-gray-500">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {new Date(delivery.$createdAt).toLocaleString()}
                        </p>
                      </div>
                      {getStatusBadge(delivery.status)}
                    </div>

                    {/* PROMINENT CODE DISPLAY */}
                    {(delivery.status === 'accepted' || delivery.status === 'assigned') && delivery.pickupCode && (
                      <div className="mb-4 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                              <Package className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-blue-900">Pickup Code</p>
                              <p className="text-xs text-blue-600">Show to sender</p>
                            </div>
                          </div>
                          <button
                            onClick={() => copyToClipboard(delivery.pickupCode, `pickup-${delivery.$id}`)}
                            className="p-2 hover:bg-blue-200 rounded-lg transition-colors"
                          >
                            {copiedCode === `pickup-${delivery.$id}` ? (
                              <Check className="w-5 h-5 text-blue-600" />
                            ) : (
                              <Copy className="w-5 h-5 text-blue-600" />
                            )}
                          </button>
                        </div>
                        <p className="text-3xl font-bold text-blue-900 tracking-widest text-center py-2">
                          {delivery.pickupCode}
                        </p>
                      </div>
                    )}

                    {(delivery.status === 'picked_up' || delivery.status === 'in_transit') && delivery.dropoffOTP && (
                      <div className="mb-4 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-green-900">Dropoff OTP</p>
                              <p className="text-xs text-green-600">Get from recipient</p>
                            </div>
                          </div>
                          <button
                            onClick={() => copyToClipboard(delivery.dropoffOTP, `dropoff-${delivery.$id}`)}
                            className="p-2 hover:bg-green-200 rounded-lg transition-colors"
                          >
                            {copiedCode === `dropoff-${delivery.$id}` ? (
                              <Check className="w-5 h-5 text-green-600" />
                            ) : (
                              <Copy className="w-5 h-5 text-green-600" />
                            )}
                          </button>
                        </div>
                        <p className="text-3xl font-bold text-green-900 tracking-widest text-center py-2">
                          {delivery.dropoffOTP}
                        </p>
                      </div>
                    )}

                    <div className="space-y-3 mb-4">
                      <div className="flex items-start gap-2">
                        <div className="p-1 bg-green-100 rounded-full mt-0.5">
                          <MapPin className="w-3 h-3 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-500">Pickup</p>
                          <p className="text-sm text-gray-900">{delivery.pickupAddress}</p>
                          {delivery.pickupContactName && (
                            <p className="text-xs text-gray-500 mt-1">
                              Contact: {delivery.pickupContactName} • {delivery.pickupPhone}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="border-l-2 border-dashed border-gray-200 h-4 ml-3"></div>
                      
                      <div className="flex items-start gap-2">
                        <div className="p-1 bg-red-100 rounded-full mt-0.5">
                          <MapPin className="w-3 h-3 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-500">Dropoff</p>
                          <p className="text-sm text-gray-900">{delivery.dropoffAddress}</p>
                          {delivery.dropoffContactName && (
                            <p className="text-xs text-gray-500 mt-1">
                              Contact: {delivery.dropoffContactName} • {delivery.dropoffPhone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-gray-50 p-3 rounded-xl text-center">
                        <p className="text-xs text-gray-500 mb-1">Package</p>
                        <p className="font-semibold text-xs">{delivery.packageSize || 'Standard'}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl text-center">
                        <p className="text-xs text-gray-500 mb-1">Distance</p>
                        <p className="font-semibold">{(delivery.distance / 1000).toFixed(1)} km</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-xl text-center">
                        <p className="text-xs text-gray-500 mb-1">Payout</p>
                        <p className="font-semibold text-green-600">{formatNairaSimple(delivery.offeredFare)}</p>
                      </div>
                    </div>

                    {delivery.packageDescription && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-xl">
                        <p className="text-xs text-gray-500 mb-1">Package Details</p>
                        <p className="text-sm text-gray-700">{delivery.packageDescription}</p>
                        {delivery.isFragile && (
                          <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                            ⚠️ Fragile
                          </span>
                        )}
                      </div>
                    )}

                    {renderActions(delivery)}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'history':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Delivery History</h2>
              <p className="text-gray-500 text-sm">View all your completed and cancelled deliveries</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Delivered</p>
                <p className="text-2xl font-bold text-green-600">
                  {completedDeliveries.filter(d => d.status === 'delivered').length}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">
                  {completedDeliveries.filter(d => d.status === 'cancelled').length}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Total Earned</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatNairaSimple(
                    completedDeliveries
                      .filter(d => d.status === 'delivered')
                      .reduce((sum, d) => sum + (d.offeredFare || 0), 0)
                  )}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-[#3A0A21] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : completedDeliveries.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center">
                <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No History Yet</h3>
                <p className="text-gray-500">Completed deliveries will appear here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {completedDeliveries.map(delivery => renderDeliveryCard(delivery, false))}
              </div>
            )}
          </div>
        );

      case 'earnings':
        const totalEarnings = completedDeliveries
          .filter(d => d.status === 'delivered')
          .reduce((sum, d) => sum + (d.offeredFare || 0), 0);

        const todayEarnings = completedDeliveries
          .filter(d => {
            const deliveredToday = new Date(d.deliveredAt || d.$createdAt).toDateString() === new Date().toDateString();
            return d.status === 'delivered' && deliveredToday;
          })
          .reduce((sum, d) => sum + (d.offeredFare || 0), 0);

        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">My Earnings</h2>
              <p className="text-gray-500">Track your delivery earnings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Today's Earnings</p>
                    <p className="text-2xl font-bold">{formatNairaSimple(todayEarnings)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Earnings</p>
                    <p className="text-2xl font-bold">{formatNairaSimple(totalEarnings)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Completed</p>
                    <p className="text-2xl font-bold">
                      {completedDeliveries.filter(d => d.status === 'delivered').length}
                    </p>
                  </div>
                </div>
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
    <div className="min-h-screen pb-14 bg-gray-50">
      {/* Header */}
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
        <aside
          className={`fixed lg:static left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-30 transform transition-transform duration-200 lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-6 mt-16 lg:mt-5">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activePage === item.id
                      ? 'bg-[#3A0A21] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{renderPage()}</main>
      </div>

      {/* Mobile Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 z-10">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                activePage === item.id ? 'text-[#3A0A21]' : 'text-gray-500'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Pickup Code Confirmation Modal */}
      {selectedDeliveryForOTP && activeDeliveries.find(d => d.$id === selectedDeliveryForOTP)?.status === 'accepted' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold">Verify Pickup Code</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              Ask the sender for the pickup code and enter it below to confirm package collection.
            </p>
            
            <input
              type="text"
              value={pickupCodeInput}
              onChange={(e) => setPickupCodeInput(e.target.value.toUpperCase())}
              placeholder="Enter 6-character code"
              maxLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-4 text-center text-2xl font-bold tracking-wider uppercase"
            />
            
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedDeliveryForOTP(null);
                  setPickupCodeInput('');
                }}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmPickupWithCode(selectedDeliveryForOTP)}
                disabled={pickupCodeInput.length !== 6}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Pickup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dropoff OTP Confirmation Modal */}
      {selectedDeliveryForOTP && activeDeliveries.find(d => d.$id === selectedDeliveryForOTP)?.status === 'in_transit' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold">Verify Delivery OTP</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              Ask the recipient for the 6-digit OTP code to complete the delivery.
            </p>
            
            <input
              type="text"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-4 text-center text-2xl font-bold tracking-wider"
            />
            
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedDeliveryForOTP(null);
                  setOtpInput('');
                }}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDeliveryWithOTP(selectedDeliveryForOTP)}
                disabled={otpInput.length !== 6}
                className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Complete Delivery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackCourierDelivery;