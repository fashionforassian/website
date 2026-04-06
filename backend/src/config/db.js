const { MongoClient } = require("mongodb");
const { env } = require("./env");

let clientPromise = null;

async function getDb() {
  if (!env.mongodbUri) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  if (!clientPromise) {
    clientPromise = new MongoClient(env.mongodbUri).connect();
  }

  let client;
  try {
    client = await clientPromise;
  } catch (error) {
    clientPromise = null;
    throw error;
  }

  return client.db(env.mongodbDbName);
}

async function getCollection(name) {
  const db = await getDb();
  return db.collection(name);
}

module.exports = {
  getDb,
  getCollection,
};
