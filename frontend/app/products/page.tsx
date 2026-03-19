import Link from "next/link";
import FilterSidebar from "@/components/FilterSidebar";
import ProductGrid from "@/components/ProductGrid";
import { products, sortProducts } from "@/lib/data";

type ProductsPageProps = {
  searchParams: Promise<{ sort?: string }>;
};

const sortOptions: Array<{ label: string; value: string }> = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-low-high" },
  { label: "Price: High to Low", value: "price-high-low" },
  { label: "Popularity", value: "popularity" },
];

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { sort } = await searchParams;
  const sortedProducts = sortProducts(products, sort);

  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-10 md:px-8 md:py-14">
      <header className="mb-8 border-b border-neutral-200 pb-5">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-neutral-500">Fashion Asia</p>
        <h1 className="font-heading text-4xl text-[#111111]">Shop All</h1>
      </header>

      <section className="mb-8 flex flex-wrap items-center gap-3 border border-neutral-200 p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Sort</p>
        {sortOptions.map((option) => {
          const isActive = (sort ?? "newest") === option.value;

          return (
            <Link
              key={option.value}
              href={`/products?sort=${option.value}`}
              className={`border px-3 py-2 text-[11px] uppercase tracking-[0.14em] transition ${
                isActive
                  ? "border-[#111111] bg-[#111111] text-white"
                  : "border-neutral-300 text-[#222222] hover:border-[#111111]"
              }`}
            >
              {option.label}
            </Link>
          );
        })}
      </section>

      <div className="grid gap-8 lg:grid-cols-[280px,1fr]">
        <FilterSidebar title="Filter Products" />
        <ProductGrid products={sortedProducts} />
      </div>
    </main>
  );
}
