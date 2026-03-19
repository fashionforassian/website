"use client";

import { motion } from "framer-motion";

interface ClothingItemProps {
  isActive: boolean;
  color: string;
  pattern: string;
}

export default function ClothingItem({ isActive, color, pattern }: ClothingItemProps) {
  return (
    <motion.div
      className="absolute w-48 h-56 rounded-2xl shadow-xl overflow-hidden"
      style={{
        top: "30%",
        backgroundColor: color,
        transform: "translateZ(30px)",
      }}
      animate={{
        scale: isActive ? 1 : 0.8,
        opacity: isActive ? 1 : 0,
      }}
      transition={{
        duration: 0.6,
        ease: "easeInOut",
      }}
    >
      {/* Fabric texture */}
      <div className="absolute inset-0" style={{ backgroundImage: pattern, opacity: 0.3 }} />

      {/* Clothing fold texture */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)`,
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Shine effect */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/30 to-transparent"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}
