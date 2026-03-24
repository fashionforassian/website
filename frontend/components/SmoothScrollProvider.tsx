"use client";

import { ReactNode, useEffect } from "react";

export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    delete (window as Window & { __fassionLenis?: unknown }).__fassionLenis;
  }, []);

  return <>{children}</>;
}
