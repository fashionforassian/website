"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const [activeMenu, setActiveMenu] = useState<"men" | "kids" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { cartCount } = useCart();
  const router = useRouter();

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = searchQuery.trim();
    router.push(term ? `/search?q=${encodeURIComponent(term)}` : "/search");
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur"
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div className="mx-auto flex min-h-16 w-full max-w-[1400px] items-center justify-between gap-3 px-4 py-3 md:px-8">
        <button
          aria-label="Toggle navigation"
          className="shrink-0 border border-neutral-300 px-3 py-2 text-[10px] tracking-[0.2em] md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          type="button"
        >
          MENU
        </button>

        <Link
          href="/"
          className="min-w-0 flex-1 pr-2 font-heading text-sm tracking-[0.16em] text-[#111111] sm:text-base md:flex-none md:pr-0 md:text-xl md:tracking-[0.2em]"
        >
          FASSION 4 ASIAN
        </Link>

        <nav className="hidden items-center gap-5 text-xs font-medium uppercase tracking-[0.16em] lg:flex xl:gap-7 xl:tracking-[0.18em]">
          {navCategories.map((item) => {
            const hasMegaMenu = item.label === "Men" || item.label === "Kids";
            const menuKey = item.label.toLowerCase() as "men" | "kids";

            return (
              <div
                key={item.label}
                onMouseEnter={hasMegaMenu ? () => setActiveMenu(menuKey) : () => setActiveMenu(null)}
                onFocus={hasMegaMenu ? () => setActiveMenu(menuKey) : () => setActiveMenu(null)}
              >
                <Link
                  href={item.href}
                  className="relative text-[#222222] transition-colors hover:text-[#111111]"
                >
                  {item.label}
                </Link>
              </div>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2 text-[10px] uppercase tracking-[0.13em] sm:text-xs sm:tracking-[0.15em]">
          <form onSubmit={submitSearch} className="hidden lg:block">
            <div className="flex h-10 items-center rounded-full border border-neutral-300 bg-white px-3 transition focus-within:border-[#111111]">
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search products"
                className="w-36 bg-transparent text-[11px] normal-case tracking-normal text-[#111111] outline-none placeholder:text-neutral-400 xl:w-48"
              />
              <button type="submit" className="ml-2 text-neutral-500 hover:text-[#111111]" aria-label="Search products">
                Go
              </button>
            </div>
          </form>
          <Link href="/admin" className="hidden lg:inline hover:text-[#111111]">
            Admin
          </Link>
          <Link href="/cart" className="whitespace-nowrap hover:text-[#111111]">
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
              {activeMenu === "men" ? "Men's Collection" : "Kids' Collection"}
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
            <li className="pt-2">
              <form
                onSubmit={(event) => {
                  submitSearch(event);
                  setMobileOpen(false);
                }}
              >
                <div className="flex h-11 items-center rounded-full border border-neutral-300 bg-white px-3">
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search products"
                    className="w-full bg-transparent text-sm normal-case tracking-normal text-[#111111] outline-none placeholder:text-neutral-400"
                  />
                  <button type="submit" className="text-neutral-500">Go</button>
                </div>
              </form>
            </li>
            <li>
              <Link href="/admin" className="block py-1 text-[#222222]" onClick={() => setMobileOpen(false)}>
                Admin
              </Link>
            </li>
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
    </motion.header>
  );
}
