"use client";

import { motion, useInView, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/data";

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
  const scrollSpeedRef = useRef(0.55);
  const [containerWidth, setContainerWidth] = useState(0);
  const isInView = useInView(containerRef, { margin: "-10% 0px -10% 0px" });

  useEffect(() => {
    const measureWidth = () => {
      if (scrollRef.current) {
        setContainerWidth(scrollRef.current.scrollWidth / 2);
      }
    };

    const timer = window.setTimeout(measureWidth, 100);
    window.addEventListener("resize", measureWidth);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", measureWidth);
    };
  }, [products.length]);

  useEffect(() => {
    if (containerWidth === 0) {
      return;
    }

    const animate = () => {
      if (isAutoScrolling && isInView) {
        positionRef.current -= scrollSpeedRef.current;

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
  }, [containerWidth, isAutoScrolling, isInView, x]);

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-neutral-50 to-white py-24">
      <div className="mx-auto mb-12 w-full max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-2 font-playfair text-4xl font-light text-black md:text-5xl">
            Fresh Additions
          </h2>
          <p className="text-sm text-neutral-600">A lighter moving strip for the latest arrivals.</p>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-16 bg-gradient-to-r from-white to-transparent md:w-24" />
      <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-16 bg-gradient-to-l from-white to-transparent md:w-24" />

      <div
        ref={containerRef}
        className="overflow-hidden"
        onMouseEnter={() => setIsAutoScrolling(false)}
        onMouseLeave={() => setIsAutoScrolling(true)}
      >
        <motion.div ref={scrollRef} className="flex gap-6 px-4 md:px-8" style={{ x }}>
          {[...products, ...products].map((product, index) => (
            <motion.div
              key={`${product.id}-${index}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false, margin: "50px" }}
              transition={{ duration: 0.35 }}
              className="group relative min-w-[280px] flex-shrink-0"
            >
              <Link href={`/product/${product.slug}`}>
                <motion.div
                  className="relative aspect-[4/5] min-w-[280px] overflow-hidden rounded-xl bg-neutral-200 shadow-sm transition-shadow duration-300 group-hover:shadow-lg"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority={index < 4}
                  />
                  {product.isNew ? (
                    <div className="absolute left-4 top-4 rounded-full bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-black shadow-md">
                      New
                    </div>
                  ) : null}
                </motion.div>

                <motion.div className="mt-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
                  <h3 className="line-clamp-2 font-playfair text-base font-light text-black transition-colors group-hover:text-neutral-600">
                    {product.title}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-neutral-900">{formatPrice(product.price)}</p>
                </motion.div>
              </Link>

              <button
                type="button"
                className="mt-4 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-xs font-semibold text-neutral-900 transition-all hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
              >
                Quick View
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
