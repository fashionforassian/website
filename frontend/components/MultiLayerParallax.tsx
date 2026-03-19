"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface MultiLayerParallaxProps {
  images: {
    src: string;
    speed: number;
  }[];
  height?: number;
  className?: string;
}

export default function MultiLayerParallax({
  images,
  height = 600,
  className = "",
}: MultiLayerParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <div
      ref={ref}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ height }}
    >
      {images.map((image, index) => {
        const y = useTransform(
          scrollYProgress,
          [0, 1],
          [0, image.speed * 100]
        );

        return (
          <motion.div
            key={index}
            className="absolute inset-0"
            style={{
              y,
              zIndex: images.length - index,
            }}
          >
            <motion.img
              src={image.src}
              alt={`Parallax layer ${index}`}
              className="h-full w-full object-cover"
            />
          </motion.div>
        );
      })}
    </div>
  );
}
