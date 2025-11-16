'use client';
import React from 'react';

export default function TermsPage() {
  const sections = [
    {
      title: "1. Agreement",
      content: `These Terms govern your access to and use of Carrydey's platform. "Users" includes senders, travelers, and registered companies. By using our service you agree to these Terms and any policies referenced (Privacy Policy, Escrow Policy).`
    },
    {
      title: "2. Eligibility",
      content: `You must be 18+ and eligible to form binding contracts under Nigerian law. You must provide accurate information and keep your account up to date.`
    },
    {
      title: "3. Accounts & Verification",
      list: [
        "You are responsible for maintaining a secure account.",
        "Carrydey may require identity verification (NIN, BVN, driver's licence, selfie). Verified status is at our discretion.",
        "False information may lead to account suspension."
      ]
    },
    {
      title: "4. Roles & Relationships",
      content: `Carrydey acts as a technology platform connecting senders and travelers. We are not the carrier of goods (unless explicitly stated). The traveler is an independent agent selected by the sender. Carrydey does not assume responsibility for the physical goods beyond the escrow and dispute procedures defined below.`
    },
    {
      title: "5. Posting & Accepting Requests",
      subsections: [
        {
          subtitle: "Senders:",
          text: "Shall provide honest and accurate package descriptions and select travelers thoughtfully. Packages with prohibited items are not allowed (see Prohibited Items)."
        },
        {
          subtitle: "Travelers:",
          text: "Shall ensure they have capacity and ability to deliver safely and on time. Travelers must follow instructions and comply with laws and transport rules."
        }
      ]
    },
    {
      title: "6. Escrow & Payments",
      list: [
        "Senders must fund the delivery fee into escrow before pickup (unless special cases apply). Carrydey uses Paystack to collect and settle funds.",
        "Funds are released to the traveler after the sender confirms delivery or after resolution of a dispute as described in the Escrow Policy."
      ]
    },
    {
      title: "7. Delivery, Proof & Confirmation",
      subsections: [
        {
          subtitle: "Pickup:",
          text: "Traveler must provide proof of collection (photo + GPS) where applicable."
        },
        {
          subtitle: "Delivery:",
          text: "Traveler must upload proof (photo, recipient name, OTP or signature). Recipient confirmation may be required."
        },
        {
          subtitle: "Auto-release:",
          text: "If sender does not confirm within X days (configurable; e.g., 3 days) and proof is present, funds may auto-release per Escrow Policy."
        }
      ]
    },
    {
      title: "8. Prohibited Items",
      content: `Users may not use Carrydey to transport illegal, hazardous, or restricted items including but not limited to: weapons, illicit drugs, flammable liquids, stolen property, perishable biological materials, or any items restricted by law.`
    },
    {
      title: "9. Cancellations & Refunds",
      content: `Cancellations are governed by the Escrow & Refund Policy. Early cancellations before pickup may result in partial or full refund depending on timing & fees.`
    },
    {
      title: "10. Liability & Disclaimer",
      list: [
        "To the maximum extent permitted by law, Carrydey's liability is limited to direct proven losses caused by our gross negligence. We are not liable for indirect, incidental, or consequential losses.",
        "We do not guarantee delivery times — times are estimates and depend on traveler availability & route.",
        "Travelers are responsible for any damage or loss during their custody unless proven otherwise and covered by insurance or the dispute resolution outcome."
      ]
    },
    {
      title: "11. Insurance",
      content: `Carrydey encourages senders to declare high-value items and purchase optional parcel insurance via our partner providers. Insurance terms are agreed separately.`
    },
    {
      title: "12. Ratings & Conduct",
      content: `Users shall behave respectfully. Abuse, harassment, threats, or illegal acts may result in account suspension. Ratings are used to maintain service quality.`
    },
    {
      title: "13. Dispute Resolution",
      content: `First: contact support via the app or support@carrydey.com. If unresolved, disputes may be escalated through our internal dispute resolution process. For legal matters, Nigerian law applies and disputes shall be resolved in Nigerian courts.`
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms & Conditions</h1>
          <p className="text-sm text-gray-600">Carrydey Technologies</p>
          <p className="text-sm text-gray-600">Effective date: November 2025</p>
        </div>

        {/* Introduction Notice */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6 rounded-r-lg">
          <p className="text-sm text-gray-700">
            By using Carrydey's platform, you agree to be bound by these Terms & Conditions. 
            Please read them carefully before using our services.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <section key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                {section.title}
              </h2>
              
              {section.content && (
                <p className="text-gray-700 leading-relaxed">
                  {section.content}
                </p>
              )}
              
              {section.list && (
                <ul className="space-y-2">
                  {section.list.map((item, i) => (
                    <li key={i} className="text-gray-700 leading-relaxed flex">
                      <span className="text-blue-600 mr-2 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.subsections && (
                <div className="space-y-3">
                  {section.subsections.map((sub, i) => (
                    <div key={i}>
                      <p className="font-medium text-gray-900 mb-1">{sub.subtitle}</p>
                      <p className="text-gray-700 leading-relaxed ml-4">{sub.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Important Notice */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
            <span className="text-amber-600 mr-2">⚠️</span>
            Important Notice
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            These Terms & Conditions constitute a legally binding agreement. By creating an account 
            or using Carrydey's services, you acknowledge that you have read, understood, and agree 
            to be bound by these terms.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Questions about these Terms & Conditions?
          </p>
          <a 
            href="mailto:support@carrydey.tech" 
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            support@carrydey.tech
          </a>
          <p className="text-xs text-gray-500 mt-4">
            Carrydey Technologies • Registered in Nigeria
          </p>
        </div>
      </div>
    </main>
  );
}