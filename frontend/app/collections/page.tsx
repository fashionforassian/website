import Image from "next/image";
import Link from "next/link";
import { featuredCollections } from "@/lib/data";

export default function CollectionsPage() {
  return (
    <main className="w-full bg-white">
      <section className="py-16 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-4">Fassion 4 Asian</p>
        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-black">
          Collections
        </h1>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 max-w-360 mx-auto pb-24 space-y-24">
        {featuredCollections.map((collection, index) => (
          <article key={collection.title} className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`relative h-[60vh] min-h-100 w-full bg-gray-50 ${index % 2 === 1 ? "md:order-2" : ""}`}>
              <Image src={collection.image} alt={collection.title} fill className="object-cover" />
            </div>
            <div className={`text-center md:text-left ${index % 2 === 1 ? "md:order-1 md:pl-12" : "md:pr-12"}`}>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Collection 0{index + 1}</p>
              <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-black mb-6">{collection.title}</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-8">{collection.subtitle}</p>
              <Link
                href="/products"
                className="inline-block bg-black text-white px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors"
              >
                Explore Pieces
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
