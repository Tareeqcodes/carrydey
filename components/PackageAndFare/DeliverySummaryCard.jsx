'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, ChevronRight, CheckCircle2 } from 'lucide-react';
import PickupDetailsModal from '@/components/PickupDetailsModal';
import DropoffDetailsModal from '@/components/DropoffDetailsModal';
import { useUserRole } from '@/hooks/useUserRole';
import { useBrandColors } from '@/hooks/BrandColors';

export default function DeliverySummaryCard({
  delivery,
  pickupContact,
  dropoffContact,
  onPickupContactChange,
  onDropoffContactChange,
}) {
  const { brandColors } = useBrandColors();
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [showDropoffModal, setShowDropoffModal] = useState(false);
  const { userData } = useUserRole();

  const handlePickupSave = (contactDetails) => {
    onPickupContactChange(contactDetails);
    setShowPickupModal(false);
  };
  const handleDropoffSave = (contactDetails) => {
    onDropoffContactChange(contactDetails);
    setShowDropoffModal(false);
  };

  const pickupDone = !!pickupContact?.pickupContactName;
  const dropoffDone = !!dropoffContact?.dropoffContactName;

  return (
    <>
      <div className="rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden bg-black/5 dark:bg-white/5 backdrop-blur-sm">
        <ContactRow
          type="pickup"
          isDone={pickupDone}
          contactName={pickupContact?.pickupContactName}
          contactPhone={pickupContact?.pickupPhone}
          address={delivery?.pickup?.place_name}
          brandColors={brandColors}
          onClick={() => setShowPickupModal(true)}
        />
        <div className="relative flex items-center px-4 py-0">
          <div className="absolute left-[27px] top-0 bottom-0 w-px bg-black/10 dark:bg-white/10" />
          <div className="w-full h-px bg-black/5 dark:bg-white/5" />
        </div>
        <ContactRow
          type="dropoff"
          isDone={dropoffDone}
          contactName={dropoffContact?.dropoffContactName}
          contactPhone={dropoffContact?.dropoffPhone}
          address={delivery?.dropoff?.place_name}
          brandColors={brandColors}
          onClick={() => setShowDropoffModal(true)}
        />
      </div>

      <PickupDetailsModal
        isOpen={showPickupModal}
        onClose={() => setShowPickupModal(false)}
        delivery={delivery}
        userData={userData}
        initialData={pickupContact}
        onSave={handlePickupSave}
      />
      <DropoffDetailsModal
        isOpen={showDropoffModal}
        onClose={() => setShowDropoffModal(false)}
        delivery={delivery}
        initialData={dropoffContact}
        onSave={handleDropoffSave}
      />
    </>
  );
}

function ContactRow({
  type,
  isDone,
  contactName,
  contactPhone,
  address,
  brandColors,
  onClick,
}) {
  const isPickup = type === 'pickup';
  const dotColor = isPickup ? '#10b981' : '#ef4444';

  return (
    <motion.button
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10"
    >
      <div className="flex-shrink-0 flex flex-col items-center">
        <span
          className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
          style={{ backgroundColor: dotColor }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-[11px] font-semibold text-black/40 dark:text-white/40 uppercase tracking-wider">
            {isPickup ? 'Pickup' : 'Dropoff'}
          </p>
          {isDone && (
            <CheckCircle2
              className="w-3 h-3 flex-shrink-0"
              style={{ color: '#10b981' }}
            />
          )}
        </div>

        {isDone ? (
          <div className="mt-0.5">
            <p className="text-sm font-semibold text-black dark:text-white truncate">
              {contactName}
            </p>
            {contactPhone && (
              <p className="text-xs text-black/40 dark:text-white/40 truncate">
                {contactPhone}
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm font-semibold mt-0.5 text-[#00C896]">
            Add contact details
          </p>
        )}
      </div>

      <div className="flex-shrink-0">
        {isDone ? (
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(16,185,129,0.1)' }}
          >
            <UserCircle className="w-4 h-4 text-emerald-500" />
          </div>
        ) : (
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,200,150,0.1)' }}
          >
            <ChevronRight className="w-4 h-4 text-[#00C896]" />
          </div>
        )}
      </div>
    </motion.button>
  );
}
