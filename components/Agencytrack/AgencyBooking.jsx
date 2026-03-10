// 'use client';
// import { useState, useEffect } from 'react';
// import { Phone, Clock, Ruler } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useAgencyFareCalculator } from '@/hooks/useFareCalculator';
// import { usePackageValidation } from '@/hooks/usePackageValidation';
// import { useBrandColors } from '@/hooks/BrandColors';
// import InputLocation from '@/components/InputLocation';
// import PackageSection from '@/components/PackageAndFare/PackageSection';
// import FareSection from '@/components/PackageAndFare/FareSection';
// import PickupOptions from '@/components/PackageAndFare/PickupOptions';
// import StickyConfirmBar from '@/components/PackageAndFare/StickyConfirmBar';
// import PaymentSection from '@/components/PackageAndFare/PaymentSection';

// function AgencyPriceContactCard() { 
//   const { brandColors } = useBrandColors();
//   return (
//     <section>
//       <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Fare</p>
//       <div
//         className="rounded-2xl border border-dashed bg-gray-50 px-5 py-6 flex gap-4 items-start"
//         style={{ borderColor: `${brandColors.primary}40` }}
//       >
//         <div
//           className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
//           style={{
//             background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.secondary} 100%)`,
//             boxShadow: `0 4px 14px ${brandColors.primary}30`,
//           }}
//         >
//           <Phone className="w-5 h-5 text-white" />
//         </div>
//         <div>
//           <p className="text-sm font-semibold text-gray-900 mb-1">The agency will contact you with the price</p>
//           <p className="text-xs text-gray-500 leading-relaxed">
//             This agency sets pricing manually. After you confirm your booking details, they will reach out to discuss and agree on a fare before your delivery is dispatched.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// }

// function RouteInfoPill({ routeData }) {
//   const { brandColors } = useBrandColors();
//   const formatDuration = (minutes) => {
//     if (minutes < 60) return `${minutes} min`;
//     const h = Math.floor(minutes / 60);
//     const m = minutes % 60;
//     return m === 0 ? `${h} hr${h > 1 ? 's' : ''}` : `${h} hr${h > 1 ? 's' : ''} ${m} min`;
//   };
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -8 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       className="flex items-center gap-3 px-4 py-3 rounded-2xl border"
//       style={{ background: `${brandColors.primary}08`, borderColor: `${brandColors.primary}20` }}
//     >
//       <div
//         className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
//         style={{ background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.secondary} 100%)` }}
//       >
//         <Ruler className="w-4 h-4 text-white" />
//       </div>
//       <div className="flex items-center gap-4 flex-wrap">
//         <div>
//           <p className="text-xs text-gray-500 font-medium">Distance</p>
//           <p className="text-sm font-bold text-gray-900">{routeData.distance} km</p>
//         </div>
//         <div className="w-px h-8 rounded-full" style={{ backgroundColor: `${brandColors.primary}20` }} />
//         <div className="flex items-center gap-1.5">
//           <Clock className="w-4 h-4" style={{ color: brandColors.primary }} />
//           <div>
//             <p className="text-xs text-gray-500 font-medium">Est. time</p>
//             <p className="text-sm font-bold text-gray-900">{formatDuration(routeData.duration)}</p>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// export default function AgencyBookingScreen({ onPackageConfirmed, loading, showPricing = true }) {
//   const { brandColors } = useBrandColors();

//   const [pickup, setPickup] = useState(null);
//   const [dropoff, setDropoff] = useState(null);
//   const [routeData, setRouteData] = useState(null);
//   const [routeReady, setRouteReady] = useState(false);

//   const [packageDetails, setPackageDetails] = useState({
//     size: '',
//     description: '',
//     isFragile: false,
//     pickupTime: 'courier',
//     pickupContact: { pickupContactName: '', pickupPhone: '' },
//     dropoffContact: {
//       dropoffContactName: '',
//       dropoffPhone: '',
//       dropoffInstructions: '',
//       recipientPermission: false,
//     },
//   });

//   const [fareDetails, setFareDetails] = useState({ offeredFare: 0, paymentMethod: '' });

