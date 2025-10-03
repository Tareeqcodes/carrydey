import { ID, Query } from 'node-appwrite';

class DatabaseService {
  constructor(database, databaseId) {
    this.database = database;
    this.databaseId = databaseId;
    this.escrowCollectionId = 'escrow_transactions';
    this.packagesCollectionId = 'packages';
    this.usersCollectionId = 'users';
  }

  async createEscrowRecord(escrowData) {
    try {
      const {
        packageId,
        senderId,
        travelerId,
        amount,
        paystackReference,
        status = 'pending'
      } = escrowData;

      const escrowId = ID.unique();

      const result = await this.database.createDocument(
        this.databaseId,
        this.escrowCollectionId,
        escrowId,
        {
          packageId,
          senderId,
          travelerId,
          amount,
          paystackReference,
          status,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );

      return {
        success: true,
        escrowId: result.$id,
        data: result,
      };
    } catch (error) {
      console.error('Database create escrow error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async updateEscrowStatus(escrowId, status, additionalData = {}) {
    try {
      const updateData = {
        status,
        updatedAt: new Date().toISOString(),
        ...additionalData,
      };

      const result = await this.database.updateDocument(
        this.databaseId,
        this.escrowCollectionId,
        escrowId,
        updateData
      );

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Database update escrow error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getEscrowById(escrowId) {
    try {
      const result = await this.database.getDocument(
        this.databaseId,
        this.escrowCollectionId,
        escrowId
      );

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Database get escrow error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getEscrowByPackage(packageId) {
    try {
      const result = await this.database.listDocuments(
        this.databaseId,
        this.escrowCollectionId,
        [Query.equal('packageId', packageId)]
      );

      return {
        success: true,
        data: result.documents[0] || null,
      };
    } catch (error) {
      console.error('Database get escrow by package error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getEscrowByReference(paystackReference) {
    try {
      const result = await this.database.listDocuments(
        this.databaseId,
        this.escrowCollectionId,
        [Query.equal('paystackReference', paystackReference)]
      );

      return {
        success: true,
        data: result.documents[0] || null,
      };
    } catch (error) {
      console.error('Database get escrow by reference error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async updatePackageStatus(packageId, status) {
    try {
      const result = await this.database.updateDocument(
        this.databaseId,
        this.packagesCollectionId,
        packageId,
        {
          status,
          updatedAt: new Date().toISOString(),
        }
      );

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Database update package error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getUserBankDetails(userId) {
    try {
      const result = await this.database.getDocument(
        this.databaseId,
        this.usersCollectionId,
        userId
      );

      return {
        success: true,
        data: {
          accountNumber: result.bankAccountNumber,
          bankCode: result.bankCode,
          accountName: result.bankAccountName,
        },
      };
    } catch (error) {
      console.error('Database get user bank details error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export default DatabaseService;