import Image from "next/image";
import Link from "next/link";
import { getVisibleProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/data";

export default async function KidsPage() {
  const products = await getVisibleProducts();
  const kidsProducts = products.filter((item) => item.category === "kids");

  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-10 md:px-8 md:py-14">
      <section className="grid gap-6 md:grid-cols-[1.1fr,1fr]">
        <article className="border border-neutral-200 bg-[#f5efe5] p-8 md:p-12">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Kids</p>
          <h1 className="mt-4 font-heading text-5xl leading-tight text-[#111111]">
            Play-ready pieces with clean silhouettes.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-[#222222]">
            Easy layers, comfortable fits, and bright essentials managed from the same live catalog as
            the rest of the store.
          </p>
          <Link
            href="/products"
            className="mt-7 inline-block border border-[#111111] px-6 py-3 text-xs uppercase tracking-[0.2em] text-[#111111] hover:bg-[#111111] hover:text-white"
          >
            Shop All Products
          </Link>
        </article>
        <div className="relative h-[420px] md:h-[520px]">
          <Image
            src="https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Kids campaign"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-6 flex items-end justify-between border-b border-neutral-200 pb-4">
          <h2 className="font-heading text-3xl text-[#111111]">Kids Selection</h2>
          <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">{kidsProducts.length} Items</p>
        </div>
        {kidsProducts.length === 0 ? (
          <div className="border border-neutral-200 p-8 text-sm text-[#222222]">
            No kids products yet. Add them from the admin page to publish them here.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {kidsProducts.map((item) => (
              <Link key={item.id} href={`/product/${item.slug}`} className="group border border-neutral-200 p-3">
                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                  <Image src={item.image} alt={item.name} fill className="object-cover transition duration-500 group-hover:scale-[1.03]" />
                </div>
                <h3 className="mt-3 text-sm uppercase tracking-[0.12em] text-[#111111]">{item.name}</h3>
                <p className="mt-1 text-sm text-[#222222]">{formatPrice(item.price)}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
