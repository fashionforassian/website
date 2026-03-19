"use client";

import { motion } from "framer-motion";

interface Badge {
  id: string;
  icon: string;
  label: string;
  desc: string;
  animationType: "bounce" | "rotate" | "scale" | "pulse";
}

const badges: Badge[] = [
  { id: "payment", icon: "🔒", label: "Secure Payment", desc: "Encrypted transactions", animationType: "pulse" },
  { id: "shipping", icon: "🚚", label: "Fast Shipping", desc: "Orders shipped within 24h", animationType: "bounce" },
  { id: "returns", icon: "↩️", label: "Easy Returns", desc: "14-day return period", animationType: "rotate" },
  { id: "support", icon: "💬", label: "24/7 Support", desc: "Customer support available", animationType: "scale" },
];

const getAnimationVariants = (type: string) => {
  switch (type) {
    case "bounce":
      return {
        y: [0, -12, 0, -6, 0],
        transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" as const },
      };
    case "rotate":
      return {
        rotate: [0, 15, -15, 8, 0],
        transition: { duration: 2.8, repeat: Infinity, ease: "easeInOut" as const },
      };
    case "scale":
      return {
        scale: [1, 1.15, 0.9, 1.05, 1],
        transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" as const },
      };
    case "pulse":
    default:
      return {
        opacity: [1, 0.5, 1],
        scale: [1, 1.08, 1],
        transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" as const },
      };
  }
};

export default function AnimatedTrustBadges() {
  return (
    <section className="border-t border-neutral-200 bg-gradient-to-b from-white to-neutral-50">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-16 md:grid-cols-4 md:px-8 md:py-20">
        {badges.map((badge, idx) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="group relative overflow-hidden rounded-xl border border-neutral-100 bg-white p-8 hover:shadow-xl transition-shadow duration-300"
          >
            {/* Gradient background on hover */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-neutral-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ pointerEvents: "none" }}
            />
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <motion.div
                className="mb-5 text-6xl will-change-transform"
                animate={getAnimationVariants(badge.animationType)}
              >
                {badge.icon}
              </motion.div>
              <h3 className="font-semibold text-neutral-900 text-base mb-2">{badge.label}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{badge.desc}</p>
            </div>

            {/* Decorative element */}
            <motion.div 
              className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-neutral-900 to-transparent group-hover:w-full transition-all duration-500"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
