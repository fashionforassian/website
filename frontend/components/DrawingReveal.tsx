"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface DrawingRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export default function DrawingReveal({
  children,
  delay = 0,
  duration = 1.2,
  className = "",
}: DrawingRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, pathLength: 0 }}
      whileInView={{ opacity: 1, pathLength: 1 }}
      viewport={{ once: true }}
      transition={{
        duration,
        delay,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
