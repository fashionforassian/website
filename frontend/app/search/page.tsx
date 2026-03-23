"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatPrice, type Product } from "@/lib/data";

const quickTerms = ["Linen", "Tailoring", "Sneakers", "Accessories", "New"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("q") ?? "");
  }, []);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        const response = await fetch("/api/products");
        const data = (await response.json()) as Product[];

        if (active) {
          setProducts(data);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      active = false;
    };
  }, []);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();

    if (!term) {
      return products.slice(0, 6);
    }

    return products.filter((item) => {
      const haystack =
        `${item.name} ${item.description} ${item.category} ${item.tags.join(" ")}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [products, query]);

  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-10 md:px-8 md:py-14">
      <header className="mb-8 grid gap-6 border border-neutral-200 p-6 md:grid-cols-[1.2fr,1fr] md:p-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Product Finder</p>
          <h1 className="mt-3 font-heading text-5xl text-[#111111]">Search</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#222222]">
            Explore all pieces by name, category, or style notes.
          </p>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for blazer, accessories, sneakers..."
            className="mt-6 h-12 w-full max-w-2xl border border-neutral-300 px-4 text-sm outline-none focus:border-[#111111]"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {quickTerms.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setQuery(term)}
                className="border border-neutral-300 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[#222222] hover:border-[#111111]"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        <div className="relative h-[260px] md:h-auto">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80"
            alt="Search campaign"
            fill
            className="object-cover"
          />
        </div>
      </header>

      <section>
        <div className="mb-5 flex items-end justify-between border-b border-neutral-200 pb-3">
          <h2 className="font-heading text-3xl text-[#111111]">Results</h2>
          <p className="text-xs uppercase tracking-[0.14em] text-neutral-500">{results.length} Items</p>
        </div>

        {loading ? (
          <div className="border border-neutral-200 p-8 text-sm text-[#222222]">Loading catalog...</div>
        ) : results.length === 0 ? (
          <div className="border border-neutral-200 p-8 text-sm text-[#222222]">
            No products found. Try another term.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((item) => (
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
