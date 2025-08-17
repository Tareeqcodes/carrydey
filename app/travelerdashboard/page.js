'use client'
import TravelerMain from "@/components/traveler/TravelerMain"
import Pending from "@/components/verification/Pending"
import { UserRole } from "@/hooks/UserRole"
import Navigation from "@/components/traveler/Navigation"


export default function PendingVerification() {
  const { role } = UserRole();
  return (
    <>
      {role === "traveler" ? (
        <>
          <Navigation />
          <TravelerMain />
        </>
      ) : (
        <Pending />
      )}
    </>
  )
}
