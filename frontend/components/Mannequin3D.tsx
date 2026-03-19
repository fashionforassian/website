"use client";

import { motion } from "framer-motion";

export default function Mannequin3D() {
  return (
    <motion.div
      className="relative w-64 h-96 flex items-center justify-center"
      style={{
        perspective: "1500px",
      }}
    >
      {/* Head */}
      <motion.div
        className="absolute w-14 h-14 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 shadow-lg"
        style={{
          top: "8%",
          zIndex: 5,
        }}
        animate={{
          y: [0, -2, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Neck */}
      <motion.div
        className="absolute w-6 h-8 bg-gradient-to-b from-amber-300 to-amber-400"
        style={{
          top: "22%",
        }}
      />

      {/* Left Arm */}
      <motion.div
        className="absolute w-6 h-40 rounded-full bg-gradient-to-b from-amber-200 to-amber-300 shadow-lg"
        style={{
          left: "-35px",
          top: "28%",
        }}
        animate={{
          rotateZ: [-15, -5, -15],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Right Arm */}
      <motion.div
        className="absolute w-6 h-40 rounded-full bg-gradient-to-b from-amber-200 to-amber-300 shadow-lg"
        style={{
          right: "-35px",
          top: "28%",
        }}
        animate={{
          rotateZ: [15, 5, 15],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Left Leg */}
      <motion.div
        className="absolute w-8 h-32 rounded-full bg-gradient-to-b from-amber-200 to-amber-300 shadow-lg"
        style={{
          left: "20px",
          bottom: "0%",
        }}
      />

      {/* Right Leg */}
      <motion.div
        className="absolute w-8 h-32 rounded-full bg-gradient-to-b from-amber-200 to-amber-300 shadow-lg"
        style={{
          right: "20px",
          bottom: "0%",
        }}
      />

      {/* Glow effect */}
      <motion.div
        className="absolute w-56 h-80 rounded-full bg-gradient-to-t from-blue-400/20 to-transparent blur-3xl pointer-events-none"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}
