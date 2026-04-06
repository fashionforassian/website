import ProductsCatalog from "@/components/ProductsCatalog";
import { fetchBackendJson } from "@/lib/backend-api";
import { type Product } from "@/lib/data";

type ProductsPageProps = {
  searchParams: Promise<{ sort?: string }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { sort } = await searchParams;
  const products = await fetchBackendJson<Product[]>("/api/products");

  return <ProductsCatalog products={products} initialSort={sort ?? "newest"} />;
}
