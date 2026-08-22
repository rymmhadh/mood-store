'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useState, type ReactNode } from 'react';
import { DUREE, EASE_DOUX } from '@/lib/motion';
import { cn } from '@/lib/cn';

export interface Panneau {
  titre: string;
  contenu: ReactNode;
}

/** Accordéon sobre : un filet, un signe qui pivote, aucune bordure de bloc. */
export function Accordeon({ panneaux, ouvertParDefaut = 0 }: { panneaux: Panneau[]; ouvertParDefaut?: number }) {
  const [ouvert, setOuvert] = useState<number | null>(ouvertParDefaut);

  return (
    <div className="border-t border-sable/60">
      {panneaux.map((p, i) => {
        const actif = ouvert === i;
        return (
          <div key={p.titre} className="border-b border-sable/60">
            <h3>
              <button
                type="button"
                onClick={() => setOuvert(actif ? null : i)}
                aria-expanded={actif}
                className="flex w-full items-center justify-between gap-6 py-6 text-left text-[17px] transition-colors hover:text-fumee"
              >
                {p.titre}
                <span
                  aria-hidden
                  className={cn(
                    'relative size-4 shrink-0 transition-transform duration-500 ease-[var(--ease-doux)]',
                    actif && 'rotate-45',
                  )}
                >
                  <span className="absolute top-1/2 left-0 h-px w-4 -translate-y-1/2 bg-current" />
                  <span className="absolute top-0 left-1/2 h-4 w-px -translate-x-1/2 bg-current" />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {actif && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: DUREE.base, ease: EASE_DOUX }}
                  className="overflow-hidden"
                >
                  <div className="pb-8 text-[15px] leading-relaxed text-fumee">{p.contenu}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
