import ProductsCatalog from "@/components/ProductsCatalog";
import { fetchBackendJson } from "@/lib/backend-api";
import { type Product } from "@/lib/data";

type ProductsPageProps = {
  searchParams: Promise<{ sort?: string }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { sort } = await searchParams;
  let products: Product[] = [];
  try {
    const payload = await fetchBackendJson<any>("/api/products");
    products = Array.isArray(payload) ? payload : (payload?.items || payload?.products || []);
  } catch {}

  return <ProductsCatalog products={products} initialSort={sort ?? "newest"} />;
}
