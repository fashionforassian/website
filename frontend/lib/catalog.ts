import { promises as fs } from "fs";
import path from "path";
import { unstable_noStore as noStore } from "next/cache";
import {
  type Category,
  categoryMeta,
  seedProducts,
  type Product,
  type ProductColorVariant,
  type SeedProduct,
} from "@/lib/data";
import { getColorSwatchValue } from "@/lib/product-options";

type CatalogOverrides = {
  upserts: Product[];
  deletedIds: string[];
};

export type ProductMutationInput = Omit<Product, "id" | "slug" | "sku"> & {
  id?: string;
  slug?: string;
  sku?: string;
};

const overridesPath = path.join(process.cwd(), "data", "catalog-overrides.json");

const categorySet = new Set<Category>(Object.keys(categoryMeta) as Category[]);

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

function normalizeList(items: string[]): string[] {
  return unique(
    items
      .map((item) => item.trim())
      .filter(Boolean),
  );
}

function normalizeColorVariants(
  input: {
    colors?: string[];
    images?: string[];
    image?: string;
    colorVariants?: ProductColorVariant[];
  },
  existing?: Product,
): ProductColorVariant[] {
  const fallbackImages = normalizeList(
    input.images?.length
      ? input.images
      : input.image
        ? [input.image]
        : existing?.images ?? [],
  );
  const rawVariants = Array.isArray(input.colorVariants) ? input.colorVariants : [];

  if (rawVariants.length > 0) {
    return rawVariants.map((variant, index) => {
      const name = variant.name.trim() || input.colors?.[index]?.trim() || `Color ${index + 1}`;
      const images = normalizeList(
        variant.images.length ? variant.images : variant.image ? [variant.image] : fallbackImages,
      );
      const image = variant.image.trim() || images[0] || fallbackImages[0] || existing?.image || "";

      return {
        id: slugify(variant.id || name) || `color-${index + 1}`,
        name,
        swatch: getColorSwatchValue(name, variant.swatch),
        image,
        images: images.length ? images : image ? [image] : [],
      };
    });
  }

  const fallbackColors = normalizeList(input.colors ?? existing?.colors ?? []);
  const names = fallbackColors.length ? fallbackColors : ["Default"];

  return names.map((name, index) => ({
    id: slugify(name) || `color-${index + 1}`,
    name,
    swatch: getColorSwatchValue(name),
    image: fallbackImages[index] || fallbackImages[0] || existing?.image || "",
    images: fallbackImages.length ? fallbackImages : existing?.images ?? [],
  }));
}

function normalizeSeedProduct(product: SeedProduct): Product {
  return normalizeProduct(
    {
      ...product,
      sku: product.sku ?? product.id.toUpperCase(),
      compareAtPrice: product.compareAtPrice ?? null,
      inventory: product.inventory ?? 12,
      status: product.status ?? "active",
      isFeatured: product.isFeatured ?? product.popularity >= 90,
      isSale: product.isSale ?? false,
      tags: normalizeList(product.tags ?? [product.category, product.isNew ? "new" : "core"]),
      colorVariants: product.colorVariants ?? [],
    },
    undefined,
  );
}

