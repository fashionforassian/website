"use client";

import Link from "next/link";
import { useState } from "react";
import { ClerkLoaded, UserButton, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/providers/CartProvider";
import { navCategories } from "@/lib/data";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cartCount, setIsCartOpen } = useCart();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = searchQuery.trim();
    if (term) router.push(`/search?q=${encodeURIComponent(term)}`);
  }

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-black text-white text-[10px] sm:text-xs text-center py-2 uppercase tracking-widest">
        Free shipping on orders over $50
      </div>

      <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 -ml-2 text-black"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" className="font-bold text-lg sm:text-xl tracking-tighter text-black uppercase lg:w-1/4">
            FASSION 4 ASIAN
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center gap-8 text-sm font-medium uppercase tracking-widest text-black flex-1">
            {navCategories.map((item) => (
              <Link key={item.label} href={item.href} className="hover:text-gray-500 transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 text-sm font-medium uppercase tracking-widest lg:w-1/4 text-black">
            <div className="hidden lg:block">
              <form onSubmit={submitSearch} className="flex border-b border-black pb-1">
                <input
                  type="text"
                  placeholder="SEARCH"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none w-32 focus:w-48 transition-all placeholder-gray-400 text-xs"
                />
              </form>
            </div>

            <ClerkLoaded>
              {!isSignedIn ? (
                <Link href="/sign-in" className="hidden lg:block hover:text-gray-500 transition-colors">
                  LOG IN
                </Link>
              ) : (
                <div className="hidden lg:block">
                  <UserButton />
                </div>
              )}
            </ClerkLoaded>

            <button
              onClick={() => setIsCartOpen(true)}
              className="hover:text-gray-500 transition-colors flex items-center gap-1"
            >
              <span>CART</span>
              {cartCount > 0 && <span>({cartCount})</span>}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-xl py-4 px-4 flex flex-col space-y-4">
            {navCategories.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-base font-medium uppercase tracking-widest text-black"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-200">
              <form onSubmit={(e) => { submitSearch(e); setMobileMenuOpen(false); }} className="flex border border-gray-300 p-2">
                <input
                  type="text"
                  placeholder="SEARCH"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none w-full text-sm placeholder-gray-400"
                />
              </form>
            </div>
            {!isSignedIn ? (
              <Link href="/sign-in" className="text-sm font-medium uppercase tracking-widest text-gray-500 pt-2" onClick={() => setMobileMenuOpen(false)}>
                Log In
              </Link>
            ) : (
              <div className="pt-2">
                <UserButton />
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}
