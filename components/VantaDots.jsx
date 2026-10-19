"use client";

import { useEffect, useRef } from "react";

export default function VantaDots() {
  const containerRef = useRef(null);

  useEffect(() => {
    let effect;
    let cancelled = false;

    async function startVanta() {
      try {
        const THREE = await import("three");

        // Vanta traži THREE na window objektu
        window.THREE = THREE;

        const VANTA = await import("vanta/dist/vanta.dots.min");

        if (cancelled || !containerRef.current) return;

        const createDots = VANTA.default || VANTA;

        effect = createDots({
          el: containerRef.current,
          THREE,

          mouseControls: true,
          touchControls: true,
          gyroControls: false,

          minHeight: 200,
          minWidth: 200,
          scale: 1,
          scaleMobile: 0.7,

          backgroundColor: 0xffffff,
          color: 0x1a75ff,
          color2: 0xbfdbfe,

          size: 3,
          spacing: 28,
          showLines: false,
        });
      } catch (error) {
        console.error("Vanta DOTS error:", error);
      }
    }

    startVanta();

    return () => {
      cancelled = true;
      if (effect) effect.destroy();
    };
  }, []);

  return <div ref={containerRef} className="h-full w-full" aria-hidden="true" />;
}