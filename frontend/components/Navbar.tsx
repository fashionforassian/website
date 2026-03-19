"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/components/providers/CartProvider";
import { navCategories } from "@/lib/data";

const megaMenu = {
  men: [
    "Outerwear",
    "Shirts",
    "Trousers",
    "Denim",
    "Footwear",
    "Accessories",
  ],
  women: [
    "Dresses",
    "Tailoring",
    "Knitwear",
    "Outerwear",
    "Footwear",
    "Accessories",
  ],
  kids: [
    "Shirts & Tops",
    "Pants & Shorts",
    "Dresses & Skirts",
    "Outerwear",
    "Footwear",
    "Accessories",
  ],
};

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<"men" | "women" | "kids" | null>(null);
  const { cartCount } = useCart();

  return (
    <header
      className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur"
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-4 md:px-8">
        <button
          aria-label="Toggle navigation"
          className="border border-neutral-300 px-3 py-2 text-xs tracking-[0.2em] md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          type="button"
        >
          MENU
        </button>

        <Link href="/" className="font-heading text-xl tracking-[0.2em] text-[#111111]">
          FASHION ASIA
        </Link>

        <nav className="hidden items-center gap-7 text-xs font-medium uppercase tracking-[0.18em] md:flex">
          {navCategories.map((item) => {
            const hasMegaMenu = item.label === "Men" || item.label === "Women" || item.label === "Kids";
            const menuKey = item.label.toLowerCase() as "men" | "women" | "kids";

            return (
              <div
                key={item.label}
                onMouseEnter={hasMegaMenu ? () => setActiveMenu(menuKey) : () => setActiveMenu(null)}
                onFocus={hasMegaMenu ? () => setActiveMenu(menuKey) : () => setActiveMenu(null)}
              >
                <Link
                  href={item.href}
                  className="text-[#222222] transition-colors hover:text-[#111111]"
                >
                  {item.label}
                </Link>
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-4 text-xs uppercase tracking-[0.15em]">
          <Link href="/search" className="hidden md:inline hover:text-[#111111]">
            Search
          </Link>
          <Link href="/cart" className="hover:text-[#111111]">
            Cart ({cartCount})
          </Link>
        </div>
      </div>

      {activeMenu ? (
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="hidden border-t border-neutral-200 bg-white md:block"
        >
          <div className="mx-auto max-w-[1400px] px-8 py-6">
            <p className="mb-5 text-[11px] uppercase tracking-[0.2em] text-neutral-500 font-semibold">
              {activeMenu === "men" ? "Men's Collection" : activeMenu === "women" ? "Women's Collection" : "Kids' Collection"}
            </p>
            <ul className="grid grid-cols-3 gap-y-3 gap-x-8 text-sm">
              {megaMenu[activeMenu].map((item, idx) => (
                <motion.li 
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05, ease: "easeOut" }}
                >
                  <Link
                    href={`/${activeMenu}`}
                    className="text-[#222222] transition-colors hover:text-[#111111] hover:translate-x-1 inline-block"
                  >
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      ) : null}

      {mobileOpen ? (
        <nav className="border-t border-neutral-200 bg-white px-4 py-5 md:hidden">
          <ul className="space-y-3 text-xs uppercase tracking-[0.15em]">
            {navCategories.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="block py-1 text-[#222222]" onClick={() => setMobileOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/about" className="block py-1 text-[#222222]" onClick={() => setMobileOpen(false)}>
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="block py-1 text-[#222222]" onClick={() => setMobileOpen(false)}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
