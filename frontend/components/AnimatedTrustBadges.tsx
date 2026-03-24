"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";

type Badge = {
  id: string;
  label: string;
  desc: string;
  icon: ReactNode;
};

const badges: Badge[] = [
  {
    id: "payment",
    label: "Secure Payment",
    desc: "Encrypted transactions",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18" />
        <path d="M7 15h3" />
      </svg>
    ),
  },
  {
    id: "shipping",
    label: "Fast Shipping",
    desc: "Orders shipped within 24h",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
        <path d="M3 16h11" />
        <path d="M14 8h4l3 4v4h-2" />
        <path d="M14 8v8" />
        <circle cx="8" cy="18" r="2" />
        <circle cx="18" cy="18" r="2" />
      </svg>
    ),
  },
  {
    id: "returns",
    label: "Easy Returns",
    desc: "14-day return period",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
        <path d="M8 7H4v4" />
        <path d="M4 11a8 8 0 1 0 2.3-5.6L4 7" />
      </svg>
    ),
  },
  {
    id: "support",
    label: "24/7 Support",
    desc: "Customer support available",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
        <path d="M5 18v-6a7 7 0 0 1 14 0v6" />
        <path d="M5 14H3v3a2 2 0 0 0 2 2h2v-5H5z" />
        <path d="M19 14h2v3a2 2 0 0 1-2 2h-2v-5h2z" />
      </svg>
    ),
  },
];

export default function AnimatedTrustBadges() {
  return (
    <section className="border-t border-neutral-200 bg-white">
      <div className="mx-auto grid w-full max-w-7xl gap-3 px-4 py-10 md:grid-cols-2 md:px-8 lg:grid-cols-4">
        {badges.map((badge, index) => (
          <motion.article
            key={badge.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.42, delay: index * 0.06, ease: "easeOut" }}
            whileHover={{ y: -4 }}
            className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-[#fbfaf8] px-4 py-4 shadow-[0_12px_30px_rgba(17,17,17,0.04)]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-900">
              {badge.icon}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-neutral-900">{badge.label}</h3>
              <p className="mt-1 text-xs uppercase tracking-[0.12em] text-neutral-500">{badge.desc}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
