"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ScrollTriggerProps {
  children: React.ReactNode;
  onEnter?: () => void;
  className?: string;
}

export default function ScrollTrigger({
  children,
  onEnter,
  className = "",
}: ScrollTriggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0.5 1", "0.5 0.5"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 0.9, 1]);
  const blur = useTransform(scrollYProgress, [0, 0.5, 1], [10, 5, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, scale, filter: blur }}
      onViewportEnter={onEnter}
      className={className}
    >
      {children}
    </motion.div>
  );
}
