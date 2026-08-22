import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface Props {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Ancre de page (`#fiche-technique`, etc.). */
  id?: string;
  /** Supprime la largeur maximale : le contenu occupe toute la largeur utile. */
  fluide?: boolean;
}

export function Conteneur({ children, className, as: Tag = 'div', id, fluide }: Props) {
  return (
    <Tag id={id} className={cn('conteneur', fluide && 'max-w-none', className)}>
      {children}
    </Tag>
  );
}
