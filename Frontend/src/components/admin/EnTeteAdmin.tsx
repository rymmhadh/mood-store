'use client';

import { IconeRafraichir } from '@/components/icons/admin';
import { PERIODES, type Periode } from '@/types/admin';
import { cn } from '@/lib/cn';

interface Props {
  periode: Periode;
  onPeriode: (p: Periode) => void;
  chargement: boolean;
  onRafraichir: () => void;
}

/**
 * Sélecteur de période du tableau de bord.
 *
 * Ce composant ne portait au départ que l'en-tête du tableau de bord. Depuis
 * que le back-office a plusieurs modules, l'en-tête est commun
 * (`EnTetePage`) et il ne reste ici que ce qui est propre au tableau de
 * bord : la fenêtre d'observation et le rechargement.
 */
export function SelecteurPeriode({ periode, onPeriode, chargement, onRafraichir }: Props) {
  return (
    <>
      <div role="group" aria-label="Période observée" className="flex border border-sable/70 bg-blanc">
        {PERIODES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onPeriode(p.id)}
            aria-pressed={periode === p.id}
            className={cn(
              'px-4 py-2.5 text-[13px] transition-colors duration-300 ease-[var(--ease-doux)]',
              periode === p.id ? 'bg-encre text-craie' : 'text-fumee hover:bg-galerie',
            )}
          >
            {p.libelle}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onRafraichir}
        disabled={chargement}
        aria-label="Recharger les chiffres"
        className={cn(
          'flex size-11 items-center justify-center border border-sable/70 bg-blanc text-fumee',
          'transition-colors duration-300 hover:text-encre disabled:opacity-45',
        )}
      >
        <IconeRafraichir className={cn('size-5', chargement && 'animate-spin')} />
      </button>
    </>
  );
}

/** « mardi 11 août » — sans dépendre de la locale du moteur JavaScript. */
const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const MOIS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];

export function jourEnToutesLettres(iso: string): string {
  const d = new Date(iso);
  return `${JOURS[d.getUTCDay()]} ${d.getUTCDate()} ${MOIS[d.getUTCMonth()]}`;
}
