"use client";

import { motion } from "framer-motion";

interface PulseProps {
  children: React.ReactNode;
  duration?: number;
  className?: string;
}

export default function Pulse({
  children,
  duration = 2,
  className = "",
}: PulseProps) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
