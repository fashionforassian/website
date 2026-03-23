"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const ClothGLBViewer = dynamic(() => import("@/components/ClothGLBViewer"), {
  ssr: false,
});

export default function DeferredClothShowcase() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    const node = hostRef.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldMount(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={hostRef} className="relative min-h-[52vh] bg-[#f6f1e8] sm:min-h-[60vh] lg:min-h-[70vh]">
      {!shouldMount ? (
        <div className="relative flex h-[52vh] w-full items-center justify-center overflow-hidden bg-[#f6f1e8] sm:h-[60vh] lg:h-[70vh]">
          <Image
            src="/fabric.jpg"
            alt="3D preview"
            fill
            className="object-cover opacity-18"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#fffdf8_0%,rgba(246,241,232,0.92)_45%,rgba(235,227,213,0.96)_100%)]" />
          <div className="relative z-10 text-center text-[#5f5242]">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm">
              <div className="h-8 w-8 animate-[pulse_2.8s_ease-in-out_infinite] rounded-full border border-neutral-300 bg-neutral-200/80" />
            </div>
            <p className="text-sm uppercase tracking-[0.25em] text-[#7b6d5b]">3D Showcase</p>
            <h3 className="mt-3 font-playfair text-3xl font-light sm:text-4xl">Interactive Cloth View</h3>
            <p className="mt-4 text-sm text-[#7b6d5b]">Loading optimized scene as you reach this section.</p>
          </div>
        </div>
      ) : (
        <ClothGLBViewer />
      )}
    </div>
  );
}
