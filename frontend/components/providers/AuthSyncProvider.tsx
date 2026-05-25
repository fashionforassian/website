"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { buildBackendUrl } from "@/lib/backend-api";

/**
 * AuthSyncProvider
 *
 * Silently syncs the authenticated Clerk user into MongoDB on every session.
 * This ensures every user who signs in or signs up gets a record in the
 * `users` collection, which is required for admin role checks and user management.
 *
 * It runs once per page load when a userId is present and debounces via a ref
 * so it doesn't fire repeatedly on re-renders.
 */
export default function AuthSyncProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, userId, getToken } = useAuth();
  const syncedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !userId) return;
    // Only sync once per userId per page load
    if (syncedRef.current === userId) return;
    syncedRef.current = userId;

    async function syncSession() {
      try {
        const token = await getToken();
        if (!token) return;

        await fetch(buildBackendUrl("/api/auth/session"), {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } catch {
        // Best-effort — never block the UI on sync failure
      }
    }

    void syncSession();
  }, [isLoaded, userId, getToken]);

  return <>{children}</>;
}
