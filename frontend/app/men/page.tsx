import Image from "next/image";
import Link from "next/link";
import { fetchBackendJson } from "@/lib/backend-api";
import { formatPrice, type Product } from "@/lib/data";

const wardrobeNotes = [
  {
    title: "Urban Tailoring",
    text: "Soft shoulders, relaxed fit, and breathable fabrics designed for daily movement.",
  },
  {
    title: "Utility Layering",
    text: "Functional outerwear and knitwear that adapts from office to evening.",
  },
  {
    title: "Neutral Rotation",
    text: "A focused palette of stone, charcoal, and navy for effortless styling.",
  },
];

export default async function MenPage() {
  const products = await fetchBackendJson<Product[]>("/api/products");
  const menProducts = products.filter((item) => item.category === "men");

  return (
    <main>
      <section className="mx-auto grid w-full max-w-[1400px] gap-6 px-4 py-10 md:grid-cols-[1.1fr,1fr] md:px-8 md:py-14">
        <article className="flex items-end bg-[#111111] p-8 text-white md:p-12">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#c8b79f]">Menswear</p>
            <h1 className="mt-4 font-heading text-4xl leading-tight sm:text-5xl">Built For A Faster City Rhythm</h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/90">
              Precision-cut layers and contemporary staples engineered for movement, climate, and sharp proportion.
            </p>
            <Link
              href="/products"
              className="mt-7 inline-block border border-white px-6 py-3 text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-[#111111]"
            >
              Shop Menswear
            </Link>
          </div>
        </article>
        <div className="relative h-[360px] sm:h-[420px] md:h-[520px]">
          <Image
            src="https://images.pexels.com/photos/5378700/pexels-photo-5378700.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Menswear campaign"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1400px] px-4 pb-14 md:px-8 md:pb-20">
        <div className="grid gap-5 md:grid-cols-3">
          {wardrobeNotes.map((note) => (
            <article key={note.title} className="border border-neutral-200 p-6">
              <h2 className="font-heading text-2xl text-[#111111]">{note.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#222222]">{note.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1400px] px-4 pb-14 md:px-8 md:pb-20">
        <div className="mb-6 flex items-end justify-between border-b border-neutral-200 pb-4">
          <h2 className="font-heading text-2xl text-[#111111] sm:text-3xl">Menswear Picks</h2>
          <Link href="/products" className="text-xs uppercase tracking-[0.18em] text-neutral-500 hover:text-[#111111]">
            View All
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {menProducts.slice(0, 8).map((item) => (
            <Link key={item.id} href={`/product/${item.slug}`} className="group border border-neutral-200 p-3">
              <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                <Image src={item.image} alt={item.name} fill className="object-cover transition duration-500 group-hover:scale-[1.03]" />
              </div>
              <h3 className="mt-3 text-sm uppercase tracking-[0.12em] text-[#111111]">{item.name}</h3>
              <p className="mt-1 text-sm text-[#222222]">{formatPrice(item.price)}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
