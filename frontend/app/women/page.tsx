import Image from "next/image";
import Link from "next/link";
import { fetchBackendJson } from "@/lib/backend-api";
import { formatPrice, type Product } from "@/lib/data";

export default async function WomenPage() {
  let products: Product[] = [];
  try {
    const payload = await fetchBackendJson<any>("/api/products");
    products = Array.isArray(payload) ? payload : (payload?.items || payload?.products || []);
  } catch {}

  const womenProducts = products.filter((item) => item.category === "women");

  return (
    <main className="w-full bg-white">
      <section className="relative flex h-[60vh] min-h-100 w-full items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2400&auto=format&fit=crop"
          alt="Womenswear Collection"
          fill
          priority
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em]">Fassion 4 Asian</p>
          <h1 className="text-5xl font-bold uppercase tracking-tight drop-shadow-lg md:text-7xl">
            Womenswear
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-360 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-black">All Women&apos;s</h2>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">{womenProducts.length} Items</p>
        </div>

        {womenProducts.length === 0 ? (
          <div className="py-20 text-center text-sm uppercase tracking-widest text-gray-500">
            No women&apos;s products yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {womenProducts.map((item) => (
              <Link key={item.id} href={`/product/${item.slug}`} className="group block">
                <div className="relative mb-4 aspect-3/4 overflow-hidden bg-gray-50">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="text-center">
                  <h3 className="truncate text-sm font-medium text-black">{item.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{formatPrice(item.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}