const { getCollection } = require("../config/db");

function mapOrder(order) {
  return {
    ...order,
    trackingNumber: order.trackingNumber ?? null,
    adminNotes: order.adminNotes ?? "",
    status: order.status ?? "placed",
  };
}

async function listOrders() {
  const collection = await getCollection("orders");
  const orders = await collection.find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
  return orders.map(mapOrder);
}

async function getOrderById(id) {
  const collection = await getCollection("orders");
  const order = await collection.findOne({ id }, { projection: { _id: 0 } });
  return order ? mapOrder(order) : null;
}

async function createOrder(order) {
  const collection = await getCollection("orders");
  await collection.insertOne(order);
  return mapOrder(order);
}

async function updateOrder(id, patch) {
  const collection = await getCollection("orders");
  const current = await collection.findOne({ id }, { projection: { _id: 0 } });
  if (!current) return null;

  const nextOrder = {
    ...current,
    status: patch.status ?? current.status,
    trackingNumber:
      patch.trackingNumber === undefined
        ? current.trackingNumber
        : String(patch.trackingNumber || "").trim() || null,
    adminNotes:
      patch.adminNotes === undefined ? current.adminNotes : String(patch.adminNotes || "").trim(),
  };

  await collection.updateOne({ id }, { $set: nextOrder });
  return mapOrder(nextOrder);
}

module.exports = {
  listOrders,
  getOrderById,
  createOrder,
  updateOrder,
};
