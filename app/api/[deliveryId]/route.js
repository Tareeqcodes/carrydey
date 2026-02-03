import { tablesDB } from '@/lib/config/Appwriteconfig';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    // Await params in Next.js 15+
    const { deliveryId } = await params;
    
    // Validate token (must be present and valid)
    if (!token) {
      return NextResponse.json(
        { error: 'Token required' },
        { status: 401 }
      );
    }
    
    // Fetch delivery
    const delivery = await tablesDB.getRow({
      databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      tableId: process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_COLLECTION_ID,
      rowId: deliveryId,
    });
    
    // Verify token matches (stored during booking)
    if (delivery.trackingToken !== token) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 403 }
      );
    }
    
    // Check token expiry (24 hours from creation)
    const tokenExpiry = new Date(delivery.$createdAt);
    tokenExpiry.setHours(tokenExpiry.getHours() + 24);
    
    if (new Date() > tokenExpiry) {
      return NextResponse.json(
        { error: 'Token expired' },
        { status: 403 }
      );
    }
    
    // Return ONLY what guest needs to see
    const response = {
      $id: delivery.$id,
      status: delivery.status,
      pickupAddress: delivery.pickupAddress,
      dropoffAddress: delivery.dropoffAddress,
      $createdAt: delivery.$createdAt,
    };
    
    // Add pickup code only if assigned or later
    if (['assigned', 'picked_up', 'in_transit', 'delivered'].includes(delivery.status)) {
      response.pickupCode = delivery.pickupCode;
      response.driverName = delivery.driverName;
      response.driverPhone = delivery.driverPhone;
    }
    
    // Add dropoff OTP only if picked up
    if (['picked_up', 'in_transit', 'delivered'].includes(delivery.status)) {
      response.dropoffOTP = delivery.dropoffOTP;
    }
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json(
      { error: 'Delivery not found', details: error.message },
      { status: 404 }
    );
  }
}