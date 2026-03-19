"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 md:px-8">
      <SectionHeading title={title} subtitle={subtitle} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid gap-6 md:grid-cols-3 lg:gap-8"
      >
        {collections.map((collection) => (
          <motion.div key={collection.id} variants={itemVariants}>
            <Link href={collection.href}>
              <motion.div className="group overflow-hidden" whileHover={{ y: -10 }}>
                {/* Image */}
                <div className="relative mb-6 h-96 overflow-hidden bg-neutral-100">
                  <motion.div
                    className="relative h-full w-full"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Image
                      src={collection.image}
                      alt={collection.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </motion.div>
                  {/* Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-black/0"
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.15)" }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <motion.h3
                    className="font-playfair text-xl font-light text-black transition-colors duration-300 group-hover:text-neutral-700"
                  >
                    {collection.title}
                  </motion.h3>
                  <motion.p
                    animate={{ opacity: 0.7 }}
                    className="text-sm text-neutral-600 transition-colors duration-300 group-hover:text-neutral-900"
                  >
                    {collection.subtitle}
                  </motion.p>

                  {/* CTA Link */}
                  <motion.div
                    initial={{ opacity: 0, x: -5 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="pt-2"
                  >
                    <span className="inline-block border-b border-black text-xs uppercase tracking-[0.15em] text-black transition-colors duration-300">
                      Explore
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
