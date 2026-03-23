import Link from "next/link";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";
import ProductGrid from "@/components/ProductGrid";
import { getProductBySlug, getVisibleProducts } from "@/lib/catalog";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const products = await getVisibleProducts();
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
        <h2 className="mb-8 font-heading text-3xl text-[#111111]">Related Products</h2>
        <ProductGrid products={relatedProducts} />
      </section>
    </main>
  );
}
