import Link from 'next/link';
import type { Indicateur } from '@/types/admin';
import { IconeBaisse, IconeHausse } from '@/components/icons/admin';
import { cn } from '@/lib/cn';

/**
 * Les six indicateurs du jour (§19.3).
 *
 * Une valeur, deux précisions, un écart avec la semaine précédente. Pas de
 * graphique dans la tuile : à cette taille, une courbe de sept points ne dit
 * rien que le pourcentage ne dise mieux.
 *
 * L'écart n'est jamais coloré en vert ou en rouge — la charte l'interdit
 * (§2.1) et la couleur seule ne porte jamais une information. Il est donc
 * signé, fléché, et suivi de la mention « en hausse » ou « en baisse » pour
 * les lecteurs d'écran.
 */
function Variation({ valeur, hausseSouhaitee }: { valeur: number; hausseSouhaitee: boolean }) {
  const hausse = valeur >= 0;
  const bonneNouvelle = hausse === hausseSouhaitee;
  const Icone = hausse ? IconeHausse : IconeBaisse;

  return (
    <p
      className={cn(
        'mt-4 flex items-center gap-2 text-[13px]',
        bonneNouvelle ? 'text-fumee' : 'text-pierre',
      )}
    >
      <Icone className={cn('size-4 shrink-0', bonneNouvelle && 'text-bronze')} />
      <span className="chiffres whitespace-nowrap">
        {hausse ? '+' : '−'}
        {Math.abs(valeur).toString().replace('.', ',')} %
      </span>
      <span className="sr-only">{hausse ? 'en hausse' : 'en baisse'}</span>
      <span className="text-pierre">vs 7 j précédents</span>
    </p>
  );
}

export function BandeauIndicateurs({ indicateurs }: { indicateurs: Indicateur[] }) {
  return (
    <ul className="grid grid-cols-1 gap-px border border-sable/50 bg-sable/50 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {indicateurs.map((indicateur) => (
        <li key={indicateur.id} className="bg-blanc">
          <Link
            href={indicateur.href}
            className="flex h-full flex-col p-6 transition-colors duration-300 ease-[var(--ease-doux)] hover:bg-galerie/60"
          >
            <p className="text-[12px] tracking-[0.1em] text-pierre uppercase">
              {indicateur.libelle}
            </p>

            <p className="chiffres mt-3 text-[30px] leading-none font-light">{indicateur.valeur}</p>

            <dl className="mt-4 flex flex-col gap-1 text-[13px]">
              {indicateur.details.map((detail) => (
                <div key={detail.libelle} className="flex items-baseline justify-between gap-3">
                  <dt className="min-w-0 leading-snug text-pierre">{detail.libelle}</dt>
                  <dd className="chiffres shrink-0 text-fumee">{detail.valeur}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-auto">
              {indicateur.variation !== null && (
                <Variation
                  valeur={indicateur.variation}
                  hausseSouhaitee={indicateur.hausseSouhaitee}
                />
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
