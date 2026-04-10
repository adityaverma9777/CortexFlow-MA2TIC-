"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { isLowPowerDevice } from "@/libs/device-performance";
import "./fluid-noise-bg.css";

const FluidNoiseCanvas = dynamic(() => import("@/components/fluid-noise-canvas"), {
  ssr: false,
});

export default function FluidNoiseBg({ isDark, forceLowPower = false }) {
  const [lowPower, setLowPower] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce), (max-width: 1023px)");

    const sync = () => {
      setLowPower(forceLowPower || isLowPowerDevice());
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
  }, [forceLowPower]);

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
