"use client";

import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface TextRevealProps {
  text: string;
  delay?: number;
  duration?: number;
  staggerDelay?: number;
  className?: string;
}

export default function TextReveal({
  text,
  delay = 0,
  duration = 0.05,
  staggerDelay = 0.02,
  className = "",
}: TextRevealProps) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(entry.target);
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const letters = text.split("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateZ: -10,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateZ: 0,
      transition: {
        duration,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={`inline ${className}`}
    >
      {letters.map((letter, index) => (
        <motion.span key={index} variants={letterVariants}>
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  );
}
