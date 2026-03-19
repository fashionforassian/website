"use client";

import { motion } from "framer-motion";

const uspItems = [
  { icon: "✈️", text: "Express Delivery", desc: "Within 24-48 hours" },
  { icon: "✨", text: "Curated Capsules", desc: "Hand-selected pieces" },
  { icon: "♻️", text: "14-day Returns", desc: "Hassle-free returns" },
  { icon: "🔒", text: "Secure Checkout", desc: "100% encrypted" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const iconVariants = {
  idle: { y: 0, scale: 1 },
  hover: { y: -8, scale: 1.1, transition: { duration: 0.3, ease: "easeOut" as const } },
};

export default function AnimatedUSP() {
  return (
    <section className="border-b border-neutral-200 bg-gradient-to-b from-white to-neutral-50 py-20 md:py-28">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
        className="mx-auto grid w-full max-w-7xl gap-6 px-4 md:grid-cols-4 lg:px-8"
      >
        {uspItems.map((item) => (
          <motion.div
            key={item.text}
            variants={itemVariants}
            whileHover="hover"
            className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white px-8 py-10 shadow-sm transition-all duration-300 hover:border-neutral-400 hover:shadow-xl hover:scale-105"
          >
            <motion.div
              variants={iconVariants}
              className="mb-6 text-6xl will-change-transform"
            >
              {item.icon}
            </motion.div>
            <h3 className="font-semibold text-neutral-900 text-base mb-3">
              {item.text}
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              {item.desc}
            </p>
            <motion.div 
              className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-neutral-900 to-neutral-600 transition-all duration-300 group-hover:w-full" 
              layoutId={`usp-${item.text}`}
            />
            <motion.div 
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: "radial-gradient(circle at 30% 30%, rgba(0,0,0,0.02) 0%, transparent 70%)"
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
