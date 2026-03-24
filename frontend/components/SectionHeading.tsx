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
  const isCenter = align === "center";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={`mb-12 ${isCenter ? "text-center" : "text-left"}`}
    >
      {subtitle ? (
        <p className="mb-4 text-[11px] uppercase tracking-[0.34em] text-neutral-500">
          {subtitle}
        </p>
      ) : null}

      <h2 className="font-playfair text-4xl font-light leading-tight text-black md:text-5xl">
        {title}
      </h2>

      <motion.div
        initial={{ width: 0, opacity: 0 }}
        whileInView={{ width: 88, opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        className={`mt-6 h-px bg-[linear-gradient(90deg,#111111_0%,rgba(17,17,17,0.12)_100%)] ${
          isCenter ? "mx-auto" : ""
        }`}
      />
    </motion.div>
  );
}
