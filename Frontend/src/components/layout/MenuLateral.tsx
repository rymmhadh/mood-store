'use client';

import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { IconeFermer, IconeInstagram, IconeLieu, IconeWhatsApp } from '@/components/icons';
import { LogoMood } from '@/components/ui/LogoMood';
import { MENU_LATERAL } from '@/data/navigation';
import { SHOWROOMS } from '@/data/home';
import { SITE, lienWhatsApp } from '@/data/site';
import { DUREE, EASE_CINE, EASE_DOUX } from '@/lib/motion';
import { useTouche } from '@/hooks/useTouche';
import { useVerrouScroll } from '@/hooks/useVerrouScroll';

interface Props {
  ouvert: boolean;
  onFermer: () => void;
}

/** Menu plein écran (bouton « Menu »). Sert aussi de navigation mobile. */
export function MenuLateral({ ouvert, onFermer }: Props) {
  useVerrouScroll(ouvert);
  useTouche('Escape', onFermer, ouvert);

  return (
    <AnimatePresence>
      {ouvert && (
        <motion.div
          key="menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DUREE.rapide }}
          className="fixed inset-0 z-90 bg-encre text-craie"
          role="dialog"
          aria-modal="true"
          aria-label="Menu principal"
        >
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: DUREE.ample, ease: EASE_CINE }}
            className="flex h-full flex-col overflow-y-auto"
          >
            <div className="conteneur flex h-24 shrink-0 items-center justify-between">
              <LogoMood taille={64} clair sansSurvol />
              <button
                type="button"
                onClick={onFermer}
                aria-label="Fermer le menu"
                className="flex items-center gap-3 libelle-action transition-opacity hover:opacity-60"
              >
                Fermer
                <IconeFermer className="size-5" />
              </button>
            </div>

            <nav className="conteneur grid flex-1 gap-10 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
              {MENU_LATERAL.map((groupe, gi) => (
                <div key={groupe.titre}>
                  <p className="eyebrow mb-6 text-craie">{groupe.titre}</p>
                  <ul className="space-y-4">
                    {groupe.liens.map((lien, li) => (
                      <motion.li
                        key={lien.href + lien.libelle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: DUREE.base,
                          ease: EASE_DOUX,
                          delay: 0.2 + gi * 0.05 + li * 0.05,
                        }}
                      >
                        <Link
                          href={lien.href}
                          onClick={onFermer}
                          className="lien-souligne text-xl font-light text-craie/85 transition-colors hover:text-craie lg:text-2xl"
                        >
                          {lien.libelle}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>

            <div className="conteneur border-t border-craie/15 py-8">
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {SHOWROOMS.map((s) => (
                  <div key={s.slug} className="flex items-start gap-3">
                    <IconeLieu className="mt-0.5 size-4 shrink-0 text-bronze" />
                    <div>
                      <p className="text-sm text-craie">{s.nom}</p>
                      <p className="text-sm text-pierre">{s.adresse}</p>
                    </div>
                  </div>
                ))}
                <a
                  href={`tel:${SITE.telephoneBrut}`}
                  className="lien-souligne self-start text-sm text-craie"
                >
                  {SITE.telephone}
                </a>
                <div className="flex items-center gap-4">
                  <a
                    href={SITE.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="transition-opacity hover:opacity-60"
                  >
                    <IconeInstagram className="size-5" />
                  </a>
                  <a
                    href={lienWhatsApp('Bonjour, je souhaite des informations.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="transition-opacity hover:opacity-60"
                  >
                    <IconeWhatsApp className="size-5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
