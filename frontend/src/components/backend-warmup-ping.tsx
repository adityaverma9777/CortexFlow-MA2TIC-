"use client";

import { useEffect, useRef } from "react";

const WARMUP_ENABLED = process.env.NEXT_PUBLIC_BACKEND_WAKE_ENABLED !== "false";

export function BackendWarmupPing() {
  const sentRef = useRef(false);

  useEffect(() => {
    if (!WARMUP_ENABLED || sentRef.current) {
      return;
    }

    sentRef.current = true;
    void fetch("/api/wake-backend", {
      method: "POST",
      cache: "no-store",
      keepalive: true,
    }).catch(() => {
      // Silent failure is intentional for background wakeup.
    });
  }, []);

  return null;
}
