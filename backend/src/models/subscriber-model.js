const { getCollection } = require("../config/db");

async function listSubscribers() {
  const collection = await getCollection("subscribers");
  return collection.find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
}

async function getSubscriberByEmail(email) {
  const collection = await getCollection("subscribers");
  return collection.findOne({ email }, { projection: { _id: 0 } });
}

async function createSubscriber(subscriber) {
  const collection = await getCollection("subscribers");
  await collection.insertOne(subscriber);
  return subscriber;
}

module.exports = {
  listSubscribers,
  getSubscriberByEmail,
  createSubscriber,
};
