import type { Variants } from 'motion/react';

/** Durées et courbes alignées sur les tokens CSS (§3.1). */
export const DUREE = {
  instant: 0.15,
  rapide: 0.3,
  base: 0.6,
  ample: 0.9,
  cine: 1.4,
} as const;

export const EASE_DOUX = [0.16, 1, 0.3, 1] as const;
export const EASE_CINE = [0.83, 0, 0.17, 1] as const;

/** Révélation par masque : le contenu monte depuis un rideau. */
export const revelationMasque: Variants = {
  cache: { y: '110%' },
  visible: (i = 0) => ({
    y: '0%',
    transition: { duration: DUREE.ample, ease: EASE_DOUX, delay: i * 0.08 },
  }),
};

/** Apparition simple : fondu + légère translation. */
export const apparition: Variants = {
  cache: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DUREE.base, ease: EASE_DOUX, delay: i * 0.08 },
  }),
};

/** Déclencheur commun : une seule fois, à 20 % de visibilité (§3.3). */
export const VUE = { once: true, amount: 0.2 } as const;
