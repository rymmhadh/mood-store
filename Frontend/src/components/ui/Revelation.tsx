'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { apparition, revelationMasque, VUE } from '@/lib/motion';
import { cn } from '@/lib/cn';

interface Props {
  children: ReactNode;
  className?: string;
  /** Index d'ordre : décale l'apparition de 80 ms par cran. */
  index?: number;
}

/** Apparition en fondu + translation. Déclenchée une seule fois. */
export function Revelation({ children, className, index = 0 }: Props) {
  const sobre = useReducedMotion();
  if (sobre) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={apparition}
      custom={index}
      initial="cache"
      whileInView="visible"
      viewport={VUE}
    >
      {children}
    </motion.div>
  );
}

/**
 * Révélation par masque : le texte monte depuis un rideau.
 * Chaque ligne doit être passée séparément pour que l'effet fonctionne.
 */
export function RevelationTexte({ children, className, index = 0 }: Props) {
  const sobre = useReducedMotion();

  // Sans cette sortie, un texte dont l'animation ne se déclenche pas reste
  // hors de son masque, donc invisible. Un titre ne doit jamais dépendre
  // d'une animation pour être lu.
  if (sobre) return <span className={cn('block', className)}>{children}</span>;

  return (
    <span className={cn('masque-revelation', className)}>
      <motion.span
        className="block"
        variants={revelationMasque}
        custom={index}
        initial="cache"
        whileInView="visible"
        viewport={VUE}
      >
        {children}
      </motion.span>
    </span>
  );
}
