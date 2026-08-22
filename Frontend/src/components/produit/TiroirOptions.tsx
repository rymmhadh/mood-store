'use client';

import { AnimatePresence, motion } from 'motion/react';
import { IconeFermer } from '@/components/icons';
import { DUREE, EASE_CINE } from '@/lib/motion';
import { useTouche } from '@/hooks/useTouche';
import { useVerrouScroll } from '@/hooks/useVerrouScroll';
import { cn } from '@/lib/cn';

export interface OptionTiroir {
  id: string;
  libelle: string;
  detail?: string;
  hex?: string;
}

interface Props {
  ouvert: boolean;
  titre: string;
  options: OptionTiroir[];
  selection: string;
  onSelection: (id: string) => void;
  onFermer: () => void;
}

/**
 * Tiroir de sélection (dimensions, coloris, revêtements).
 * Un seul composant pour les trois usages : même comportement, même
 * animation, même accessibilité — et un seul endroit à corriger.
 */
export function TiroirOptions({
  ouvert,
  titre,
  options,
  selection,
  onSelection,
  onFermer,
}: Props) {
  useVerrouScroll(ouvert);
  useTouche('Escape', onFermer, ouvert);

  return (
    <AnimatePresence>
      {ouvert && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DUREE.rapide }}
            onClick={onFermer}
            className="fixed inset-0 z-90 bg-encre/35 backdrop-blur-[2px]"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: DUREE.ample, ease: EASE_CINE }}
            role="dialog"
            aria-modal="true"
            aria-label={titre}
            className="fixed inset-y-0 right-0 z-90 flex w-full max-w-[26rem] flex-col bg-craie"
          >
            <header className="flex h-20 shrink-0 items-center justify-between border-b border-sable/50 px-7">
              <p className="text-[18px] font-bold">{titre}</p>
              <button
                type="button"
                onClick={onFermer}
                aria-label="Fermer"
                className="bouton-icone -mr-3"
              >
                <IconeFermer className="size-5" strokeWidth={1.6} />
              </button>
            </header>

            <ul className="flex-1 overflow-y-auto px-7 py-6">
              {options.map((o) => {
                const actif = o.id === selection;
                return (
                  <li key={o.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelection(o.id);
                        onFermer();
                      }}
                      aria-pressed={actif}
                      className={cn(
                        'flex w-full items-center gap-4 border-b border-sable/40 py-4 text-left transition-colors',
                        actif ? 'text-encre' : 'text-fumee hover:text-encre',
                      )}
                    >
                      {o.hex && (
                        <span
                          className={cn(
                            'size-9 shrink-0 rounded-full transition-all',
                            actif
                              ? 'ring-2 ring-encre ring-offset-2 ring-offset-craie'
                              : 'ring-1 ring-encre/12',
                          )}
                          style={{ backgroundColor: o.hex }}
                        />
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px]">{o.libelle}</span>
                        {o.detail && (
                          <span className="mt-0.5 block text-[13px] text-pierre">{o.detail}</span>
                        )}
                      </span>
                      {actif && (
                        <svg viewBox="0 0 14 14" className="size-4 shrink-0" aria-hidden>
                          <path
                            d="M2.5 7.4 5.6 10.5 11.5 4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
