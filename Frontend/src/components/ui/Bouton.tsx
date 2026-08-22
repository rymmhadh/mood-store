import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variante = 'primaire' | 'inverse' | 'secondaire';

interface Props {
  href: string;
  children: ReactNode;
  variante?: Variante;
  className?: string;
  externe?: boolean;
}

const VARIANTES: Record<Variante, string> = {
  primaire: 'bg-encre text-craie hover:bg-craie hover:text-encre border-encre',
  inverse: 'bg-craie text-encre hover:bg-transparent hover:text-craie border-craie',
  secondaire: 'bg-transparent text-encre hover:bg-encre hover:text-craie border-encre',
};

/** Bouton rectangulaire, sans rayon ni ombre : inversion au survol (§2.4). */
export function Bouton({ href, children, variante = 'primaire', className, externe }: Props) {
  const classes = cn(
    'inline-flex h-14 items-center justify-center border px-9 libelle-action',
    'transition-colors duration-[400ms] ease-[var(--ease-doux)]',
    VARIANTES[variante],
    className,
  );

  if (externe) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
