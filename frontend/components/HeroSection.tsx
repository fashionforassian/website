"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function HeroSection() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const xPos = (e.clientX / innerWidth - 0.5) * 40;
      const yPos = (e.clientY / innerHeight - 0.5) * 40;
      x.set(xPos);
      y.set(yPos);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y]);

  const imageX = useTransform(x, (val) => val * 1.2);
  const imageY = useTransform(y, (val) => val * 1.2);

  const textX = useTransform(x, (val) => val * 0.5);
  const textY = useTransform(y, (val) => val * 0.5);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Image */}
      <motion.div style={{ x: imageX, y: imageY }} className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1464863979621-258859e62245?auto=format&fit=crop&w=2000&q=80"
          alt="Hero"
          fill
          priority
          className="object-cover"
        />
      </motion.div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <motion.div
        style={{ x: textX, y: textY }}
        className="relative z-10 flex h-full items-end px-6 pb-16 md:px-12"
      >
        <div className="max-w-2xl text-white">
          <p className="mb-4 text-xs uppercase tracking-[0.22em]">
              Fassion 4 Asian Spring Summer 2026
          </p>

          <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-7xl">
            Editorial pieces for modern urban dressing
          </h1>

          <p className="mt-5 text-sm md:text-base text-white/80 leading-7">
            Refined essentials and directional statements designed for movement, climate, and contemporary life.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="border border-white bg-white px-6 py-3 text-xs uppercase tracking-[0.2em] text-black hover:bg-transparent hover:text-white transition"
            >
              Shop New Arrivals
            </Link>

            <Link
              href="/about"
              className="border border-white px-6 py-3 text-xs uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black transition"
            >
              Discover Campaign
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
