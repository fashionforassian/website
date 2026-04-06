const { getCollection } = require("../config/db");

async function listProducts() {
  const collection = await getCollection("products");
  return collection.find({}, { projection: { _id: 0 } }).sort({ name: 1 }).toArray();
}

async function listVisibleProducts() {
  const products = await listProducts();
  return products.filter((product) => product.status === "active" && product.category !== "women");
}

async function getProductById(id) {
  const collection = await getCollection("products");
  return collection.findOne({ id }, { projection: { _id: 0 } });
}

async function getProductBySlug(slug) {
  const collection = await getCollection("products");
  return collection.findOne({ slug }, { projection: { _id: 0 } });
}

async function createProduct(product) {
  const collection = await getCollection("products");
  await collection.insertOne(product);
  return product;
}

async function updateProduct(id, product) {
  const collection = await getCollection("products");
  await collection.updateOne({ id }, { $set: product });
  return product;
}

async function deleteProduct(id) {
  const collection = await getCollection("products");
  await collection.deleteOne({ id });
}

async function findProductBySlugExcludingId(slug, id) {
  const collection = await getCollection("products");
  return collection.findOne({ slug, id: { $ne: id } }, { projection: { _id: 0 } });
}

async function hasProductsUsingCategorySlug(slug) {
  const collection = await getCollection("products");
  const count = await collection.countDocuments({
    $or: [{ category: slug }, { categoryPathSlugs: slug }],
  });

  return count > 0;
}

module.exports = {
  listProducts,
  listVisibleProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  findProductBySlugExcludingId,
  hasProductsUsingCategorySlug,
};
