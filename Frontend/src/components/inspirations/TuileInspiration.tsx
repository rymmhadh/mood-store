'use client';

import Image from 'next/image';
import Link from 'next/link';
import { IconeCoeur } from '@/components/icons';
import type { ProduitCatalogue } from '@/data/catalogue';
import { useFavoris } from '@/hooks/useFavoris';
import { cn } from '@/lib/cn';

interface Props {
  produit: ProduitCatalogue;
  /** Classe d'aspect-ratio : fait varier la hauteur des tuiles dans la grille en colonnes. */
  ratio?: string;
  prioritaire?: boolean;
}

/**
 * Tuile de la grille Inspirations.
 *
 * Plein cadre, sans marge intérieure : au survol, un voile sombre monte
 * depuis le bas avec le nom de la pièce (§11.5 du cahier des charges). Le
 * cœur permet d'ajouter la pièce au moodboard local sans quitter la grille.
 */
export function TuileInspiration({ produit, ratio = 'aspect-[4/5]', prioritaire }: Props) {
  const { estFavori, basculer } = useFavoris();
  const favori = estFavori(produit.slug);

  return (
    <Link
      href={`/produit/${produit.slug}`}
      className={cn('group relative block cursor-pointer overflow-hidden bg-boucle', ratio)}
    >
      <Image
        src={produit.images[0] ?? ''}
        alt={`${produit.type} ${produit.nom}`}
        fill
        priority={prioritaire}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-doux)] group-hover:scale-105"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-encre/85 via-encre/10 to-transparent p-4 pt-14 transition-transform duration-500 ease-[var(--ease-doux)] group-hover:translate-y-0"
      >
        <p className="text-[12px] text-craie/75">{produit.type}</p>
        <p className="text-[15px] text-craie">{produit.nom}</p>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          basculer({
            slug: produit.slug,
            type: produit.type,
            nom: produit.nom,
            image: produit.images[0] ?? '',
          });
        }}
        aria-label={favori ? 'Retirer du moodboard' : 'Ajouter à mon moodboard'}
        aria-pressed={favori}
        className="absolute top-3 right-3 flex size-10 cursor-pointer items-center justify-center rounded-full bg-craie/70 text-fumee backdrop-blur-sm transition-all duration-300 hover:bg-craie hover:text-encre"
      >
        <IconeCoeur className={cn('size-4', favori && 'fill-encre text-encre')} strokeWidth={1.5} />
      </button>
    </Link>
  );
}
