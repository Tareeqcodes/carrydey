'use client';
import { useEffect, useState } from 'react';
import { databases, ID, Query } from '@/lib/config/Appwriteconfig'
import { usePackages } from '@/hooks/usePackages';
import { useAuth } from '@/hooks/Authcontext';


const db = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const applicationsCollection = process.env.NEXT_PUBLIC_APPWRITE_APPLICATIONS;
const packagesCollection = process.env.NEXT_PUBLIC_APPWRITE_PACKAGE_COLLECTION_ID;


export default function TravelerTransit() {
  return (
    <div>TravelerTransit</div>
  )
}
