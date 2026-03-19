"use client";

import { motion } from "framer-motion";

interface AnimatedGradientProps {
  children: React.ReactNode;
  colors?: string[];
  duration?: number;
  className?: string;
}

export default function AnimatedGradient({
  children,
  colors = ["#111111", "#c8b79f", "#222222", "#111111"],
  duration = 8,
  className = "",
}: AnimatedGradientProps) {
  return (
    <motion.div
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        background: `linear-gradient(-45deg, ${colors.join(", ")})`,
        backgroundSize: "300% 300%",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
