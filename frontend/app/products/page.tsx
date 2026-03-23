import ProductsCatalog from "@/components/ProductsCatalog";
import { getVisibleProducts } from "@/lib/catalog";

type ProductsPageProps = {
  searchParams: Promise<{ sort?: string }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { sort } = await searchParams;
  const products = await getVisibleProducts();

  return <ProductsCatalog products={products} initialSort={sort ?? "newest"} />;
}
