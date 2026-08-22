import { cn } from '@/lib/cn';

/** Petit label majuscule très espacé qui coiffe chaque section (§2.2). */
export function Eyebrow({ children, className }: { children: string; className?: string }) {
  return <p className={cn('eyebrow text-pierre', className)}>{children}</p>;
}
