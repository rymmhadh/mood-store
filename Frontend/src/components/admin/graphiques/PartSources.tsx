'use client';

import type { PartSource } from '@/types/admin';
import { nombreFr } from '@/lib/tableauBord';
import { pourcentFr, RAMPE, TableauDeSecours } from './primitives';

/**
 * D'où viennent les visiteurs.
 *
 * ── Une barre plutôt qu'un camembert ────────────────────────────────────
 * Le cahier des charges dit « camembert ». On a gardé la question — quelle
 * part chaque source représente-t-elle — et changé la forme, pour deux
 * raisons : l'œil compare des longueurs bien mieux que des angles, et un
 * camembert à cinq parts oblige à cinq teintes qui se distinguent entre
 * elles, ce que la charte du site n'autorise pas (§2.1 : aucune couleur vive).
 *
 * Ici, les parts sont **triées par poids** et posées sur une rampe d'une
 * seule teinte : la couleur devient une grandeur, ce qu'elle sait faire. Un
 * filet de 2 px sépare les segments — sans lui, deux pas voisins se collent.
 */
export function PartSources({ sources }: { sources: PartSource[] }) {
  const total = Math.max(1, sources.reduce((s, x) => s + x.visiteurs, 0));

  return (
    <div>
      <div className="flex h-12 w-full gap-[2px]" role="img" aria-label="Répartition des sources de trafic">
        {sources.map((source, i) => (
          <div
            key={source.id}
            title={`${source.libelle} — ${pourcentFr((source.visiteurs / total) * 100)}`}
            style={{
              width: `${(source.visiteurs / total) * 100}%`,
              background: RAMPE[Math.min(i, RAMPE.length - 1)],
            }}
          />
        ))}
      </div>

      <ul className="mt-5 flex flex-col gap-2.5">
        {sources.map((source, i) => (
          <li key={source.id} className="flex items-baseline gap-3 text-[14px]">
            <span
              aria-hidden
              className="size-3 shrink-0 translate-y-0.5"
              style={{ background: RAMPE[Math.min(i, RAMPE.length - 1)] }}
            />
            <span className="min-w-0 flex-1 truncate">{source.libelle}</span>
            <span className="chiffres text-[13px] text-pierre">{nombreFr(source.visiteurs)}</span>
            <span className="chiffres w-14 text-right">
              {pourcentFr((source.visiteurs / total) * 100)}
            </span>
          </li>
        ))}
      </ul>

      <TableauDeSecours
        legende="Voir les sources en chiffres"
        colonnes={['Source', 'Visiteurs', 'Part']}
        lignes={sources.map((s) => [
          s.libelle,
          nombreFr(s.visiteurs),
          pourcentFr((s.visiteurs / total) * 100),
        ])}
      />
    </div>
  );
}