//   const suggestedFare = useAgencyFareCalculator(packageDetails, routeData);
//   const fareFloor = Math.round(suggestedFare * 0.5);
//   const { isValid, errors } = usePackageValidation(packageDetails, fareDetails, fareFloor, showPricing);

//   useEffect(() => {
//     if (!showPricing) return;
//     setFareDetails((prev) => ({
//       ...prev,
//       offeredFare: prev.offeredFare === 0 ? suggestedFare : Math.max(prev.offeredFare, suggestedFare),
//     }));
//   }, [suggestedFare, showPricing]);

//   const handleLocationSelect = (type, location) => {
//     if (type === 'pickup') setPickup(location);
//     else setDropoff(location);
//   };

//   const handleRouteCalculated = (data) => {
//     setRouteData(data);
//     setRouteReady(true);
//   };

//   // ✅ THE FIX: pass pickup, dropoff, routeData as args 3-5
//   const handleConfirm = () => {
//     if (!isValid || !pickup || !dropoff || !routeData) return;
//     onPackageConfirmed(
//       packageDetails,
//       {
//         suggestedFare: showPricing ? suggestedFare : null,
//         offeredFare: showPricing ? fareDetails.offeredFare : null,
//         paymentMethod: fareDetails.paymentMethod,
//       },
//       pickup,
//       dropoff,
//       routeData,
//     );
//   };

//   const deliverySnapshot = {
//     pickup, dropoff, routeData, packageDetails,
//     fareDetails: {
//       suggestedFare: showPricing ? suggestedFare : null,
//       offeredFare: showPricing ? fareDetails.offeredFare : null,
//       paymentMethod: fareDetails.paymentMethod,
//     },
//   };

//   return (
//     <div className="min-h-screen bg-white max-w-md pb-28 md:pb-0 mx-auto">
//       <div className="max-w-3xl mx-auto px-4 py-5 space-y-6">
//         <div
//           className="h-0.5 rounded-full"
//           style={{ background: `linear-gradient(90deg, ${brandColors.primary} 0%, ${brandColors.accent} 50%, ${brandColors.secondary} 100%)` }}
//         />

//         <section className="space-y-3">
//           <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Where to & from</p>
//           <InputLocation
//             onLocationSelect={handleLocationSelect}
//             onRouteCalculated={handleRouteCalculated}
//             pickup={pickup}
//             dropoff={dropoff}
//             onCalculate={() => {}}
//             showNextButton={false}
//           />
//           <AnimatePresence>
//             {routeReady && routeData && <RouteInfoPill routeData={routeData} />}
//           </AnimatePresence>
//         </section>

//         <AnimatePresence>
//           {routeReady && (
//             <motion.div
//               initial={{ opacity: 0, y: 16 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.4, ease: 'easeOut' }}
//               className="space-y-6"
//             >
//               <PackageSection
//                 packageDetails={packageDetails}
//                 onPackageDetailChange={(k, v) => setPackageDetails((p) => ({ ...p, [k]: v }))}
//                 errors={errors}
//               />
//               <PickupOptions
//                 packageDetails={packageDetails}
//                 onPackageDetailChange={(k, v) => setPackageDetails((p) => ({ ...p, [k]: v }))}
//               />
//               {showPricing ? (
//                 <FareSection
//                   fareDetails={fareDetails}
//                   onFareChange={(offeredFare) => setFareDetails((p) => ({ ...p, offeredFare }))}
//                   suggestedFare={suggestedFare}
//                   fareFloor={fareFloor}
//                   errors={errors}
//                 />
//               ) : (
//                 <AgencyPriceContactCard />
//               )}
//               <PaymentSection
//                 paymentMethod={fareDetails.paymentMethod}
//                 onPaymentMethodChange={(method) => setFareDetails((p) => ({ ...p, paymentMethod: method }))}
//                 errors={errors}
//               />
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       <StickyConfirmBar
//         isValid={isValid && routeReady}
//         loading={loading}
//         onConfirm={handleConfirm}
//         fareDetails={fareDetails}
//         deliverySnapshot={deliverySnapshot}
//       />
//     </div>
//   );
// }