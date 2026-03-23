import Image from "next/image";
import Link from "next/link";
import { getVisibleProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/data";

export default async function SalePage() {
  const products = await getVisibleProducts();
  const saleItems = products
    .filter((item) => item.isSale && item.compareAtPrice)
    .slice(0, 8);

  return (
    <main className="bg-[#faf8f4]">
      <section className="mx-auto w-full max-w-[1400px] px-4 py-10 md:px-8 md:py-14">
        <div className="grid gap-6 border border-neutral-300 bg-white p-6 md:grid-cols-[1.1fr,1fr] md:p-8">
          <article>
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Limited Offer</p>
            <h1 className="mt-3 font-heading text-5xl text-[#111111]">Seasonal Sale</h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#222222]">
              Selected styles are now reduced for a short period. Offer applies while stock lasts.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="border border-[#111111] bg-[#111111] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white">Up To 40% Off</span>
              <span className="border border-neutral-300 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[#222222]">Online Exclusive</span>
            </div>
          </article>
          <div className="relative h-[300px] md:h-[360px]">
            <Image
              src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=80"
              alt="Sale campaign"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1400px] px-4 pb-14 md:px-8 md:pb-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {saleItems.map((item) => (
            <Link key={item.id} href={`/product/${item.slug}`} className="group border border-neutral-300 bg-white p-3">
              <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                <Image src={item.image} alt={item.name} fill className="object-cover transition duration-500 group-hover:scale-[1.03]" />
              </div>
              <h2 className="mt-3 text-sm uppercase tracking-[0.12em] text-[#111111]">{item.name}</h2>
              <p className="mt-1 text-sm text-neutral-500 line-through">
                {formatPrice(item.compareAtPrice ?? item.price)}
              </p>
              <p className="text-base text-[#111111]">{formatPrice(item.price)}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
