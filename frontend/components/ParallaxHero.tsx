"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface ParallaxHeroProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  backgroundImage?: string;
}

export default function ParallaxHero({
  title,
  subtitle,
  ctaText = "Explore Collection",
  ctaHref = "/products",
  backgroundImage = "https://images.unsplash.com/photo-1488554347313-52581516c25f?auto=format&fit=crop&w=2000&q=80",
}: ParallaxHeroProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      setMousePosition({ x: x * 20, y: y * 20 });
    };

    const handleMouseLeave = () => {
      setMousePosition({ x: 0, y: 0 });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* Parallax Background Image */}
      <motion.div
        className="absolute inset-0"
        animate={{
          x: mousePosition.x * 0.15,
          y: mousePosition.y * 0.15,
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
        }}
      >
        <Image
          src={backgroundImage}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      {/* Dark overlay for readability */}
      <motion.div
        className="absolute inset-0 bg-black/40"
        animate={{
          opacity: 0.4,
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        {/* Parallax Text Container */}
        <motion.div
          animate={{
            x: mousePosition.x * 0.3,
            y: mousePosition.y * 0.3,
          }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
          }}
          className="max-w-2xl"
        >
          {/* Subtitle */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
              className="mb-4 text-sm uppercase tracking-[0.3em] text-neutral-300"
            >
              {subtitle}
            </motion.p>
          )}

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="mb-6 font-playfair text-5xl font-light leading-tight text-white md:text-7xl"
          >
            {title}
          </motion.h1>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <a
              href={ctaHref}
              className="group relative inline-block border border-white px-8 py-3 text-sm uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-white hover:text-black"
            >
              <span className="relative z-10">{ctaText}</span>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs uppercase tracking-[0.15em] text-white/60">
            Scroll
          </span>
          <svg
            className="h-5 w-5 text-white/60"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
