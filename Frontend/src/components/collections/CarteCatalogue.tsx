'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, type MouseEvent } from 'react';
import { IconeChevron, IconeCoeur } from '@/components/icons';
import { COLORIS, type Coloris, type ProduitCatalogue } from '@/data/catalogue';
import { cn } from '@/lib/cn';

interface Props {
  produit: ProduitCatalogue;
  /** Absent = nuancier de référence — suffisant hors de la grille de catalogue en direct. */
  coloris?: Coloris[];
  /** Priorité de chargement pour les premières cartes de la grille. */
  prioritaire?: boolean;
}

const SWATCHES_VISIBLES = 5;

/**
 * Carte de catalogue.
 *
 * Le visuel repose sur un fond gris très clair, sans cadre ni ombre. Au
 * survol, on passe du plan produit à la vue en situation, un badge
 * « Découvrir » apparaît et deux flèches permettent de parcourir les visuels
 * sans quitter la grille.
 *
 * Le pied de carte donne l'information qui compte vraiment pour du mobilier
 * sur mesure : le nombre de revêtements et de tailles disponibles.
 */
export function CarteCatalogue({ produit, coloris: nuancier = COLORIS, prioritaire }: Props) {
  const [index, setIndex] = useState(0);
  const [survol, setSurvol] = useState(false);
  const [favori, setFavori] = useState(false);

  const total = produit.images.length;
  const actif = survol && index === 0 ? 1 : index;

  const naviguer = (e: MouseEvent, sens: 1 | -1) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => (i + sens + total) % total);
  };

  const coloris = produit.colorisIds
    .map((id) => nuancier.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  const restants = coloris.length - SWATCHES_VISIBLES;

  return (
    <article
      onMouseEnter={() => setSurvol(true)}
      onMouseLeave={() => {
        setSurvol(false);
        setIndex(0);
      }}
      className="group flex flex-col bg-galerie"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link href={`/produit/${produit.slug}`} className="relative block size-full">
          {produit.images.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt={i === 0 ? `${produit.type} ${produit.nom}` : ''}
              aria-hidden={i !== 0}
              fill
              priority={prioritaire && i === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className={cn(
                'object-cover transition-opacity duration-[600ms] ease-[var(--ease-doux)]',
                i === actif ? 'opacity-100' : 'opacity-0',
              )}
            />
          ))}
        </Link>

        <Link
          href={`/produit/${produit.slug}`}
          tabIndex={-1}
          className={cn(
            'absolute top-4 left-4 rounded-full bg-encre px-5 py-2.5 text-[13px] text-craie',
            'transition-all duration-[400ms] ease-[var(--ease-doux)]',
            'translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100',
          )}
        >
          Découvrir
        </Link>

        <button
          type="button"
          onClick={() => setFavori((v) => !v)}
          aria-label={favori ? 'Retirer du moodboard' : 'Ajouter à mon moodboard'}
          aria-pressed={favori}
          className="absolute top-3 right-3 flex size-11 items-center justify-center rounded-full text-fumee transition-all duration-300 hover:bg-craie/70 hover:text-encre"
        >
          <IconeCoeur
            className={cn('size-5', favori && 'fill-encre text-encre')}
            strokeWidth={1.5}
          />
        </button>

        {total > 1 && (
          <div className="pointer-events-none absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {([-1, 1] as const).map((sens) => (
              <button
                key={sens}
                type="button"
                onClick={(e) => naviguer(e, sens)}
                aria-label={sens === -1 ? 'Visuel précédent' : 'Visuel suivant'}
                className="pointer-events-auto flex size-10 items-center justify-center rounded-full bg-craie/85 text-encre backdrop-blur-sm transition-colors hover:bg-craie"
              >
                <IconeChevron
                  className={cn('size-4', sens === -1 && 'rotate-180')}
                  strokeWidth={1.6}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-1 items-end justify-between gap-4 p-5 lg:p-6">
        <div className="min-w-0">
          <p className="text-[13px] text-pierre">{produit.type}</p>
          <h3 className="mt-0.5 truncate text-[24px] leading-tight font-light">
            <Link href={`/produit/${produit.slug}`} className="lien-souligne">
              {produit.nom}
            </Link>
          </h3>

          {coloris.length > 0 && (
            <div className="mt-3 flex items-center gap-1.5">
              {coloris.slice(0, SWATCHES_VISIBLES).map((c) => (
                <span
                  key={c.id}
                  title={c.nom}
                  className="size-4 rounded-full ring-1 ring-encre/10"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              {restants > 0 && <span className="ml-1 text-[13px] text-pierre">+{restants}</span>}
            </div>
          )}
        </div>

        <div className="shrink-0 text-right text-[13px] leading-relaxed text-pierre">
          <p>
            Disponible en {produit.revetementIds.length || produit.colorisIds.length}{' '}
            {produit.revetementIds.length ? 'revêtements' : 'finitions'}
          </p>
          <p>
            · {produit.dimensions.length} taille{produit.dimensions.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </article>
  );
}
