"use client";
import Link from "next/link";
import Main from "@/components/Main";
import Hero from "@/components/Hero";
import { useUserRole } from "@/hooks/useUserRole";
import QuickNav from "@/components/QuickNav";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/Authcontext";
import ContentLoading from "@/components/ui/ContentLoading";
import PendingVerification from "../travelerdashboard/page";

export default function page() {
  const { user } = useAuth();
  const { loading, role, name } = useUserRole();

  if (loading ) {
    return <div>Loading</div>
  }

  return (
    <>
      {user ? (
        <div> 
          {role === "sender" ? (
            // Sender Dashboard
            <div className='mb-20 bg-gradient-to-br from-gray-50 to-blue-50 px-6'>
              <Main role={role} name={name} />
              <Hero role={role} />

              <QuickNav />
              <div className='h-20'></div>
            </div>
          ) : (
            <div>
              <PendingVerification />
            </div>
          )}
          <Navbar />
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center h-screen'>
          <h1 className='text-2xl font-bold'>Please log in to continue</h1>
          <Link href='/login' className='mt-4 text-blue-500'>
            Go to Login
          </Link>
        </div>
      )}
    </>
  );
}
