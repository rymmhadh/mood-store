import Link from 'next/link';
import { Fragment } from 'react';

export interface Miette {
  libelle: string;
  href?: string;
}

/** Fil d'Ariane discret, aligné à gauche sous l'en-tête. */
export function FilAriane({ miettes }: { miettes: Miette[] }) {
  return (
    <nav aria-label="Fil d’Ariane" className="text-[13px] text-pierre">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {miettes.map((m, i) => (
          <Fragment key={m.libelle}>
            {i > 0 && (
              <li aria-hidden className="text-sable">
                /
              </li>
            )}
            <li>
              {m.href ? (
                <Link href={m.href} className="lien-souligne transition-colors hover:text-encre">
                  {m.libelle}
                </Link>
              ) : (
                <span className="text-fumee">{m.libelle}</span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
