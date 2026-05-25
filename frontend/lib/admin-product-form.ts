import { type Category, type ProductStatus } from "@/lib/data";

export type EditableColorVariant = {
  id: string;
  name: string;
  swatch: string;
  image: string;
  images: string[];
};

export type EditableVariantStock = {
  id: string;
  color: string;
  size: string;
  inventory: string;
  price: string;
};

export type ProductFormState = {
  id?: string;
  name: string;
  slug: string;
  sku: string;
  category: Category;
  categoryPathSlugs: string[];
  price: string;
  compareAtPrice: string;
  inventory: string;
  status: ProductStatus;
  isNew: boolean;
  isFeatured: boolean;
  isSale: boolean;
  description: string;
  fabricCare: string;
  image: string;
  images: string[];
  sizes: string[];
  tags: string[];
  colorVariants: EditableColorVariant[];
  variantStocks: EditableVariantStock[];
};
