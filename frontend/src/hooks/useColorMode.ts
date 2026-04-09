"use client";
import { useState, useEffect } from "react";

export function useColorMode() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return localStorage.getItem("nt-theme") === "dark";
  });
/*============================================================
  MA2TIC ORG — Proprietary Software
  © 2026 MA2TIC. All Rights Reserved.

  Licensed to: MA2TIC Organisation
  Owners: Archana Thakur | Tanisha Bhardwaj |
          Manika Kutiyal | Aditya Verma

  NOTICE: This software is proprietary and confidential.
  Unauthorized copying, fragmentation, redistribution,
  or publication of this code, in whole or in part,
  is strictly prohibited without prior written permission
  from the MA2TIC development team.

  For permissions and licensing inquiries, contact MA2TIC.
  ============================================================*/
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("nt-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggle = () => {
    setIsDark((prev) => !prev);
  };

  return { isDark, toggle };
}
