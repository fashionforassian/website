"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface FeaturedProductShowcaseProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  secondaryImage?: string;
  badge?: string;
  cta: string;
  ctaHref: string;
  layout?: "left" | "right" | "full";
}

export default function FeaturedProductShowcase({
  title,
  subtitle,
  description,
  image,
  secondaryImage,
  badge,
  cta,
  ctaHref,
  layout = "left",
}: FeaturedProductShowcaseProps) {
  const [isHovered, setIsHovered] = useState(false);

  const contentVariants = {
    hidden: { opacity: 0, x: layout === "left" ? -40 : 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8 },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, delay: 0.2 },
    },
  };

  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 py-20 md:px-8">
      <div className="grid items-center gap-12 md:grid-cols-2 lg:gap-20">
        {/* Content - Left or Right based on layout */}
        {layout !== "right" && (
          <motion.div
            variants={contentVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-6"
          >
            {badge && (
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-block border border-black px-4 py-2 text-xs uppercase tracking-[0.2em] text-black"
              >
                {badge}
              </motion.span>
            )}

            <div className="space-y-3">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="font-playfair text-sm uppercase tracking-[0.3em] text-neutral-600"
              >
                {subtitle}
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="font-playfair text-4xl font-light leading-tight text-black md:text-5xl"
              >
                {title}
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-lg text-base leading-relaxed text-neutral-700"
            >
              {description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="pt-4"
            >
              <Link href={ctaHref}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative in line-block border-b-2 border-black pb-2 text-sm uppercase tracking-[0.2em] text-black transition-all duration-300 hover:border-neutral-400 hover:text-neutral-600"
                >
                  {cta}
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        )}

        {/* Image - Right or Left based on layout */}
        <motion.div
          variants={imageVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className={layout === "right" ? "order-2" : ""}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative overflow-hidden bg-neutral-100">
            {/* Primary Image */}
            <motion.div
              className="relative h-screen w-full"
              animate={{ opacity: isHovered && secondaryImage ? 0 : 1 }}
              transition={{ duration: 0.4 }}
            >
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>

            {/* Secondary Image Swap */}
            {secondaryImage && (
              <motion.div
                className="absolute inset-0"
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              >
                <Image
                  src={secondaryImage}
                  alt={`${title} alternate`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </motion.div>
            )}

            {/* Hover Text */}
            <motion.div
              className="absolute inset-0 flex items-end justify-start p-8"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.p
                initial={{ y: 20 }}
                whileHover={{ y: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-xs text-sm leading-relaxed text-white drop-shadow-lg"
              >
                Hover to explore alternate views
              </motion.p>
            </motion.div>
          </div>
        </motion.div>

        {/* Content - Right side (if layout is right) */}
        {layout === "right" && (
          <motion.div
            variants={contentVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="order-1 space-y-6"
          >
            {badge && (
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-block border border-black px-4 py-2 text-xs uppercase tracking-[0.2em] text-black"
              >
                {badge}
              </motion.span>
            )}

            <div className="space-y-3">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="font-playfair text-sm uppercase tracking-[0.3em] text-neutral-600"
              >
                {subtitle}
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="font-playfair text-4xl font-light leading-tight text-black md:text-5xl"
              >
                {title}
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-lg text-base leading-relaxed text-neutral-700"
            >
              {description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="pt-4"
            >
              <Link href={ctaHref}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-block border-b-2 border-black pb-2 text-sm uppercase tracking-[0.2em] text-black transition-all duration-300 hover:border-neutral-400 hover:text-neutral-600"
                >
                  {cta}
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
