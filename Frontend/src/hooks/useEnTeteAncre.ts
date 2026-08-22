'use client';

import { useEffect, useState } from 'react';

/**
 * Détecte l'ancrage de l'en-tête et le sens du défilement.
 * - `ancre` : passé le seuil, l'en-tête se compacte et devient opaque.
 * - `cache` : à la descente, l'en-tête se rétracte ; il revient à la remontée.
 */
export function useEnTeteAncre(seuil = 80) {
  const [ancre, setAncre] = useState(false);
  const [cache, setCache] = useState(false);

  useEffect(() => {
    let dernier = window.scrollY;
    let attente = false;

    const onScroll = () => {
      if (attente) return;
      attente = true;

      requestAnimationFrame(() => {
        const y = window.scrollY;
        setAncre(y > seuil);
        setCache(y > dernier && y > seuil * 3);
        dernier = y;
        attente = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [seuil]);

  return { ancre, cache };
}
