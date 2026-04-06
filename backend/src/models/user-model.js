const { getCollection } = require("../config/db");

async function getUserByClerkId(clerkUserId) {
  const collection = await getCollection("users");
  return collection.findOne({ clerkUserId }, { projection: { _id: 0 } });
}

async function syncUserFromAuth({ clerkUserId, email, firstName, lastName }) {
  const collection = await getCollection("users");
  const now = new Date().toISOString();

  const existing = await getUserByClerkId(clerkUserId);
  const profilePatch = {
    updatedAt: now,
    lastLoginAt: now,
  };

  if (email) profilePatch.email = String(email).toLowerCase();
  if (firstName) profilePatch.firstName = String(firstName).trim();
  if (lastName) profilePatch.lastName = String(lastName).trim();

  if (existing) {
    await collection.updateOne({ clerkUserId }, { $set: profilePatch });
    const updated = await getUserByClerkId(clerkUserId);
    return { existed: true, created: false, user: updated };
  }

  const user = {
    id: `usr_${Date.now()}`,
    clerkUserId,
    role: "customer",
    createdAt: now,
    ...profilePatch,
  };

  await collection.insertOne(user);
  return { existed: false, created: true, user };
}

module.exports = {
  getUserByClerkId,
  syncUserFromAuth,
};
