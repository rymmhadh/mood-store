import Link from 'next/link';
import { cn } from '@/lib/cn';

interface Props {
  href: string;
  children: string;
  className?: string;
  /** Variante claire pour les fonds sombres. */
  clair?: boolean;
}

/**
 * Lien « › en savoir + » — reprise directe du vocabulaire Roche Bobois :
 * un chevron, le libellé, et un « + » en bronze qui se décale au survol.
 */
export function LienFleche({ href, children, className, clair }: Props) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex items-center gap-2 text-nav transition-colors duration-300',
        clair ? 'text-craie hover:text-blanc' : 'text-encre hover:text-fumee',
        className,
      )}
    >
      <span
        aria-hidden
        className="inline-block transition-transform duration-500 ease-[var(--ease-doux)] group-hover:translate-x-1"
      >
        ›
      </span>
      <span className="lien-souligne">{children}</span>
      <span className="text-bronze transition-transform duration-500 ease-[var(--ease-doux)] group-hover:rotate-90">
        +
      </span>
    </Link>
  );
}
