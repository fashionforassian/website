"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export default function SectionHeading({
  title,
  subtitle,
  align = "left",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center" : "text-left";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`mb-12 ${alignClass}`}
    >
      <h2 className="font-playfair text-4xl font-light text-black md:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-sm uppercase tracking-[0.2em] text-neutral-500">
          {subtitle}
        </p>
      )}
      <motion.div
        className="mx-auto mt-6 h-px w-12 bg-black"
        initial={{ width: 0 }}
        whileInView={{ width: align === "center" ? 48 : 48 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
    </motion.div>
  );
}
