const { getCollection } = require("../config/db");

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function buildPathLookup(categories) {
  const byId = new Map(categories.map((category) => [category.id, category]));

  function buildPath(category) {
    const path = [];
    const seen = new Set();
    let current = category;

    while (current) {
      if (seen.has(current.id)) {
        break;
      }
      seen.add(current.id);
      path.unshift(current);
      current = current.parentId ? byId.get(current.parentId) : null;
    }

    return path;
  }

  const withPaths = categories.map((category) => {
    const path = buildPath(category);

    return {
      ...category,
      depth: Math.max(path.length - 1, 0),
      pathIds: path.map((item) => item.id),
      pathSlugs: path.map((item) => item.slug),
      pathLabels: path.map((item) => item.name),
      pathKey: path.map((item) => item.slug).join("/"),
    };
  });

  return withPaths;
}

function buildCategoryTree(categoriesWithPaths) {
  const byId = new Map(
    categoriesWithPaths.map((category) => [
      category.id,
      { ...category, children: [] },
    ]),
  );

  const roots = [];

  for (const category of categoriesWithPaths) {
    const node = byId.get(category.id);

    if (!category.parentId) {
      roots.push(node);
      continue;
    }

    const parent = byId.get(category.parentId);
    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  function sortNodes(nodes) {
    nodes.sort((a, b) => {
      const orderA = Number.isFinite(a.order) ? a.order : 0;
      const orderB = Number.isFinite(b.order) ? b.order : 0;
      if (orderA !== orderB) return orderA - orderB;
      return String(a.name).localeCompare(String(b.name));
    });

    for (const node of nodes) {
      sortNodes(node.children);
    }
  }

  sortNodes(roots);
  return roots;
}

async function listCategoriesRaw() {
  const collection = await getCollection("categories");
  return collection.find({}, { projection: { _id: 0 } }).toArray();
}

async function listCategoriesWithPaths() {
  const categories = await listCategoriesRaw();
  return buildPathLookup(categories);
}

async function listCategoryTree() {
  const withPaths = await listCategoriesWithPaths();
  return buildCategoryTree(withPaths);
}

async function getCategoryById(id) {
  const collection = await getCollection("categories");
  return collection.findOne({ id }, { projection: { _id: 0 } });
}

async function getCategoryBySlug(slug) {
  const collection = await getCollection("categories");
  return collection.findOne({ slug }, { projection: { _id: 0 } });
}

async function createCategory(input) {
  const collection = await getCollection("categories");
  const name = String(input.name || "").trim();
  const slug = slugify(input.slug || name);

  const category = {
    id: input.id || `cat_${Date.now()}`,
    name,
    slug,
    parentId: input.parentId || null,
    order: Number.isFinite(Number(input.order)) ? Number(input.order) : 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await collection.insertOne(category);
  return category;
}

async function updateCategory(id, patch) {
  const collection = await getCollection("categories");
  const nextPatch = {
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  if (Object.prototype.hasOwnProperty.call(nextPatch, "slug")) {
    nextPatch.slug = slugify(nextPatch.slug);
  }

  if (Object.prototype.hasOwnProperty.call(nextPatch, "name")) {
    nextPatch.name = String(nextPatch.name || "").trim();
  }

  if (Object.prototype.hasOwnProperty.call(nextPatch, "parentId")) {
    nextPatch.parentId = nextPatch.parentId || null;
  }

  await collection.updateOne({ id }, { $set: nextPatch });
  return collection.findOne({ id }, { projection: { _id: 0 } });
}

async function deleteCategory(id) {
  const collection = await getCollection("categories");
  await collection.deleteOne({ id });
}

module.exports = {
  slugify,
  buildCategoryTree,
  listCategoriesRaw,
  listCategoriesWithPaths,
  listCategoryTree,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
