import { MongoClient, Db } from 'mongodb';

// The client is created on first use, not at import time, so `next build`
// can load API routes without MONGODB_URI being set.
const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  // Reuse one connection across hot reloads in dev and across requests in prod.
  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = new MongoClient(uri).connect();
  }
  return globalWithMongo._mongoClientPromise;
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  const client = await getClientPromise();
  const db = client.db(); // Use default database from connection string
  return { client, db };
}
