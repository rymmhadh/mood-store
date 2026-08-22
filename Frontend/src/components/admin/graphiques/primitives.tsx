'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Briques communes aux sept graphiques.
 *
 * Tout est dessiné en SVG à la main, sans bibliothèque. Ce n'est pas de
 * l'entêtement : le budget de JavaScript du projet est de 180 ko au premier
 * chargement (§23.1) et la plus légère des bibliothèques de graphiques en
 * consomme la moitié à elle seule. Les formes utilisées ici — aire, barres,
 * anneau, cercles proportionnels — tiennent en quelques dizaines de lignes.
 */

/* ── Rampe séquentielle ───────────────────────────────────────────────── */

/**
 * Six pas d'une seule teinte, du clair au foncé.
 *
 * Une rampe séquentielle encode une grandeur (« plus ou moins »), ce qui est
 * le propos de presque tous les graphiques d'un tableau de bord. Une palette
 * catégorielle encoderait une identité — elle exigerait des teintes vives et
 * bien séparées, que la charte du site interdit (§2.1). On n'en a besoin
 * nulle part ici : chaque graphique ne porte qu'une seule série.
 */
export const RAMPE = [
  'var(--color-donnee-100)',
  'var(--color-donnee-200)',
  'var(--color-donnee-300)',
  'var(--color-donnee-400)',
  'var(--color-donnee-500)',
  'var(--color-donnee-600)',
] as const;

/** Pas de la rampe pour une valeur normalisée entre 0 et 1. */
export const pasRampe = (t: number) =>
  RAMPE[Math.min(RAMPE.length - 1, Math.max(0, Math.round(t * (RAMPE.length - 1))))];

/** Teinte de contrepoint, pour la série de contexte d'une mise en évidence. */
export const GRIS = 'var(--color-pierre)';

/* ── Mise en forme ────────────────────────────────────────────────────── */

export const pourcentFr = (v: number, decimales = 1) =>
  `${v.toFixed(decimales).replace('.', ',').replace(',0', '')} %`;

/* ── Infobulle ────────────────────────────────────────────────────────── */

export interface PositionInfobulle {
  x: number;
  y: number;
  contenu: ReactNode;
}

/**
 * Infobulle positionnée en pourcentage du cadre parent.
 *
 * Positionnée en pourcentage plutôt qu'en pixels : le SVG est fluide, ses
 * coordonnées internes ne correspondent pas à celles de l'écran.
 */
export function Infobulle({ position, className }: { position: PositionInfobulle | null; className?: string }) {
  if (!position) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
      className={cn(
        'pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[calc(100%+0.75rem)]',
        'border border-encre bg-encre px-3 py-2 text-[12px] leading-relaxed whitespace-nowrap text-craie',
        className,
      )}
    >
      {position.contenu}
    </div>
  );
}

/* ── Repli et tableau de secours ──────────────────────────────────────── */

/**
 * Équivalent tabulaire d'un graphique.
 *
 * Ouvrable sous chaque figure. Sert aux lecteurs d'écran, à la copie vers un
 * tableur, et aux valeurs que l'œil ne peut pas lire précisément sur une aire
 * ou un cercle.
 */
export function TableauDeSecours({
  legende,
  colonnes,
  lignes,
}: {
  legende: string;
  colonnes: string[];
  lignes: (string | number)[][];
}) {
  return (
    <details className="mt-5 border-t border-sable/40 pt-4">
      <summary className="cursor-pointer text-[13px] text-pierre transition-colors hover:text-encre">
        {legende}
      </summary>
      <div className="mt-3 max-h-64 overflow-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-sable/50 text-left text-pierre">
              {colonnes.map((c, i) => (
                <th key={c} scope="col" className={cn('py-2 pr-4 font-normal', i > 0 && 'text-right')}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lignes.map((ligne, i) => (
              <tr key={i} className="border-b border-sable/25 last:border-0">
                {ligne.map((cellule, j) => (
                  <td key={j} className={cn('py-2 pr-4', j > 0 && 'chiffres text-right')}>
                    {cellule}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
