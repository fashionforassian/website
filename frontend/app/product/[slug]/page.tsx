import Link from "next/link";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";
import ProductGrid from "@/components/ProductGrid";
import { fetchBackendJson } from "@/lib/backend-api";
import { type Product } from "@/lib/data";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const products = await fetchBackendJson<Product[]>("/api/products");
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 4);

  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-10 md:px-8 md:py-14">
      <div className="mb-10 text-xs uppercase tracking-[0.14em] text-neutral-500">
        <Link href="/products" className="hover:text-[#111111]">
          Shop All
        </Link>
        <span className="mx-2">/</span>
        <span>{product.name}</span>
      </div>

      <ProductDetailClient product={product} />

      <section className="mt-16">
        <h2 className="mb-8 font-heading text-2xl text-[#111111] sm:text-3xl">Related Products</h2>
        <ProductGrid products={relatedProducts} />
      </section>
    </main>
  );
}
