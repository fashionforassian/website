import Image from "next/image";
import Link from "next/link";
import { formatPrice, products } from "@/lib/data";

const womenProducts = products.filter((item) => item.category === "women");

const styleStories = [
  {
    title: "Soft Tailoring",
    caption: "Relaxed lines and precise drape for day-to-night wear.",
    image: "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Textural Layers",
    caption: "Knit, poplin, and linen balanced for warm-season structure.",
    image: "https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "After Hours",
    caption: "Statement silhouettes made minimal through detail and fit.",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function WomenPage() {
  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-10 md:px-8 md:py-14">
      <section className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="relative h-[460px] sm:h-[520px]">
            <Image
              src="https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1400&q=80"
              alt="Womenswear campaign main"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="space-y-6">
            <article className="border border-neutral-200 p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Womenswear</p>
              <h1 className="mt-3 font-heading text-4xl leading-tight text-[#111111]">Editorial Lines, Everyday Ease</h1>
              <p className="mt-4 text-sm leading-7 text-[#222222]">
                A focused wardrobe system built around movement, proportion, and understated sophistication.
              </p>
              <Link
                href="/products"
                className="mt-6 inline-block border border-[#111111] px-5 py-2 text-xs uppercase tracking-[0.18em] text-[#111111] hover:bg-[#111111] hover:text-white"
              >
                Shop Womenswear
              </Link>
            </article>
            <div className="relative h-[250px]">
              <Image
                src="https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Womenswear lookbook"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <aside className="border border-neutral-200 p-6">
          <h2 className="font-heading text-3xl text-[#111111]">Style Stories</h2>
          <div className="mt-5 space-y-6">
            {styleStories.map((story, index) => (
              <article key={story.title} className="grid grid-cols-[72px,1fr] gap-4">
                <div className="relative h-[72px]">
                  <Image src={story.image} alt={story.title} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">0{index + 1}</p>
                  <h3 className="mt-1 text-sm uppercase tracking-[0.12em] text-[#111111]">{story.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#222222]">{story.caption}</p>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className="mt-12">
        <h2 className="mb-6 font-heading text-3xl text-[#111111]">Womenswear Selection</h2>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {womenProducts.map((item, index) => (
            <Link key={item.id} href={`/product/${item.slug}`} className="group block">
              <div className={`relative overflow-hidden bg-neutral-100 ${index % 3 === 0 ? "h-[360px]" : "h-[440px]"}`}>
                <Image src={item.image} alt={item.name} fill className="object-cover transition duration-500 group-hover:scale-[1.03]" />
              </div>
              <div className="mt-3">
                <h3 className="text-sm uppercase tracking-[0.12em] text-[#111111]">{item.name}</h3>
                <p className="mt-1 text-sm text-[#222222]">{formatPrice(item.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
