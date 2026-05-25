/**
 * set-admin.js
 *
 * Run this script to promote a Clerk user to admin role in MongoDB.
 * Usage:
 *   node set-admin.js <clerk-user-id>
 *
 * The Clerk user ID looks like: user_2xxxxxxxxxxx
 * You can find it in the Clerk dashboard under Users.
 *
 * Example:
 *   node set-admin.js user_2abc123def456
 */

const { MongoClient } = require("mongodb");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "fashion_asia";

async function main() {
  const clerkUserId = process.argv[2];

  if (!clerkUserId) {
    console.error("Usage: node set-admin.js <clerk-user-id>");
    console.error("Example: node set-admin.js user_2abc123def456");
    process.exit(1);
  }

  if (!MONGODB_URI) {
    console.error("Missing MONGODB_URI in .env");
    process.exit(1);
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();

  const db = client.db(MONGODB_DB_NAME);
  const users = db.collection("users");

  const existing = await users.findOne({ clerkUserId });

  if (!existing) {
    console.log(`User ${clerkUserId} not found in DB.`);
    console.log("Please sign in to the website first (this syncs your Clerk user to MongoDB).");
    console.log("Then run this script again.");
    await client.close();
    process.exit(1);
  }

  await users.updateOne({ clerkUserId }, { $set: { role: "admin", updatedAt: new Date().toISOString() } });
  const updated = await users.findOne({ clerkUserId });

  console.log("✅ User promoted to admin:");
  console.log(`  ID: ${updated.id}`);
  console.log(`  Clerk ID: ${updated.clerkUserId}`);
  console.log(`  Email: ${updated.email || "(not set)"}`);
  console.log(`  Role: ${updated.role}`);

  await client.close();
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
