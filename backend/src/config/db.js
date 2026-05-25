const { MongoClient } = require("mongodb");

let clientPromise = null;

async function getDb() {
  const mongodbUri = process.env.MONGODB_URI || "";
  const mongodbDbName = process.env.MONGODB_DB_NAME || "fashion_asia";

  if (!mongodbUri) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  if (!clientPromise) {
    clientPromise = new MongoClient(mongodbUri).connect();
  }

  let client;
  try {
    client = await clientPromise;
  } catch (error) {
    clientPromise = null;
    throw error;
  }

  return client.db(mongodbDbName);
}

async function getCollection(name) {
  const db = await getDb();
  return db.collection(name);
}

module.exports = {
  getDb,
  getCollection,
};
