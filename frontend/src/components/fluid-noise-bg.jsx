"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "./fluid-noise-bg.css";

const FluidNoiseCanvas = dynamic(() => import("@/components/fluid-noise-canvas"), {
  ssr: false,
});

function isLowPowerDevice() {
  if (typeof window === "undefined") {
    return true;
  }

  const touchLike = window.matchMedia("(pointer: coarse)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return touchLike || reducedMotion || window.innerWidth < 1024;
}

export default function FluidNoiseBg({ isDark }) {
  const [lowPower, setLowPower] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)");

    const sync = () => {
      setLowPower(isLowPowerDevice());
    };

    sync();

    window.addEventListener("resize", sync);

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", sync);
      return () => {
        window.removeEventListener("resize", sync);
        media.removeEventListener("change", sync);
      };
    }

    media.addListener(sync);
    return () => {
      window.removeEventListener("resize", sync);
      media.removeListener(sync);
    };
  }, []);

  if (lowPower) {
    return (
      <div
        aria-hidden="true"
        className={`fluid-noise-bg fluid-noise-bg-static ${isDark ? "is-dark" : "is-light"}`}
      />
    );
  }

  return <FluidNoiseCanvas isDark={isDark} />;
}
