import Link from 'next/link';
import type { Alerte, Gravite } from '@/types/admin';
import { nombreFr } from '@/lib/tableauBord';
import { cn } from '@/lib/cn';

/**
 * Ce qui demande une action aujourd'hui.
 *
 * La charte interdit le rouge d'alerte (§2.1). La gravité est donc portée
 * par une pastille de forme différente **et** par un mot écrit — jamais par
 * la couleur seule, qui de toute façon ne serait pas lisible pour une part
 * des lecteurs.
 */
const GRAVITES: Record<Gravite, { mot: string; pastille: string }> = {
  critique: { mot: 'À traiter', pastille: 'bg-encre' },
  attention: { mot: 'À surveiller', pastille: 'bg-bronze' },
  information: { mot: 'Pour information', pastille: 'border border-pierre bg-transparent' },
};

export function Alertes({ alertes }: { alertes: Alerte[] }) {
  if (alertes.length === 0) {
    return <p className="text-[14px] text-pierre">Rien ne demande votre attention. Bonne journée.</p>;
  }

  return (
    <ul className="flex flex-col">
      {alertes.map((alerte) => {
        const gravite = GRAVITES[alerte.gravite];
        return (
          <li key={alerte.id} className="border-b border-sable/35 last:border-0">
            <Link
              href={alerte.href}
              className="group flex items-start gap-3 py-3.5 transition-colors duration-300 hover:text-bronze"
            >
              <span
                aria-hidden
                className={cn('mt-[7px] size-2 shrink-0 rounded-full', gravite.pastille)}
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] leading-snug">{alerte.libelle}</span>
                <span className="mt-0.5 block text-[12px] text-pierre">{gravite.mot}</span>
              </span>
              <span className="chiffres shrink-0 text-[15px]">{nombreFr(alerte.nombre)}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
