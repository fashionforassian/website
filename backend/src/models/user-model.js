const { getCollection } = require("../config/db");

async function getUserByClerkId(clerkUserId) {
  const collection = await getCollection("users");
  return collection.findOne({ clerkUserId }, { projection: { _id: 0 } });
}

async function getUserById(id) {
  const collection = await getCollection("users");
  return collection.findOne({ id }, { projection: { _id: 0 } });
}

async function listUsers() {
  const collection = await getCollection("users");
  const users = await collection.find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
  return users;
}

async function updateUser(id, patch) {
  const collection = await getCollection("users");
  const current = await collection.findOne({ id }, { projection: { _id: 0 } });
  if (!current) return null;

  const next = {
    ...current,
    role: patch.role === undefined ? current.role : String(patch.role || "").trim(),
    email: patch.email === undefined ? current.email : String(patch.email || "").toLowerCase(),
    firstName: patch.firstName === undefined ? current.firstName : String(patch.firstName || "").trim(),
    lastName: patch.lastName === undefined ? current.lastName : String(patch.lastName || "").trim(),
    updatedAt: new Date().toISOString(),
  };

  await collection.updateOne({ id }, { $set: next });
  return next;
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
  getUserById,
  syncUserFromAuth,
  listUsers,
  updateUser,
};
