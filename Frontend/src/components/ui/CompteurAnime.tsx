'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';

interface Props {
  valeur: number;
  prefixe?: string;
  suffixe?: string;
  /** Durée totale de l'incrémentation, en millisecondes (§2.2 : 1,8 s). */
  duree?: number;
  className?: string;
}

/** Nombre qui s'incrémente jusqu'à sa valeur finale à l'entrée en viewport. */
export function CompteurAnime({ valeur, prefixe = '', suffixe = '', duree = 1800, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const enVue = useInView(ref, { once: true, margin: '-80px' });
  const sobre = useReducedMotion();
  const [affiche, setAffiche] = useState(sobre ? valeur : 0);

  useEffect(() => {
    if (!enVue || sobre) return;

    const depart = performance.now();
    let frame: number;

    const etape = (maintenant: number) => {
      const t = Math.min((maintenant - depart) / duree, 1);
      const progression = 1 - (1 - t) ** 3; // ease-out cubique
      setAffiche(Math.round(progression * valeur));
      if (t < 1) frame = requestAnimationFrame(etape);
    };

    frame = requestAnimationFrame(etape);
    return () => cancelAnimationFrame(frame);
  }, [enVue, sobre, valeur, duree]);

  return (
    <span ref={ref} className={className}>
      {prefixe}
      {affiche.toLocaleString('fr-FR')}
      {suffixe}
    </span>
  );
}
