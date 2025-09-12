import { databases } from "@/lib/config/Appwriteconfig"


const db = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const collection = process.env.NEXT_PUBLIC_APPWRITE_PACKAGE_COLLECTION_ID;

const usesinglePackage = async (id) => {
  try {
    const response = await databases.getDocument(db, collection, id);
    return response;
  } catch (error) {
    console.error("Error fetching package:", error);
    throw error;
  }
};

export default usesinglePackage;