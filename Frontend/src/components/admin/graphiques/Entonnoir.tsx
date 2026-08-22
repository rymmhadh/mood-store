'use client';

import type { EtapeEntonnoir } from '@/types/admin';
import { nombreFr } from '@/lib/tableauBord';
import { pourcentFr, RAMPE, TableauDeSecours } from './primitives';

/**
 * Entonnoir de conversion.
 *
 * Les étapes sont **ordonnées** : leur suite a un sens. Elles reçoivent donc
 * une rampe d'une seule teinte, du clair au foncé, de sorte que la couleur
 * elle-même raconte la progression. Une palette catégorielle donnerait six
 * teintes sans hiérarchie, ce qui masquerait justement ce qu'il faut voir.
 *
 * Les barres sont centrées : la silhouette qui se resserre est lisible d'un
 * coup d'œil, avant même la lecture des chiffres.
 *
 * La donnée la plus utile n'est pas le volume de chaque étape mais la
 * **déperdition** entre deux étapes — elle est écrite en toutes lettres dans
 * l'intervalle qui les sépare.
 */
export function Entonnoir({ etapes }: { etapes: EtapeEntonnoir[] }) {
  const depart = etapes[0]?.valeur || 1;

  return (
    <div>
      <ol className="flex flex-col">
        {etapes.map((etape, i) => {
          const part = etape.valeur / depart;
          const precedente = i > 0 ? etapes[i - 1] : null;
          const perte = precedente ? 1 - etape.valeur / (precedente.valeur || 1) : 0;

          return (
            <li key={etape.id}>
              {precedente && (
                <p className="py-2 text-center text-[12px] text-pierre">
                  <span aria-hidden>↓</span> {pourcentFr(perte * 100)} de déperdition
                </p>
              )}

              {/* Le libellé est posé au-dessus de la barre, jamais dedans : les
                  dernières étapes sont étroites, et sur un écran de 390 px un
                  texte à l'intérieur se réduirait à « De… ». */}
              <div className="flex items-baseline justify-between gap-4">
                <span className="min-w-0 text-[14px]">{etape.libelle}</span>
                <span className="chiffres shrink-0 text-[15px]">{nombreFr(etape.valeur)}</span>
              </div>

              <div
                className="mx-auto mt-1.5 h-9 transition-[width] duration-700 ease-[var(--ease-doux)]"
                style={{
                  width: `${Math.max(6, part * 100)}%`,
                  background: RAMPE[Math.min(i, RAMPE.length - 1)],
                }}
              />

              <p className="mt-1.5 text-center text-[12px] text-pierre">
                {pourcentFr(part * 100)} des visites — {etape.aide}
              </p>
            </li>
          );
        })}
      </ol>

      <TableauDeSecours
        legende="Voir les étapes en chiffres"
        colonnes={['Étape', 'Sessions', 'Part des visites', 'Déperdition']}
        lignes={etapes.map((e, i) => [
          e.libelle,
          nombreFr(e.valeur),
          pourcentFr((e.valeur / depart) * 100),
          i === 0 ? '—' : pourcentFr((1 - e.valeur / (etapes[i - 1].valeur || 1)) * 100),
        ])}
      />
    </div>
  );
}
