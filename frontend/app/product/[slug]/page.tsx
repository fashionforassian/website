import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartControls from "@/components/AddToCartControls";
import ProductGrid from "@/components/ProductGrid";
import { formatPrice, products } from "@/lib/data";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
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

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="grid gap-4 sm:grid-cols-2">
          {product.images.map((image, index) => (
            <div key={image} className="relative h-[300px] bg-neutral-100 sm:h-[420px]">
              <Image
                src={image}
                alt={`${product.name} image ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        <article className="max-w-xl">
          <h1 className="font-heading text-4xl text-[#111111]">{product.name}</h1>
          <p className="mt-4 text-2xl text-[#222222]">{formatPrice(product.price)}</p>

          <AddToCartControls
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              image: product.image,
              price: product.price,
              sizes: product.sizes,
              colors: product.colors,
            }}
          />

          <div className="mt-10 border-t border-neutral-200 pt-6">
            <h2 className="mb-2 text-xs uppercase tracking-[0.18em] text-neutral-500">Product Description</h2>
            <p className="text-sm leading-7 text-[#222222]">{product.description}</p>
          </div>

          <div className="mt-6 border-t border-neutral-200 pt-6">
            <h2 className="mb-2 text-xs uppercase tracking-[0.18em] text-neutral-500">Fabric & Care</h2>
            <p className="text-sm leading-7 text-[#222222]">{product.fabricCare}</p>
          </div>
        </article>
      </section>

      <section className="mt-16">
        <h2 className="mb-8 font-heading text-3xl text-[#111111]">Related Products</h2>
        <ProductGrid products={relatedProducts} />
      </section>
    </main>
  );
}
