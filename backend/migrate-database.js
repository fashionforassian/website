/**
 * migrate-database.js
 *
 * Copies data from the legacy MongoDB database into the active app database.
 *
 * Usage:
 *   node migrate-database.js
 *
 * Optional env vars:
 *   MONGODB_SOURCE_DB_NAME   defaults to "fashion"
 *   MONGODB_DB_NAME          defaults to "fashion_asia"
 */

const { MongoClient } = require("mongodb");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;
const SOURCE_DB_NAME = process.env.MONGODB_SOURCE_DB_NAME || "fashion";
const TARGET_DB_NAME = process.env.MONGODB_DB_NAME || "fashion_asia";

const COLLECTION_KEY_FIELDS = {
  users: ["clerkUserId", "id"],
  products: ["id", "slug"],
  orders: ["id"],
  subscribers: ["email"],
  contacts: ["id", "email"],
  categories: ["id", "slug"],
  checkout_sessions: ["id", "razorpayOrderId"],
};

function buildFilter(collectionName, document) {
  const preferredKeys = COLLECTION_KEY_FIELDS[collectionName] || ["id", "slug", "email", "clerkUserId"];

  for (const key of preferredKeys) {
    const value = document[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return { [key]: value };
    }
  }

  return { _id: document._id };
}

function stripMongoId(document) {
  const { _id, ...rest } = document;
  return rest;
}

async function migrateCollection(sourceDb, targetDb, collectionName) {
  const sourceCollection = sourceDb.collection(collectionName);
  const targetCollection = targetDb.collection(collectionName);

  const documents = await sourceCollection.find({}).toArray();
  let migrated = 0;

  for (const document of documents) {
    const filter = buildFilter(collectionName, document);
    const replacement = stripMongoId(document);

    await targetCollection.replaceOne(filter, replacement, { upsert: true });
    migrated += 1;
  }

  return migrated;
}

async function main() {
  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI in environment.");
  }

  if (SOURCE_DB_NAME === TARGET_DB_NAME) {
    throw new Error("Source and target database names are the same. Set MONGODB_SOURCE_DB_NAME to the old database.");
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();

  try {
    const sourceDb = client.db(SOURCE_DB_NAME);
    const targetDb = client.db(TARGET_DB_NAME);
    const collections = await sourceDb.listCollections().toArray();

    if (!collections.length) {
      console.log(`No collections found in source database "${SOURCE_DB_NAME}".`);
      return;
    }

    console.log(`Migrating from "${SOURCE_DB_NAME}" to "${TARGET_DB_NAME}"...`);

    for (const { name } of collections) {
      const count = await migrateCollection(sourceDb, targetDb, name);
      console.log(`  ${name}: migrated ${count} document(s)`);
    }

    console.log("Migration complete.");
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error("Migration failed:", error.message);
  process.exit(1);
});