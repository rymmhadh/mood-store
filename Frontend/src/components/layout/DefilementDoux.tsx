'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';

/**
 * Défilement inertiel (§18.14). Le scroll acquiert une masse et une
 * décélération — détail inconscient mais qui change la sensation du site.
 * Désactivé si l'utilisateur a demandé la réduction des animations.
 */
export function DefilementDoux() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    let frame = 0;
    const boucle = (temps: number) => {
      lenis.raf(temps);
      frame = requestAnimationFrame(boucle);
    };
    frame = requestAnimationFrame(boucle);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
