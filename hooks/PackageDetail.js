import { databases } from "@/lib/config/Appwriteconfig"

const db = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
const cll = process.env.NEXT_PUBLIC_APPWRITE_PACKAGES_COLLECTION_ID


export default function PackageDetail() {
    
  return (
    <div>PackageDetail</div>
  )
}
