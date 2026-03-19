"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import React from "react";

interface CounterProps {
  from?: number;
  to: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export default function Counter({
  from = 0,
  to,
  duration = 2,
  delay = 0,
  suffix = "",
  prefix = "",
  className = "",
}: CounterProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={className}
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <svg style={{ opacity: 0 }} width="0" height="0">
          <defs>
            <filter id="soften" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0" />
            </filter>
          </defs>
        </svg>
        <CounterNumber from={from} to={to} duration={duration} />
        {suffix && <span>{suffix}</span>}
      </motion.div>
    </motion.div>
  );
}

function CounterNumber({
  from,
  to,
  duration,
}: {
  from: number;
  to: number;
  duration: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: (custom: number) => ({
      opacity: 1,
      transition: {
        duration: duration,
        ease: "easeOut",
      },
    }),
  };

  const handleCountUp = (element: HTMLElement | null) => {
    if (!element) return;

    let current = from;
    const increment = (to - from) / (duration * 60);
    let animationFrameId: number;

    const animate = () => {
      current += increment;
      if (current >= to) {
        element.innerText = to.toLocaleString();
      } else {
        element.innerText = Math.floor(current).toLocaleString();
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  };

  React.useEffect(() => {
    const cleanup = handleCountUp(ref.current);
    return cleanup;
  }, []);

  return <span ref={ref}>{from}</span>;
}
