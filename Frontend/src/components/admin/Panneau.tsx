import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface Props {
  titre: string;
  /** Une phrase qui dit comment lire le graphique. Jamais de jargon (§19.1). */
  aide?: string;
  /** Contenu secondaire aligné à droite du titre (légende, total, filtre). */
  extra?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Cadre commun à tous les blocs du tableau de bord.
 *
 * Angles vifs, filet fin, fond blanc : mêmes règles que les fiches produit du
 * site (§2.4). Aucune ombre portée — elle ferait « application web » là où le
 * reste de la maison est imprimé.
 */
export function Panneau({ titre, aide, extra, children, className }: Props) {
  return (
    <section className={cn('flex flex-col border border-sable/50 bg-blanc', className)}>
      <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-sable/40 px-6 py-5">
        <div className="min-w-0">
          <h2 className="text-[17px] leading-snug">{titre}</h2>
          {aide && <p className="mt-1 max-w-prose text-[13px] leading-relaxed text-pierre">{aide}</p>}
        </div>
        {extra && <div className="shrink-0 text-[13px] text-pierre">{extra}</div>}
      </header>

      <div className="flex-1 px-6 py-6">{children}</div>
    </section>
  );
}
