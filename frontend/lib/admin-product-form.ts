import { type Category, type ProductStatus } from "@/lib/data";

export type EditableColorVariant = {
  id: string;
  name: string;
  swatch: string;
  image: string;
  images: string[];
};

export type ProductFormState = {
  id?: string;
  name: string;
  slug: string;
  sku: string;
  category: Category;
  price: string;
  compareAtPrice: string;
  inventory: string;
  popularity: string;
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
};
