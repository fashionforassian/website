const { getCollection } = require("../config/db");

async function createContact(input) {
  const collection = await getCollection("contacts");

  const contact = {
    id: input.id || `contact_${Date.now()}`,
    firstName: String(input.firstName || "").trim(),
    lastName: String(input.lastName || "").trim(),
    email: String(input.email || "").trim().toLowerCase(),
    message: String(input.message || "").trim(),
    createdAt: new Date().toISOString(),
  };

  await collection.insertOne(contact);
  return contact;
}

async function listContacts() {
  const collection = await getCollection("contacts");
  return collection
    .find({}, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .toArray();
}

module.exports = {
  createContact,
  listContacts,
};
