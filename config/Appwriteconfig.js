import { Client, Account, Databases, Storage, Functions, ID, Query } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENPOINT_ID) 
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID); 

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);
export{ ID, Query }; 