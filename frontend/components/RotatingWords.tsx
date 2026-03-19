"use client";

import { motion } from "framer-motion";

interface RotatingWordsProps {
  words: string[];
  duration?: number;
  className?: string;
}

export default function RotatingWords({
  words,
  duration = 3,
  className = "",
}: RotatingWordsProps) {
  return (
    <div className={`relative inline-block h-[1em] overflow-hidden ${className}`}>
      {words.map((word, index) => (
        <motion.div
          key={index}
          className="absolute whitespace-nowrap"
          initial={{ y: "100%" }}
          animate={{ y: "-100%" }}
          transition={{
            delay: (index * duration) / words.length,
            duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {word}
        </motion.div>
      ))}
    </div>
  );
}
