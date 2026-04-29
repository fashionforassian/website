import Image from "next/image";
import Link from "next/link";
import { fetchBackendJson } from "@/lib/backend-api";
import { formatPrice, type Product } from "@/lib/data";

export default async function Home() {
  let products: Product[] = [];
  try {
    const payload = await fetchBackendJson<Product[] | { items?: Product[] }>("/api/products");
    if (Array.isArray(payload)) products = payload;
    else if (Array.isArray(payload?.items)) products = payload.items;
  } catch {}

  const newArrivals = products.filter((p) => p.isNew).slice(0, 8);
  const bestSellers = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 4);

  return (
    <main className="w-full bg-white">
      {/* 1. Hero Section */}
      <section className="relative h-[85vh] w-full min-h-[600px] flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2400&auto=format&fit=crop"
          alt="New Collection"
          fill
          priority
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-16 left-0 right-0 flex flex-col items-center text-white text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tight mb-8 drop-shadow-lg">
            The Spring Edit
          </h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/men" className="bg-white text-black px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors">
              Shop Men
            </Link>
            <Link href="/kids" className="bg-white text-black px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors">
              Shop Kids
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Featured Categories (Grid) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {[
            { title: "Outerwear", img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop", link: "/products" },
            { title: "Knitwear", img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop", link: "/products" },
            { title: "Accessories", img: "https://images.unsplash.com/photo-1611080665932-520e542bf9e5?q=80&w=800&auto=format&fit=crop", link: "/products" },
          ].map((cat, i) => (
            <Link key={i} href={cat.link} className="group relative aspect-[3/4] overflow-hidden bg-gray-100 block">
              <Image src={cat.img} alt={cat.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:bg-black/20" />
              <div className="absolute bottom-6 left-6">
                <h3 className="text-white text-xl font-medium uppercase tracking-widest">{cat.title}</h3>
                <span className="text-white text-xs uppercase tracking-widest mt-2 block opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">Shop Now →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. New Arrivals Horizontal Carousel */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-black">New Arrivals</h2>
          <Link href="/new-arrivals" className="text-sm font-medium uppercase tracking-widest text-black underline underline-offset-4 hover:text-gray-500 transition-colors">
            View All
          </Link>
        </div>
        
        <div className="flex overflow-x-auto gap-4 pb-8 snap-x hide-scrollbar">
          {newArrivals.map((product) => (
            <Link key={product.id} href={`/product/${product.slug}`} className="group shrink-0 w-[70vw] sm:w-[45vw] md:w-[30vw] lg:w-[22vw] snap-start">
              <div className="relative aspect-[3/4] bg-gray-100 mb-4 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {product.isNew && (
                  <div className="absolute top-3 left-3 bg-white text-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                    New
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-black truncate">{product.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{formatPrice(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Editorial Lookbook Banner */}
      <section className="w-full relative h-[70vh] min-h-[500px]">
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2400&auto=format&fit=crop"
          alt="Editorial Lookbook"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] mb-4">Editorial</p>
          <h2 className="text-4xl md:text-5xl font-light uppercase tracking-widest max-w-2xl leading-tight mb-8">
            The Art of Layering
          </h2>
          <Link href="/products" className="border border-white px-8 py-3 text-sm font-medium uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
            Explore the Collection
          </Link>
        </div>
      </section>

      {/* 5. Best Sellers */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto bg-gray-50 mt-12 mb-12">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-black">Most Wanted</h2>
          <p className="text-sm text-gray-500 mt-4 uppercase tracking-widest">Our best selling pieces right now</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {bestSellers.map((product) => (
            <Link key={product.id} href={`/product/${product.slug}`} className="group block">
              <div className="relative aspect-[3/4] bg-white mb-4 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="text-center">
                <h3 className="text-sm font-medium text-black truncate">{product.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{formatPrice(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/products?sort=popularity" className="inline-block bg-black text-white px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors">
            Shop All Best Sellers
          </Link>
        </div>
      </section>

      {/* 6. Instagram/Social Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-xl font-bold uppercase tracking-tight text-black">@FASSION4ASIAN</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          {[
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1485230895905-ef19fb591746?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=600&auto=format&fit=crop"
          ].map((src, i) => (
            <div key={i} className="relative aspect-square bg-gray-100 group overflow-hidden">
              <Image src={src} alt={`Instagram post ${i}`} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                 <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Value Prop / Info */}
      <section className="py-24 px-4 text-center bg-white border-t border-gray-200">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-widest text-black">
            Conscious Design. Premium Quality.
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed max-w-lg mx-auto">
            Our collections are defined by clean silhouettes, premium fabrics, and timeless styling. We believe in clothes that last beyond the season.
          </p>
          <div className="pt-6">
            <Link href="/about" className="inline-block border-b border-black text-black pb-1 text-xs font-bold uppercase tracking-widest hover:text-gray-500 hover:border-gray-500 transition-colors">
              Read Our Story
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
