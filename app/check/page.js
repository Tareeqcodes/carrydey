'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { tablesDB, ID } from '@/lib/config/Appwriteconfig';
import { useAuth } from '@/hooks/Authcontext';
import useChooseAvailable from '@/hooks/useChooseAvailable';
import SelectAvailableModal from '@/components/SelectAvailableModal';
import {
  Star,
  MapPin,
  Clock,
  Package,
  Building2,
  Bike,
  CheckCircle,
  Zap,
  ChevronRight,
  ArrowUpDown,
  TrendingUp,
  Loader2,
} from 'lucide-react';

const SORTS = [
  { id: 'nearest', label: 'Nearest', icon: MapPin },
  { id: 'rated', label: 'Top rated', icon: TrendingUp },
];

function sortList(list, sort) {
  return [...list].sort((a, b) =>
    sort === 'nearest'
      ? parseFloat(a.distance) - parseFloat(b.distance)
      : (b.rating || 0) - (a.rating || 0)
  );
}

function FeaturedCard({ traveler, onBook, deliveryReady }) {
  const isAgency = traveler.entityType === 'agency';
  const accent = isAgency ? '#c084a0' : '#FF6B35';

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-3xl overflow-hidden"
      style={{
        background:
          'linear-gradient(150deg, #0e0608 0%, #1c0812 55%, #2e0d1e 100%)',
        boxShadow:
          '0 24px 64px rgba(58,10,33,0.5), 0 4px 16px rgba(0,0,0,0.25)',
      }}
    >
      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Warm glow */}
      <div
        className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #FF6B35 0%, transparent 70%)',
          transform: 'translate(30%, -30%)',
        }}
      />

      {/* Best match badge */}
      <div
        className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
        style={{
          background: '#FF6B35',
          boxShadow: '0 4px 14px rgba(255,107,53,0.45)',
        }}
      >
        <Zap className="w-3 h-3 text-white" fill="white" />
        <span className="text-[10px] font-black text-white uppercase tracking-widest">
          Best match
        </span>
      </div>

      <div className="relative z-10 p-5">
        {/* Identity */}
        <div className="flex items-start gap-4 mb-5">
          <div className="relative flex-shrink-0">
            <div
              className="w-13 h-13 rounded-xl overflow-hidden"
              style={{ border: `2px solid ${accent}50` }}
            >
              <img
                src={traveler.avatar}
                alt={traveler.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Online dot */}
            <div
              className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2"
              style={{ borderColor: '#0e0608' }}
            />
          </div>

          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-center gap-2 mb-1.5">
              <h2
                className="text-[14px] font-black text-white leading-tight truncate"
                style={{ fontFamily: 'Fraunces, Georgia, serif' }}
              >
                {traveler.name}
              </h2>
              
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.1)', color: accent }}
              >
                {isAgency ? ' Agency' : ' Courier'}
              </span>
              <div className="flex items-center gap-1">
                <Star
                  className="w-3.5 h-3.5 text-amber-400"
                  fill="currentColor"
                />
                <span className="text-[10px] font-black text-white">
                  {traveler.rating}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {[
            {
              icon: Clock,
              value: `${traveler.pickupTime}m`,
              label: 'Pickup ETA',
            },
            {
              icon: MapPin,
              value: `${traveler.distance} km`,
              label: 'Distance',
            },
            {
              icon: Package,
              value: traveler.totalDeliveries,
              label: 'Deliveries',
            },
          ].map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="rounded-2xl p-3 text-center"
              style={{
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(6px)',
              }}
            >
              <Icon className="w-3.5 h-3.5 mx-auto mb-1.5 text-white/40" />
              <p className="text-[13px] font-black text-white leading-none">
                {value}
              </p>
              <p className="text-[9px] text-white/35 mt-1 uppercase tracking-wider">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Vehicle tags */}
        {traveler.vehicleTypes?.length > 0 && (
          <div className="flex gap-2 mb-5 flex-wrap">
            {traveler.vehicleTypes.slice(0, 3).map((v) => (
              <span
                key={v}
                className="text-[10px] px-2.5 py-1 rounded-full font-semibold capitalize"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  color: 'rgba(255,255,255,0.5)',
                }}
              >
                {v}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => onBook(traveler)}
          disabled={!deliveryReady}
          className="w-full py-4 rounded-2xl font-black text-[14px] text-white flex items-center justify-center gap-2 disabled:opacity-40 transition-all"
          style={{
            background: deliveryReady
              ? 'linear-gradient(135deg, #FF6B35 0%, #d94e1a 100%)'
              : '#374151',
            boxShadow: deliveryReady
              ? '0 8px 28px rgba(255,107,53,0.4)'
              : 'none',
          }}
        >
          {deliveryReady ? (
            <>
              <span>Book {isAgency ? 'Agency' : 'Courier'}</span>
              <ChevronRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Preparing…</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

function ListCard({ traveler, index, onBook, deliveryReady }) {
  const isAgency = traveler.entityType === 'agency';
  const accent = isAgency ? '#3A0A21' : '#FF6B35';

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.32,
        delay: index * 0.055,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="bg-white rounded-2xl overflow-hidden"
      style={{
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        border: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      <div className="flex items-stretch">
        {/* Left accent bar */}
        <div className="w-1 flex-shrink-0" style={{ background: accent }} />

        <div className="flex-1 px-4 py-3.5 flex items-center gap-3">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src={traveler.avatar}
              alt={traveler.name}
              className="w-11 h-11 rounded-xl object-cover bg-gray-100"
            />
            <div
              className="absolute -bottom-1 -right-1 w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-white"
              style={{ background: accent }}
            >
              {isAgency ? (
                <Building2 size={8} className="text-white" />
              ) : (
                <Bike size={8} className="text-white" />
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <p
                className="text-[14px] font-black text-[#0e0608] truncate"
                style={{ fontFamily: 'Fraunces, Georgia, serif' }}
              >
                {traveler.name}
              </p>
              {traveler.verified && (
                <CheckCircle
                  size={11}
                  className="text-blue-500 flex-shrink-0"
                  fill="currentColor"
                />
              )}
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="flex items-center gap-1">
                <Clock size={10} className="text-gray-400" />
                <span className="text-[11px] text-gray-700 font-semibold">
                  {traveler.pickupTime}m
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={10} className="text-gray-400" />
                <span className="text-[11px] text-gray-500">
                  {traveler.distance} km
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Star
                  size={10}
                  className="text-amber-400"
                  fill="currentColor"
                />
                <span className="text-[11px] font-black text-gray-700">
                  {traveler.rating}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Package size={10} className="text-gray-400" />
                <span className="text-[11px] text-gray-500">
                  {traveler.totalDeliveries}
                </span>
              </div>
            </div>
          </div>

          {/* Book button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onBook(traveler)}
            disabled={!deliveryReady}
            className="flex-shrink-0 px-4 py-2.5 rounded-xl text-[12px] font-black text-white disabled:opacity-40 transition-all"
            style={{ background: accent }}
          >
            Book
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-72 bg-gray-200 rounded-3xl" />
      <div className="h-5 w-32 bg-gray-200 rounded-full" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-[72px] bg-gray-100 rounded-2xl" />
      ))}
    </div>
  );
}

const ChooseAvailable = () => {
  const [travelers, setTravelers] = useState([]);
  const [selectedTraveler, setSelectedTraveler] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [deliveryId, setDeliveryId] = useState(null);
  const [restoring, setRestoring] = useState(false);
  const [tab, setTab] = useState('all');
  const [sort, setSort] = useState('nearest');

  const { agencies, loading, error } = useChooseAvailable();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const sessionId = sessionStorage.getItem('latestDeliveryId');
      if (sessionId) {
        setDeliveryId(sessionId);
        return;
      }

      const raw = localStorage.getItem('pendingDelivery');
      if (!raw || !user) return;

      try {
        setRestoring(true);
        const pending = JSON.parse(raw);
        const { pickup, dropoff, routeData, packageDetails, fareDetails } =
          pending;

        if (!pickup || !dropoff || !routeData) {
          localStorage.removeItem('pendingDelivery');
          localStorage.removeItem('postAuthRedirect');
          router.push('/send');
          return;
        }

        const newDeliveryId = ID.unique();
        await tablesDB.createRow({
          databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
          rowId: newDeliveryId,
          data: {
            pickupAddress:
              pickup.place_name?.substring(0, 500) || 'Pickup location',
            pickupLat: pickup.geometry.coordinates[1],
            pickupLng: pickup.geometry.coordinates[0],
            dropoffAddress:
              dropoff.place_name?.substring(0, 500) || 'Dropoff location',
            dropoffLat: dropoff.geometry.coordinates[1],
            dropoffLng: dropoff.geometry.coordinates[0],
            distance: parseFloat(routeData.distance),
            duration: parseInt(routeData.duration),
            status: 'pending',
            pickupContactName: packageDetails?.pickupContact?.pickupContactName,
            pickupPhone: packageDetails?.pickupContact?.pickupPhone,
            dropoffContactName:
              packageDetails?.dropoffContact?.dropoffContactName,
            dropoffPhone: packageDetails?.dropoffContact?.dropoffPhone,
            dropoffInstructions:
              packageDetails?.dropoffContact?.dropoffInstructions,
            recipientPermission:
              packageDetails?.dropoffContact?.recipientPermission,
            offeredFare: parseInt(
              fareDetails?.offeredFare || routeData.estimatedFare || 0
            ),
            packageSize: packageDetails?.size,
            packageDescription: packageDetails?.description,
            isFragile: packageDetails?.isFragile || false,
            pickupTime: packageDetails?.pickupTime || 'courier',
            userId: user.$id,
            assignedAgencyId: null,
            paymentMethod: fareDetails?.paymentMethod,
          },
        });

        sessionStorage.setItem('latestDeliveryId', newDeliveryId);
        setDeliveryId(newDeliveryId);
        localStorage.removeItem('pendingDelivery');
        localStorage.removeItem('postAuthRedirect');
      } catch (err) {
        console.error('Failed to restore pending delivery:', err);
      } finally {
        setRestoring(false);
      }
    };

    init();
  }, [user]);

  useEffect(() => {
    if (!agencies?.length) return;

    const transformed = agencies
      .filter((e) => e.isAvailable === true)
      .map((entity) => {
        const isAgency = entity.entityType === 'agency';
        let serviceCities = [];
        if (isAgency && entity.serviceCities) {
          serviceCities = entity.serviceCities
            .split(',')
            .map((c) => c.trim())
            .filter(Boolean);
        }
        const routeDisplay = isAgency
          ? serviceCities.length === 0
            ? 'Nigeria'
            : serviceCities.length === 1
              ? serviceCities[0]
              : `${serviceCities[0]} + ${serviceCities.length - 1} more`
          : entity.currentCity || entity.operatingArea || 'Kano';

        return {
          id: entity.$id,
          entityType: entity.entityType,
          name: isAgency
            ? entity.name || entity.contactPerson || 'Agency'
            : entity.userName || 'Courier',
          avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${isAgency ? entity.name || entity.contactPerson : entity.userName}`,
          rating: entity.rating || 4.5,
          verified: entity.verified || false,
          route: routeDisplay,
          serviceCities,
          distance: (Math.random() * 3 + 0.5).toFixed(1),
          pickupTime: Math.floor(Math.random() * 20 + 10),
          type: isAgency ? entity.type : 'Independent Courier',
          phone: entity.phone || entity.phoneNumber,
          services: isAgency
            ? entity.services
              ? JSON.parse(entity.services)
              : []
            : ['Package Delivery'],
          vehicleTypes: isAgency
            ? entity.vehicleTypes
              ? JSON.parse(entity.vehicleTypes)
              : []
            : [entity.vehicleType || 'Motorcycle'],
          totalDeliveries:
            entity.totalDeliveries || Math.floor(Math.random() * 10 + 20),
          isAvailable: entity.isAvailable || false,
        };
      });

    setTravelers(transformed);
  }, [agencies]);


  const handleBookTraveler = useCallback(
    (traveler) => {
      if (!deliveryId) {
        alert('Your delivery is still being prepared. Please wait a moment.');
        return;
      }
      setSelectedTraveler(traveler);
      setShowConfirmation(true);
    },
    [deliveryId]
  );

  const handleConfirmBooking = async () => {
    if (!selectedTraveler?.id || !deliveryId) {
      alert('Missing delivery or traveler information');
      return;
    }
    setBookingLoading(true);
    try {
      const isAgency = selectedTraveler.entityType === 'agency';
      const updateData = { status: 'pending' };
      if (isAgency) updateData.assignedAgencyId = selectedTraveler.id;
      else updateData.assignedCourierId = selectedTraveler.id;

      await tablesDB.updateRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
        rowId: deliveryId,
        data: updateData,
      });

      sessionStorage.removeItem('latestDeliveryId');
      if (isAgency) {
        sessionStorage.setItem('agencyId', selectedTraveler.id);
        sessionStorage.setItem('agencyName', selectedTraveler.name);
      } else {
        sessionStorage.setItem('courierId', selectedTraveler.id);
        sessionStorage.setItem('courierName', selectedTraveler.name);
      }

      setShowConfirmation(false);
      router.push('/track');
    } catch (err) {
      console.error('Error assigning delivery:', err);
      alert('Failed to assign delivery. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const byTab =
    tab === 'all' ? travelers : travelers.filter((t) => t.entityType === tab);
  const sorted = sortList(byTab, sort);
  const topPick = sorted[0] || null;
  const rest = sorted.slice(1);

  const tabs = [
    { id: 'all', label: 'All', count: travelers.length },
    {
      id: 'agency',
      label: ' Agencies',
      count: travelers.filter((t) => t.entityType === 'agency').length,
    },
    {
      id: 'courier',
      label: 'Couriers',
      count: travelers.filter((t) => t.entityType === 'courier').length,
    },
  ];

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-red-600 p-4 rounded-2xl bg-red-50 max-w-md w-full text-sm">
          Error loading couriers: {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900&family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      <div
        className="min-h-screen bg-[#f5f3f4]"
        style={{ fontFamily: 'DM Sans, sans-serif' }}
      >
        {/* ── Sticky header ── */}
        <div
          className="bg-white border-b border-gray-100 px-4 pt-5 pb-4 sticky top-0 z-30"
          style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.05)' }}
        >
          <div className="max-w-2xl mx-auto">
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                  Available now
                </p>
                <h1
                  className="text-[22px] font-black text-[#0e0608] leading-tight"
                  style={{ fontFamily: 'Fraunces, Georgia, serif' }}
                >
                  Choose a courier
                </h1>
              </div>
            </div>

            {/* Tab filter */}
            <div className="flex gap-2">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-bold border transition-all ${
                    tab === t.id
                      ? 'bg-[#3A0A21] text-white border-[#3A0A21]'
                      : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="max-w-2xl mx-auto px-4 pt-5 pb-32 space-y-4">
          {loading || restoring ? (
            <Skeleton />
          ) : sorted.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-14 h-14 bg-white rounded-2xl border border-gray-100 flex items-center justify-center mb-3 text-2xl shadow-sm">
                {tab === 'agency' ? '🏢' : tab === 'courier' ? '🏍️' : '📦'}
              </div>
              <p
                className="text-[13px] font-semibold text-gray-500"
                style={{ fontFamily: 'Fraunces, Georgia, serif' }}
              >
                No {tab === 'all' ? 'couriers' : tab + 's'} available right now
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                Try again in a few minutes
              </p>
            </motion.div>
          ) : (
            <>
              {/* Featured top pick */}
              {topPick && (
                <FeaturedCard
                  traveler={topPick}
                  onBook={handleBookTraveler}
                  deliveryReady={!!deliveryId}
                />
              )}

              {/* Other options — sort + list */}
              {rest.length > 0 && (
                <>
                  <div className="flex items-center justify-between pt-1">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      Other options
                    </p>
                    <div className="flex items-center gap-1.5">
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                      {SORTS.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setSort(s.id)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${
                            sort === s.id
                              ? 'bg-[#0e0608] text-white border-[#0e0608]'
                              : 'bg-white text-gray-500 border-gray-200'
                          }`}
                        >
                          <s.icon className="w-3 h-3" />
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {rest.map((traveler, index) => (
                        <motion.div
                          key={traveler.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.97 }}
                          transition={{ delay: index * 0.04, duration: 0.22 }}
                        >
                          <ListCard
                            traveler={traveler}
                            index={index}
                            onBook={handleBookTraveler}
                            deliveryReady={!!deliveryId}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {showConfirmation && (
        <SelectAvailableModal
          traveler={selectedTraveler}
          onCancel={() => setShowConfirmation(false)}
          onConfirm={handleConfirmBooking}
          loading={bookingLoading}
        />
      )}
    </>
  );
};

export default ChooseAvailable;
