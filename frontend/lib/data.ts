export type Category = "men" | "women" | "accessories" | "footwear" | "kids";

export type ProductStatus = "active" | "draft" | "archived";

export type ProductColorVariant = {
  id: string;
  name: string;
  swatch: string;
  image: string;
  images: string[];
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  category: Category;
  colors: string[];
  sizes: string[];
  image: string;
  images: string[];
  colorVariants: ProductColorVariant[];
  description: string;
  fabricCare: string;
  popularity: number;
  inventory: number;
  status: ProductStatus;
  isNew: boolean;
  isFeatured: boolean;
  isSale: boolean;
  tags: string[];
};

export type SeedProduct = Omit<
  Product,
  "sku" | "compareAtPrice" | "inventory" | "status" | "isFeatured" | "isSale" | "tags" | "colorVariants"
> &
  Partial<
    Pick<
      Product,
      "sku" | "compareAtPrice" | "inventory" | "status" | "isFeatured" | "isSale" | "tags" | "colorVariants"
    >
  >;

export const navCategories: Array<{ label: string; href: string }> = [
  { label: "Men", href: "/men" },
  { label: "Kids", href: "/kids" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Collections", href: "/collections" },
  { label: "Sale", href: "/sale" },
];

export const featuredCollections = [
  {
    title: "Resort Linen",
    subtitle: "Lightweight silhouettes for tropical city days",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Monochrome Tailoring",
    subtitle: "Refined essentials inspired by metropolitan nights",
    image:
      "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "Street Atelier",
    subtitle: "Modern cuts blending utility with elevated detail",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
  },
];

export const categoryShowcase: Array<{
  name: string;
  slug: Category;
  image: string;
}> = [
  {
    name: "Men",
    slug: "men",
    image:
      "https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    name: "Accessories",
    slug: "accessories",
    image:
      "https://images.pexels.com/photos/934063/pexels-photo-934063.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    name: "Footwear",
    slug: "footwear",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
  },
];

export const seedProducts: SeedProduct[] = [
  {
    id: "p-1",
    slug: "tailored-linen-blazer",
    name: "Tailored Linen Blazer",
    price: 129,
    category: "women",
    colors: ["Ivory", "Black"],
    sizes: ["XS", "S", "M", "L"],
    image:
      "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=1200&q=80",
      "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    ],
    description:
      "A single-breasted linen blazer with a relaxed, architectural line and soft shoulder structure.",
    fabricCare: "55% linen, 45% cotton. Dry clean recommended.",
    popularity: 94,
    isNew: true,
  },
  {
    id: "p-2",
    slug: "relaxed-pleat-trousers",
    name: "Relaxed Pleat Trousers",
    price: 89,
    category: "men",
    colors: ["Stone", "Charcoal"],
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://images.pexels.com/photos/7691080/pexels-photo-7691080.jpeg?auto=compress&cs=tinysrgb&w=900",
    images: [
      "https://images.pexels.com/photos/7691080/pexels-photo-7691080.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
      "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    description:
      "Straight-leg trousers with double pleats and an easy drape for day-to-evening transitions.",
    fabricCare: "70% polyester, 28% viscose, 2% elastane. Cold gentle wash.",
    popularity: 88,
    isNew: true,
  },
  {
    id: "p-3",
    slug: "sculpted-knit-top",
    name: "Sculpted Knit Top",
    price: 59,
    category: "women",
    colors: ["Black", "Beige"],
    sizes: ["XS", "S", "M"],
    image:
      "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=1200&q=80",
      "https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
    ],
    description:
      "Fine-rib knit top designed with a close fit and clean neckline.",
    fabricCare: "66% viscose, 34% nylon. Hand wash cold and dry flat.",
    popularity: 90,
    isNew: false,
  },
  {
    id: "p-4",
    slug: "leather-crossbody-mini",
    name: "Leather Crossbody Mini",
    price: 139,
    category: "accessories",
    colors: ["Cocoa", "Black"],
    sizes: ["One Size"],
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80",
      "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1200&q=80",
    ],
    description:
      "Compact structured bag with adjustable strap and brushed metal hardware.",
    fabricCare: "100% leather. Wipe with soft dry cloth.",
    popularity: 83,
    isNew: false,
  },
  {
    id: "p-5",
    slug: "minimal-low-top-sneakers",
    name: "Minimal Low-Top Sneakers",
    price: 119,
    category: "footwear",
    colors: ["White", "Sand"],
    sizes: ["39", "40", "41", "42", "43"],
    image:
      "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=900",
    images: [
      "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
      "https://images.pexels.com/photos/2385477/pexels-photo-2385477.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    description:
      "Refined leather sneakers with tonal sole and low-profile construction.",
    fabricCare: "Leather upper and rubber outsole. Spot clean only.",
    popularity: 96,
    isNew: true,
  },
  {
    id: "p-6",
    slug: "oversized-poplin-shirt",
    name: "Oversized Poplin Shirt",
    price: 69,
    category: "women",
    colors: ["White", "Sky"],
    sizes: ["XS", "S", "M", "L"],
    image:
      "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=1200&q=80",
      "https://images.pexels.com/photos/1036627/pexels-photo-1036627.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80",
    ],
    description:
      "Relaxed cotton poplin shirt cut long with a sharp point collar.",
    fabricCare: "100% cotton. Machine wash at 30C.",
    popularity: 79,
    isNew: false,
  },
  {
    id: "p-7",
    slug: "utility-bomber-jacket",
    name: "Utility Bomber Jacket",
    price: 149,
    category: "men",
    colors: ["Olive", "Black"],
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://images.pexels.com/photos/1040421/pexels-photo-1040421.jpeg?auto=compress&cs=tinysrgb&w=900",
    images: [
      "https://images.pexels.com/photos/1040421/pexels-photo-1040421.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
      "https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    description:
      "Technical bomber with matte finish, concealed pockets, and lightweight insulation.",
    fabricCare: "Shell: 100% nylon. Lining: 100% polyester. Gentle wash.",
    popularity: 87,
    isNew: true,
  },
  {
    id: "p-8",
    slug: "woven-belted-midi-dress",
    name: "Woven Belted Midi Dress",
    price: 109,
    category: "women",
    colors: ["Sand", "Ink"],
    sizes: ["XS", "S", "M", "L"],
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80",
      "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
    ],
    description:
      "Fluid midi dress with removable belt and understated side seam pockets.",
    fabricCare: "100% viscose. Cold hand wash.",
    popularity: 81,
    isNew: true,
  },
  {
    id: "p-9",
    slug: "structured-tote",
    name: "Structured Tote",
    price: 159,
    category: "accessories",
    colors: ["Taupe", "Black"],
    sizes: ["One Size"],
    image:
      "https://images.pexels.com/photos/2081199/pexels-photo-2081199.jpeg?auto=compress&cs=tinysrgb&w=900",
    images: [
      "https://images.pexels.com/photos/2081199/pexels-photo-2081199.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80",
      "https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    description:
      "Large tote with structured profile and reinforced handles for daily use.",
    fabricCare: "100% leather. Keep away from moisture.",
    popularity: 85,
    isNew: false,
  },
  {
    id: "p-10",
    slug: "soft-calf-ankle-boots",
    name: "Soft Calf Ankle Boots",
    price: 179,
    category: "footwear",
    colors: ["Black", "Mocha"],
    sizes: ["36", "37", "38", "39", "40"],
    image:
      "https://images.unsplash.com/photo-1608256246200-53e8b47b6a21?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1608256246200-53e8b47b6a21?auto=format&fit=crop&w=1200&q=80",
      "https://images.pexels.com/photos/267202/pexels-photo-267202.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80",
    ],
    description:
      "Minimal ankle boots crafted with soft calf leather and stacked heel.",
    fabricCare: "Leather upper and lining. Professional care recommended.",
    popularity: 89,
    isNew: false,
  },
  {
    id: "p-11",
    slug: "fine-merino-crewneck",
    name: "Fine Merino Crewneck",
    price: 79,
    category: "men",
    colors: ["Camel", "Navy"],
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?auto=format&fit=crop&w=1200&q=80",
      "https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=1200&q=80",
    ],
    description:
      "Fine-gauge merino crewneck with a refined fit and ribbed finish.",
    fabricCare: "100% merino wool. Hand wash cold.",
    popularity: 86,
    isNew: true,
  },
  {
    id: "p-12",
    slug: "layered-chain-necklace",
    name: "Layered Chain Necklace",
    price: 49,
    category: "accessories",
    colors: ["Muted Gold"],
    sizes: ["One Size"],
    image:
      "https://images.pexels.com/photos/1099816/pexels-photo-1099816.jpeg?auto=compress&cs=tinysrgb&w=900",
    images: [
      "https://images.pexels.com/photos/1099816/pexels-photo-1099816.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
      "https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    description:
      "Delicate layered necklace set in a muted gold finish.",
    fabricCare: "Brass alloy with protective finish. Avoid water and perfume.",
    popularity: 78,
    isNew: true,
  },
];

