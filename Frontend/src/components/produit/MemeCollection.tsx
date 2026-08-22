'use client';

import { useRef } from 'react';
import { CarteCatalogue } from '@/components/collections/CarteCatalogue';
import { Conteneur } from '@/components/ui/Conteneur';
import { IconeChevron } from '@/components/icons';
import type { ProduitCatalogue } from '@/data/catalogue';
import { cn } from '@/lib/cn';

interface Props {
  titre: string;
  produits: ProduitCatalogue[];
}

/** Carrousel « dans la même collection », à magnétisme natif. */
export function MemeCollection({ titre, produits }: Props) {
  const rail = useRef<HTMLDivElement>(null);

  if (produits.length === 0) return null;

  const defiler = (sens: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: sens * Math.round(el.clientWidth * 0.8), behavior: 'smooth' });
  };

  return (
    <section aria-label={titre} className="border-t border-sable/60 py-16 lg:py-20">
      <Conteneur className="mb-10 flex items-center justify-between gap-6">
        <h2 className="eyebrow text-encre">{titre}</h2>

        <div className="hidden items-center gap-2 lg:flex">
          {([-1, 1] as const).map((sens) => (
            <button
              key={sens}
              type="button"
              onClick={() => defiler(sens)}
              aria-label={sens === -1 ? 'Précédent' : 'Suivant'}
              className="flex size-11 items-center justify-center rounded-full border border-sable transition-colors hover:border-encre hover:bg-encre hover:text-craie"
            >
              <IconeChevron className={cn('size-4', sens === -1 && 'rotate-180')} strokeWidth={1.6} />
            </button>
          ))}
        </div>
      </Conteneur>

      <div
        ref={rail}
        className="flex snap-x snap-mandatory gap-2 overflow-x-auto px-[var(--marge-laterale)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {produits.map((p) => (
          <div key={p.slug} className="w-[85vw] shrink-0 snap-start sm:w-[46vw] xl:w-[31vw]">
            <CarteCatalogue produit={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
