"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface StickyScrollProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}

export default function StickyScroll({
  children,
  offset = 100,
  className = "",
}: StickyScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, scale, y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
