import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import FilterSidebar from "@/components/FilterSidebar";
import ProductGrid from "@/components/ProductGrid";
import { categoryMeta, products, type Category } from "@/lib/data";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

const itemsPerPage = 8;

const validCategories: Category[] = ["men", "women", "accessories", "footwear"];

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;

  if (!validCategories.includes(slug as Category)) {
    notFound();
  }

  const currentCategory = slug as Category;
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
          <h1 className="font-heading text-4xl text-white md:text-5xl">{meta.title}</h1>
        </div>
      </section>

      <section className="mx-auto mt-10 grid w-full max-w-[1400px] gap-8 px-4 md:px-8 lg:grid-cols-[280px,1fr]">
        <FilterSidebar title="Refine Selection" />
        <div>
          <ProductGrid products={paginated} />

          <nav className="mt-10 flex items-center gap-2" aria-label="Pagination">
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
