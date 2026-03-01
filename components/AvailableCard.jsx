'use client';
import { MapPin, Star, CheckCircle, Clock, Bike, Building2, Package } from 'lucide-react';

const AvailableCard = ({ traveler, index, isSelected, onSelect, onBook, deliveryReady }) => {
  const isAgency  = traveler.entityType === 'agency';
  const accentColor = isAgency ? '#3A0A21' : '#FF6B35';

  return (
    <div
      onClick={() => onSelect(traveler)}
      className={`bg-white rounded-2xl border-2 transition-all duration-200 overflow-hidden cursor-pointer relative
        ${isSelected ? 'border-[#3A0A21] shadow-md' : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'}`}
    >
      {/* ── Top colour strip per type ───────────────────────────────── */}
      <div
        className="h-1 w-full"
        style={{ background: accentColor }}
      />

      <div className="p-4">
        {/* ── Top row ─────────────────────────────────────────────── */}
        <div className="flex items-start gap-3 mb-3">

          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src={traveler.avatar}
              alt={traveler.name}
              className="w-11 h-11 rounded-xl bg-gray-100 object-cover"
            />
            {/* Type icon badge */}
            <div
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white"
              style={{ background: accentColor }}
            >
              {isAgency
                ? <Building2 size={9} className="text-white" />
                : <Bike size={9} className="text-white" />
              }
            </div>
          </div>

          {/* Name + type */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="text-[14px] font-bold text-[#1a1a1a] truncate">{traveler.name}</p>
              {traveler.verified && (
                <CheckCircle size={13} className="text-blue-500 flex-shrink-0" fill="currentColor" />
              )}
            </div>
            {/* Type pill */}
            <span
              className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5"
              style={{ background: accentColor + '15', color: accentColor }}
            >
              {isAgency ? '🏢 Agency' : '🏍️ Independent Courier'}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star size={12} className="text-yellow-400" fill="currentColor" />
            <span className="text-[12px] font-bold text-[#1a1a1a]">{traveler.rating}</span>
          </div>
        </div>

        {/* ── Stats row ───────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <div className="flex items-center gap-1">
            <Package size={11} className="text-gray-400" />
            <span className="text-[11px] text-gray-500">{traveler.totalDeliveries} deliveries</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={11} className="text-gray-400" />
            <span className="text-[11px] text-gray-500">{traveler.distance} km away</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={11} className="text-gray-400" />
            <span className="text-[11px] text-gray-500">~{traveler.pickupTime} min pickup</span>
          </div>
        </div>

        {/* ── Covers row ──────────────────────────────────────────── */}
        <div className="flex items-center gap-1.5 mb-4">
          <span className="text-[10px] text-gray-400 font-medium">Covers:</span>
          <span className="text-[11px] font-semibold text-[#1a1a1a]">{traveler.route}</span>
        </div>

        {/* ── Vehicle types ───────────────────────────────────────── */}
        {traveler.vehicleTypes?.length > 0 && (
          <div className="flex gap-1.5 mb-4 flex-wrap">
            {traveler.vehicleTypes.slice(0, 3).map((v) => (
              <span key={v} className="text-[10px] bg-gray-50 border border-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                {v}
              </span>
            ))}
          </div>
        )}

        {/* ── Book button ─────────────────────────────────────────── */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBook(traveler);
          }}
          disabled={!deliveryReady}
          className="w-full py-3 rounded-xl text-[13px] font-bold transition-all duration-150 active:scale-98 disabled:cursor-not-allowed"
          style={{
            background:  deliveryReady ? accentColor : '#e5e7eb',
            color:       deliveryReady ? 'white' : '#9ca3af',
          }}
        >
          {deliveryReady ? `Book ${isAgency ? 'Agency' : 'Courier'}` : 'Preparing…'}
        </button>
      </div>

      {/* Best pick badge */}
      {index === 0 && (
        <div className="absolute top-3 right-3 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
          Top pick
        </div>
      )}
    </div>
  );
};

export default AvailableCard;