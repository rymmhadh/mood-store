'use client';

import { AnimatePresence, motion } from 'motion/react';
import { IconeFermer } from '@/components/icons';
import type { Coloris } from '@/data/catalogue';
import { DUREE, EASE_CINE } from '@/lib/motion';
import { useTouche } from '@/hooks/useTouche';
import { useVerrouScroll } from '@/hooks/useVerrouScroll';
import { cn } from '@/lib/cn';

export interface Filtres {
  matieres: string[];
  couleurs: string[];
  styles: string[];
}

export const FILTRES_VIDES: Filtres = { matieres: [], couleurs: [], styles: [] };

export const nombreFiltres = (f: Filtres) =>
  f.matieres.length + f.couleurs.length + f.styles.length;

interface Props {
  ouvert: boolean;
  filtres: Filtres;
  resultats: number;
  matieres: string[];
  styles: string[];
  coloris: Coloris[];
  onChange: (f: Filtres) => void;
  onFermer: () => void;
}

/** Bascule une valeur dans un tableau, sans le muter. */
function basculer(liste: string[], valeur: string) {
  return liste.includes(valeur) ? liste.filter((v) => v !== valeur) : [...liste, valeur];
}

/**
 * Panneau de filtres, en tiroir latéral gauche.
 * L'état est remonté au parent : la grille se met à jour en direct, sans
 * bouton « appliquer » — on voit le nombre de résultats évoluer à chaque clic.
 */
export function PanneauFiltres({
  ouvert,
  filtres,
  resultats,
  matieres,
  styles,
  coloris,
  onChange,
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
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: DUREE.ample, ease: EASE_CINE }}
            role="dialog"
            aria-modal="true"
            aria-label="Filtrer les produits"
            className="fixed inset-y-0 left-0 z-90 flex w-full max-w-[26rem] flex-col bg-craie"
          >
            <header className="flex h-20 shrink-0 items-center justify-between border-b border-sable/50 px-7">
              <p className="text-[18px] font-bold">Filtrer</p>
              <button
                type="button"
                onClick={onFermer}
                aria-label="Fermer les filtres"
                className="bouton-icone -mr-3"
              >
                <IconeFermer className="size-5" strokeWidth={1.6} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-7 py-8">
              <Groupe titre="Matière">
                {matieres.map((m) => (
                  <Case
                    key={m}
                    libelle={m}
                    actif={filtres.matieres.includes(m)}
                    onClick={() => onChange({ ...filtres, matieres: basculer(filtres.matieres, m) })}
                  />
                ))}
              </Groupe>

              <Groupe titre="Couleur">
                <div className="flex flex-wrap gap-2.5">
                  {coloris.map((c) => {
                    const actif = filtres.couleurs.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() =>
                          onChange({ ...filtres, couleurs: basculer(filtres.couleurs, c.id) })
                        }
                        aria-pressed={actif}
                        title={c.nom}
                        className={cn(
                          'size-9 rounded-full transition-all duration-300',
                          actif
                            ? 'ring-2 ring-encre ring-offset-2 ring-offset-craie'
                            : 'ring-1 ring-encre/12 hover:ring-encre/40',
                        )}
                        style={{ backgroundColor: c.hex }}
                      >
                        <span className="sr-only">{c.nom}</span>
                      </button>
                    );
                  })}
                </div>
              </Groupe>

              <Groupe titre="Style">
                {styles.map((s) => (
                  <Case
                    key={s}
                    libelle={s}
                    actif={filtres.styles.includes(s)}
                    onClick={() => onChange({ ...filtres, styles: basculer(filtres.styles, s) })}
                  />
                ))}
              </Groupe>
            </div>

            <footer className="flex shrink-0 items-center gap-4 border-t border-sable/50 px-7 py-5">
              <button
                type="button"
                onClick={() => onChange(FILTRES_VIDES)}
                className="lien-souligne text-[14px] text-pierre transition-colors hover:text-encre"
              >
                Tout effacer
              </button>
              <button
                type="button"
                onClick={onFermer}
                className="ml-auto h-12 bg-encre px-8 libelle-action text-craie transition-colors hover:bg-fumee"
              >
                Voir {resultats} produit{resultats > 1 ? 's' : ''}
              </button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Groupe({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="mb-9 last:mb-0">
      <h3 className="mb-4 text-[16px] font-bold">{titre}</h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Case({
  libelle,
  actif,
  onClick,
}: {
  libelle: string;
  actif: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={actif}
      className="flex w-full items-center gap-3 text-left text-[15px] text-fumee transition-colors hover:text-encre"
    >
      <span
        className={cn(
          'flex size-[18px] shrink-0 items-center justify-center border transition-colors duration-200',
          actif ? 'border-encre bg-encre' : 'border-sable',
        )}
      >
        {actif && (
          <svg viewBox="0 0 12 12" className="size-3 text-craie" aria-hidden>
            <path
              d="M2.5 6.2 4.8 8.5 9.5 3.8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      {libelle}
    </button>
  );
}
