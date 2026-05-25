const { getCollection } = require("../config/db");

async function createCheckoutSession(session) {
  const collection = await getCollection("checkout_sessions");
  await collection.insertOne(session);
  return session;
}

async function getCheckoutSessionByRazorpayOrderId(razorpayOrderId) {
  const collection = await getCollection("checkout_sessions");
  return collection.findOne({ razorpayOrderId }, { projection: { _id: 0 } });
}

async function updateCheckoutSessionByRazorpayOrderId(razorpayOrderId, patch) {
  const collection = await getCollection("checkout_sessions");
  await collection.updateOne({ razorpayOrderId }, { $set: patch });
  return collection.findOne({ razorpayOrderId }, { projection: { _id: 0 } });
}

module.exports = {
  createCheckoutSession,
  getCheckoutSessionByRazorpayOrderId,
  updateCheckoutSessionByRazorpayOrderId,
};