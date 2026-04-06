const {
  listVisibleProducts,
  getProductBySlug,
  listProducts,
} = require("../models/product-model");
const { listCategoriesWithPaths } = require("../models/category-model");
const { createOrder, getOrderById } = require("../models/order-model");
const { getSubscriberByEmail, createSubscriber } = require("../models/subscriber-model");
const { syncUserFromAuth } = require("../models/user-model");
const { badRequest, notFound } = require("../utils/http-error");

function parsePositiveInt(value, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
}

function filterAndSortProducts(products, query) {
  const category = String(query.category || "").trim();
  const search = String(query.search || "").trim().toLowerCase();
  const sort = String(query.sort || "name-asc").trim();

  let next = [...products];

  if (category) {
    next = next.filter((item) => item.category === category);
  }

  if (search) {
    next = next.filter((item) => {
      const haystack = `${item.name} ${item.description} ${item.category} ${(item.tags || []).join(" ")}`.toLowerCase();
      return haystack.includes(search);
    });
  }

  if (sort === "name-desc") {
    next.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sort === "price-asc") {
    next.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    next.sort((a, b) => b.price - a.price);
  } else if (sort === "newest") {
    next.sort((a, b) => Number(b.isNew) - Number(a.isNew) || b.popularity - a.popularity);
  } else {
    next.sort((a, b) => a.name.localeCompare(b.name));
  }

  return next;
}

async function getProducts(req, res) {
  const page = parsePositiveInt(req.query.page, 1);
  const limit = parsePositiveInt(req.query.limit, 100);

  const products = await listVisibleProducts();
  const filtered = filterAndSortProducts(products, req.query);

  const startIndex = (page - 1) * limit;
  const paged = filtered.slice(startIndex, startIndex + limit);

  res.json({
    items: paged,
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / limit)),
    },
  });
}

async function getProductBySlugHandler(req, res) {
  const product = await getProductBySlug(req.params.slug);

  if (!product || product.status !== "active" || product.category === "women") {
    throw notFound("Product not found.");
  }

  res.json(product);
}

async function getCategories(req, res) {
  const products = await listProducts();

  const productCountBySlug = products.reduce((acc, product) => {
    const key = String(product.category || "").trim().toLowerCase();
    if (!key) {
      return acc;
    }

    if (!acc[key]) {
      acc[key] = 0;
    }

    acc[key] += 1;
    return acc;
  }, {});

  const categories = await listCategoriesWithPaths();
  if (!categories.length) {
    const fallback = Object.entries(productCountBySlug).map(([slug, totalProducts]) => ({
      slug,
      name: slug,
      totalProducts,
      pathSlugs: [slug],
      pathLabels: [slug],
    }));
    res.json(fallback);
    return;
  }

  const payload = categories.map((category) => ({
    id: category.id,
    slug: category.slug,
    name: category.name,
    parentId: category.parentId,
    depth: category.depth,
    pathSlugs: category.pathSlugs,
    pathLabels: category.pathLabels,
    pathKey: category.pathKey,
    totalProducts: productCountBySlug[category.slug] || 0,
  }));

  res.json(payload);
}

async function createOrderHandler(req, res) {
  const customerName = String(req.body.customerName || "").trim();
  const customerEmail = String(req.body.customerEmail || "").trim().toLowerCase();
  const items = Array.isArray(req.body.items) ? req.body.items.filter((item) => item.quantity > 0) : [];

  if (!customerName) throw badRequest("Customer name is required.");
  if (!customerEmail || !customerEmail.includes("@")) throw badRequest("A valid email is required.");
  if (!items.length) throw badRequest("Your cart is empty.");

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 200 ? 0 : 12;
  const total = subtotal + shipping;

  const order = {
    id: `ord_${Date.now()}`,
    customerName,
    customerEmail,
    createdAt: new Date().toISOString(),
    status: "placed",
    trackingNumber: null,
    adminNotes: "",
    items,
    subtotal,
    shipping,
    total,
  };

  const created = await createOrder(order);
  res.status(201).json(created);
}

async function getOrderByIdHandler(req, res) {
  const order = await getOrderById(req.params.id);
  if (!order) throw notFound("Order not found.");

  const email = String(req.query.email || "").trim().toLowerCase();
  if (email && email !== order.customerEmail.toLowerCase()) {
    throw notFound("Order not found.");
  }

  res.json(order);
}

async function createSubscriberHandler(req, res) {
  const email = String(req.body.email || "").trim().toLowerCase();
  const source = String(req.body.source || "website").trim() || "website";

  if (!email || !email.includes("@")) {
    throw badRequest("A valid email is required.");
  }

  const existing = await getSubscriberByEmail(email);
  if (existing) {
    return res.status(201).json(existing);
  }

  const subscriber = {
    id: `sub_${Date.now()}`,
    email,
    source,
    createdAt: new Date().toISOString(),
  };

  const created = await createSubscriber(subscriber);
  res.status(201).json(created);
}

async function syncAuthSessionHandler(req, res) {
  const payload = req.authPayload || {};

  const result = await syncUserFromAuth({
    clerkUserId: req.userId,
    email: payload.email,
    firstName: payload.given_name,
    lastName: payload.family_name,
  });

  res.json({
    ok: true,
    existed: result.existed,
    created: result.created,
    user: result.user,
  });
}

module.exports = {
  getProducts,
  getProductBySlugHandler,
  getCategories,
  createOrderHandler,
  getOrderByIdHandler,
  createSubscriberHandler,
  syncAuthSessionHandler,
};
