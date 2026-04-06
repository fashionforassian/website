const {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  findProductBySlugExcludingId,
  hasProductsUsingCategorySlug,
} = require("../models/product-model");
const { listOrders, getOrderById, updateOrder } = require("../models/order-model");
const { listSubscribers } = require("../models/subscriber-model");
const {
  slugify,
  listCategoriesWithPaths,
  listCategoryTree,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../models/category-model");
const { normalizeProduct } = require("../utils/product-normalizer");
const { notFound, badRequest } = require("../utils/http-error");

function pathKeyFromSlugs(slugs) {
  return (slugs || []).map((item) => slugify(item)).filter(Boolean).join("/");
}

function ensureValidProductCategoryPath(payload, categoriesWithPaths) {
  const productCategory = slugify(payload.category);
  const pathSlugs = Array.isArray(payload.categoryPathSlugs)
    ? payload.categoryPathSlugs.map((item) => slugify(item)).filter(Boolean)
    : [];

  if (!productCategory) {
    throw badRequest("Category is required.");
  }

  if (!pathSlugs.length) {
    return;
  }

  if (pathSlugs[0] !== productCategory) {
    throw badRequest("Category path must start with the selected main category.");
  }

  const validKeys = new Set(categoriesWithPaths.map((category) => category.pathKey));
  const key = pathKeyFromSlugs(pathSlugs);
  if (!validKeys.has(key)) {
    throw badRequest("Selected category path does not exist.");
  }
}

function collectDescendantIds(rootId, categoriesWithPaths) {
  const byParent = new Map();
  for (const category of categoriesWithPaths) {
    const key = category.parentId || "ROOT";
    if (!byParent.has(key)) {
      byParent.set(key, []);
    }
    byParent.get(key).push(category.id);
  }

  const descendants = new Set();
  const queue = [rootId];

  while (queue.length) {
    const currentId = queue.shift();
    const children = byParent.get(currentId) || [];
    for (const childId of children) {
      if (!descendants.has(childId)) {
        descendants.add(childId);
        queue.push(childId);
      }
    }
  }

  return descendants;
}

async function getAdminSession(req, res) {
  res.json({ ok: true, userId: req.userId });
}

async function getAdminProducts(_req, res) {
  const products = await listProducts();
  res.json(products);
}

async function createAdminProduct(req, res) {
  const categoriesWithPaths = await listCategoriesWithPaths();
  ensureValidProductCategoryPath(req.body, categoriesWithPaths);

  const normalized = normalizeProduct(req.body, undefined);
  const conflicting = await findProductBySlugExcludingId(normalized.slug, normalized.id);

  if (conflicting) {
    throw badRequest("Another product already uses that slug.");
  }

  const created = await createProduct(normalized);
  res.status(201).json(created);
}

async function updateAdminProduct(req, res) {
  const existing = await getProductById(req.params.id);
  if (!existing) {
    throw notFound("Product not found.");
  }

  const categoriesWithPaths = await listCategoriesWithPaths();
  ensureValidProductCategoryPath(req.body, categoriesWithPaths);

  const normalized = normalizeProduct({ ...req.body, id: req.params.id }, existing);
  const conflicting = await findProductBySlugExcludingId(normalized.slug, normalized.id);

  if (conflicting) {
    throw badRequest("Another product already uses that slug.");
  }

  const updated = await updateProduct(req.params.id, normalized);
  res.json(updated);
}

async function deleteAdminProduct(req, res) {
  await deleteProduct(req.params.id);
  res.json({ ok: true });
}

async function getAdminOrders(_req, res) {
  const orders = await listOrders();
  res.json(orders);
}

async function getAdminOrderById(req, res) {
  const order = await getOrderById(req.params.id);
  if (!order) throw notFound("Order not found.");
  res.json(order);
}

async function updateAdminOrder(req, res) {
  const updated = await updateOrder(req.params.id, req.body || {});
  if (!updated) throw notFound("Order not found.");
  res.json(updated);
}

async function getAdminSubscribers(_req, res) {
  const subscribers = await listSubscribers();
  res.json(subscribers);
}

async function getAdminCategories(_req, res) {
  const [tree, flat] = await Promise.all([listCategoryTree(), listCategoriesWithPaths()]);
  res.json({ tree, flat });
}

async function createAdminCategory(req, res) {
  const name = String(req.body?.name || "").trim();
  const parentId = req.body?.parentId ? String(req.body.parentId).trim() : null;
  const slug = slugify(req.body?.slug || name);

  if (!name) {
    throw badRequest("Category name is required.");
  }

  if (!slug) {
    throw badRequest("Category slug is required.");
  }

  const existingSlug = await getCategoryBySlug(slug);
  if (existingSlug) {
    throw badRequest("Another category already uses that slug.");
  }

  if (parentId) {
    const parent = await getCategoryById(parentId);
    if (!parent) {
      throw badRequest("Parent category not found.");
    }
  }

  const created = await createCategory({
    name,
    slug,
    parentId,
    order: Number(req.body?.order) || 0,
  });
  res.status(201).json(created);
}

async function updateAdminCategory(req, res) {
  const id = req.params.id;
  const existing = await getCategoryById(id);
  if (!existing) {
    throw notFound("Category not found.");
  }

  const nextName = Object.prototype.hasOwnProperty.call(req.body || {}, "name")
    ? String(req.body.name || "").trim()
    : existing.name;
  const nextSlug = Object.prototype.hasOwnProperty.call(req.body || {}, "slug")
    ? slugify(req.body.slug || nextName)
    : existing.slug;
  const parentId = Object.prototype.hasOwnProperty.call(req.body || {}, "parentId")
    ? (req.body.parentId ? String(req.body.parentId).trim() : null)
    : existing.parentId;

  if (!nextName) {
    throw badRequest("Category name is required.");
  }

  if (!nextSlug) {
    throw badRequest("Category slug is required.");
  }

  if (parentId === id) {
    throw badRequest("Category cannot be its own parent.");
  }

  const slugOwner = await getCategoryBySlug(nextSlug);
  if (slugOwner && slugOwner.id !== id) {
    throw badRequest("Another category already uses that slug.");
  }

  if (parentId) {
    const parent = await getCategoryById(parentId);
    if (!parent) {
      throw badRequest("Parent category not found.");
    }

    const categoriesWithPaths = await listCategoriesWithPaths();
    const descendants = collectDescendantIds(id, categoriesWithPaths);
    if (descendants.has(parentId)) {
      throw badRequest("Cannot move category under one of its descendants.");
    }
  }

  const updated = await updateCategory(id, {
    name: nextName,
    slug: nextSlug,
    parentId,
    order: Object.prototype.hasOwnProperty.call(req.body || {}, "order")
      ? Number(req.body.order) || 0
      : existing.order,
  });

  res.json(updated);
}

async function deleteAdminCategory(req, res) {
  const existing = await getCategoryById(req.params.id);
  if (!existing) {
    throw notFound("Category not found.");
  }

  const categoriesWithPaths = await listCategoriesWithPaths();
  const hasChildren = categoriesWithPaths.some((category) => category.parentId === req.params.id);
  if (hasChildren) {
    throw badRequest("Delete child categories first.");
  }

  const inUse = await hasProductsUsingCategorySlug(existing.slug);
  if (inUse) {
    throw badRequest("Category is in use by one or more products.");
  }

  await deleteCategory(req.params.id);
  res.json({ ok: true });
}

module.exports = {
  getAdminSession,
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  getAdminOrders,
  getAdminOrderById,
  updateAdminOrder,
  getAdminSubscribers,
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
};
