'use client';

import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import { useState } from 'react';
import { IconeFermer } from '@/components/icons';
import { Conteneur } from '@/components/ui/Conteneur';
import {
  FAMILLES_MATIERE,
  NUANCIER,
  type FamilleMatiere,
  type MatiereNuancier,
} from '@/data/matieres';
import { DUREE, EASE_CINE, EASE_DOUX } from '@/lib/motion';
import { useTouche } from '@/hooks/useTouche';
import { cn } from '@/lib/cn';

/**
 * Nuancier interactif.
 *
 * Grille de plans rapprochés, filtrable par famille. Au clic, un panneau
 * latéral donne l'origine, les propriétés mesurables (Martindale, épaisseur)
 * et l'entretien — puis propose l'envoi d'un échantillon gratuit, qui est le
 * vrai objectif de la page.
 */
export function Nuancier() {
  const [famille, setFamille] = useState<FamilleMatiere | null>(null);
  const [choisie, setChoisie] = useState<MatiereNuancier | null>(null);
  const [panier, setPanier] = useState<string[]>([]);

  useTouche('Escape', () => setChoisie(null), Boolean(choisie));

  const visibles = famille ? NUANCIER.filter((m) => m.famille === famille) : NUANCIER;

  const basculerPanier = (id: string) =>
    setPanier((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length < 5 ? [...p, id] : p));

  return (
    <>
      {/* Filtres */}
      <Conteneur className="flex flex-wrap items-center gap-2 border-b border-sable/60 pb-6">
        <button
          type="button"
          onClick={() => setFamille(null)}
          aria-pressed={famille === null}
          className={cn(
            'border px-5 py-2.5 text-[14px] transition-colors',
            famille === null ? 'border-encre bg-encre text-craie' : 'border-sable text-fumee hover:border-encre',
          )}
        >
          Toutes
        </button>
        {FAMILLES_MATIERE.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFamille(f)}
            aria-pressed={famille === f}
            className={cn(
              'border px-5 py-2.5 text-[14px] transition-colors',
              famille === f ? 'border-encre bg-encre text-craie' : 'border-sable text-fumee hover:border-encre',
            )}
          >
            {f}
          </button>
        ))}

        <p className="ml-auto text-[15px] text-fumee">
          {visibles.length} matière{visibles.length > 1 ? 's' : ''}
        </p>
      </Conteneur>

      {/* Grille */}
      <Conteneur className="py-10">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {visibles.map((m) => (
            <motion.button
              key={m.id}
              layout
              id={m.id}
              type="button"
              onClick={() => setChoisie(m)}
              transition={{ duration: DUREE.base, ease: EASE_DOUX }}
              className="group relative aspect-square scroll-mt-40 overflow-hidden bg-galerie text-left"
              style={m.image ? undefined : { backgroundColor: m.hex }}
            >
              {m.image && (
                <Image
                  src={m.image}
                  alt={m.nom}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw"
                  className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-doux)] group-hover:scale-110"
                />
              )}
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-encre/80 via-encre/20 to-transparent p-4">
                <span className="block text-[13px] text-craie/70">{m.famille}</span>
                <span className="mt-0.5 block text-[15px] text-craie">{m.nom}</span>
              </span>
              {panier.includes(m.id) && (
                <span className="absolute top-3 right-3 flex size-7 items-center justify-center rounded-full bg-encre text-craie">
                  <svg viewBox="0 0 14 14" className="size-3.5" aria-hidden>
                    <path d="M2.5 7.4 5.6 10.5 11.5 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </Conteneur>

      {/* Panneau de détail */}
      <AnimatePresence>
        {choisie && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DUREE.rapide }}
              onClick={() => setChoisie(null)}
              className="fixed inset-0 z-90 bg-encre/35 backdrop-blur-[2px]"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: DUREE.ample, ease: EASE_CINE }}
              role="dialog"
              aria-modal="true"
              aria-label={choisie.nom}
              className="fixed inset-y-0 right-0 z-90 flex w-full max-w-[30rem] flex-col overflow-y-auto bg-craie"
            >
              <div className="relative aspect-[4/3] shrink-0 bg-galerie" style={choisie.image ? undefined : { backgroundColor: choisie.hex }}>
                {choisie.image && (
                  <Image src={choisie.image} alt={choisie.nom} fill sizes="30rem" className="object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => setChoisie(null)}
                  aria-label="Fermer"
                  className="absolute top-4 right-4 flex size-11 items-center justify-center rounded-full bg-craie/85 text-encre backdrop-blur-sm transition-colors hover:bg-craie"
                >
                  <IconeFermer className="size-5" strokeWidth={1.6} />
                </button>
              </div>

              <div className="px-8 py-8">
                <p className="eyebrow text-encre">{choisie.famille}</p>
                <h2 className="mt-3 text-[28px] font-light">{choisie.nom}</h2>
                <p className="mt-4 text-[15px] leading-relaxed text-fumee">{choisie.origine}</p>

                <ul className="mt-7 space-y-2 border-t border-sable/60 pt-7">
                  {choisie.proprietes.map((p) => (
                    <li key={p} className="flex gap-3 text-[15px] text-fumee">
                      <span aria-hidden className="mt-2.5 size-1 shrink-0 rounded-full bg-bronze" />
                      {p}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 border-t border-sable/60 pt-7">
                  <p className="text-[13px] text-pierre">Entretien</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-fumee">{choisie.entretien}</p>
                </div>

                {choisie.echantillon ? (
                  <button
                    type="button"
                    onClick={() => basculerPanier(choisie.id)}
                    className={cn(
                      'mt-8 flex h-14 w-full items-center justify-center libelle-action transition-colors',
                      panier.includes(choisie.id)
                        ? 'border border-encre text-encre'
                        : 'bg-encre text-craie hover:bg-fumee',
                    )}
                  >
                    {panier.includes(choisie.id)
                      ? 'Retirer de ma sélection'
                      : 'Ajouter à mes échantillons'}
                  </button>
                ) : (
                  <p className="mt-8 border border-sable p-5 text-[13px] leading-relaxed text-pierre">
                    Les pierres ne s’envoient pas par la poste. Nous les présentons en showroom,
                    et le veinage de votre plateau est validé sur photo avant découpe.
                  </p>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Barre de sélection d'échantillons */}
      <AnimatePresence>
        {panier.length > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: DUREE.base, ease: EASE_DOUX }}
            className="fixed inset-x-0 bottom-0 z-70 border-t border-sable/60 bg-craie/97 backdrop-blur-md"
          >
            <Conteneur className="flex flex-wrap items-center gap-4 py-4">
              <div className="flex items-center gap-2">
                {panier.map((id) => {
                  const m = NUANCIER.find((x) => x.id === id)!;
                  return (
                    <span
                      key={id}
                      title={m.nom}
                      className="relative size-10 overflow-hidden rounded-full ring-1 ring-encre/12"
                      style={m.image ? undefined : { backgroundColor: m.hex }}
                    >
                      {m.image && <Image src={m.image} alt="" aria-hidden fill sizes="40px" className="object-cover" />}
                    </span>
                  );
                })}
              </div>
              <p className="text-[13px] text-pierre">
                {panier.length} échantillon{panier.length > 1 ? 's' : ''} sur 5 · envoi gratuit
              </p>
              <a
                href="#echantillons"
                className="ml-auto flex h-12 items-center bg-encre px-7 libelle-action text-craie transition-colors hover:bg-fumee"
              >
                Recevoir chez moi
              </a>
            </Conteneur>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
