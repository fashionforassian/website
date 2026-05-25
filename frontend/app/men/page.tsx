import Image from "next/image";
import Link from "next/link";
import { fetchBackendJson } from "@/lib/backend-api";
import { formatPrice, type Product } from "@/lib/data";

export default async function MenPage() {
  let products: Product[] = [];
  try {
    const payload = await fetchBackendJson<any>("/api/products");
    products = Array.isArray(payload) ? payload : (payload?.items || payload?.products || []);
  } catch {}
  const menProducts = products.filter((item) => item.category === "men");

  return (
    <main className="w-full bg-white">
      <section className="relative h-[60vh] w-full min-h-[400px] flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=2400&auto=format&fit=crop"
          alt="Menswear Collection"
          fill
          priority
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <p className="text-xs font-bold uppercase tracking-[0.3em] mb-4">Fassion 4 Asian</p>
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tight drop-shadow-lg">
            Menswear
          </h1>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-360 mx-auto">
        <div className="flex justify-between items-end mb-10 border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-black">All Men's</h2>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">{menProducts.length} Items</p>
        </div>
        
        {menProducts.length === 0 ? (
          <div className="py-20 text-center text-gray-500 uppercase tracking-widest text-sm">
            No men's products yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {menProducts.map((item) => (
              <Link key={item.id} href={`/product/${item.slug}`} className="group block">
                <div className="relative aspect-[3/4] bg-gray-50 mb-4 overflow-hidden">
                  <Image src={item.image} alt={item.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
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
