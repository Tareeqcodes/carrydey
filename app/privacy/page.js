'use client';
import React from 'react';

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Introduction",
      content: `Carrydey Technologies ("Carrydey", "we", "us", "our") operates a peer-to-peer delivery platform that connects senders and travelers for intercity parcel delivery. This Privacy Policy explains what personal data we collect, why we collect it, how we use it, and the choices you have. We operate in Nigeria and comply with applicable privacy laws, including the Nigerian Data Protection Regulation (NDPR).`
    },
    {
      title: "2. Scope & Acceptance",
      content: `By registering for or using the Carrydey platform (website, mobile apps, or related services) you accept the practices described in this policy. If you don't agree, please do not use our services.`
    },
    {
      title: "3. What We Collect",
      content: `We collect personal data required to provide safe, lawful, and secure delivery services. Data categories include:`,
      list: [
        "Account & identity data: name, email, phone number, profile photo, NIN number or slip, government ID (passport, driver's licence), date of birth.",
        "Verification data: BVN (when required), driver's licence details, selfie for liveness/face match, and any third-party verification reports.",
        "Transaction & payment data: billing name, bank account details, Paystack payment ID, transaction history, refunds and escrow records.",
        "Package & delivery data: pickup/drop locations, package description, weight/size, photos uploaded as proof, recipient name and OTP (when used).",
        "Location & usage data: GPS coordinates (when enabled), IP address, device identifiers, app usage logs, timestamps.",
        "Communications & messages: messages between users, support tickets, and call recordings (if any) for support/quality.",
        "Optional marketing & profile data: business name (for company accounts), company CAC number, logo."
      ]
    },
    {
      title: "5. Why We Collect Data & Legal Basis",
      content: `We process your data to:`,
      list: [
        "Provide, operate, maintain, and improve the Carrydey service (performance of contract).",
        "Secure payments and hold funds in escrow (legal/commercial necessity).",
        "Verify identity for safety and trust (legitimate interest and legal obligations).",
        "Communicate account or transactional information (contractual).",
        "Prevent fraud and enforce our Terms (legitimate interest).",
        "Comply with legal or regulatory demands (legal obligations)."
      ]
    },
    {
      title: "6. How We Use Your Data",
      list: [
        "Match senders with travelers and manage bookings.",
        "Process and secure payments using Paystack (we never store your raw card data; payments are tokenized via Paystack).",
        "Perform KYC/identity checks, liveness checks, and background verification where applicable.",
        "Provide customer support and handle disputes/disputes evidence.",
        "Improve the product (analytics, aggregated insights).",
        "Notify you about relevant updates and marketing (with your consent where required)."
      ] 
    },
    {
      title: "7. Sharing & Recipients",
      content: `We may share personal data with:`,
      list: [
        "Payment processors (Paystack) to process and escrow payments.",
        "Verification providers (third-party identity/BVN/NIN providers) for KYC.",
        "Service providers (cloud hosting, email, SMS, analytics) who act as processors.",
        "Law enforcement or regulators when required by law.",
        "Companies you choose to interact with (registered companies on our platform) — with your explicit consent."
      ],
      footer: "We will not sell your personal data." 
    },
    {
      title: "8. Data Retention",
      content: `We retain personal data for as long as needed to provide services, meet legal obligations, resolve disputes, enforce agreements, and for permitted business purposes. Typical retention: account and transaction records for at least 5 years for audit/compliance, unless law requires otherwise.`
    },
    {
      title: "9. Security",
      content: `We take reasonable technical and organizational measures (TLS encryption, access controls, data minimization) to protect your data. However, no system is 100% secure — if a breach occurs we'll comply with applicable notification rules and notify affected users promptly.`
    },
    {
      title: "10. Your Rights",
      content: `Under applicable Nigerian law you may, subject to legal limits, request: access, rectification, portability, restriction, or deletion of your data. Some data is required to use our service (e.g., KYC info, payment records) and cannot be deleted while legal or contractual obligations remain.`
    },
    {
      title: "11. Children",
      content: `Carrydey does not knowingly collect data from children under 13. If you believe we have such data, contact us to remove it.`
    },
    {
      title: "13. Cookies & Tracking",
      content: `We use cookies and similar technologies for analytics, performance, and authentication. You can control cookies via your browser, but blocking critical cookies may limit core functionality.`
    },
    {
      title: "14. Changes to This Policy",
      content: `We may update this policy. We'll post the new effective date and notify users where appropriate.`
    },
    {
      title: "15. Contact & Data Protection Officer",
      content: `Carrydey Technologies`,
      footer: "Email: privacy@carrydey.tech"
    }
  ];

  return (
    <main className="min-h-screen mt-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-600">
            Carrydey Technologies (operating as "Carrydey")
          </p>
          <p className="text-sm text-gray-600">Last updated: November 2025</p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <section key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                {section.title}
              </h2>
              
              {section.content && (
                <p className="text-gray-700 leading-relaxed mb-3">
                  {section.content}
                </p>
              )}
              
              {section.list && (
                <ul className="space-y-2 ml-4">
                  {section.list.map((item, i) => (
                    <li key={i} className="text-gray-700 leading-relaxed flex">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              
              {section.footer && (
                <p className="text-gray-700 leading-relaxed mt-3 font-medium">
                  {section.footer}
                </p>
              )}
            </section>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            If you have any questions about this Privacy Policy, please contact us at{' '}
            <a 
              href="mailto:privacy@carrydey.com" 
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