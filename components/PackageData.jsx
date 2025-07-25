'use client';
import { useState, useEffect } from "react";
import { databases } from "@/config/Appwriteconfig";



const db = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const collection = process.env.NEXT_PUBLIC_APPWRITE_PACKAGE_COLLECTION_ID;

export default function PackageData() {
    const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
   
  return (
    <div>PackageData</div>
  )
}
