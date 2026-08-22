'use client';

import { cn } from '@/lib/cn';
import { nombreFr } from '@/lib/tableauBord';
import { TableauDeSecours } from './primitives';

export interface LigneBarre {
  cle: string;
  libelle: string;
  /** Précision affichée sous le libellé (typologie, collection…). */
  detail?: string;
  valeur: number;
}

interface Props {
  lignes: LigneBarre[];
  /** Unité affichée en bout de barre : « vues », « demandes », « recherches ». */
  unite: string;
  /** Repère commun à deux graphiques mis côte à côte. Sinon, le maximum local. */
  maximum?: number;
  legendeTableau: string;
  className?: string;
}

/**
 * Classement horizontal.
 *
 * Une seule série, des catégories nominales (des noms de pièces, des mots
 * saisis) : toutes les barres portent donc **la même teinte**. Colorer chaque
 * barre selon sa valeur reviendrait à encoder deux fois la même information —
 * la longueur la dit déjà — et gaspillerait le canal de la couleur.
 *
 * Barres horizontales et non verticales : les libellés sont des noms propres
 * et des expressions, illisibles à la verticale ou en oblique.
 */
export function BarresClassees({ lignes, unite, maximum, legendeTableau, className }: Props) {
  const haut = maximum ?? Math.max(1, ...lignes.map((l) => l.valeur));

  return (
    <div className={className}>
      <ol className="flex flex-col gap-3">
        {lignes.map((ligne, i) => (
          <li key={ligne.cle} className="grid grid-cols-[1.35rem_minmax(0,1fr)] items-center gap-x-3">
            <span className="chiffres text-[12px] text-pierre">{i + 1}</span>

            <div className="min-w-0">
              <div className="flex items-baseline justify-between gap-3">
                <span className="truncate text-[14px]">
                  {ligne.libelle}
                  {ligne.detail && (
                    <span className="ml-2 text-[12px] text-pierre">{ligne.detail}</span>
                  )}
                </span>
                <span className="chiffres shrink-0 text-[13px] text-fumee">
                  {nombreFr(ligne.valeur)}
                </span>
              </div>

              <div className="mt-1.5 h-2 w-full bg-galerie">
                <div
                  className={cn(
                    'h-full rounded-r-[4px] bg-donnee-300',
                    'transition-[width] duration-700 ease-[var(--ease-doux)]',
                  )}
                  style={{ width: `${Math.max(1.5, (ligne.valeur / haut) * 100)}%` }}
                />
              </div>
            </div>
          </li>
        ))}
      </ol>

      <TableauDeSecours
        legende={legendeTableau}
        colonnes={['Rang', 'Libellé', unite]}
        lignes={lignes.map((l, i) => [
          i + 1,
          l.detail ? `${l.libelle} — ${l.detail}` : l.libelle,
          nombreFr(l.valeur),
        ])}
      />
    </div>
  );
}
