'use client';

import { useEffect } from 'react';

/** Bloque le défilement de la page quand un panneau plein écran est ouvert. */
export function useVerrouScroll(actif: boolean) {
  useEffect(() => {
    if (!actif) return;

    const { overflow, paddingRight } = document.body.style;
    const compensation = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (compensation > 0) document.body.style.paddingRight = `${compensation}px`;

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [actif]);
}
