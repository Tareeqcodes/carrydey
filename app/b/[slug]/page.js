'use client';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { tablesDB, Query } from '@/lib/config/Appwriteconfig';

export default function ShortLinkRedirect() {
  const { slug } = useParams();
  const router = useRouter();

  useEffect(() => {
    async function resolve() {
      try {
        const res = await tablesDB.listRows({
          databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          tableId: process.env.NEXT_PUBLIC_APPWRITE_ORGANISATION_COLLECTION_ID,
          queries: [Query.equal('shortCode', slug)],
        });

        if (res.rows.length > 0) {
          router.replace(`/AgencyBooking/${res.rows[0].$id}`);
        } else {
          // Old full-ID links still work
          router.replace(`/AgencyBooking/${slug}`);
        }
      } catch {
        router.replace('/');
      }
    }
    resolve();
  }, [slug]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto rounded-full border-4 border-gray-200 border-t-[#3A0A21] animate-spin mb-4" />
        <p className="text-sm text-gray-500 font-medium">Loading...</p>
      </div>
    </div>
  );
}