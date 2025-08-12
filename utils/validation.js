
import { databases, storage, ID } from '../lib/appwriteConfig';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_VERIFICATION_COLLECTION_ID;
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_LICENSE_BUCKET_ID;

export const verificationService = {
  // Upload license image to storage
  uploadLicense: async (file) => {
    try {
      const response = await storage.createFile(BUCKET_ID, ID.unique(), file);
      return {
        success: true,
        fileId: response.$id,
        fileUrl: storage.getFileView(BUCKET_ID, response.$id)
      };
    } catch (error) {
      console.error('License upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Create verification record
  createVerification: async (verificationData) => {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        verificationData
      );
      return {
        success: true,
        verificationId: response.$id
      };
    } catch (error) {
      console.error('Verification creation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Update verification record
  updateVerification: async (verificationId, updateData) => {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        verificationId,
        updateData
      );
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Verification update error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get verification status
  getVerification: async (userId) => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal('userId', userId)
        ]
      );
      return {
        success: true,
        data: response.documents[0] || null
      };
    } catch (error) {
      console.error('Get verification error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};