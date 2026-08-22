'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Bouton } from '@/components/ui/Bouton';
import { Conteneur } from '@/components/ui/Conteneur';
import { LienFleche } from '@/components/ui/LienFleche';
import { RevelationTexte } from '@/components/ui/Revelation';

const ETAPES = ['Vos dimensions', 'Vos matières', 'Notre atelier'];

/**
 * Bloc immersif sur-mesure (§6 section 4).
 * Fond sombre plein écran, image en parallaxe à 0,8×, titre en deux temps.
 */
export function SurMesure({ image = '/images/home/surmesure.webp' }: { image?: string } = {}) {
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <section
      ref={section}
      aria-label="Le sur-mesure"
      className="relative flex min-h-[85vh] items-center overflow-hidden bg-encre py-28"
    >
      <motion.div style={{ y }} className="absolute inset-[-10%]">
        <Image
          src={image}
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="object-cover opacity-35"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-encre via-encre/70 to-encre" />

      <Conteneur className="relative text-center">
        <h2 className="text-h1 mx-auto max-w-3xl font-extralight text-craie">
          <RevelationTexte>Votre pièce n’existe pas encore.</RevelationTexte>
          <RevelationTexte index={1} className="text-bronze">
            Dessinons-la ensemble.
          </RevelationTexte>
        </h2>

        <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {ETAPES.map((etape, i) => (
            <li key={etape} className="flex items-center gap-8">
              <span className="eyebrow text-craie/70">{etape}</span>
              {i < ETAPES.length - 1 && (
                <span aria-hidden className="hidden h-px w-12 bg-craie/25 sm:block" />
              )}
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
          <Bouton href="/sur-mesure/configurateur" variante="inverse">
            Ouvrir le configurateur
          </Bouton>
          <LienFleche href="/sur-mesure/matieres" clair>
            Découvrir nos matières
          </LienFleche>
        </div>
      </Conteneur>
    </section>
  );
}
