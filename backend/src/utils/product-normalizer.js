const { badRequest } = require("./http-error");

function unique(items) {
  return Array.from(new Set(items));
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function normalizeList(items) {
  return unique((items || []).map((item) => String(item || "").trim()).filter(Boolean));
}

function normalizeSlugList(items) {
  return unique(
    (items || [])
      .map((item) => slugify(item))
      .filter(Boolean),
  );
}

function getColorSwatchValue(name, fallback) {
  if (fallback && fallback.trim()) return fallback.trim();

  const map = {
    black: "#111111",
    white: "#F5F5F5",
    ivory: "#F4EFE7",
    beige: "#D9C9B3",
    stone: "#B5AA9A",
    charcoal: "#4A4A4A",
    navy: "#1F2A44",
    olive: "#4E5B45",
    sand: "#C7B59B",
    cocoa: "#6B4A3C",
    mocha: "#7A5A46",
    camel: "#A77C54",
    taupe: "#8A7A68",
    ink: "#263648",
    sky: "#9AB6D3",
  };

  return map[String(name || "").trim().toLowerCase()] || "#D4CEC3";
}

function normalizeColorVariants(input, existing) {
  const fallbackImages = normalizeList(
    (input.images && input.images.length ? input.images : input.image ? [input.image] : existing?.images) || [],
  );
  const rawVariants = Array.isArray(input.colorVariants) ? input.colorVariants : [];

  if (rawVariants.length > 0) {
    return rawVariants.map((variant, index) => {
      const name =
        String(variant.name || "").trim() || String(input.colors?.[index] || "").trim() || `Color ${index + 1}`;
      const images = normalizeList(
        (variant.images && variant.images.length
          ? variant.images
          : variant.image
            ? [variant.image]
            : fallbackImages) || [],
      );
      const image = String(variant.image || "").trim() || images[0] || fallbackImages[0] || existing?.image || "";

      return {
        id: slugify(variant.id || name) || `color-${index + 1}`,
        name,
        swatch: getColorSwatchValue(name, variant.swatch),
        image,
        images: images.length ? images : image ? [image] : [],
      };
    });
  }

  const fallbackColors = normalizeList(input.colors || existing?.colors || []);
  const names = fallbackColors.length ? fallbackColors : ["Default"];

  return names.map((name, index) => ({
    id: slugify(name) || `color-${index + 1}`,
    name,
    swatch: getColorSwatchValue(name),
    image: fallbackImages[index] || fallbackImages[0] || existing?.image || "",
    images: fallbackImages.length ? fallbackImages : existing?.images || [],
  }));
}

function normalizeProduct(input, existing) {
  const name = String(input.name || "").trim();
  const id = input.id || existing?.id || `p-${Date.now()}`;
  const slugBase = slugify(String(input.slug || "").trim() || name || id);
  const slug = slugBase || id;
  const colorVariants = normalizeColorVariants(input, existing).filter((variant) => variant.image);
  const colors = normalizeList(colorVariants.map((variant) => variant.name));
  const sizes = normalizeList(input.sizes || []);
  const images = normalizeList([...(input.images || []), ...colorVariants.flatMap((variant) => variant.images)]);
  const image = String(input.image || "").trim() || colorVariants[0]?.image || images[0] || existing?.image || "";
  const price = Number(input.price);
  const compareAtPrice = input.compareAtPrice && Number(input.compareAtPrice) > price ? Number(input.compareAtPrice) : null;
  const inventory = Math.max(0, Math.floor(Number(input.inventory)));
  const category = slugify(input.category || existing?.category);
  const categoryPathSlugsInput = normalizeSlugList(input.categoryPathSlugs || existing?.categoryPathSlugs || []);
  const categoryPathLabelsInput = normalizeList(input.categoryPathLabels || existing?.categoryPathLabels || []);

  const categoryPathSlugs = categoryPathSlugsInput.length
    ? categoryPathSlugsInput
    : category
      ? [category]
      : [];
  const categoryPathLabels = categoryPathLabelsInput.length
    ? categoryPathLabelsInput
    : categoryPathSlugs;

  if (!category) throw badRequest("Category is required.");
  if (!name) throw badRequest("Product name is required.");
  if (!image) throw badRequest("A primary image is required.");
  if (!images.length) throw badRequest("At least one product image is required.");
  if (!Number.isFinite(price) || price <= 0) throw badRequest("Price must be greater than 0.");
  if (categoryPathSlugs[0] !== category) {
    throw badRequest("Category path must start with the selected main category.");
  }

  return {
    id,
    slug,
    sku: String(input.sku || "").trim() || existing?.sku || slug.toUpperCase(),
    name,
    price,
    compareAtPrice,
    category,
    categoryPathSlugs,
    categoryPathLabels,
    subcategoryPath: categoryPathSlugs.slice(1),
    colors: colors.length ? colors : ["Default"],
    sizes: sizes.length ? sizes : ["One Size"],
    image,
    images,
    colorVariants: colorVariants.length
      ? colorVariants.map((variant) => ({
          ...variant,
          image: variant.image || image,
          images: normalizeList(variant.images.length ? variant.images : [variant.image || image]),
        }))
      : [
          {
            id: "default",
            name: "Default",
            swatch: "#D4CEC3",
            image,
            images,
          },
        ],
    description: String(input.description || "").trim(),
    fabricCare: String(input.fabricCare || "").trim(),
    popularity: Math.max(1, Math.min(100, Math.floor(Number(input.popularity) || 1))),
    inventory,
    status: input.status,
    isNew: Boolean(input.isNew),
    isFeatured: Boolean(input.isFeatured),
    isSale: Boolean(input.isSale) || Boolean(compareAtPrice),
    tags: normalizeList(input.tags || []),
  };
}

module.exports = {
  normalizeProduct,
  normalizeList,
};
