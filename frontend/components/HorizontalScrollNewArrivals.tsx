"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/data";

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  hoverImage?: string;
  category: string;
  slug: string;
  isNew?: boolean;
}

interface HorizontalScrollNewArrivalsProps {
  products: Product[];
  title: string;
  subtitle: string;
}

export default function HorizontalScrollNewArrivals({
  products,
  title,
  subtitle,
}: HorizontalScrollNewArrivalsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const velocityRef = useRef(0);
  const momentumFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      const rect = container.getBoundingClientRect();
      const isInView =
        rect.top < window.innerHeight * 0.2 && rect.bottom > window.innerHeight * 0.2;

      if (!isInView) return;

      // Check if we can scroll more horizontally
      const canScrollRight =
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10;
      const canScrollLeft = container.scrollLeft > 10;

      // Only intercept vertical scrolling if we can scroll horizontally
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        if ((e.deltaY > 0 && canScrollRight) || (e.deltaY < 0 && canScrollLeft)) {
          e.preventDefault();
          velocityRef.current = e.deltaY * 0.8;

          // Cancel any existing momentum animation
          if (momentumFrameRef.current) {
            cancelAnimationFrame(momentumFrameRef.current);
          }

          // Apply momentum scrolling
          const applyMomentum = () => {
            const velocity = velocityRef.current;
            if (Math.abs(velocity) < 0.5) {
              velocityRef.current = 0;
              return;
            }

            container.scrollLeft += velocity;
            velocityRef.current *= 0.92; // Friction

            // Update progress
            const progress =
              container.scrollLeft /
              (container.scrollWidth - container.clientWidth);
            setScrollProgress(Math.min(1, progress));

            momentumFrameRef.current = requestAnimationFrame(applyMomentum);
          };

          momentumFrameRef.current = requestAnimationFrame(applyMomentum);
        }
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    // Track scroll progress
    const handleScroll = () => {
      const progress =
        container.scrollLeft /
        (container.scrollWidth - container.clientWidth);
      setScrollProgress(Math.min(1, progress));
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("scroll", handleScroll);
      if (momentumFrameRef.current) {
        cancelAnimationFrame(momentumFrameRef.current);
      }
    };
  }, []);

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="font-playfair text-4xl md:text-5xl font-light text-black mb-2">
            {title}
          </h2>
          <p className="text-neutral-600 font-light">{subtitle}</p>
        </motion.div>
      </div>

      {/* Scroll instruction */}
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 mb-6">
        <p className="text-xs text-neutral-500 uppercase tracking-widest">
          Scroll horizontally to explore
        </p>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-8"
          style={{
            scrollBehavior: "smooth",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="flex-shrink-0 w-72 scroll-snap-align-start scroll-snap-stop-always"
              style={{ scrollSnapAlign: "start" }}
            >
              <Link href={`/product/${product.slug}`}>
                <div className="group relative overflow-hidden rounded-lg bg-neutral-100 aspect-square cursor-pointer">
                  <div className="relative h-full w-full overflow-hidden">
                    {/* Main Image */}
                    <motion.div
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="h-full w-full"
                    >
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </motion.div>

                    {/* Hover Image Overlay */}
                    {product.hoverImage && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={product.hoverImage}
                          alt={`${product.title} hover`}
                          fill
                          className="object-cover"
                        />
                      </motion.div>
                    )}

                    {/* Badge */}
                    {product.isNew && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-xs font-medium"
                      >
                        NEW
                      </motion.div>
                    )}

                    {/* Quick View Overlay */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 flex items-end justify-center bg-black/40 p-4"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-black px-6 py-2 font-medium rounded-full text-sm"
                      >
                        Quick View
                      </motion.button>
                    </motion.div>
                  </div>
                </div>

                {/* Product Info */}
                <motion.div
                  className="mt-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <p className="text-sm text-neutral-600 uppercase tracking-widest mb-2">
                    {product.category}
                  </p>
                  <h3 className="font-playfair text-lg font-light text-black mb-2 line-clamp-2">
                    {product.title}
                  </h3>
                  <p className="text-sm font-medium text-black">{formatPrice(product.price)}</p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Scroll Progress Indicator */}
        <div className="mx-auto w-full max-w-7xl px-4 md:px-8 mt-8">
          <div className="h-0.5 bg-neutral-200 overflow-hidden">
            <motion.div
              className="h-full bg-black"
              style={{ width: `${scrollProgress * 100}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
