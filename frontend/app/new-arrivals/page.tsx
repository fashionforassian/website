import Image from "next/image";
import Link from "next/link";
import { formatPrice, products } from "@/lib/data";

const arrivals = products.filter((item) => item.isNew);

const drops = [
  { week: "Drop 01", date: "March 03", focus: "Soft tailoring and modern linen" },
  { week: "Drop 02", date: "March 10", focus: "Utility outerwear and refined knitwear" },
  { week: "Drop 03", date: "March 17", focus: "Accessories and footwear edit" },
];

export default function NewArrivalsPage() {
  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-10 md:px-8 md:py-14">
      <header className="mb-10 border-b border-neutral-200 pb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Latest Pieces</p>
        <h1 className="mt-3 font-heading text-5xl text-[#111111]">New Arrivals</h1>
      </header>

      <section className="grid gap-8 lg:grid-cols-[320px,1fr]">
        <aside className="border border-neutral-200 p-6">
          <h2 className="font-heading text-3xl text-[#111111]">Drop Calendar</h2>
          <div className="relative mt-6 space-y-6 pl-5 before:absolute before:left-1 before:top-0 before:h-full before:w-px before:bg-neutral-300">
            {drops.map((drop) => (
              <article key={drop.week} className="relative">
                <span className="absolute -left-[19px] top-1 h-2 w-2 rounded-full bg-[#111111]" />
                <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">{drop.date}</p>
                <h3 className="mt-1 text-sm uppercase tracking-[0.12em] text-[#111111]">{drop.week}</h3>
                <p className="mt-1 text-sm leading-6 text-[#222222]">{drop.focus}</p>
              </article>
            ))}
          </div>
        </aside>

        <div className="space-y-4">
          {arrivals.map((item) => (
            <Link
              key={item.id}
              href={`/product/${item.slug}`}
              className="group grid gap-4 border border-neutral-200 p-4 sm:grid-cols-[160px,1fr]"
            >
              <div className="relative h-44 bg-neutral-100 sm:h-40">
                <Image src={item.image} alt={item.name} fill className="object-cover transition duration-500 group-hover:scale-[1.03]" />
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Just In</p>
                  <h2 className="mt-1 text-base uppercase tracking-[0.12em] text-[#111111]">{item.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#222222]">{item.description}</p>
                </div>
                <p className="mt-3 text-sm text-[#111111]">{formatPrice(item.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