function normalizeProduct(input: ProductMutationInput, existing?: Product): Product {
  const name = input.name.trim();
  const id = input.id ?? existing?.id ?? `p-${Date.now()}`;
  const slugBase = slugify(input.slug?.trim() || name || id);
  const slug = slugBase || id;
  const colorVariants = normalizeColorVariants(input, existing).filter((variant) => variant.image);
  const colors = normalizeList(colorVariants.map((variant) => variant.name));
  const sizes = normalizeList(input.sizes);
  const images = normalizeList([
    ...input.images,
    ...colorVariants.flatMap((variant) => variant.images),
  ]);
  const image = input.image.trim() || colorVariants[0]?.image || images[0] || existing?.image || "";
  const price = Number(input.price);
  const compareAtPrice =
    input.compareAtPrice && input.compareAtPrice > price ? Number(input.compareAtPrice) : null;
  const inventory = Math.max(0, Math.floor(Number(input.inventory)));

  if (!categorySet.has(input.category)) {
    throw new Error("Invalid category.");
  }

  if (!name) {
    throw new Error("Product name is required.");
  }

  if (!image) {
    throw new Error("A primary image is required.");
  }

  if (!images.length) {
    throw new Error("At least one product image is required.");
  }

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error("Price must be greater than 0.");
  }

  return {
    id,
    slug,
    sku: input.sku?.trim() || existing?.sku || slug.toUpperCase(),
    name,
    price,
    compareAtPrice,
    category: input.category,
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
    description: input.description.trim(),
    fabricCare: input.fabricCare.trim(),
    popularity: Math.max(1, Math.min(100, Math.floor(Number(input.popularity) || 1))),
    inventory,
    status: input.status,
    isNew: Boolean(input.isNew),
    isFeatured: Boolean(input.isFeatured),
    isSale: Boolean(input.isSale) || Boolean(compareAtPrice),
    tags: normalizeList(input.tags),
  };
}

async function readOverrides(): Promise<CatalogOverrides> {
  try {
    const file = await fs.readFile(overridesPath, "utf-8");
    const parsed = JSON.parse(file) as Partial<CatalogOverrides>;
    return {
      upserts: Array.isArray(parsed.upserts) ? parsed.upserts : [],
      deletedIds: Array.isArray(parsed.deletedIds) ? parsed.deletedIds : [],
    };
  } catch {
    return { upserts: [], deletedIds: [] };
  }
}

async function writeOverrides(overrides: CatalogOverrides): Promise<void> {
  await fs.mkdir(path.dirname(overridesPath), { recursive: true });
  await fs.writeFile(overridesPath, `${JSON.stringify(overrides, null, 2)}\n`, "utf-8");
}

export async function getProducts(): Promise<Product[]> {
  noStore();
  const overrides = await readOverrides();
  const deletedIds = new Set(overrides.deletedIds);
  const upsertMap = new Map(overrides.upserts.map((product) => [product.id, product]));
  const merged = seedProducts
    .map(normalizeSeedProduct)
    .filter((product) => !deletedIds.has(product.id))
    .map((product) => upsertMap.get(product.id) ?? product);

  for (const product of overrides.upserts) {
    if (!seedProducts.some((seed) => seed.id === product.id) && !deletedIds.has(product.id)) {
      merged.push(product);
    }
  }

  return merged.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getVisibleProducts(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((product) => product.status === "active" && product.category !== "women");
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getVisibleProducts();
  return products.find((product) => product.slug === slug);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((product) => product.id === id);
}

export async function saveProduct(input: ProductMutationInput): Promise<Product> {
  const overrides = await readOverrides();
  const currentProducts = await getProducts();
  const existing = currentProducts.find((product) => product.id === input.id);
  const normalized = normalizeProduct(input, existing);
  const conflicting = currentProducts.find(
    (product) => product.slug === normalized.slug && product.id !== normalized.id,
  );

  if (conflicting) {
    throw new Error("Another product already uses that slug.");
  }

  const nextUpserts = overrides.upserts.filter((product) => product.id !== normalized.id);
  nextUpserts.push(normalized);

  await writeOverrides({
    upserts: nextUpserts,
    deletedIds: overrides.deletedIds.filter((deletedId) => deletedId !== normalized.id),
  });

  return normalized;
}

export async function deleteProduct(id: string): Promise<void> {
  const overrides = await readOverrides();
  await writeOverrides({
    upserts: overrides.upserts.filter((product) => product.id !== id),
    deletedIds: unique([...overrides.deletedIds, id]),
  });
}

export function getEffectivePrice(product: Product): number {
  return product.price;
}

export function isProductAvailable(product: Product): boolean {
  return product.status === "active" && product.inventory > 0;
}

export function getCategoryOptions(): Category[] {
  return Object.keys(categoryMeta) as Category[];
}
