"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";

type USPItem = {
  text: string;
  desc: string;
  icon: ReactNode;
};

const uspItems: USPItem[] = [
  {
    text: "Express Delivery",
    desc: "Within 24-48 hours",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
        <path d="M3 16h11" />
        <path d="M3 12h8" />
        <path d="M3 8h5" />
        <path d="M14 8h4l3 4v4h-2" />
        <path d="M14 8v8" />
        <circle cx="8" cy="18" r="2" />
        <circle cx="18" cy="18" r="2" />
      </svg>
    ),
  },
  {
    text: "Curated Capsules",
    desc: "Hand-selected pieces",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
        <path d="M12 3l2.8 5.7L21 9.6l-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9L12 3z" />
      </svg>
    ),
  },
  {
    text: "14-day Returns",
    desc: "Hassle-free returns",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
        <path d="M8 7H4v4" />
        <path d="M4 11a8 8 0 1 0 2.3-5.6L4 7" />
      </svg>
    ),
  },
  {
    text: "Secure Checkout",
    desc: "100% encrypted",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
        <rect x="4" y="10" width="16" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </svg>
    ),
  },
];

export default function AnimatedUSP() {
  return (
    <section className="border-b border-neutral-200 bg-[#fbfaf8]">
      <div className="mx-auto grid w-full max-w-7xl gap-3 px-4 py-10 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {uspItems.map((item, index) => (
          <motion.article
            key={item.text}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.45, delay: index * 0.06, ease: "easeOut" }}
            whileHover={{ y: -4 }}
            className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-4 shadow-[0_12px_30px_rgba(17,17,17,0.04)]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-neutral-900">
              {item.icon}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-neutral-900">{item.text}</h3>
              <p className="mt-1 text-xs uppercase tracking-[0.12em] text-neutral-500">{item.desc}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
