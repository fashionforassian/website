import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import RotatingWords from "@/components/RotatingWords";
import AnimatedUSP from "@/components/AnimatedUSP";
import NewsletterForm from "@/components/NewsletterForm";
import ParallaxHero from "@/components/ParallaxHero";
import HomeAuthCta from "@/components/HomeAuthCta";
import { fetchBackendJson } from "@/lib/backend-api";
import { formatPrice, type Product } from "@/lib/data";

const FeaturedCollections = dynamic(() => import("@/components/FeaturedCollections"));
const EditorialShowcase = dynamic(() => import("@/components/EditorialShowcase"));
const StatsCounter = dynamic(() => import("@/components/StatsCounter"));
const AutoScrollNewArrivals = dynamic(() => import("@/components/AutoScrollNewArrivals"));
const AnimatedTrustBadges = dynamic(() => import("@/components/AnimatedTrustBadges"));

export default async function Home() {
  let products: Product[] = [];
  let productFeedUnavailable = false;

  try {
    const payload = await fetchBackendJson<Product[] | { items?: Product[] }>("/api/products");

    if (Array.isArray(payload)) {
      products = payload;
    } else if (Array.isArray(payload?.items)) {
      products = payload.items;
    } else {
      productFeedUnavailable = true;
    }
  } catch {
    productFeedUnavailable = true;
  }

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

  const spotlightProduct = bestSellers[0];
  const heroSecondaryProduct = newArrivals[0] ?? bestSellers[1];
  const supportingBestSellers = bestSellers.slice(1, 5);
  const salePreview = saleProducts.slice(0, 4);
  const categoryTiles = [
    {
      name: "Men",
      eyebrow: "Tailored Edit",
      summary: "Sharper essentials and cleaner silhouettes.",
      image:
        "https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=1200",
      href: "/men",
      className: "md:col-span-7 md:row-span-2",
    },
    {
      name: "Kids New Arrivals",
      eyebrow: "Playwear Drop",
      summary: "Easy movement and brighter new picks.",
      image:
        "https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=1200",
      href: "/kids",
      className: "md:col-span-5",
    },
    {
      name: "Accessories",
      eyebrow: "Daily Details",
      summary: "Finishing pieces for travel and daily carry.",
      image:
        "https://images.pexels.com/photos/934063/pexels-photo-934063.jpeg?auto=compress&cs=tinysrgb&w=1200",
      href: "/category/accessories",
      className: "md:col-span-5",
    },
    {
      name: "Footwear",
      eyebrow: "Street Step",
      summary: "Modern pairs that sharpen the full look.",
      image:
        "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1200",
      href: "/category/footwear",
      className: "md:col-span-4",
    },
    {
      name: "New Arrivals",
      eyebrow: "Fresh Drop",
      summary: "The latest additions from the live catalog.",
      image:
        "https://images.pexels.com/photos/6311613/pexels-photo-6311613.jpeg?auto=compress&cs=tinysrgb&w=1200",
      href: "/new-arrivals",
      className: "md:col-span-8",
    },
  ];

  return (
    <main className="relative w-full bg-white">
      {productFeedUnavailable ? (
        <section className="mx-auto w-full max-w-7xl px-4 pt-6 md:px-8">
          <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Live catalog data is temporarily unavailable. Showing editorial sections while the backend reconnects.
          </div>
        </section>
      ) : null}

      <ParallaxHero
        title="Sharper fits for everyday movement."
        subtitle="New Season Edit"
        description="Menswear, kids essentials, footwear, and accessories presented through a faster live catalog with cleaner structure, stronger imagery, and easier product entry from the first screen."
        ctaText="View All Products"
        ctaHref="/products"
        secondaryCtaText="Shop New Arrivals"
        secondaryCtaHref="/new-arrivals"
        announcement="Fresh arrivals, curated edits, and smoother browsing from the first screen."
        backgroundImage="https://images.pexels.com/photos/5378700/pexels-photo-5378700.jpeg?auto=compress&cs=tinysrgb&w=1800"
        stats={[
          { value: `${products.length}+`, label: "live products" },
          { value: `${newArrivals.length}+`, label: "new arrivals" },
          { value: "24-48h", label: "dispatch window" },
        ]}
        quickLinks={[
          { label: "Men", href: "/men" },
          { label: "Kids", href: "/kids" },
          { label: "New Arrivals", href: "/new-arrivals" },
          { label: "Sale", href: "/sale" },
        ]}
        spotlight={
          spotlightProduct
            ? {
                title: spotlightProduct.title,
                subtitle: "Best Seller",
                price: formatPrice(spotlightProduct.price),
                image: spotlightProduct.image,
                href: `/product/${spotlightProduct.slug}`,
              }
            : undefined
        }
        secondarySpotlight={
          heroSecondaryProduct
            ? {
                title: heroSecondaryProduct.title,
                subtitle: heroSecondaryProduct.isNew ? "New Arrival" : "Trending Now",
                price: formatPrice(heroSecondaryProduct.price),
                image: heroSecondaryProduct.image,
                href: `/product/${heroSecondaryProduct.slug}`,
              }
            : undefined
        }
      />

      <HomeAuthCta />

      <AnimatedUSP />
      <FeaturedCollections collections={featuredCollectionsData} />

      <EditorialShowcase
        items={bestSellers.slice(0, 3).map((product, index) => ({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          href: `/product/${product.slug}`,
          caption: ["Modern Tailoring", "Refined Layers", "Daily Uniform"][index] ?? "Featured Edit",
        }))}
      />

      <section className="mx-auto w-full max-w-7xl px-4 py-20 md:px-8 md:py-24">
        <div className="grid items-center gap-8 lg:grid-cols-[0.92fr,1.08fr]">
          <Reveal yOffset={34}>
            <div className="rounded-[34px] border border-neutral-200 bg-[linear-gradient(180deg,#fbf7f1_0%,#f7f1e8_100%)] p-6 shadow-[0_20px_70px_rgba(17,17,17,0.04)] sm:p-8 md:p-10">
              <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500">
                Our Commitment
              </p>
              <h2 className="mt-5 max-w-lg font-playfair text-4xl font-light leading-tight text-[#111111] md:text-5xl">
                Conscious design with a sharper editorial finish.
              </h2>
              <p className="mt-6 max-w-xl text-sm leading-7 text-neutral-600 sm:text-base">
                Every release is built around cleaner silhouettes, softer structure, and more useful
                everyday styling. The visual system follows the same principle: less clutter, stronger
                hierarchy, and better movement.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Material Focus", value: "Refined, easy layers" },
                  { label: "Fit Direction", value: "Modern everyday tailoring" },
                  { label: "Movement", value: "Lightweight motion system" },
                  { label: "Visual Tone", value: "Clean editorial layout" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/70 bg-white/80 p-4 backdrop-blur-sm"
                  >
                    <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                      {item.label}
                    </p>
                    <p className="mt-3 font-playfair text-2xl text-[#111111]">{item.value}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/about"
                className="mt-8 inline-flex items-center justify-center rounded-full border border-neutral-900 px-7 py-3 text-xs uppercase tracking-[0.22em] text-neutral-900 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-neutral-900 hover:text-white"
              >
                Learn Our Story
              </Link>
            </div>
          </Reveal>

          <Reveal yOffset={34} delay={0.08}>
            <div className="grid gap-4 sm:relative sm:min-h-[520px] sm:gap-0">
              <div className="relative w-full overflow-hidden rounded-[34px] border border-neutral-200 bg-white p-3 shadow-[0_24px_80px_rgba(17,17,17,0.08)] sm:absolute sm:right-0 sm:top-0 sm:w-[86%]">
                <div className="relative h-[360px] overflow-hidden rounded-[28px] bg-neutral-100 sm:h-[430px]">
                  <Image
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80"
                    alt="Sustainability"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_42%,rgba(0,0,0,0.2)_100%)]" />
                </div>
              </div>

              <div className="relative w-full rounded-[30px] border border-neutral-200 bg-[#111111] p-6 text-white shadow-[0_22px_70px_rgba(17,17,17,0.14)] sm:absolute sm:bottom-0 sm:left-0 sm:w-[58%]">
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/55">Studio Note</p>
                <p className="mt-4 font-playfair text-3xl font-light">Built to move with the page.</p>
                <p className="mt-4 text-sm leading-7 text-white/72">
                  Cleaner structure, calmer motion, and better spacing make the storefront feel more
                  premium without slowing it down.
                </p>
              </div>

              <div className="absolute left-[14%] top-[8%] hidden rounded-full border border-neutral-200 bg-white/80 px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-neutral-500 shadow-[0_14px_35px_rgba(17,17,17,0.06)] backdrop-blur-sm md:block">
                Responsible sourcing
              </div>
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

      <section className="mx-auto w-full max-w-7xl px-4 py-20 md:px-8 md:py-24">
        <Reveal yOffset={34}>
          <div className="overflow-hidden rounded-[38px] border border-neutral-200 bg-white shadow-[0_24px_90px_rgba(17,17,17,0.06)]">
            <div className="grid gap-0 lg:grid-cols-[0.95fr,1.05fr]">
              <div className="bg-[linear-gradient(180deg,#f9f5ef_0%,#f3ece1_100%)] px-6 py-8 sm:px-8 md:px-10 md:py-12">
                <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500">
                  Catalog Access
                </p>
                <h2 className="mt-5 max-w-lg font-playfair text-4xl font-light leading-tight text-[#111111] md:text-5xl">
                  Browse the full active catalog with a cleaner shopping flow.
                </h2>
                <p className="mt-6 max-w-xl text-sm leading-7 text-neutral-600 sm:text-base">
                  Every product block is now connected to the admin inventory, pricing, image, and
                  content system. The homepage uses that live catalog while keeping the layout more
                  editorial and less repetitive.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center rounded-full bg-[#111111] px-7 py-3 text-xs uppercase tracking-[0.22em] text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-black"
                  >
                    Open Catalog
                  </Link>
                  <Link
                    href="/sale"
                    className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white/80 px-7 py-3 text-xs uppercase tracking-[0.22em] text-[#111111] transition-transform duration-300 hover:-translate-y-0.5 hover:border-[#111111]"
                  >
                    Sale Edit
                  </Link>
                </div>
              </div>

              <div className="grid gap-px bg-neutral-200 sm:grid-cols-2">
                {[
                  { label: "Best Sellers", value: `${bestSellers.length}+` },
                  { label: "New Arrivals", value: `${newArrivals.length}+` },
                  { label: "Sale Products", value: `${saleProducts.length}+` },
                  {
                    label: "Starting From",
                    value: formatPrice(Math.min(...products.map((product) => product.price))),
                  },
                ].map((item) => (
                  <div key={item.label} className="bg-white p-6 sm:p-8">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                      {item.label}
                    </p>
                    <p className="mt-4 font-playfair text-4xl text-[#111111]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <AutoScrollNewArrivals products={newArrivals} />

      {spotlightProduct ? (
        <section className="mx-auto w-full max-w-7xl px-4 py-20 md:px-8 md:py-24">
          <Reveal yOffset={32}>
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500">
                  Trending Now
                </p>
                <h2 className="mt-4 font-playfair text-4xl font-light text-[#111111] md:text-5xl">
                  Best Sellers
                </h2>
              </div>
              <Link
                href={`/product/${spotlightProduct.slug}`}
                className="text-[11px] uppercase tracking-[0.22em] text-neutral-500 transition-colors hover:text-[#111111]"
              >
                View featured product
              </Link>
            </div>
          </Reveal>

          <div className="grid gap-6 xl:grid-cols-[1.02fr,0.98fr]">
            <Reveal yOffset={34}>
              <Link href={`/product/${spotlightProduct.slug}`} className="group block">
                <div className="overflow-hidden rounded-[36px] border border-neutral-200 bg-white p-3 shadow-[0_24px_90px_rgba(17,17,17,0.06)]">
                  <div className="grid gap-0 lg:grid-cols-[1.12fr,0.88fr]">
                    <div className="relative min-h-[420px] overflow-hidden rounded-[28px] bg-neutral-100">
                      <Image
                        src={spotlightProduct.image}
                        alt={spotlightProduct.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="flex flex-col justify-between px-6 py-6 sm:px-8">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.26em] text-neutral-500">
                          Featured Best Seller
                        </p>
                        <h3 className="mt-4 font-playfair text-4xl font-light leading-tight text-[#111111]">
                          {spotlightProduct.title}
                        </h3>
                        <p className="mt-4 text-sm leading-7 text-neutral-600">
                          A stronger lead product presentation with more breathing room, better emphasis,
                          and a cleaner editorial block than the old standard grid.
                        </p>
                      </div>

                      <div className="mt-8">
                        <p className="font-playfair text-3xl text-[#111111]">
                          {formatPrice(spotlightProduct.price)}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#111111]">
                          Shop now
                          <span className="transition-transform duration-300 group-hover:translate-x-1">+</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>

            <div className="grid gap-5 sm:grid-cols-2">
              {supportingBestSellers.map((product, idx) => (
                <Reveal key={product.id} yOffset={30} delay={idx * 0.05}>
                  <Link href={`/product/${product.slug}`} className="group block">
                    <div className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white p-3 shadow-[0_18px_60px_rgba(17,17,17,0.05)] transition-transform duration-300 group-hover:-translate-y-1">
                      <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-neutral-100">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                        />
                      </div>
                      <div className="px-2 pb-2 pt-4">
                        <h3 className="font-playfair text-xl font-light text-[#111111]">
                          {product.title}
                        </h3>
                        <p className="mt-2 text-sm text-neutral-600">{formatPrice(product.price)}</p>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto w-full max-w-7xl px-4 py-20 md:px-8 md:py-24">
        <div className="grid gap-6 lg:grid-cols-[0.78fr,1.22fr]">
          <Reveal yOffset={34}>
            <div className="flex h-full flex-col justify-between rounded-[36px] bg-[#151515] px-6 py-8 text-white shadow-[0_24px_80px_rgba(17,17,17,0.16)] sm:px-8 md:px-10 md:py-12">
              <div>
                <p className="text-[11px] uppercase tracking-[0.32em] text-white/50">
                  Limited Time
                </p>
                <h2 className="mt-5 font-playfair text-4xl font-light leading-tight md:text-5xl">
                  Seasonal Sale with a cleaner editorial rhythm.
                </h2>
                <p className="mt-6 text-sm leading-7 text-white/72 sm:text-base">
                  Instead of another plain product grid, the sale block now leads with stronger copy
                  and lets the discounted pieces sit beside it as a curated panel.
                </p>
              </div>

              <div className="mt-10 space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { label: "Sale Products", value: `${saleProducts.length}+` },
                    { label: "Best Offer", value: "Selected markdowns" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">{item.label}</p>
                      <p className="mt-3 font-playfair text-2xl text-white">{item.value}</p>
                    </div>
                  ))}
                </div>

                <Link
                  href="/sale"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3 text-xs uppercase tracking-[0.22em] text-white transition-transform duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white/10"
                >
                  View All Sale Items
                </Link>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2">
            {salePreview.map((product, idx) => (
              <Reveal key={product.id} yOffset={30} delay={idx * 0.05}>
                <Link href={`/product/${product.slug}`} className="group block">
                  <div className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white p-3 shadow-[0_18px_60px_rgba(17,17,17,0.05)] transition-transform duration-300 group-hover:-translate-y-1">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-neutral-100">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                      />
                      <div className="absolute right-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-bold text-black">
                        Sale
                      </div>
                    </div>
                    <div className="px-2 pb-2 pt-4">
                      <h3 className="font-playfair text-xl font-light text-[#111111]">
                        {product.title}
                      </h3>
                      <div className="mt-2 flex items-center gap-2 text-sm">
                        <p className="text-[#111111]">{formatPrice(product.price)}</p>
                        {product.compareAtPrice ? (
                          <p className="text-neutral-400 line-through">
                            {formatPrice(product.compareAtPrice)}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-20 md:px-8 md:py-24">
        <Reveal yOffset={32}>
          <div className="mb-10 text-center">
            <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500">Browse the Edit</p>
            <h2 className="mt-4 font-playfair text-4xl font-light text-[#111111] md:text-5xl">
              Shop by{" "}
              <RotatingWords
                words={["Category", "Style", "Season", "Mood"]}
                duration={5}
                className="text-accent"
              />
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-12 md:auto-rows-[240px]">
          {categoryTiles.map((category, index) => (
            <Reveal
              key={category.name}
              yOffset={28}
              delay={index * 0.04}
              className={category.className}
            >
              <Link href={category.href} className="group block h-full">
                <div className="relative h-full min-h-[260px] overflow-hidden rounded-[30px] border border-neutral-200 bg-neutral-100 shadow-[0_18px_60px_rgba(17,17,17,0.05)] transition-transform duration-300 group-hover:-translate-y-1">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.16)_28%,rgba(0,0,0,0.66)_100%)]" />

                  <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/18 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-white/92 backdrop-blur-md sm:left-6 sm:top-6">
                    {category.eyebrow}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 md:p-7">
                    <div className="flex items-end justify-between gap-4 rounded-[24px] border border-white/14 bg-black/42 p-5 backdrop-blur-md sm:p-6">
                      <div className="max-w-[26rem]">
                        <h3 className="font-playfair text-3xl font-light text-white sm:text-[2rem]">
                          {category.name}
                        </h3>
                        <p className="mt-3 max-w-[24rem] text-sm leading-6 text-white/82">
                          {category.summary}
                        </p>
                      </div>

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                        <span className="text-lg leading-none">+</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-20 md:px-8 md:py-24">
        <Reveal yOffset={32}>
          <div className="overflow-hidden rounded-[38px] border border-neutral-200 bg-[linear-gradient(135deg,#171717_0%,#101010_48%,#202020_100%)] shadow-[0_24px_80px_rgba(17,17,17,0.14)]">
            <div className="grid gap-0 lg:grid-cols-[0.92fr,1.08fr]">
              <div className="px-6 py-8 text-white sm:px-8 md:px-10 md:py-12">
                <p className="text-[11px] uppercase tracking-[0.32em] text-white/50">Stay Updated</p>
                <h2 className="mt-5 font-playfair text-4xl font-light leading-tight md:text-5xl">
                  Exclusive drops, cleaner edits, and early access.
                </h2>
                <p className="mt-6 max-w-xl text-sm leading-7 text-white/72 sm:text-base">
                  Join the list for new arrivals, seasonal stories, and the latest curated product
                  releases from the catalog.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {[
                    "Priority access to new arrivals",
                    "Monthly curated style edits",
                    "Sale alerts and capsule drops",
                    "Cleaner weekly product updates",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/78"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/6 px-6 py-8 sm:px-8 md:px-10 md:py-12">
                <div className="rounded-[30px] border border-white/10 bg-white p-6 shadow-[0_16px_50px_rgba(0,0,0,0.1)] sm:p-8">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-500">
                    Newsletter Access
                  </p>
                  <p className="mt-4 max-w-md text-sm leading-7 text-neutral-600">
                    Sign up once and receive the latest on best sellers, sale edits, and new releases.
                  </p>

                  <NewsletterForm
                    source="homepage"
                    className="mt-8 flex flex-col gap-3"
                    inputClassName="h-13 rounded-full border border-neutral-300 bg-white px-6 text-neutral-900 placeholder-neutral-500 outline-none transition-all focus:border-[#111111]"
                    buttonClassName="rounded-full bg-[#111111] px-8 py-3 text-xs uppercase tracking-[0.2em] text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-black disabled:opacity-60"
                  />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <AnimatedTrustBadges />
    </main>
  );
}
