'use client';

import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { Conteneur } from '@/components/ui/Conteneur';
import { IconeFermer } from '@/components/icons';
import { CarteMenu } from './CarteMenu';
import { MENU_PRODUITS, VIGNETTES_MENU } from '@/data/navigation';
import { DUREE, EASE_DOUX } from '@/lib/motion';

interface Props {
  ouvert: boolean;
  onFermer: () => void;
}

/**
 * Méga-menu « Produits ».
 *
 * Deux moitiés : la navigation textuelle à gauche (4 colonnes sur 12), les
 * cartes éditoriales à droite (8 colonnes). Ce déséquilibre est volontaire —
 * l'image doit dominer le texte, comme partout ailleurs sur le site (§1.2).
 * Les cartes sont plafonnées à 190 px et alignées à droite : au-delà de
 * 1440 px, l'espace rendu va à la colonne de liens, ce qui permet aux
 * libellés longs de tenir sur une seule ligne.
 *
 * Les cartes apparaissent une par une (opacité + translation de 20 px,
 * 500 ms, décalage de 100 ms) : le menu se compose sous les yeux du visiteur
 * au lieu de surgir d'un bloc.
 *
 * Hiérarchie de la colonne de gauche : intitulé de rubrique en 17 px gras
 * noir, liens en 15 px réguliers gris. Aucun interlettrage et aucun filet —
 * c'est le seul contraste de graisse qui structure, comme sur les menus des
 * grandes maisons. L'interlettrage, utile sur les surtitres de section, rend
 * ici la lecture flottante.
 */
export function MegaMenu({ ouvert, onFermer }: Props) {
  return (
    <AnimatePresence>
      {ouvert && (
        <motion.div
          key="mega"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: DUREE.base, ease: EASE_DOUX }}
          className="overflow-hidden border-t border-sable/40 bg-craie"
        >
          <Conteneur className="relative grid gap-12 py-12 lg:grid-cols-12 lg:gap-10 lg:py-14 xl:gap-14 xl:py-16">
            <button
              type="button"
              onClick={onFermer}
              aria-label="Fermer le menu"
              className="bouton-icone absolute top-4 right-[calc(var(--marge-laterale)-0.75rem)]"
            >
              <IconeFermer className="size-5" strokeWidth={1.6} />
            </button>

            {/* ── Navigation textuelle ──────────────────────────────────── */}
            <nav className="grid gap-x-8 gap-y-11 sm:grid-cols-2 lg:col-span-4 lg:content-start xl:gap-x-12">
              {MENU_PRODUITS.map((groupe, gi) => (
                <motion.div
                  key={groupe.titre}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: EASE_DOUX, delay: gi * 0.05 }}
                >
                  <h3 className="mb-3.5 text-[16px] leading-none font-bold tracking-normal text-encre uppercase xl:text-[17px]">
                    {groupe.titre}
                  </h3>
                  <ul className="space-y-2.5">
                    {groupe.liens.map((lien) => (
                      <li key={lien.href + lien.libelle}>
                        <Link
                          href={lien.href}
                          onClick={onFermer}
                          className="lien-souligne text-[14px] leading-tight tracking-normal text-pierre uppercase transition-colors duration-300 hover:text-encre xl:text-[15px]"
                        >
                          {lien.libelle}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </nav>

            {/* ── Cartes éditoriales ────────────────────────────────────── */}
            <div className="lg:col-span-8">
              <div className="ml-auto grid max-w-[51.25rem] grid-cols-2 gap-5 sm:grid-cols-4">
                {VIGNETTES_MENU.map((vignette, i) => (
                  <CarteMenu
                    key={vignette.titre}
                    vignette={vignette}
                    index={i}
                    onClic={onFermer}
                  />
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: EASE_DOUX, delay: 0.5 }}
                className="mt-6 ml-auto flex max-w-[51.25rem] items-center justify-between gap-6 border-t border-sable/50 pt-5"
              >
                <p className="text-[0.8125rem] text-pierre">
                  Chaque pièce est réalisable sur mesure, dans vos dimensions et vos matières.
                </p>
                <Link
                  href="/sur-mesure/configurateur"
                  onClick={onFermer}
                  className="lien-nav shrink-0 text-[0.8125rem]"
                >
                  Configurer une pièce
                </Link>
              </motion.div>
            </div>
          </Conteneur>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
