import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ScrollAnimation from "@/components/ScrollAnimation";
import RotatingWords from "@/components/RotatingWords";
import AnimatedUSP from "@/components/AnimatedUSP";
import NewsletterForm from "@/components/NewsletterForm";
import ParallaxHero from "@/components/ParallaxHero";
import { getVisibleProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/data";

const FeaturedCollections = dynamic(() => import("@/components/FeaturedCollections"));
const DeferredClothShowcase = dynamic(() => import("@/components/DeferredClothShowcase"));
const StatsCounter = dynamic(() => import("@/components/StatsCounter"));
const AutoScrollNewArrivals = dynamic(() => import("@/components/AutoScrollNewArrivals"));
const AnimatedTrustBadges = dynamic(() => import("@/components/AnimatedTrustBadges"));

export default async function Home() {
  const products = await getVisibleProducts();

  const newArrivals = products
    .filter((product) => product.isNew)
    .slice(0, 12)
    .map((product) => ({
      id: product.id,
      title: product.name,
      price: product.price,
      image: product.image,
      hoverImage: product.images[1],
      category: product.category,
      slug: product.slug,
      isNew: product.isNew,
      isSale: product.isSale,
    }));

  const bestSellers = [...products]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 8)
    .map((product) => ({
      id: product.id,
      title: product.name,
      price: product.price,
      image: product.image,
      hoverImage: product.images[1],
      category: product.category,
      slug: product.slug,
      isNew: product.isNew,
      isSale: product.isSale,
    }));

  const saleProducts = products
    .filter((product) => product.isSale && product.compareAtPrice)
    .slice(0, 12)
    .map((product) => ({
      id: product.id,
      title: product.name,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: product.image,
      hoverImage: product.images[1],
      category: product.category,
      slug: product.slug,
      isNew: product.isNew,
      isSale: true,
    }));

  const featuredCollectionsData = [
    {
      id: "feat-1",
      title: "Menswear Staples",
      subtitle: "Sharp everyday layers built for movement and city wear",
      image:
        "https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=1200",
      href: "/men",
    },
    {
      id: "feat-2",
      title: "Kids Essentials",
      subtitle: "Play-ready fits with easy movement and softer structure",
      image:
        "https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=1200",
      href: "/kids",
    },
    {
      id: "feat-3",
      title: "Accessories Edit",
      subtitle: "Finishing pieces for everyday carry, travel, and gifting",
      image:
        "https://images.pexels.com/photos/934063/pexels-photo-934063.jpeg?auto=compress&cs=tinysrgb&w=1200",
      href: "/category/accessories",
    },
  ];

  return (
    <main className="relative w-full">
      <ParallaxHero
        title="Elevated Urban Fashion"
        subtitle="Modern Minimalism"
        ctaText="Shop Collection"
        ctaHref="/products"
        backgroundImage="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=2000&q=80"
      />

      <AnimatedUSP />
      <FeaturedCollections collections={featuredCollectionsData} />
      <DeferredClothShowcase />

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:py-16 md:px-8 md:py-20">
        <div className="grid items-center gap-8 md:gap-12 lg:grid-cols-2">
          <Reveal yOffset={40}>
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.3em] text-neutral-500">
                Our Commitment
              </p>
              <h2 className="font-playfair text-3xl font-light text-black sm:text-4xl md:text-5xl">
                Sustainable Fashion
              </h2>
              <p className="mt-6 text-neutral-600">
                Every piece is crafted with mindfulness. We partner with suppliers who share our values,
                use eco-friendly materials wherever possible, and maintain fair labor practices
                throughout our supply chain.
              </p>
              <Link
                href="/about"
                className="mt-8 inline-block rounded-lg border border-neutral-900 px-6 py-3 text-sm font-medium text-neutral-900 transition-all hover:bg-neutral-900 hover:text-white sm:px-8"
              >
                Learn Our Story
              </Link>
            </div>
          </Reveal>

          <Reveal yOffset={40} delay={0.1}>
            <div className="relative h-72 overflow-hidden rounded-lg bg-neutral-200 sm:h-80 md:h-96">
              <Image
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80"
                alt="Sustainability"
                fill
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <StatsCounter
        stats={[
          { value: 50000, label: "Happy Customers", suffix: "+" },
          { value: 200, label: "New Items Weekly", suffix: "+" },
          { value: 50, label: "Countries Shipping To", suffix: "" },
          { value: 98, label: "Customer Satisfaction", suffix: "%" },
        ]}
      />

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:py-16 md:px-8 md:py-20">
        <Reveal yOffset={40}>
          <div className="overflow-hidden rounded-[24px] border border-neutral-200 bg-[linear-gradient(135deg,#0f172a_0%,#111827_45%,#1f2937_100%)] px-5 py-8 text-white sm:px-8 md:rounded-[32px] md:px-12 md:py-14">
            <div className="grid gap-8 md:gap-10 lg:grid-cols-[1.1fr,0.9fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Catalog Access</p>
                <h2 className="mt-4 font-playfair text-3xl font-light sm:text-4xl md:text-5xl">View All Products</h2>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75">
                  Browse the full active catalog across men, kids, accessories, footwear, new arrivals,
                  and sale edits. Every product block is now synced with the admin inventory and pricing
                  system.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link
                    href="/products"
                    className="rounded-full bg-white px-6 py-3 text-center text-xs uppercase tracking-[0.2em] text-[#111111] transition hover:bg-neutral-200"
                  >
                    Open Catalog
                  </Link>
                  <Link
                    href="/sale"
                    className="rounded-full border border-white/25 px-6 py-3 text-center text-xs uppercase tracking-[0.2em] text-white transition hover:border-white hover:bg-white/10"
                  >
                    Sale Edit
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Best Sellers", value: `${bestSellers.length}+` },
                  { label: "New Arrivals", value: `${newArrivals.length}+` },
                  { label: "Sale Products", value: `${saleProducts.length}+` },
                  { label: "Starting From", value: formatPrice(Math.min(...products.map((product) => product.price))) },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                  >
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">{item.label}</p>
                    <p className="mt-3 font-playfair text-3xl text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <AutoScrollNewArrivals products={newArrivals} />

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:py-16 md:px-8 md:py-20">
        <Reveal yOffset={40}>
          <div className="mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Trending Now</p>
            <h2 className="font-playfair text-3xl font-light text-black sm:text-4xl md:text-5xl">Best Sellers</h2>
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers.map((product, idx) => (
            <Reveal key={product.id} yOffset={40} delay={idx * 0.05}>
              <Link href={`/product/${product.slug}`}>
                <div className="group transition-transform duration-300 hover:-translate-y-1">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-neutral-100">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="mt-4 font-playfair text-lg font-light text-black">{product.title}</h3>
                  <p className="mt-1 text-neutral-600">{formatPrice(product.price)}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:py-16 md:px-8 md:py-20">
        <Reveal yOffset={40}>
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Limited Time</p>
            <h2 className="font-playfair text-3xl font-light text-black sm:text-4xl md:text-5xl">Seasonal Sale</h2>
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {saleProducts.map((product, idx) => (
            <Reveal key={product.id} yOffset={40} delay={idx * 0.05}>
              <Link href={`/product/${product.slug}`}>
                <div className="group relative transition-transform duration-300 hover:scale-[1.02]">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-neutral-100">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute right-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-bold text-black">
                      Sale
                    </div>
                  </div>
                  <h3 className="mt-4 font-playfair text-lg font-light text-black">{product.title}</h3>
                  <div className="mt-1 flex items-center gap-2 text-neutral-600">
                    <p>{formatPrice(product.price)}</p>
                    {product.compareAtPrice ? (
                      <p className="text-sm text-neutral-400 line-through">
                        {formatPrice(product.compareAtPrice)}
                      </p>
                    ) : null}
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal yOffset={40} delay={0.2}>
          <div className="mt-12 text-center">
            <Link
              href="/sale"
              className="inline-block rounded-lg border border-neutral-900 px-8 py-3 text-sm font-medium text-neutral-900 transition-all hover:bg-neutral-900 hover:text-white sm:px-12"
            >
              View All Sale Items
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:py-16 md:px-8 md:py-20">
        <Reveal yOffset={40}>
          <h2 className="font-playfair text-3xl font-light text-black sm:text-4xl md:text-5xl">
            Shop by
            <br />
            <RotatingWords
              words={["Category", "Style", "Season", "Mood"]}
              duration={6}
              className="text-accent"
            />
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
          {[
            {
              name: "Men",
              image:
                "https://images.unsplash.com/photo-1506629082632-5b940e2ac09e?auto=format&fit=crop&w=600&q=80",
              href: "/men",
            },
            {
              name: "Kids New Arrivals",
              image:
                "https://images.unsplash.com/photo-1503454537688-e6694e7f9d73?auto=format&fit=crop&w=600&q=80",
              href: "/kids",
            },
            {
              name: "Accessories",
              image:
                "https://images.unsplash.com/photo-1535298626774-f29adc82c54b?auto=format&fit=crop&w=600&q=80",
              href: "/category/accessories",
            },
            {
              name: "Footwear",
              image:
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
              href: "/category/footwear",
            },
            {
              name: "New Arrivals",
              image:
                "https://images.unsplash.com/photo-1595777712802-aaf2f2dc10eb?auto=format&fit=crop&w=600&q=80",
              href: "/new-arrivals",
            },
          ].map((category) => (
            <Reveal key={category.name} yOffset={40}>
              <Link href={category.href}>
                <div className="group relative overflow-hidden rounded-xl bg-neutral-200 transition-transform duration-500 hover:scale-[1.02]">
                  <ScrollAnimation type="scale" intensity={0.1}>
                    <div className="relative overflow-hidden">
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={400}
                        height={400}
                        className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-110 sm:h-72 lg:h-80"
                      />
                    </div>
                  </ScrollAnimation>
                  <div className="absolute inset-0 flex items-end justify-start p-6">
                    <h3 className="font-playfair text-2xl font-light text-white transition-all duration-300 group-hover:text-neutral-200 sm:text-3xl">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:py-16 md:px-8 md:py-20">
        <div className="rounded-2xl bg-neutral-900 px-5 py-12 text-center sm:px-8 md:px-12 md:py-24">
          <Reveal yOffset={40}>
            <h2 className="font-playfair text-3xl font-light text-white sm:text-4xl md:text-5xl">Stay Updated</h2>
          </Reveal>
          <Reveal yOffset={40} delay={0.1}>
            <p className="mx-auto mt-4 max-w-lg text-neutral-300">
              Get the latest on new arrivals, exclusive collections, and special offers delivered to
              your inbox.
            </p>
          </Reveal>

          <NewsletterForm
            source="homepage"
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-3"
            inputClassName="flex-1 rounded-lg bg-white px-6 py-3 text-neutral-900 placeholder-neutral-500 outline-none transition-all focus:ring-2 focus:ring-accent"
            buttonClassName="whitespace-nowrap rounded-lg bg-accent px-8 py-3 font-medium text-white transition-all hover:bg-yellow-500 disabled:opacity-60"
          />
        </div>
      </section>

      <AnimatedTrustBadges />
    </main>
  );
}
