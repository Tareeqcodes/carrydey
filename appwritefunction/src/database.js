import { ID, Query } from 'node-appwrite';

export class DatabaseService {
  constructor(databases, databaseId) {
    this.db = databases;
    this.databaseId = databaseId;
    this.collections = {
      contracts: 'contracts',
      payments: 'payments',
      delivery_events: 'delivery_events',
    };
  }

  async getContract(contractId) {
    return await this.db.getDocument(this.databaseId, this.collections.contracts, contractId);
  }

  async createContract(data) {
    return await this.db.createDocument(
      this.databaseId,
      this.collections.contracts,
      ID.unique(),
      { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    );
  }

  async updateContract(contractId, data) {
    return await this.db.updateDocument(this.databaseId, this.collections.contracts, contractId, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }

  async createPayment(data) {
    return await this.db.createDocument(this.databaseId, this.collections.payments, ID.unique(), {
      ...data,
      createdAt: new Date().toISOString(),
    });
  }

  async updatePayment(paymentId, data) {
    return await this.db.updateDocument(this.databaseId, this.collections.payments, paymentId, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }

  async getPaymentByReference(reference) {
    const response = await this.db.listDocuments(this.databaseId, this.collections.payments, [
      Query.equal('paystackReference', reference),
    ]);
    return response.documents[0] || null;
  }

  async getPaymentByContract(contractId) {
    const response = await this.db.listDocuments(this.databaseId, this.collections.payments, [
      Query.equal('contractId', contractId),
    ]);
    return response.documents[0] || null;
  }

  async createDeliveryEvent(data) {
    return await this.db.createDocument(this.databaseId, this.collections.delivery_events, ID.unique(), {
      ...data,
      createdAt: new Date().toISOString(),
    });
  }

  async listDocuments(databaseId, collectionId, queries) {
    return await this.db.listDocuments(databaseId, collectionId, queries);
  }
}