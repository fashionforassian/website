"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface RotatingWordsProps {
  words: string[];
  duration?: number;
  className?: string;
}

export default function RotatingWords({
  words,
  duration = 6,
  className = "",
}: RotatingWordsProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, Math.max(duration * 1000, 1400));

    return () => window.clearInterval(intervalId);
  }, [duration, words.length]);

  return (
    <span className={`relative inline-flex min-w-[7ch] overflow-hidden align-baseline ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index] ?? ""}
          initial={{ opacity: 0, y: "55%" }}
          animate={{ opacity: 1, y: "0%" }}
          exit={{ opacity: 0, y: "-55%" }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          className="inline-block"
        >
          {words[index] ?? ""}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
