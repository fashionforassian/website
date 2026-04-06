import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import { fetchBackendJson } from "@/lib/backend-api";
import { categoryMeta, type Category, type Product } from "@/lib/data";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

const itemsPerPage = 8;

const validCategories: Category[] = ["men", "accessories", "footwear", "kids"];

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;

  if (!validCategories.includes(slug as Category)) {
    notFound();
  }

  const currentCategory = slug as Category;
  const products = await fetchBackendJson<Product[]>("/api/products");
  const categoryProducts = products.filter((item) => item.category === currentCategory);
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page ?? 1));
  const totalPages = Math.max(1, Math.ceil(categoryProducts.length / itemsPerPage));
  const normalizedPage = Math.min(currentPage, totalPages);
  const paginated = categoryProducts.slice(
    (normalizedPage - 1) * itemsPerPage,
    normalizedPage * itemsPerPage,
  );

  const meta = categoryMeta[currentCategory];

  return (
    <main className="pb-14">
      <section className="relative h-[44vh] min-h-[280px]">
        <Image src={meta.banner} alt={meta.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 mx-auto flex w-full max-w-[1400px] items-end px-4 pb-10 md:px-8">
          <h1 className="font-heading text-3xl text-white sm:text-4xl md:text-5xl">{meta.title}</h1>
        </div>
      </section>

      <section className="mx-auto mt-10 grid w-full max-w-[1400px] gap-8 px-4 md:px-8 lg:grid-cols-[280px,1fr]">
        <div className="border border-neutral-200 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Category Insights</p>
          <h2 className="mt-3 font-heading text-2xl text-[#111111] sm:text-3xl">{meta.title}</h2>
          <p className="mt-4 text-sm leading-7 text-[#222222]">
            Browse the latest {meta.title.toLowerCase()} edit. Inventory, pricing, and merchandising
            now update directly from the admin panel.
          </p>
          <div className="mt-6 space-y-2 text-xs uppercase tracking-[0.16em] text-neutral-500">
            <p>{categoryProducts.length} Products</p>
            <p>{categoryProducts.filter((item) => item.inventory > 0).length} Available</p>
            <p>{categoryProducts.filter((item) => item.isFeatured).length} Featured</p>
          </div>
        </div>
        <div>
          <ProductGrid products={paginated} />

          <nav className="mt-10 flex flex-wrap items-center gap-2" aria-label="Pagination">
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              const isActive = pageNumber === normalizedPage;

              return (
                <Link
                  key={pageNumber}
                  href={`/category/${currentCategory}?page=${pageNumber}`}
                  className={`border px-4 py-2 text-xs uppercase tracking-[0.12em] ${
                    isActive
                      ? "border-[#111111] bg-[#111111] text-white"
                      : "border-neutral-300 text-[#222222] hover:border-[#111111]"
                  }`}
                >
                  {pageNumber}
                </Link>
              );
            })}
          </nav>
        </div>
      </section>
    </main>
  );
}
