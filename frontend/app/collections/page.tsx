import Image from "next/image";
import Link from "next/link";
import { featuredCollections } from "@/lib/data";

const capsules = [
  {
    title: "City Heat",
    season: "Spring Summer",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Evening Structure",
    season: "Resort",
    image: "https://images.pexels.com/photos/6311387/pexels-photo-6311387.jpeg?auto=compress&cs=tinysrgb&w=1400",
  },
  {
    title: "Weekend Uniform",
    season: "Core",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=80",
  },
];

export default function CollectionsPage() {
  return (
    <main>
      <section className="mx-auto w-full max-w-[1200px] px-4 py-12 text-center md:px-8 md:py-16">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Fassion 4 Asian</p>
        <h1 className="mt-3 font-heading text-4xl text-[#111111] sm:text-5xl md:text-6xl">Collections</h1>
        <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-[#222222]">
          A curated sequence of seasonal narratives where each collection is built around material, movement, and city context.
        </p>
      </section>

      <section className="mx-auto w-full max-w-[1400px] space-y-8 px-4 pb-14 md:px-8 md:pb-20">
        {featuredCollections.map((collection, index) => (
          <article key={collection.title} className="grid gap-6 border border-neutral-200 p-4 md:grid-cols-2 md:p-6">
            <div className={`relative h-[320px] md:h-[420px] ${index % 2 === 1 ? "md:order-2" : ""}`}>
              <Image src={collection.image} alt={collection.title} fill className="object-cover" />
            </div>
            <div className={`flex items-center p-3 ${index % 2 === 1 ? "md:order-1" : ""}`}>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Collection 0{index + 1}</p>
                <h2 className="mt-3 font-heading text-3xl text-[#111111] sm:text-4xl">{collection.title}</h2>
                <p className="mt-4 text-sm leading-7 text-[#222222]">{collection.subtitle}</p>
                <Link
                  href="/products"
                  className="mt-6 inline-block border border-[#111111] px-5 py-2 text-xs uppercase tracking-[0.18em] text-[#111111] hover:bg-[#111111] hover:text-white"
                >
                  Explore Pieces
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="mx-auto w-full max-w-[1400px] px-4 pb-14 md:px-8 md:pb-20">
        <h2 className="mb-6 font-heading text-2xl text-[#111111] sm:text-3xl">Capsule Edits</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {capsules.map((capsule) => (
            <article key={capsule.title} className="group border border-neutral-200 p-4">
              <div className="relative h-72 overflow-hidden">
                <Image src={capsule.image} alt={capsule.title} fill className="object-cover transition duration-500 group-hover:scale-[1.03]" />
              </div>
              <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-neutral-500">{capsule.season}</p>
              <h3 className="mt-1 font-heading text-2xl text-[#111111]">{capsule.title}</h3>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