export const promotionalBanner = {
  title: "Mid-Season Edit",
  subtitle: "Up to 30% on selected pieces crafted for the warmer season.",
  cta: "Shop The Edit",
  href: "/products",
};

export const editorialCampaign = {
  title: "Campaign 2026: Movement In Form",
  description:
    "A study in contrast where fluid tailoring meets urban function. Discover silhouettes designed for pace, texture, and contemporary city life.",
  image:
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80",
};

export const categoryMeta: Record<Category, { title: string; banner: string }> = {
  men: {
    title: "Menswear",
    banner:
      "https://images.pexels.com/photos/5378700/pexels-photo-5378700.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  kids: {
  title: "Kids",
  banner: "https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  women: {
    title: "Womenswear",
    banner:
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1600&q=80",
  },
  accessories: {
    title: "Accessories",
    banner:
      "https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  footwear: {
    title: "Footwear",
    banner:
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1600&q=80",
  },
};

export function formatPrice(price: number): string {
  return `₹${price.toFixed(2)}`;
}

export function sortProducts(items: Product[], sort: string | undefined): Product[] {
  const copy = [...items];

  switch (sort) {
    case "price-low-high":
      return copy.sort((a, b) => a.price - b.price);
    case "price-high-low":
      return copy.sort((a, b) => b.price - a.price);
    case "popularity":
      return copy.sort((a, b) => b.popularity - a.popularity);
    case "newest":
    default:
      return copy.sort((a, b) => Number(b.isNew) - Number(a.isNew));
  }
}
