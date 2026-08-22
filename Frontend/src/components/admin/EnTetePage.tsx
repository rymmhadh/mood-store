import Link from 'next/link';
import type { ReactNode } from 'react';
import { IconeChevron } from '@/components/icons';
import { LogoMood } from '@/components/ui/LogoMood';

interface Props {
  titre: string;
  /** Une ligne sous le titre : la date du jour, un décompte, un rappel. */
  soustitre?: ReactNode;
  /** Fil d'Ariane interne au back-office, sans la page courante. */
  retour?: { libelle: string; href: string };
  /** Boutons et sélecteurs alignés à droite. */
  actions?: ReactNode;
}

/**
 * En-tête commun à tous les modules du back-office.
 *
 * Le même bandeau partout : on sait toujours où l'on est, comment revenir, et
 * les actions de la page sont toujours au même endroit. Collant en haut de
 * l'écran, parce qu'une liste de catalogue se fait longue et qu'on ne veut pas
 * remonter pour changer de filtre.
 */
export function EnTetePage({ titre, soustitre, retour, actions }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-sable/50 bg-craie/92 backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 px-6 py-5 lg:px-10">
        <div className="flex min-w-0 items-center gap-4">
          <LogoMood taille={38} lien={false} sansSurvol className="lg:hidden" />

          <div className="min-w-0">
            {retour && (
              <Link
                href={retour.href}
                className="mb-1 inline-flex items-center gap-1 text-[13px] text-pierre transition-colors hover:text-encre"
              >
                <IconeChevron className="size-3.5 rotate-180" />
                {retour.libelle}
              </Link>
            )}
            <h1 className="truncate text-h3">{titre}</h1>
            {soustitre && <p className="mt-0.5 text-[13px] text-pierre">{soustitre}</p>}
          </div>
        </div>

        {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
      </div>
    </header>
  );
}
