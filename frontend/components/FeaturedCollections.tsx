"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

interface FeaturedCollectionItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  href: string;
}

interface FeaturedCollectionsProps {
  collections: FeaturedCollectionItem[];
  title?: string;
  subtitle?: string;
}

export default function FeaturedCollections({
  collections,
  title = "Featured Collections",
  subtitle = "Curated Selections",
}: FeaturedCollectionsProps) {
  const layouts = [
    "lg:col-span-7 lg:row-span-2 min-h-[460px] lg:min-h-[560px]",
    "lg:col-span-5 min-h-[260px]",
    "lg:col-span-5 min-h-[260px]",
  ];

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-18 md:px-8 md:py-24">
      <SectionHeading title={title} subtitle={subtitle} />

      <div className="grid gap-5 lg:grid-cols-12 lg:auto-rows-[260px]">
        {collections.map((collection, index) => (
          <motion.article
            key={collection.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: index * 0.08, ease: "easeOut" }}
            className={layouts[index] ?? layouts[1]}
          >
            <Link href={collection.href} className="group block h-full">
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
                className="relative h-full overflow-hidden rounded-[30px] border border-neutral-200 bg-neutral-100 shadow-[0_22px_80px_rgba(17,17,17,0.06)]"
              >
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.18)_36%,rgba(0,0,0,0.6)_100%)]" />

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <div className="max-w-md rounded-[24px] border border-white/20 bg-white/10 p-5 text-white backdrop-blur-md">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-white/65">
                      Featured Edit
                    </p>
                    <h3 className="mt-3 font-playfair text-2xl font-light sm:text-3xl">
                      {collection.title}
                    </h3>
                    <p className="mt-3 max-w-sm text-sm leading-6 text-white/78">
                      {collection.subtitle}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white">
                      Explore
                      <span className="transition-transform duration-300 group-hover:translate-x-1">+</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
