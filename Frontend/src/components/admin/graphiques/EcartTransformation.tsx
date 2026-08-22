'use client';

import Link from 'next/link';
import type { MesureProduit } from '@/types/admin';
import { nombreFr } from '@/lib/tableauBord';
import { pourcentFr, TableauDeSecours } from './primitives';
import { cn } from '@/lib/cn';

/**
 * Écart entre ce qui est regardé et ce qui est demandé.
 *
 * Le cahier des charges le dit sans détour : « l'écart entre ces deux
 * graphiques est l'information la plus précieuse du back-office ». Le lire en
 * comparant deux classements à l'œil est pourtant fastidieux — on l'a donc
 * calculé et tracé.
 *
 * Pour chaque pièce : part des visiteurs de sa fiche qui aboutit à une
 * demande, rapportée à la moyenne du site. À droite de l'axe, une pièce qui
 * convertit mieux que la moyenne ; à gauche, une pièce très consultée dont
 * la photographie, le prix ou la description ne tiennent pas la promesse.
 *
 * Couleur : une teinte pour les pièces au-dessus, le gris de pierre pour
 * celles en dessous. C'est de la **mise en évidence**, pas une palette :
 * le lecteur n'a que deux camps à distinguer, et le signe est aussi écrit.
 */
export function EcartTransformation({ produits }: { produits: MesureProduit[] }) {
  const vuesTotal = produits.reduce((s, p) => s + p.vues, 0);
  const demandesTotal = produits.reduce((s, p) => s + p.demandes, 0);
  const moyenne = demandesTotal / Math.max(1, vuesTotal);

  const lignes = produits
    .map((p) => {
      const taux = p.demandes / Math.max(1, p.vues);
      return { ...p, taux, ecart: (taux - moyenne) / moyenne };
    })
    .sort((a, b) => b.ecart - a.ecart);

  const amplitude = Math.max(0.35, ...lignes.map((l) => Math.abs(l.ecart)));

  return (
    <div>
      <p className="mb-4 text-[13px] text-pierre">
        Moyenne du site :{' '}
        <span className="chiffres text-encre">{pourcentFr(moyenne * 100, 2)}</span> des fiches
        consultées se transforment en demande.
      </p>

      <ol className="flex flex-col gap-2.5">
        {lignes.map((ligne) => {
          const positif = ligne.ecart >= 0;
          // 43 % et non 50 % : il faut laisser au libellé chiffré la place de tenir
          // en bout de barre sans déborder du cadre.
          const part = (Math.abs(ligne.ecart) / amplitude) * 43;

          return (
            <li key={ligne.slug} className="grid grid-cols-[7.5rem_minmax(0,1fr)] items-center gap-3">
              <Link
                href={`/admin/catalogue/${ligne.slug}`}
                className="lien-souligne truncate text-[13px]"
                title={`${ligne.nom} — ${ligne.type}`}
              >
                {ligne.nom}
              </Link>

              <div className="relative h-6">
                {/* Axe : la moyenne du site */}
                <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-sable" />

                <div
                  className={cn(
                    'absolute top-1/2 h-3.5 -translate-y-1/2 transition-[width] duration-700 ease-[var(--ease-doux)]',
                    positif
                      ? 'left-1/2 rounded-r-[4px] bg-donnee-400'
                      : 'right-1/2 rounded-l-[4px] bg-pierre',
                  )}
                  style={{ width: `${Math.max(0.4, part)}%` }}
                />

                <span
                  className={cn(
                    'chiffres absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-[12px] text-fumee',
                  )}
                  style={positif ? { left: `calc(50% + ${part}% + 0.5rem)` } : { right: `calc(50% + ${part}% + 0.5rem)` }}
                >
                  {positif ? '+' : '−'}
                  {Math.round(Math.abs(ligne.ecart) * 100)} %
                </span>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-pierre">
        <span className="flex items-center gap-2">
          <span className="h-3 w-6 bg-donnee-400" aria-hidden />
          Convertit mieux que la moyenne
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-6 bg-pierre" aria-hidden />
          Convertit moins bien — fiche à revoir
        </span>
      </p>

      <TableauDeSecours
        legende="Voir le détail par pièce"
        colonnes={['Pièce', 'Vues', 'Demandes', 'Transformation', 'Écart à la moyenne']}
        lignes={lignes.map((l) => [
          `${l.nom} — ${l.type}`,
          nombreFr(l.vues),
          nombreFr(l.demandes),
          pourcentFr(l.taux * 100, 2),
          `${l.ecart >= 0 ? '+' : '−'}${Math.round(Math.abs(l.ecart) * 100)} %`,
        ])}
      />
    </div>
  );
}
