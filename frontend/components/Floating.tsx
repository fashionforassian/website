"use client";

import { motion } from "framer-motion";

interface FloatingProps {
  children: React.ReactNode;
  duration?: number;
  distance?: number;
  delay?: number;
}

export default function Floating({
  children,
  duration = 4,
  distance = 15,
  delay = 0,
}: FloatingProps) {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{
        y: [0, -distance, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
