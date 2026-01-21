'use client';
import React, { useState, useEffect } from 'react';
import { Link2, Settings, Building2, Phone, Mail, MapPin } from 'lucide-react';
import AgencyLinkGenerator from '@/hooks/AgencyLinkGenerator';
import { useAuth } from '@/hooks/Authcontext';
import { tablesDB, Query } from '@/lib/config/Appwriteconfig';

const AgencySettingsPage = () => {
  const { user } = useAuth();
  const [agencyData, setAgencyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgencyData();
  }, [user]);

  const fetchAgencyData = async () => {
    if (!user?.$id) return;

    try {
      setLoading(true);
      const response = await tablesDB.listRows({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        tableId: process.env.NEXT_PUBLIC_APPWRITE_ORGANISATION_COLLECTION_ID,
        queries: [Query.equal('userId', user.$id)],
      });

      if (response.rows.length > 0) {
        setAgencyData(response.rows[0]);
      }
    } catch (error) {
      console.error('Error fetching agency data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A0A21]"></div>
      </div>
    );
  }

  if (!agencyData) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Agency Profile Not Found
        </h3>
        <p className="text-gray-600">
          Please complete your agency registration first.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      {/* <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-[#3A0A21] rounded-xl flex items-center justify-center">
          <Settings className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agency Settings</h1>
          <p className="text-gray-600">Manage your booking link and profile</p>
        </div>
      </div> */}

      {/* Booking Link Generator - Main Feature */}
      <div className="bg-gradient-to-br from-[#3A0A21] to-[#4A0A31] rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Link2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1">Your Booking Link</h2>
            <p className="text-white/80 text-sm">
              Share this link with customers to receive bookings directly
            </p>
          </div>
        </div>
        
        <AgencyLinkGenerator agencyId={agencyData.$id} />
      </div>

      {/* Agency Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Building2 className="w-6 h-6 text-gray-700" />
          <h3 className="text-lg font-bold text-gray-900">Agency Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Agency Name</p>
            <p className="font-medium text-gray-900">
              {agencyData.name || agencyData.contactPerson}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-600">Contact Person</p>
            <p className="font-medium text-gray-900">
              {agencyData.contactPerson || 'N/A'}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-600">Phone</p>
            </div>
            <p className="font-medium text-gray-900">
              {agencyData.phone || 'N/A'}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-600">Email</p>
            </div>
            <p className="font-medium text-gray-900">
              {agencyData.email || 'N/A'}
            </p>
          </div>

          <div className="space-y-1 md:col-span-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-600">Location</p>
            </div>
            <p className="font-medium text-gray-900">
              {agencyData.city && agencyData.state
                ? `${agencyData.city}, ${agencyData.state}`
                : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Stats</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {agencyData.totalDeliveries || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Total Bookings</p>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {agencyData.rating || '4.5'}⭐
            </p>
            <p className="text-sm text-gray-600 mt-1">Rating</p>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {agencyData.verified ? 'Yes' : 'No'}
            </p>
            <p className="text-sm text-gray-600 mt-1">Verified</p>
          </div>

          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">
              {agencyData.type || 'Agency'}
            </p>
            <p className="text-sm text-gray-600 mt-1">Type</p>
          </div>
        </div>
      </div>

      {/* Marketing Tips */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">
          📱 Marketing Tips
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Share your booking link on WhatsApp Business Status</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Add the link to your Instagram and Facebook bio</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Include it in your email signature</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Print QR codes linking to your booking page</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Customers don't need to sign up - just click and book!</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AgencySettingsPage;