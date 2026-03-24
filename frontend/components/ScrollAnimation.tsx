"use client";

import { motion } from "framer-motion";

interface ScrollAnimationProps {
  children: React.ReactNode;
  type?: "rotate" | "scale" | "skew" | "blur";
  intensity?: number;
  className?: string;
}

export default function ScrollAnimation({
  children,
  className = "",
}: ScrollAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0.92, scale: 0.985 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
