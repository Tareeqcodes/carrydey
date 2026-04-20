'use client';
import { useState, useRef } from 'react';
import {
  CheckCircle,
  XCircle,
  Search,
  History as HistoryIcon,
  FileText,
  Download,
  X,
  Printer,
  Package,
  MapPin,
  User,
  Phone,
  Calendar,
  Hash,
  Truck,
} from 'lucide-react';
import { formatNairaSimple } from '@/hooks/currency';

const WaybillModal = ({ delivery, onClose }) => {
  const printRef = useRef();

  const waybillNo =
    delivery.orderRef || delivery.$id?.slice(-8).toUpperCase() || 'CRD-000000';

  const formattedDate = new Date(
    delivery.$createdAt || delivery.createdAt
  ).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const fare =
    delivery.payout || delivery.offeredFare || delivery.suggestedFare || 0;

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open('', '_blank');
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Waybill ${waybillNo}</title>
          <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'DM Sans', sans-serif; background: #fff; color: #000; }
            .wb-print { max-width: 600px; margin: 0 auto; border: 1.5px solid #e5e5e5; }
            .wb-header { background: #000; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; }
            .wb-logo { font-size: 22px; font-weight: 600; color: #fff; letter-spacing: -0.5px; }
            .wb-logo span { color: #00C896; }
            .wb-wno { text-align: right; }
            .wb-wno p { font-size: 10px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 2px; }
            .wb-wno strong { font-size: 14px; color: #fff; }
            .wb-band { background: #00C896; padding: 6px 24px; display: flex; justify-content: space-between; align-items: center; }
            .wb-band span { font-size: 11px; color: #000; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }
            .wb-status { background: rgba(0,0,0,0.15); color: #000; font-size: 11px; font-weight: 600; padding: 2px 10px; border-radius: 20px; }
            .wb-body { padding: 20px 24px; }
            .wb-parties { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
            .wb-party { background: #f7f7f7; border-radius: 8px; padding: 12px; }
            .wb-plabel { font-size: 9px; font-weight: 600; color: #00C896; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; }
            .wb-pname { font-size: 13px; font-weight: 600; color: #000; margin-bottom: 3px; }
            .wb-pdetail { font-size: 11px; color: #555; line-height: 1.5; }
            .wb-meta { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 16px; }
            .wb-meta-item { background: #f7f7f7; border-radius: 8px; padding: 10px; }
            .wb-mlabel { font-size: 9px; color: #888; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 3px; }
            .wb-mval { font-size: 12px; font-weight: 600; color: #000; }
            .wb-route { background: #f7f7f7; border-radius: 8px; padding: 14px; margin-bottom: 16px; display: flex; gap: 12px; align-items: stretch; }
            .wb-route-line { display: flex; flex-direction: column; align-items: center; gap: 0; }
            .wb-dot { width: 8px; height: 8px; border-radius: 50%; background: #000; flex-shrink: 0; }
            .wb-line { width: 2px; flex: 1; background: #00C896; min-height: 24px; }
            .wb-arrowdot { width: 8px; height: 8px; border-radius: 50%; background: #00C896; flex-shrink: 0; }
            .wb-route-points { flex: 1; display: flex; flex-direction: column; gap: 16px; }
            .wb-rlabel { font-size: 9px; color: #888; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 2px; }
            .wb-raddr { font-size: 12px; font-weight: 600; color: #000; }
            .wb-rcity { font-size: 11px; color: #555; }
            .wb-pkg { display: flex; gap: 8px; margin-bottom: 0; }
            .wb-pkg-item { flex: 1; background: #f7f7f7; border-radius: 8px; padding: 10px; }
            .wb-footer { border-top: 1.5px solid #e5e5e5; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; }
            .wb-fare-label { font-size: 9px; color: #888; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 3px; }
            .wb-fare-val { font-size: 26px; font-weight: 700; color: #000; }
            .wb-courier { text-align: right; }
            .wb-clabel { font-size: 9px; color: #888; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 3px; }
            .wb-cname { font-size: 13px; font-weight: 600; color: #000; }
            .wb-cphone { font-size: 11px; color: #555; }
            .wb-barcode { display: flex; flex-direction: column; align-items: center; gap: 4px; }
            .wb-bars { display: flex; gap: 2px; align-items: flex-end; height: 28px; }
            .wb-bar { background: #000; border-radius: 1px; }
            .wb-bartext { font-size: 9px; color: #888; letter-spacing: 0.1em; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
      win.close();
    }, 300);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-black w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-black/10 dark:border-white/10 shadow-2xl">
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/10 dark:border-white/10">
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-black dark:bg-white text-white dark:text-black hover:opacity-80 transition-opacity"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4 text-black dark:text-white" />
            </button>
          </div>
        </div>

        {/* Waybill content */}
        <div ref={printRef}>
          <div className="wb-print">
            
            

            {/* Body */}
            <div style={{ padding: '20px 24px' }}>
              {/* Parties */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    background: '#f7f7f7',
                    borderRadius: 8,
                    padding: 12,
                  }}
                >
                  <p
                    style={{
                      fontSize: 9,
                      fontWeight: 600,
                      color: '#00C896',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: 6,
                    }}
                  >
                    Sender
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#000',
                      marginBottom: 3,
                    }}
                  >
                    {delivery.customerName || 'N/A'}
                  </p>
                  <p style={{ fontSize: 11, color: '#555', lineHeight: 1.5 }}>
                    {delivery.senderPhone || ''}
                  </p>
                  <p style={{ fontSize: 11, color: '#555', lineHeight: 1.5 }}>
                    {delivery.pickupAddress}
                  </p>
                </div>
                <div
                  style={{
                    background: '#f7f7f7',
                    borderRadius: 8,
                    padding: 12,
                  }}
                >
                  <p
                    style={{
                      fontSize: 9,
                      fontWeight: 600,
                      color: '#00C896',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: 6,
                    }}
                  >
                    Recipient
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#000',
                      marginBottom: 3,
                    }}
                  >
                    {delivery.recipientName || 'N/A'}
                  </p>
                  <p style={{ fontSize: 11, color: '#555', lineHeight: 1.5 }}>
                    {delivery.recipientPhone || ''}
                  </p>
                  <p style={{ fontSize: 11, color: '#555', lineHeight: 1.5 }}>
                    {delivery.dropoffAddress}
                  </p>
                </div>
              </div>

              {/* Meta */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4,1fr)',
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                {[
                  { label: 'Order ref', value: delivery.orderRef || '—' },
                  { label: 'Type', value: delivery.deliveryType || 'Standard' },
                  { label: 'Payment', value: delivery.paymentMethod || 'Cash' },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    style={{
                      background: '#f7f7f7',
                      borderRadius: 8,
                      padding: 10,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 9,
                        color: '#888',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        marginBottom: 3,
                      }}
                    >
                      {label}
                    </p>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#000' }}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Route */}
              <div
                style={{
                  background: '#f7f7f7',
                  borderRadius: 8,
                  padding: 14,
                  marginBottom: 16,
                  display: 'flex',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#000',
                      flexShrink: 0,
                    }}
                  />
                  <div
                    style={{
                      width: 2,
                      flex: 1,
                      minHeight: 24,
                      background: '#00C896',
                      margin: '2px 0',
                    }}
                  />
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#00C896',
                      flexShrink: 0,
                    }}
                  />
                </div>
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: 9,
                        color: '#888',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        marginBottom: 2,
                      }}
                    >
                      Pickup
                    </p>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#000' }}>
                      {delivery.pickupAddress}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 9,
                        color: '#888',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        marginBottom: 2,
                      }}
                    >
                      Dropoff
                    </p>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#000' }}>
                      {delivery.dropoffAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Package */}
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { label: 'Date', value: formattedDate },
                  { label: 'Package', value: delivery.packageSize || 'Medium' },
                  
                  {
                    label: 'Fragile',
                    value: delivery.isFragile ? 'Yes' : 'No',
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    style={{
                      flex: 1,
                      background: '#f7f7f7',
                      borderRadius: 8,
                      padding: 10,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 9,
                        color: '#888',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        marginBottom: 3,
                      }}
                    >
                      {label}
                    </p>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#000' }}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                borderTop: '1.5px solid #e5e5e5',
                padding: '16px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 9,
                    color: '#888',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: 3,
                  }}
                >
                  Total fare
                </p>
                <p style={{ fontSize: 26, fontWeight: 700, color: '#000' }}>
                  {formatNairaSimple(fare)}
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: 2,
                    alignItems: 'flex-end',
                    height: 28,
                  }}
                >
                  {[24, 16, 24, 18, 24, 14, 24, 20, 24, 18, 24, 22].map(
                    (h, i) => (
                      <div
                        key={i}
                        style={{
                          width: i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1,
                          height: h,
                          background: '#000',
                          borderRadius: 1,
                        }}
                      />
                    )
                  )}
                </div>
                <p
                  style={{ fontSize: 9, color: '#888', letterSpacing: '0.1em' }}
                >
                  {waybillNo}
                </p>
              </div>
              {delivery.driverName && (
                <div style={{ textAlign: 'right' }}>
                  <p
                    style={{
                      fontSize: 9,
                      color: '#888',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      marginBottom: 3,
                    }}
                  >
                    Courier
                  </p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#000' }}>
                    {delivery.driverName}
                  </p>
                  {delivery.driverPhone && (
                    <p style={{ fontSize: 11, color: '#555' }}>
                      {delivery.driverPhone}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const exportToCSV = (deliveries) => {
  const headers = [
    'Waybill No',
    'Date',
    'Status',
    'Sender',
    'Sender Phone',
    'Recipient',
    'Recipient Phone',
    'Pickup Address',
    'Dropoff Address',
    'Courier',
    'Package Size',
    'Fare (₦)',
    'Payment Method',
    'Order Ref',
  ];

  const rows = deliveries.map((d) => [
    d.orderRef || d.$id?.slice(-8).toUpperCase() || '',
    new Date(d.$createdAt || d.createdAt).toLocaleDateString('en-NG'),
    d.status,
    d.customerName || '',
    d.senderPhone || '',
    d.recipientName || '',
    d.recipientPhone || '',
    `"${(d.pickupAddress || '').replace(/"/g, '""')}"`,
    `"${(d.dropoffAddress || '').replace(/"/g, '""')}"`,
    d.driverName || '',
    d.packageSize || '',
    d.payout || d.offeredFare || d.suggestedFare || 0,
    d.paymentMethod || '',
    d.orderRef || '',
  ]);

  const csvContent = [headers, ...rows].map((r) => r.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `carrydey-history-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// ─── Delivery Card ────────────────────────────────────────────────────────────
const DeliveryHistoryCard = ({ delivery, onViewWaybill }) => {
  const fare =
    delivery.payout || delivery.offeredFare || delivery.suggestedFare || 0;

  const isDelivered = delivery.status === 'delivered';

  return (
    <div className="group bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-xl p-4 hover:border-[#00C896]/40 hover:shadow-md transition-all duration-200 flex flex-col gap-3">
      {/* Top row */}
      <div className="flex items-center justify-between">
        {isDelivered ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#00C896]/10 text-[#00C896]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00C896]" />
            Delivered
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-black/5 dark:bg-white/10 text-black/50 dark:text-white/50">
            <div className="w-1.5 h-1.5 rounded-full bg-black/30 dark:bg-white/30" />
            Cancelled
          </span>
        )}
        <time className="text-xs text-black/40 dark:text-white/40 font-mono">
          {new Date(
            delivery.$createdAt || delivery.createdAt
          ).toLocaleDateString('en-NG', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </time>
      </div>

      {/* Route */}
      <div className="flex gap-3">
        <div className="flex flex-col items-center pt-1 gap-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white flex-shrink-0" />
          <div className="w-px flex-1 min-h-[18px] bg-[#00C896]/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#00C896] flex-shrink-0" />
        </div>
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <div>
            <p className="text-[9px] uppercase tracking-wider text-black/40 dark:text-white/40 font-medium mb-0.5">
              Pickup
            </p>
            <p className="text-[11px] text-black dark:text-white leading-snug truncate">
              {delivery.pickupAddress}
            </p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-wider text-black/40 dark:text-white/40 font-medium mb-0.5">
              Dropoff
            </p>
            <p className="text-[11px] text-black dark:text-white leading-snug truncate">
              {delivery.dropoffAddress}
            </p>
          </div>
        </div>
      </div>

      {/* Courier */}
      {delivery.driverName && (
        <div className="flex items-center gap-2 p-2.5 bg-black/5 dark:bg-white/5 rounded-lg">
          <Truck className="w-3.5 h-3.5 text-[#00C896] flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-wider text-black/40 dark:text-white/40 font-medium">
              Courier
            </p>
            <p className="text-xs font-medium text-black dark:text-white truncate">
              {delivery.driverName}
            </p>
          </div>
        </div>
      )}

      {/* Package + Fare */}
      <div className="flex items-center gap-2">
        <div className="flex-1 text-center p-2 rounded-lg bg-black/5 dark:bg-white/5">
          <p className="text-[9px] uppercase tracking-wider text-black/40 dark:text-white/40 font-medium mb-0.5">
            Package
          </p>
          <p className="text-xs font-semibold text-black dark:text-white">
            {delivery.packageSize || 'Medium'}
          </p>
        </div>
        <div
          className={`flex-1 text-center p-2 rounded-lg ${isDelivered ? 'bg-[#00C896]/10' : 'bg-black/5 dark:bg-white/5'}`}
        >
          <p className="text-[9px] uppercase tracking-wider text-black/40 dark:text-white/40 font-medium mb-0.5">
            Fare
          </p>
          <p
            className={`text-xs font-bold ${isDelivered ? 'text-[#00C896]' : 'text-black/40 dark:text-white/40'}`}
          >
            {formatNairaSimple(fare)}
          </p>
        </div>
      </div>

      {/* Waybill CTA */}
      <button
        onClick={() => onViewWaybill(delivery)}
        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-black/10 dark:border-white/10 hover:border-[#00C896]/50 hover:bg-[#00C896]/5 transition-all text-xs font-medium text-black/60 dark:text-white/60 hover:text-[#00C896]"
      >
        <FileText className="w-3.5 h-3.5" />
        View Receipt
      </button>
    </div>
  );
};

const DeliveryHistory = ({ completedDeliveries, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [activeWaybill, setActiveWaybill] = useState(null);

  const getFilteredDeliveries = () => {
    let filtered = completedDeliveries;

    if (filterStatus === 'delivered')
      filtered = filtered.filter((d) => d.status === 'delivered');
    else if (filterStatus === 'cancelled')
      filtered = filtered.filter((d) => d.status === 'cancelled');

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.pickupAddress?.toLowerCase().includes(q) ||
          d.dropoffAddress?.toLowerCase().includes(q) ||
          d.driverName?.toLowerCase().includes(q) ||
          d.customerName?.toLowerCase().includes(q) ||
          d.recipientName?.toLowerCase().includes(q) ||
          d.orderRef?.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'recent':
        filtered = [...filtered].sort(
          (a, b) =>
            new Date(b.$createdAt || b.createdAt) -
            new Date(a.$createdAt || a.createdAt)
        );
        break;
      case 'oldest':
        filtered = [...filtered].sort(
          (a, b) =>
            new Date(a.$createdAt || a.createdAt) -
            new Date(b.$createdAt || b.createdAt)
        );
        break;
      case 'highest':
        filtered = [...filtered].sort(
          (a, b) =>
            (b.payout || b.offeredFare || b.suggestedFare || 0) -
            (a.payout || a.offeredFare || a.suggestedFare || 0)
        );
        break;
      case 'lowest':
        filtered = [...filtered].sort(
          (a, b) =>
            (a.payout || a.offeredFare || a.suggestedFare || 0) -
            (b.payout || b.offeredFare || b.suggestedFare || 0)
        );
        break;
    }
    return filtered;
  };

  const filteredDeliveries = getFilteredDeliveries();

  const totalDelivered = completedDeliveries.filter(
    (d) => d.status === 'delivered'
  ).length;
  const totalCancelled = completedDeliveries.filter(
    (d) => d.status === 'cancelled'
  ).length;
  const totalRevenue = completedDeliveries
    .filter((d) => d.status === 'delivered')
    .reduce(
      (sum, d) => sum + (d.payout || d.offeredFare || d.suggestedFare || 0),
      0
    );

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-black dark:text-white tracking-tight">
            Delivery History
          </h1>
          {completedDeliveries.length > 0 && (
            <button
              onClick={() => exportToCSV(filteredDeliveries)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black text-xs font-semibold hover:opacity-80 transition-opacity"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white dark:bg-black rounded-xl p-4 border border-black/10 dark:border-white/10 hover:border-[#00C896]/30 transition-all">
            <div className="w-8 h-8 rounded-lg bg-[#00C896]/10 flex items-center justify-center mb-2">
              <CheckCircle className="w-4 h-4 text-[#00C896]" />
            </div>
            <p className="text-2xl font-bold text-black dark:text-white mb-0.5">
              {totalDelivered}
            </p>
            <p className="text-xs text-black/50 dark:text-white/50">
              Delivered
            </p>
          </div>

          <div className="bg-white dark:bg-black rounded-xl p-4 border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 transition-all">
            <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/10 flex items-center justify-center mb-2">
              <XCircle className="w-4 h-4 text-black/40 dark:text-white/40" />
            </div>
            <p className="text-2xl font-bold text-black dark:text-white mb-0.5">
              {totalCancelled}
            </p>
            <p className="text-xs text-black/50 dark:text-white/50">
              Cancelled
            </p>
          </div>

          <div className="bg-white dark:bg-black rounded-xl p-4 border border-[#00C896]/20 hover:border-[#00C896]/40 transition-all">
            <div className="w-8 h-8 rounded-lg bg-[#00C896]/10 flex items-center justify-center mb-2">
              <Hash className="w-4 h-4 text-[#00C896]" />
            </div>
            <p className="text-lg font-bold text-black dark:text-white mb-0.5 truncate">
              {formatNairaSimple(totalRevenue)}
            </p>
            <p className="text-xs text-black/50 dark:text-white/50">
              Total revenue
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-black rounded-xl p-3 border border-black/10 dark:border-white/10 mb-5">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40 dark:text-white/40" />
              <input
                type="text"
                placeholder="Search by address, courier, name, ref..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-black/5 dark:bg-white/5 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C896] text-sm text-black dark:text-white placeholder-black/30 dark:placeholder-white/30"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-black/5 dark:bg-white/5 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C896] text-sm font-medium text-black dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-black/5 dark:bg-white/5 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C896] text-sm font-medium text-black dark:text-white"
              >
                <option value="recent">Recent First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Fare</option>
                <option value="lowest">Lowest Fare</option>
              </select>
            </div>
          </div>

          {(searchTerm || filterStatus !== 'all') && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-black/10 dark:border-white/10">
              <p className="text-xs text-black/60 dark:text-white/60">
                <span className="font-semibold text-black dark:text-white">
                  {filteredDeliveries.length}
                </span>{' '}
                of {completedDeliveries.length} deliveries
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                }}
                className="text-xs font-medium text-[#00C896] hover:opacity-70 transition-opacity"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-black/10 dark:border-white/10 border-t-[#00C896] rounded-full animate-spin" />
          </div>
        ) : filteredDeliveries.length === 0 ? (
          <div className="bg-white dark:bg-black rounded-xl p-12 text-center border border-black/10 dark:border-white/10">
            <div className="w-14 h-14 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center mx-auto mb-3">
              <HistoryIcon className="w-7 h-7 text-black/30 dark:text-white/30" />
            </div>
            <h3 className="text-lg font-bold text-black dark:text-white mb-1">
              {searchTerm || filterStatus !== 'all'
                ? 'No results found'
                : 'No history yet'}
            </h3>
            <p className="text-sm text-black/50 dark:text-white/50 max-w-sm mx-auto">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your filters or search terms'
                : 'Your completed deliveries will appear here'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredDeliveries.map((delivery) => (
              <DeliveryHistoryCard
                key={delivery.$id || delivery.id}
                delivery={delivery}
                onViewWaybill={setActiveWaybill}
              />
            ))}
          </div>
        )}
      </div>

      {/* Waybill Modal */}
      {activeWaybill && (
        <WaybillModal
          delivery={activeWaybill}
          onClose={() => setActiveWaybill(null)}
        />
      )}
    </div>
  );
};

export default DeliveryHistory;
