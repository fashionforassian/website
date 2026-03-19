"use client";

import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { useRef } from "react";

interface ScrollAnimationProps {
  children: React.ReactNode;
  type?: "rotate" | "scale" | "skew" | "blur";
  intensity?: number;
  className?: string;
}

export default function ScrollAnimation({
  children,
  type = "rotate",
  intensity = 10,
  className = "",
}: ScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 20%"],
  });

  let transform;

  switch (type) {
    case "rotate":
      transform = useTransform(scrollYProgress, [0, 1], [0, intensity]);
      return (
        <motion.div
          ref={ref}
          style={{ rotate: transform, willChange: "transform" }}
          className={className}
        >
          {children}
        </motion.div>
      );

    case "scale":
      const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1.2]);
      return (
        <motion.div
          ref={ref}
          style={{ scale, willChange: "transform" }}
          className={className}
        >
          {children}
        </motion.div>
      );

    case "skew":
      const skewValue = useTransform(
        scrollYProgress,
        [0, 1],
        [-intensity, intensity]
      );
      return (
        <motion.div
          ref={ref}
          style={{ skewY: skewValue, willChange: "transform" }}
          className={className}
        >
          {children}
        </motion.div>
      );

    case "blur":
      const blurValue = useTransform(
        scrollYProgress,
        [0, 1],
        [intensity, 0]
      );
      const filter = useMotionTemplate`blur(${blurValue}px)`;
      return (
        <motion.div
          ref={ref}
          style={{ filter, willChange: "filter" }}
          className={className}
        >
          {children}
        </motion.div>
      );

    default:
      return <div className={className}>{children}</div>;
  }
}
