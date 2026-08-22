'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IconeGlisser } from '@/components/icons';
import { cn } from '@/lib/cn';

interface Props {
  avant: string;
  apres: string;
  legendeAvant?: string;
  legendeApres?: string;
  className?: string;
}

/**
 * Comparateur avant / après (§18.2).
 * Le meilleur rapport impact / coût du projet : deux images fixes suffisent
 * à démontrer la valeur du service d'architecture d'intérieur.
 *
 * Accessible : la poignée est un `input[type=range]` invisible, donc pilotable
 * au clavier (flèches gauche / droite) et annoncée par les lecteurs d'écran.
 */
export function Comparateur({
  avant,
  apres,
  legendeAvant = 'Avant',
  legendeApres = 'Après',
  className,
}: Props) {
  const [position, setPosition] = useState(50);
  const [amorce, setAmorce] = useState(false);
  const cadre = useRef<HTMLDivElement>(null);

  /* Aller-retour automatique à l'entrée en viewport : signale que
     l'élément est manipulable, puis rend la main à l'utilisateur. */
  useEffect(() => {
    const el = cadre.current;
    if (!el || amorce) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const obs = new IntersectionObserver(
      ([entree]) => {
        if (!entree.isIntersecting) return;

        setAmorce(true);
        obs.disconnect();

        const etapes = [30, 70, 50];
        etapes.forEach((valeur, i) => {
          setTimeout(() => setPosition(valeur), 400 + i * 650);
        });
      },
      { threshold: 0.35 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [amorce]);

  const suivreSouris = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cadre.current;
    if (!el) return;

    const { left, width } = el.getBoundingClientRect();
    setPosition(Math.min(100, Math.max(0, ((e.clientX - left) / width) * 100)));
  }, []);

  return (
    <div
      ref={cadre}
      onMouseMove={suivreSouris}
      className={cn('relative aspect-[16/10] w-full overflow-hidden bg-encre select-none', className)}
    >
      {/* Après — image de fond */}
      <Image src={apres} alt={legendeApres} fill sizes="100vw" className="object-cover" />

      {/* Avant — révélée par découpe */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={avant}
          alt={legendeAvant}
          fill
          sizes="100vw"
          className="object-cover saturate-[0.55] brightness-90"
        />
      </div>

      {/* Poignée */}
      <div
        className="pointer-events-none absolute inset-y-0 w-px bg-craie"
        style={{ left: `${position}%` }}
      >
        <span className="absolute top-1/2 left-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-craie/70 bg-encre/40 backdrop-blur-sm">
          <IconeGlisser className="size-5 text-craie" />
        </span>
      </div>

      {/* Légendes */}
      <span className="eyebrow absolute top-5 left-5 bg-encre/55 px-3 py-1.5 text-craie backdrop-blur-sm">
        {legendeAvant}
      </span>
      <span className="eyebrow absolute top-5 right-5 bg-encre/55 px-3 py-1.5 text-craie backdrop-blur-sm">
        {legendeApres}
      </span>

      {/* Contrôle accessible */}
      <label className="sr-only" htmlFor="comparateur">
        Position du comparateur avant / après
      </label>
      <input
        id="comparateur"
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        className="absolute inset-0 size-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
