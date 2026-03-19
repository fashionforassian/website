"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ParallaxHero from "@/components/ParallaxHero";
import FeaturedCollections from "@/components/FeaturedCollections";
import Reveal from "@/components/Reveal";
import ScrollAnimation from "@/components/ScrollAnimation";
import Fashion3DHero from "@/components/Fashion3DHero";
import ClothGLBViewer from "@/components/ClothGLBViewer";
import AutoScrollNewArrivals from "@/components/AutoScrollNewArrivals";
import StatsCounter from "@/components/StatsCounter";
import RotatingWords from "@/components/RotatingWords";
import ParallaxScroll from "@/components/ParallaxScroll";
import TextReveal from "@/components/TextReveal";
import AnimatedUSP from "@/components/AnimatedUSP";
import AnimatedTrustBadges from "@/components/AnimatedTrustBadges";
import { products } from "@/lib/data";

export default function Home() {
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
      isSale: false,
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
      isNew: false,
      isSale: false,
    }));

  const saleProducts = products
    .filter((product) => !product.isNew && product.popularity < 80)
    .slice(0, 12)
    .map((product) => ({
      id: product.id,
      title: product.name,
      price: Math.floor(product.price * 0.8), // Apply 20% discount for sale
      image: product.image,
      hoverImage: product.images[1],
      category: product.category,
      slug: product.slug,
      isNew: false,
      isSale: true,
    }));

  const featuredCollectionsData = [
    {
      id: "feat-1",
      title: "Resort Collection",
      subtitle: "Lightweight silhouettes for tropical city days",
      image:
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
      href: "/women",
    },
    {
      id: "feat-2",
      title: "Urban Tailoring",
      subtitle: "Refined essentials for metropolitan styling",
      image:
        "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=1200",
      href: "/men",
    },
    {
      id: "feat-3",
      title: "Minimal Capsules",
      subtitle: "Modern essentials blending utility and elegance",
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
      href: "/collections",
    },
  ];

  return (
    <main className="relative w-full">
      {/* HERO SECTION */}
      <ParallaxHero
        title="Elevated Urban Fashion"
        subtitle="Modern Minimalism"
        ctaText="Shop Collection"
        ctaHref="/products"
        backgroundImage="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=2000&q=80"
      />

      {/* USP SECTION */}
      <AnimatedUSP />

      {/* FEATURED COLLECTIONS */}
      <FeaturedCollections collections={featuredCollectionsData} />

      {/* INTERACTIVE 3D CLOTHING SHOWCASE */}
      <ClothGLBViewer />

      {/* SUSTAINABILITY SECTION */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 md:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <Reveal yOffset={40}>
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.3em] text-neutral-500">
                Our Commitment
              </p>
              <h2 className="font-playfair text-4xl font-light text-black md:text-5xl">
                Sustainable Fashion
              </h2>
              <p className="mt-6 text-neutral-600">
                Every piece is crafted with mindfulness. We partner with suppliers
                who share our values, use eco-friendly materials wherever possible,
                and maintain fair labor practices throughout our supply chain.
              </p>
              <Link
                href="/about"
                className="mt-8 inline-block rounded-lg border border-neutral-900 px-8 py-3 font-medium text-neutral-900 transition-all hover:bg-neutral-900 hover:text-white"
              >
                Learn Our Story
              </Link>
            </div>
          </Reveal>

          <Reveal yOffset={40} delay={0.1}>
            <div className="relative h-96 overflow-hidden rounded-lg bg-neutral-200">
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

      {/* STATS SECTION */}
      <StatsCounter 
        stats={[
          { value: 50000, label: "Happy Customers", suffix: "+" },
          { value: 200, label: "New Items Weekly", suffix: "+" },
          { value: 50, label: "Countries Shipping To", suffix: "" },
          { value: 98, label: "Customer Satisfaction", suffix: "%" },
        ]}
      />

      {/* FEATURED PRODUCT SHOWCASE */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 md:px-8">
        <Reveal yOffset={40}>
          <div className="mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
              Premium Selection
            </p>
            <h2 className="font-playfair text-4xl font-light text-black md:text-5xl">
              Editor's Pick
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-12 md:grid-cols-2">
          <Reveal yOffset={40}>
            <div className="grid auto-rows-max gap-4">
                <div className="relative h-96 overflow-hidden rounded-lg bg-neutral-100">
                  <Image
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
                    alt="Premium Linen Shirt Main"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative h-48 overflow-hidden rounded-lg bg-neutral-100">
                    <Image
                      src="https://images.unsplash.com/photo-1506629082632-5b940e2ac09e?auto=format&fit=crop&w=400&q=80"
                      alt="Premium detail 1"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-48 overflow-hidden rounded-lg bg-neutral-100">
                    <Image
                      src="https://images.unsplash.com/photo-1551028719-00167b16ebc5?auto=format&fit=crop&w=400&q=80"
                      alt="Premium detail 2"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </Reveal>

          <Reveal yOffset={40} delay={0.2}>
            <div>
              <h3 className="font-playfair text-3xl font-light text-black">
                Premium Linen Shirt
              </h3>
              <p className="mt-3 text-sm uppercase tracking-widest text-neutral-500">
                The Essentials
              </p>

              <motion.div
                className="mt-6 space-y-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <p className="text-neutral-600">
                  Handcrafted from 100% premium linen, this shirt transcends
                  seasonality. A perfect blend of comfort and sophistication,
                  designed for those who value quality and minimalism.
                </p>
                <ul className="space-y-2 text-sm text-neutral-500">
                  <li>✓ 100% Premium Belgian Linen</li>
                  <li>✓ Artisan Quality Stitching</li>
                  <li>✓ Sustainable Production</li>
                  <li>✓ Lifetime Care Guide Included</li>
                  </ul>
                </motion.div>

                <p className="mt-6 text-2xl font-light text-neutral-900">
                  $189.00
                </p>

                <Link
                  href="/products"
                  className="mt-8 block rounded-lg bg-neutral-900 px-8 py-3 text-center font-medium text-white transition-all hover:bg-neutral-700"
                >
                  View Collection
                </Link>
              </div>
            </Reveal>
        </div>
      </section>

      {/* NEW ARRIVALS AUTO SCROLL */}
      <AutoScrollNewArrivals products={newArrivals} />

      {/* BEST SELLERS GRID */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 md:px-8">
        <Reveal yOffset={40}>
          <div className="mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
              Trending Now
            </p>
            <h2 className="font-playfair text-4xl font-light text-black md:text-5xl">
              Best Sellers
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {bestSellers.map((product, idx) => (
            <Reveal key={product.id} yOffset={40} delay={idx * 0.05}>
              <Link href={`/product/${product.slug}`}>
                <motion.div
                  className="group"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-64 overflow-hidden rounded-lg bg-neutral-100 md:h-80">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="mt-4 font-playfair text-lg font-light text-black">
                    {product.title}
                  </h3>
                  <p className="mt-1 text-neutral-600">${product.price}</p>
                </motion.div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SEASONAL SALE */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 md:px-8">
        <Reveal yOffset={40}>
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">
              Limited Time
            </p>
            <h2 className="font-playfair text-4xl font-light text-black md:text-5xl">
              Seasonal Sale
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {saleProducts.map((product, idx) => (
            <Reveal key={product.id} yOffset={40} delay={idx * 0.05}>
              <Link href={`/product/${product.slug}`}>
                <motion.div
                  className="group relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-64 overflow-hidden rounded-lg bg-neutral-100 md:h-80">
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
                  <h3 className="mt-4 font-playfair text-lg font-light text-black">
                    {product.title}
                  </h3>
                  <p className="mt-1 text-neutral-600">${product.price}</p>
                </motion.div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal yOffset={40} delay={0.2}>
          <div className="mt-12 text-center">
            <Link
              href="/sale"
              className="inline-block rounded-lg border border-neutral-900 px-12 py-3 font-medium text-neutral-900 transition-all hover:bg-neutral-900 hover:text-white"
            >
              View All Sale Items
            </Link>
          </div>
        </Reveal>
      </section>

      {/* CATEGORY GRID */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 md:px-8">
        <Reveal yOffset={40}>
          <h2 className="font-playfair text-4xl font-light text-black md:text-5xl">
            Shop by<br />
            <RotatingWords
              words={["Category", "Style", "Season", "Mood"]}
              duration={6}
              className="text-accent"
            />
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              name: "Women",
              image:
                "https://images.unsplash.com/photo-1495985784467-4d71bcdd2327?auto=format&fit=crop&w=600&q=80",
              href: "/women",
            },
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
              href: "/collections",
            },
            {
              name: "Footwear",
              image:
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
              href: "/collections",
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
                <motion.div
                  className="group relative overflow-hidden bg-neutral-200 rounded-xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.6 }}
                >
                  <ScrollAnimation type="scale" intensity={0.1}>
                    <div className="relative overflow-hidden">
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={400}
                        height={400}
                        className="h-80 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  </ScrollAnimation>
                  <motion.div className="absolute inset-0 flex items-end justify-start p-6">
                    <h3 className="font-playfair text-3xl font-light text-white transition-all duration-300 group-hover:text-neutral-200">
                      {category.name}
                    </h3>
                  </motion.div>
                </motion.div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 md:px-8">
        <div className="rounded-2xl bg-neutral-900 px-8 py-16 text-center md:px-12 md:py-24">
          <Reveal yOffset={40}>
            <h2 className="font-playfair text-4xl font-light text-white md:text-5xl">
              Stay Updated
            </h2>
          </Reveal>
          <Reveal yOffset={40} delay={0.1}>
            <p className="mx-auto mt-4 max-w-lg text-neutral-300">
              Get the latest on new arrivals, exclusive collections, and special offers delivered to your inbox.
            </p>
          </Reveal>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you for subscribing!");
            }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-3"
          >
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="flex-1 rounded-lg bg-white px-6 py-3 text-neutral-900 placeholder-neutral-500 outline-none transition-all focus:ring-2 focus:ring-accent"
            />
            <button
              type="submit"
              className="whitespace-nowrap rounded-lg bg-accent px-8 py-3 font-medium text-white transition-all hover:bg-yellow-500"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* TRUST BADGES */}
      <AnimatedTrustBadges />
    </main>
  );
}
