const {
  listVisibleProducts,
  getProductBySlug,
  listProducts,
} = require("../models/product-model");
const { listCategoriesWithPaths } = require("../models/category-model");
const { createOrder, getOrderById } = require("../models/order-model");
const {
  createCheckoutSession,
  getCheckoutSessionByRazorpayOrderId,
  updateCheckoutSessionByRazorpayOrderId,
} = require("../models/checkout-session-model");
const { getSubscriberByEmail, createSubscriber } = require("../models/subscriber-model");
const { createContact } = require("../models/contact-model");
const { syncUserFromAuth } = require("../models/user-model");
const { createClerkClient } = require("@clerk/backend");
const { sendOrderConfirmationEmail } = require("../utils/mailer");
const { badRequest, notFound } = require("../utils/http-error");
const {
  calculateShipping,
  createRazorpayOrder,
  normalizeShippingAddress,
  summarizeOrderItems,
  verifyRazorpaySignature,
} = require("../utils/razorpay");

function parsePositiveInt(value, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
}

function filterAndSortProducts(products, query) {
  const category = String(query.category || "").trim();
  // categoryPath supports hierarchical filtering e.g. "women/dresses"
  const categoryPath = String(query.categoryPath || "").trim();
  const search = String(query.search || "").trim().toLowerCase();
  const sort = String(query.sort || "name-asc").trim();

  let next = [...products];

  if (categoryPath) {
    // Match products whose categoryPathSlugs starts with the requested path segments
    const pathSegments = categoryPath.split("/").map((s) => s.trim()).filter(Boolean);
    next = next.filter((item) => {
      const productPath = Array.isArray(item.categoryPathSlugs) ? item.categoryPathSlugs : [];
      // Check that every segment in the requested path matches the product's path at the same position
      return pathSegments.every((seg, idx) => productPath[idx] === seg);
    });
  } else if (category) {
    // Fallback: simple root-category match
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

  if (!product || product.status !== "active") {
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
  const shippingAddress = req.body.shippingAddress ? normalizeShippingAddress(req.body.shippingAddress) : null;
  const shippingMethod = String(req.body.shippingMethod || "standard").trim() || "standard";

  if (!customerName) throw badRequest("Customer name is required.");
  if (!customerEmail || !customerEmail.includes("@")) throw badRequest("A valid email is required.");
  if (!items.length) throw badRequest("Your cart is empty.");

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = calculateShipping(subtotal, shippingMethod);
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
    paymentMethod: req.body.paymentMethod || "offline",
    paymentStatus: req.body.paymentStatus || "pending",
    shippingAddress,
    shippingMethod,
    razorpayOrderId: req.body.razorpayOrderId || null,
    razorpayPaymentId: req.body.razorpayPaymentId || null,
  };

  const created = await createOrder(order);
  // send confirmation email (best-effort)
  try {
    await sendOrderConfirmationEmail(created);
  } catch (err) {
    // don't block response on mail errors
    console.error("Failed to send order confirmation email:", err && err.message);
  }

  res.status(201).json(created);
}

async function createRazorpayCheckoutHandler(req, res) {
  const customerName = String(req.body.customerName || "").trim();
  const customerEmail = String(req.body.customerEmail || "").trim().toLowerCase();
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  const shippingMethod = String(req.body.shippingMethod || "standard").trim() || "standard";

  if (!customerName) throw badRequest("Customer name is required.");
  if (!customerEmail || !customerEmail.includes("@")) throw badRequest("A valid email is required.");

  const summary = summarizeOrderItems(items);
  const shippingAddress = normalizeShippingAddress(req.body.shippingAddress || req.body);
  const shipping = calculateShipping(summary.subtotal, shippingMethod);
  const total = summary.subtotal + shipping;
  const sessionId = `chk_${Date.now()}`;

  const checkoutOrder = await createRazorpayOrder({
    amount: Math.round(total * 100),
    receipt: sessionId,
    notes: {
      sessionId,
      customerName,
      customerEmail,
    },
  });

  await createCheckoutSession({
    id: sessionId,
    customerName,
    customerEmail,
    createdAt: new Date().toISOString(),
    status: "pending_payment",
    items: summary.items,
    subtotal: summary.subtotal,
    shipping,
    total,
    shippingAddress,
    shippingMethod,
    razorpayOrderId: checkoutOrder.id,
    razorpayAmount: checkoutOrder.amount,
    currency: checkoutOrder.currency,
  });

  res.status(201).json({
    keyId: process.env.RAZORPAY_KEY_ID || "",
    sessionId,
    razorpayOrderId: checkoutOrder.id,
    amount: checkoutOrder.amount,
    currency: checkoutOrder.currency,
    subtotal: summary.subtotal,
    shipping,
    total,
  });
}

async function confirmRazorpayOrderHandler(req, res) {
  const razorpayOrderId = String(req.body.razorpayOrderId || "").trim();
  const razorpayPaymentId = String(req.body.razorpayPaymentId || "").trim();
  const razorpaySignature = String(req.body.razorpaySignature || "").trim();

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    throw badRequest("Missing Razorpay payment details.");
  }

  const session = await getCheckoutSessionByRazorpayOrderId(razorpayOrderId);
  if (!session) {
    throw notFound("Checkout session not found.");
  }

  if (session.status === "completed" && session.orderId) {
    const existing = await getOrderById(session.orderId);
    if (existing) {
      res.json(existing);
      return;
    }
  }

  verifyRazorpaySignature({
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });

  if (Math.round(session.total * 100) !== session.razorpayAmount) {
    throw badRequest("Payment amount mismatch.");
  }

  const order = {
    id: `ord_${Date.now()}`,
    customerName: session.customerName,
    customerEmail: session.customerEmail,
    createdAt: new Date().toISOString(),
    status: "placed",
    trackingNumber: null,
    adminNotes: "",
    items: session.items,
    subtotal: session.subtotal,
    shipping: session.shipping,
    total: session.total,
    paymentMethod: "razorpay",
    paymentStatus: "paid",
    shippingAddress: session.shippingAddress,
    shippingMethod: session.shippingMethod || "standard",
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  };

  const created = await createOrder(order);
  await updateCheckoutSessionByRazorpayOrderId(razorpayOrderId, {
    status: "completed",
    orderId: created.id,
    razorpayPaymentId,
    razorpaySignature,
    completedAt: new Date().toISOString(),
  });

  // send confirmation email (best-effort)
  try {
    await sendOrderConfirmationEmail(created);
  } catch (err) {
    console.error("Failed to send order confirmation email:", err && err.message);
  }

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

async function createContactHandler(req, res) {
  const firstName = String(req.body.firstName || "").trim();
  const lastName = String(req.body.lastName || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const message = String(req.body.message || "").trim();

  if (!firstName) throw badRequest("First name is required.");
  if (!email || !email.includes("@")) throw badRequest("A valid email is required.");
  if (!message) throw badRequest("Message is required.");

  const contact = await createContact({ firstName, lastName, email, message });
  res.status(201).json(contact);
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
  const clerkUserId = req.userId;

  // Fetch the real user profile from Clerk's API so we always get
  // email, firstName, lastName — these are NOT in the JWT by default.
  let email = "";
  let firstName = "";
  let lastName = "";

  try {
    if (process.env.CLERK_SECRET_KEY) {
      const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
      const clerkUser = await clerkClient.users.getUser(clerkUserId);
      email = clerkUser.emailAddresses?.[0]?.emailAddress || "";
      firstName = clerkUser.firstName || "";
      lastName = clerkUser.lastName || "";
    }
  } catch (err) {
    // Fall back to whatever the JWT payload contains
    const payload = req.authPayload || {};
    email = payload.email || "";
    firstName = payload.given_name || "";
    lastName = payload.family_name || "";
    console.warn("Could not fetch Clerk user profile, falling back to JWT payload:", err?.message);
  }

  const result = await syncUserFromAuth({ clerkUserId, email, firstName, lastName });

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
  createRazorpayCheckoutHandler,
  confirmRazorpayOrderHandler,
  getOrderByIdHandler,
  createSubscriberHandler,
  createContactHandler,
  syncAuthSessionHandler,
};
