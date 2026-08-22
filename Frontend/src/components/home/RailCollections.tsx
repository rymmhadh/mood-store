'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CarteCatalogue } from '@/components/collections/CarteCatalogue';
import { Conteneur } from '@/components/ui/Conteneur';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { LienFleche } from '@/components/ui/LienFleche';
import { RevelationTexte } from '@/components/ui/Revelation';
import { IconeFleche } from '@/components/icons';
import { PRODUITS_VEDETTE } from '@/data/home';
import { cn } from '@/lib/cn';

/**
 * Rail horizontal des collections en vedette (§6 section 3).
 *
 * Défilement natif à magnétisme (scroll-snap) plutôt qu'un ancrage GSAP :
 * plus robuste sur mobile, aucun risque de blocage du scroll, et le clavier
 * fonctionne nativement. Les flèches pilotent le défilement sur desktop.
 */
export function RailCollections() {
  const rail = useRef<HTMLDivElement>(null);
  const [progression, setProgression] = useState(0);

  const majProgression = useCallback(() => {
    const el = rail.current;
    if (!el) return;

    const max = el.scrollWidth - el.clientWidth;
    setProgression(max > 0 ? el.scrollLeft / max : 0);
  }, []);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;

    majProgression();
    el.addEventListener('scroll', majProgression, { passive: true });
    window.addEventListener('resize', majProgression);

    return () => {
      el.removeEventListener('scroll', majProgression);
      window.removeEventListener('resize', majProgression);
    };
  }, [majProgression]);

  const defiler = (sens: 1 | -1) => {
    const el = rail.current;
    if (!el) return;

    el.scrollBy({ left: sens * Math.round(el.clientWidth * 0.75), behavior: 'smooth' });
  };

  return (
    <section aria-label="Collections en vedette" className="bg-craie py-24 lg:py-32">
      <Conteneur className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <Eyebrow className="mb-4">Nos collections</Eyebrow>
          <h2 className="text-h2 max-w-lg">
            <RevelationTexte>Des pièces qui traversent le temps</RevelationTexte>
          </h2>
        </div>

        <div className="flex items-center gap-6">
          <LienFleche href="/collections/canapes">Tout le catalogue</LienFleche>

          <div className="hidden items-center gap-2 lg:flex">
            <button
              type="button"
              onClick={() => defiler(-1)}
              aria-label="Produits précédents"
              className="flex size-11 items-center justify-center border border-sable transition-colors hover:border-encre hover:bg-encre hover:text-craie"
            >
              <IconeFleche className="size-4 rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => defiler(1)}
              aria-label="Produits suivants"
              className="flex size-11 items-center justify-center border border-sable transition-colors hover:border-encre hover:bg-encre hover:text-craie"
            >
              <IconeFleche className="size-4" />
            </button>
          </div>
        </div>
      </Conteneur>

      <div
        ref={rail}
        className={cn(
          'flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2',
          'px-[var(--marge-laterale)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        )}
      >
        {PRODUITS_VEDETTE.map((produit) => (
          <div
            key={produit.slug}
            className="w-[80vw] shrink-0 snap-start sm:w-[46vw] lg:w-[30vw] xl:w-[25vw]"
          >
            <CarteCatalogue produit={produit} />
          </div>
        ))}

        {/* Dernière tuile : accès au catalogue complet */}
        <Link
          href="/collections/canapes"
          className="group flex w-[80vw] shrink-0 snap-start flex-col justify-end bg-encre p-8 text-craie sm:w-[46vw] lg:w-[30vw] xl:w-[25vw]"
        >
          <span className="eyebrow text-craie">Catalogue</span>
          <span className="mt-3 text-h3 font-light">
            Voir toutes
            <br />
            les collections
          </span>
          <IconeFleche className="mt-8 size-6 transition-transform duration-500 ease-[var(--ease-doux)] group-hover:translate-x-2" />
        </Link>
      </div>

      {/* Barre de progression */}
      <Conteneur className="mt-8">
        <div className="h-px w-full bg-sable/60">
          <div
            className="h-px bg-bronze transition-[width] duration-200 ease-out"
            style={{ width: `${Math.max(8, progression * 100)}%` }}
          />
        </div>
      </Conteneur>
    </section>
  );
}
