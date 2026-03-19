import Image from "next/image";
import Link from "next/link";
import { categoryShowcase } from "@/lib/data";

export default function CategoryGrid() {
  return (
    <section className="mx-auto w-full max-w-[1400px] px-4 py-14 md:px-8 md:py-20">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="font-heading text-3xl text-[#111111] md:text-4xl">Shop By Category</h2>
        <Link href="/products" className="text-xs uppercase tracking-[0.18em] text-neutral-500 hover:text-[#111111]">
          View All
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categoryShowcase.map((category) => (
          <Link key={category.slug} href={`/category/${category.slug}`} className="group block">
            <div className="relative h-72 overflow-hidden">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.02]"
              />
            </div>
            <p className="mt-3 text-sm uppercase tracking-[0.16em] text-[#111111]">{category.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
