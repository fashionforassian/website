"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

export default function HomeAuthCta() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded || isSignedIn) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pt-6 md:px-8">
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4 sm:flex-row sm:items-center">
        <p className="text-sm text-[#222222]">
          Sign in to track orders faster, sync your account, and unlock admin access if approved.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/sign-in"
            className="border border-[#111111] bg-[#111111] px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-white hover:bg-white hover:text-[#111111]"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="border border-neutral-300 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-[#111111] hover:border-[#111111]"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </section>
  );
}
