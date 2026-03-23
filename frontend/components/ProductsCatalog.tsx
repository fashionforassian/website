"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import FilterSidebar from "@/components/FilterSidebar";
import ProductGrid from "@/components/ProductGrid";
import { type Product } from "@/lib/data";

type ProductsCatalogProps = {
  products: Product[];
  initialSort?: string;
};

const sortOptions: Array<{ label: string; value: string }> = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-low-high" },
  { label: "Price: High to Low", value: "price-high-low" },
  { label: "Popularity", value: "popularity" },
];

function sortProducts(items: Product[], sort: string): Product[] {
  const copy = [...items];

  switch (sort) {
    case "price-low-high":
      return copy.sort((a, b) => a.price - b.price);
    case "price-high-low":
      return copy.sort((a, b) => b.price - a.price);
    case "popularity":
      return copy.sort((a, b) => b.popularity - a.popularity);
    case "newest":
    default:
      return copy.sort((a, b) => Number(b.isNew) - Number(a.isNew));
  }
}

export default function ProductsCatalog({
  products,
  initialSort = "newest",
}: ProductsCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [selectedColor, setSelectedColor] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("all");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((product) => product.category)))],
    [products],
  );
  const sizes = useMemo(
    () => ["All", ...Array.from(new Set(products.flatMap((product) => product.sizes)))],
    [products],
  );
  const colors = useMemo(
    () => ["All", ...Array.from(new Set(products.flatMap((product) => product.colors)))],
    [products],
  );

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      if (selectedCategory !== "All" && product.category !== selectedCategory.toLowerCase()) {
        return false;
      }

      if (selectedSize !== "All" && !product.sizes.includes(selectedSize)) {
        return false;
      }

      if (selectedColor !== "All" && !product.colors.includes(selectedColor)) {
        return false;
      }

      if (selectedPrice === "under-100" && product.price >= 100) {
        return false;
      }

      if (selectedPrice === "100-200" && (product.price < 100 || product.price > 200)) {
        return false;
      }

      if (selectedPrice === "over-200" && product.price <= 200) {
        return false;
      }

      return true;
    });

    return sortProducts(filtered, initialSort);
  }, [initialSort, products, selectedCategory, selectedColor, selectedPrice, selectedSize]);

  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedSize("All");
    setSelectedColor("All");
    setSelectedPrice("all");
  };

  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-10 md:px-8 md:py-14">
      <header className="mb-8 border-b border-neutral-200 pb-5">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-neutral-500">Fassion 4 Asian</p>
        <h1 className="font-heading text-4xl text-[#111111]">Shop All</h1>
      </header>

      <section className="mb-8 flex flex-wrap items-center gap-3 border border-neutral-200 p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Sort</p>
        {sortOptions.map((option) => {
          const isActive = initialSort === option.value;

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
        <FilterSidebar
          title="Filter Products"
          categories={categories}
          sizes={sizes}
          colors={colors}
          selectedCategory={selectedCategory}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          selectedPrice={selectedPrice}
          onCategoryChange={setSelectedCategory}
          onSizeChange={setSelectedSize}
          onColorChange={setSelectedColor}
          onPriceChange={setSelectedPrice}
          onReset={resetFilters}
        />
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-neutral-500">
            <span>{filteredProducts.length} Items</span>
            <span>{products.filter((product) => product.inventory === 0).length} Sold Out</span>
          </div>
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </main>
  );
}
