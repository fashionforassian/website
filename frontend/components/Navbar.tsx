"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ClerkLoaded, UserButton, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCart } from "@/components/providers/CartProvider";
import { buildBackendUrl } from "@/lib/backend-api";
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
  const { isLoaded, isSignedIn, userId, getToken } = useAuth();
  const [canAccessAdmin, setCanAccessAdmin] = useState(false);
  const [authNotice, setAuthNotice] = useState("");
  const previousSignedInRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn) {
      return;
    }

    let cancelled = false;

    async function syncAndCheckAccess() {
      try {
        const token = await getToken();
        if (!token) {
          if (!cancelled) {
            setCanAccessAdmin(false);
          }
          return;
        }

        const sessionResponse = await fetch(buildBackendUrl("/api/auth/session"), {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (sessionResponse.ok) {
          const sessionData = (await sessionResponse.json()) as { created?: boolean };
          const hasJustSignedIn = !previousSignedInRef.current;
          if (!cancelled && hasJustSignedIn) {
            setAuthNotice(sessionData.created ? "Welcome! Your account has been created." : "You are now logged in.");
            setTimeout(() => {
              setAuthNotice("");
            }, 4000);
          }
        }

        const response = await fetch(buildBackendUrl("/api/admin/me"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!cancelled) {
          setCanAccessAdmin(response.ok);
        }
      } catch {
        if (!cancelled) {
          setCanAccessAdmin(false);
        }
      }
    }

    void syncAndCheckAccess();
    previousSignedInRef.current = true;

    return () => {
      cancelled = true;
    };
  }, [getToken, isLoaded, isSignedIn, userId]);

  useEffect(() => {
    if (!isSignedIn) {
      previousSignedInRef.current = false;
    }
  }, [isSignedIn]);

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
      <div className="mx-auto flex min-h-16 w-full max-w-[1400px] items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-4 md:px-8">
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
          className="min-w-0 flex-1 truncate pr-2 font-heading text-[11px] tracking-[0.12em] text-[#111111] sm:text-sm sm:tracking-[0.16em] md:flex-none md:pr-0 md:text-xl md:tracking-[0.2em]"
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

        <div className="flex shrink-0 items-center gap-2 text-[10px] uppercase tracking-[0.11em] sm:text-xs sm:tracking-[0.15em]">
          <ClerkLoaded>
            {!isSignedIn ? (
              <div className="hidden items-center gap-3 md:flex">
                <Link href="/sign-in" className="hover:text-[#111111]">
                  Sign In
                </Link>
                <Link href="/sign-up" className="hover:text-[#111111]">
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="hidden md:inline">
                <UserButton />
              </div>
            )}
          </ClerkLoaded>
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
          {canAccessAdmin ? (
            <Link href="/admin" className="hidden lg:inline hover:text-[#111111]">
              Admin
            </Link>
          ) : null}
          <Link href="/cart" className="whitespace-nowrap hover:text-[#111111]" aria-label={`Cart with ${cartCount} items`}>
            <span className="sm:hidden">Cart</span>
            <span className="hidden sm:inline">Cart ({cartCount})</span>
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
          <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-8">
            <p className="mb-5 text-[11px] uppercase tracking-[0.2em] text-neutral-500 font-semibold">
              {activeMenu === "men" ? "Men's Collection" : "Kids' Collection"}
            </p>
            <ul className="grid grid-cols-2 gap-x-5 gap-y-3 text-sm lg:grid-cols-3 lg:gap-x-8">
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
            {canAccessAdmin ? (
              <li>
                <Link href="/admin" className="block py-1 text-[#222222]" onClick={() => setMobileOpen(false)}>
                  Admin
                </Link>
              </li>
            ) : null}
            {!isSignedIn ? (
              <>
                <li>
                  <Link href="/sign-in" className="block py-1 text-[#222222]" onClick={() => setMobileOpen(false)}>
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/sign-up" className="block py-1 text-[#222222]" onClick={() => setMobileOpen(false)}>
                    Sign Up
                  </Link>
                </li>
              </>
            ) : null}
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

      {isSignedIn && authNotice ? (
        <div className="border-t border-emerald-200 bg-emerald-50 px-4 py-2 text-center text-xs text-emerald-700">
          {authNotice}
        </div>
      ) : null}
    </motion.header>
  );
}
