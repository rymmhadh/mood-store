'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import type { VignetteMenu } from '@/types';
import { EASE_DOUX } from '@/lib/motion';

interface Props {
  vignette: VignetteMenu;
  /** Rang de la carte : pilote le décalage d'apparition (100 ms par cran). */
  index: number;
  onClic: () => void;
}

/**
 * Carte éditoriale du méga-menu.
 *
 * Format portrait très allongé (ratio ≈ 0,40), coins adoucis à 12 px,
 * image en plein cadre, texte en bas sur dégradé. Toutes les cartes
 * partagent exactement la même hauteur, la même largeur, le même rayon,
 * le même retrait intérieur et la même animation.
 *
 * Le nom de la ligne est le point d'accroche : 32 px en semi-gras sur grand
 * écran. Les tailles ont été calées sur les métriques réelles de Jost en
 * capitales — le mot le plus long tient sur une seule ligne à chaque palier
 * (26 px < 640 px, 28 px en 1024–1280, 32 px au-delà).
 */
export function CarteMenu({ vignette, index, onClic }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_DOUX, delay: index * 0.1 }}
    >
      <Link
        href={vignette.href}
        onClick={onClic}
        className="group/carte relative block h-[22rem] w-full overflow-hidden rounded-[12px] bg-encre-doux shadow-none transition-shadow duration-[600ms] ease-[var(--ease-doux)] hover:shadow-[0_28px_60px_-24px_rgba(10,10,10,0.55)] sm:h-[26rem] lg:h-[27rem] xl:h-[31rem]"
      >
        {/* Visuel — occupe 100 % de la carte */}
        <Image
          src={vignette.image}
          alt={vignette.titre}
          fill
          quality={92}
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 16vw"
          className="object-cover transition-transform duration-[600ms] ease-[var(--ease-doux)] will-change-transform group-hover/carte:scale-[1.08]"
        />

        {/* Dégradé de lisibilité — permanent */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-encre/85 via-encre/20 to-transparent"
        />

        {/* Assombrissement au survol */}
        <div
          aria-hidden
          className="absolute inset-0 bg-encre/0 transition-colors duration-[600ms] ease-[var(--ease-doux)] group-hover/carte:bg-encre/20"
        />

        {/* Filet intérieur : détache la carte du fond beige */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-[12px] ring-1 ring-encre/10 ring-inset"
        />

        {/* Bloc éditorial */}
        <div className="absolute inset-x-0 bottom-0 p-5">
          {vignette.sousTitre && (
            <p className="text-[11px] leading-none font-medium tracking-[0.22em] text-craie/80 uppercase">
              {vignette.sousTitre}
            </p>
          )}

          <p className="mt-2.5 text-[26px] leading-[1.1] font-semibold tracking-[0.02em] text-craie uppercase lg:text-[28px] xl:text-[32px]">
            {vignette.titre}
          </p>

          {/* Filet qui se dessine au survol */}
          <span
            aria-hidden
            className="mt-4 block h-px w-8 origin-left scale-x-100 bg-craie/50 transition-all duration-[600ms] ease-[var(--ease-doux)] group-hover/carte:w-16 group-hover/carte:bg-craie"
          />
        </div>
      </Link>
    </motion.div>
  );
}
