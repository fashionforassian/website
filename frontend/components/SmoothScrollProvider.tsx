"use client";

import { ReactNode, useEffect, useRef } from "react";
import Lenis from "lenis";

export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
      mouseMultiplier: 1,
      touchMultiplier: 2,
      wheelMultiplier: 1,
    } as any);

    lenisRef.current = lenis;

    // Use Lenis's built-in RAF handler
    function raf(time: number) {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    }

    // Start the animation loop
    rafIdRef.current = requestAnimationFrame(raf);

    // Prevent Lenis from conflicting with scroll events
    const handleWheel = (e: WheelEvent) => {
      // Let Lenis handle the scroll
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      // Clean up
      window.removeEventListener("wheel", handleWheel);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
