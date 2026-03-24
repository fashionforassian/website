"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface StatItem {
  value: number;
  label: string;
  suffix?: string;
}

interface StatsCounterProps {
  stats: StatItem[];
}

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!isInView) {
      return;
    }

    let frameId = 0;
    const start = performance.now();
    const duration = 900;

    const update = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));

      if (progress < 1) {
        frameId = requestAnimationFrame(update);
      }
    };

    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function StatsCounter({ stats }: StatsCounterProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#161616] via-[#121212] to-[#161616] py-16 md:py-20">
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(45deg, #fff 1px, transparent 1px), linear-gradient(-45deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="grid w-full grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: index * 0.06, ease: "easeOut" }}
              className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center backdrop-blur-sm md:text-left"
            >
              <div className="font-playfair text-4xl font-light text-white md:text-5xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-neutral-400 md:text-sm">
                {stat.label}
              </p>
              <div className="mt-4 h-0.5 bg-gradient-to-r from-white/0 via-white/50 to-white/0" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
