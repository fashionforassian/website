"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let animationFrameId: number;
    let currentValue = 0;
    const increment = value / 60; // Animate over 60 frames (~1 second)
    const startTime = Date.now();
    const duration = 1200; // 1.2 seconds for smooth animation

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuad = 1 - Math.pow(1 - progress, 2);
      currentValue = easeOutQuad * value;

      setDisplayValue(Math.floor(currentValue));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {displayValue.toLocaleString()}{suffix}
    </span>
  );
}

export default function StatsCounter({ stats }: StatsCounterProps) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true });

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-gradient-to-b from-black via-neutral-950 to-black py-24"
    >
      {/* Background Grid Effect */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundImage:
              "linear-gradient(45deg, #fff 1px, transparent 1px), linear-gradient(-45deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            backgroundPosition: "0 0",
          }}
          className="h-full w-full"
        />
      </div>

      {/* Animated Orbs */}
      <motion.div
        className="absolute top-20 right-10 w-72 h-72 rounded-full bg-white/5 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-white/5 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Content */}
      <div className="relative mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="grid w-full grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="relative space-y-3 text-center md:text-left"
            >
              {/* Subtle background card */}
              <motion.div
                className="absolute inset-0 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              />

              <div className="relative">
                {/* Counter Number */}
                <motion.div
                  className="font-playfair text-4xl md:text-5xl font-light text-white"
                  initial={{ scale: 0.8 }}
                  animate={isInView ? { scale: 1 } : { scale: 0.8 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </motion.div>

                {/* Label */}
                <motion.p
                  className="text-xs md:text-sm uppercase tracking-[0.2em] text-neutral-400 mt-2 md:mt-3"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                >
                  {stat.label}
                </motion.p>

                {/* Animated underline */}
                <motion.div
                  className="h-0.5 bg-gradient-to-r from-white/0 via-white/50 to-white/0 mt-4"
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.1 + 0.2,
                    ease: "easeInOut",
                  }}
                  style={{ transformOrigin: "left" }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
