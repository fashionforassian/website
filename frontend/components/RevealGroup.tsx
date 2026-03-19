"use client";

import { motion } from "framer-motion";
import React from "react";

interface RevealGroupProps {
  children: React.ReactNode;
  staggerDelay?: number;
  duration?: number;
  yOffset?: number;
}

export default function RevealGroup({
  children,
  staggerDelay = 0.1,
  duration = 0.6,
  yOffset = 40,
}: RevealGroupProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: yOffset },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={itemVariants}>{child}</motion.div>
      ))}
    </motion.div>
  );
}
