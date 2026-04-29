import Image from "next/image";
import Link from "next/link";
import { fetchBackendJson } from "@/lib/backend-api";
import { formatPrice, type Product } from "@/lib/data";

export default async function NewArrivalsPage() {
  let products: Product[] = [];
  try {
    const payload = await fetchBackendJson<any>("/api/products");
    products = Array.isArray(payload) ? payload : (payload?.items || payload?.products || []);
  } catch {}
  const arrivals = products.filter((item) => item.isNew);

  return (
    <main className="w-full bg-white">
      <section className="py-16 text-center border-b border-gray-200">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-4">Latest Drops</p>
        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-black">
          New Arrivals
        </h1>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
        {arrivals.length === 0 ? (
          <div className="py-20 text-center text-gray-500 uppercase tracking-widest text-sm">
            No new arrivals right now.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {arrivals.map((item) => (
              <Link key={item.id} href={`/product/${item.slug}`} className="group block">
                <div className="relative aspect-[3/4] bg-gray-50 mb-4 overflow-hidden">
                  <Image src={item.image} alt={item.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute top-3 left-3 bg-white text-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                    New
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-medium text-black truncate">{item.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{formatPrice(item.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
