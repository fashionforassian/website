"use client";

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
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const [trackWidth, setTrackWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(media.matches);

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        setTrackWidth(trackRef.current.scrollWidth / 2);
      }
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [products.length]);

  useEffect(() => {
    if (!isDesktop || !trackWidth || !trackRef.current) {
      if (trackRef.current) {
        trackRef.current.style.transform = "translate3d(0,0,0)";
      }
      return;
    }

    const animate = () => {
      if (!isPaused && trackRef.current) {
        offsetRef.current -= 0.45;

        if (offsetRef.current <= -trackWidth) {
          offsetRef.current = 0;
        }

        trackRef.current.style.transform = `translate3d(${offsetRef.current}px,0,0)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDesktop, isPaused, trackWidth]);

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-neutral-50 to-white py-16 md:py-20">
      <div className="mx-auto mb-10 w-full max-w-7xl px-4 md:px-8">
        <h2 className="mb-2 font-playfair text-3xl font-light text-black md:text-5xl">
          Fresh Additions
        </h2>
        <p className="text-sm text-neutral-600">Latest arrivals from the live catalog.</p>
      </div>

      <div className="pointer-events-none absolute left-0 top-0 z-20 hidden h-full w-20 bg-gradient-to-r from-white to-transparent lg:block" />
      <div className="pointer-events-none absolute right-0 top-0 z-20 hidden h-full w-20 bg-gradient-to-l from-white to-transparent lg:block" />

      <div
        ref={containerRef}
        className="overflow-x-auto lg:overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          ref={trackRef}
          className="flex gap-5 px-4 md:px-8"
          style={{ width: isDesktop ? "max-content" : "auto" }}
        >
          {(isDesktop ? [...products, ...products] : products).map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className="group relative min-w-[250px] flex-shrink-0 sm:min-w-[280px]"
            >
              <Link href={`/product/${product.slug}`} className="block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-neutral-200 shadow-sm transition-shadow duration-300 group-hover:shadow-md">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    priority={index < 4}
                  />
                  {product.isNew ? (
                    <div className="absolute left-4 top-4 rounded-full bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-black shadow-sm">
                      New
                    </div>
                  ) : null}
                </div>

                <div className="mt-4">
                  <h3 className="line-clamp-2 font-playfair text-base font-light text-black transition-colors group-hover:text-neutral-600">
                    {product.title}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-neutral-900">{formatPrice(product.price)}</p>
                </div>
              </Link>

              <button
                type="button"
                className="mt-4 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-xs font-semibold text-neutral-900 transition-colors hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
              >
                Quick View
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
