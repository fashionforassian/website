"use client";

import { motion, useMotionValue } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  slug: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
}

interface AutoScrollNewArrivalsProps {
  products: Product[];
}

export default function AutoScrollNewArrivals({ products }: AutoScrollNewArrivalsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const animationRef = useRef<number | null>(null);
  const positionRef = useRef(0);
  const scrollSpeedRef = useRef(1); // pixels per frame
  const [containerWidth, setContainerWidth] = useState(0);

  // Calculate scroll width - one set of products
  const singleSetWidth = products.length * 320; // 280px + 40px gap

  useEffect(() => {
    // Measure container width on mount and window resize
    const measureWidth = () => {
      if (scrollRef.current) {
        const scrollWidth = scrollRef.current.scrollWidth / 2; // Divide by 2 since we render products twice
        setContainerWidth(scrollWidth);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(measureWidth, 100);
    window.addEventListener("resize", measureWidth);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", measureWidth);
    };
  }, [products.length]);

  useEffect(() => {
    if (containerWidth === 0) return;

    const animate = () => {
      if (isAutoScrolling) {
        // Move left (negative direction)
        positionRef.current -= scrollSpeedRef.current;

        // Reset position when we've scrolled one full set
        if (positionRef.current <= -containerWidth) {
          positionRef.current = 0;
        }

        x.set(positionRef.current);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAutoScrolling, containerWidth, x]);

  const handleMouseEnter = () => setIsAutoScrolling(false);
  const handleMouseLeave = () => setIsAutoScrolling(true);

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-neutral-50 to-white py-24">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-playfair text-4xl font-light text-black md:text-5xl mb-2">
            Fresh Additions
          </h2>
          <p className="text-sm text-neutral-600">New arrivals scroll continuously with ease</p>
        </motion.div>
      </div>

      {/* Gradient overlays for smooth edges */}
      <div className="absolute left-0 top-0 z-20 h-full w-16 bg-gradient-to-r from-white to-transparent pointer-events-none md:w-24" />
      <div className="absolute right-0 top-0 z-20 h-full w-16 bg-gradient-to-l from-white to-transparent pointer-events-none md:w-24" />

      <div 
        ref={containerRef}
        className="overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          ref={scrollRef}
          className="flex gap-6 px-4 md:px-8"
          style={{ x }}
        >
          {/* Render products twice for infinite loop effect */}
          {[...products, ...products].map((product, index) => (
            <motion.div
              key={`${product.id}-${index}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false, margin: "50px" }}
              transition={{ duration: 0.5 }}
              className="group relative min-w-[280px] flex-shrink-0"
            >
              <Link href={`/product/${product.slug}`}>
                <motion.div 
                  className="relative h-80 overflow-hidden rounded-xl bg-neutral-200 shadow-sm group-hover:shadow-lg transition-shadow duration-300"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    priority={index < 4}
                  />
                  {product.isNew && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      className="absolute left-4 top-4 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-black shadow-md"
                    >
                      🆕 New
                    </motion.div>
                  )}
                </motion.div>

                <motion.div
                  className="mt-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                >
                  <h3 className="font-playfair text-base font-light text-black line-clamp-2 group-hover:text-neutral-600 transition-colors">
                    {product.title}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-neutral-900">
                    ${product.price}
                  </p>
                </motion.div>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-xs font-semibold text-neutral-900 transition-all hover:bg-neutral-900 hover:text-white hover:border-neutral-900"
              >
                Quick View
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
