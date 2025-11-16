'use client';
import React from 'react';

export default function EscrowPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dispute & Refund Policy
          </h1>
          <p className="text-lg text-gray-600">Carrydey Technologies</p>
        </div>

        {/* Goal Section */}
        <div className="bg-green-50 border-l-4 border-green-600 p-5 mb-6 rounded-r-lg">
          <p className="text-gray-700">
            We aim to resolve disputes fairly and promptly. Below is a summary
            of eligibility, required information, and the resolution timeline.
          </p>
        </div>
        
        {/* Escrow Flow */}
        <section className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Escrow Flow
          </h2>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Funding</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  After a sender accepts a traveler (or traveler accepts a
                  sender), the sender funds the delivery fee via Paystack. Funds
                  are held in escrow.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Pickup</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Traveler can only mark "Collected" once escrow is funded.
                  Proof of pickup (photo + GPS) is recommended.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Delivery Confirmation
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Traveler marks "Delivered" and uploads proof (photo of package
                  at drop-off, recipient name, OTP). Sender receives
                  notification and may confirm within 72 hours.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                4
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Release</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  On sender confirmation, escrow releases funds to traveler. If
                  sender does not respond in 72 hours and valid proof is
                  present, funds may auto-release.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                5
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Disputes</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  If the sender disputes, funds remain in escrow while evidence
                  is collected. Carrydey investigates and decides based on
                  evidence. Resolutions include full release, partial refund, or
                  full refund.
                </p>
              </div>
            </div>

            {/* Step 6 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                6
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Timeout & Refunds
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  If the traveler fails to pick up within an agreed time or
                  cancels before pickup, the sender may request a refund.
                  Cancellation after pickup is handled case-by-case; funds may
                  be partially refunded depending on proof.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Fees & Chargebacks */}
        <section className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Fees & Chargebacks
          </h2>
          <ul className="space-y-2">
            <li className="text-gray-700 leading-relaxed flex">
              <span className="text-blue-600 mr-2">•</span>
              <span>
                Payment processor fees (Paystack) are non-refundable and may be
                deducted from refunds where applicable.
              </span>
            </li>
            <li className="text-gray-700 leading-relaxed flex">
              <span className="text-blue-600 mr-2">•</span>
              <span>
                Carrydey may charge a small administrative fee for dispute
                resolution or after repeated abuse.
              </span>
            </li>
          </ul>
        </section>

        {/* High-Value Items */}
        <section className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            High-Value Items
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Senders must declare items above a specified threshold (e.g.,
            ₦50,000). Such items may require additional verification, traveler
            deposits, or insurance and may not be accepted by all travelers.
          </p>
        </section>

        {/* How to File a Dispute */}
        <section className="bg-blue-50 rounded-lg border border-blue-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
            <span className="text-blue-600 mr-2">📋</span>
            How to File a Dispute
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Use the <span className="font-semibold">"Report an issue"</span>{' '}
            flow in the app with supporting evidence (photos, messages, OTPs).
          </p>
          <div className="bg-white rounded-lg p-4 border border-blue-300">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-blue-700">
                Response time:
              </span>{' '}
              We aim to respond within 72 hours for urgent cases.
            </p>
          </div>
        </section>
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Questions about escrow or refunds? Contact us at{' '}
            <a
              href="mailto:support@carrydey.tech"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              support@carrydey.tech
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
