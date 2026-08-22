'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Conteneur } from '@/components/ui/Conteneur';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { LienFleche } from '@/components/ui/LienFleche';
import { RevelationTexte } from '@/components/ui/Revelation';
import { Video } from '@/components/media/Video';
import { ATELIER_IMAGES as ATELIER_IMAGES_DEFAUT } from '@/data/home';

/**
 * L'atelier (§6 section 7).
 *
 * Deux vidéos de tournage réel encadrent la mosaïque de photos. Elles sont
 * en mode `contenu` : rien ne se lance tout seul, elles gardent leur son, et
 * le visiteur décide. C'est du reportage, pas du décor — l'imposer en fond
 * sonore serait déplacé.
 *
 * Le texte reste ancré pendant que la colonne de droite défile ; chaque
 * élément a sa propre amplitude de parallaxe, ce qui donne une composition
 * vivante plutôt qu'une grille figée.
 */
export function Atelier({ images = ATELIER_IMAGES_DEFAUT }: { images?: readonly string[] } = {}) {
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ['start end', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);

  return (
    <section
      ref={section}
      id="atelier"
      aria-label="Le savoir-faire"
      className="bg-boucle py-24 lg:py-32"
    >
      <Conteneur className="grid gap-14 lg:grid-cols-12">
        {/* Texte ancré */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Eyebrow className="mb-4 text-encre">Le savoir-faire</Eyebrow>
            <h2 className="text-h2 max-w-md">
              <RevelationTexte>Fait à la main, à Tunis.</RevelationTexte>
            </h2>

            <div className="mt-8 max-w-md space-y-5 text-fumee">
              <p className="leading-relaxed">
                Nos ébénistes et tapissiers travaillent dans un atelier unique, à quelques
                minutes du showroom. Chaque pièce y est montée, garnie et contrôlée à la
                main avant de partir.
              </p>
              <p className="leading-relaxed">
                C’est ce qui nous permet de modifier une dimension au millimètre, de
                changer une matière en cours de projet, et de réparer un meuble dix ans
                plus tard.
              </p>
            </div>

            <LienFleche href="/a-propos#atelier" className="mt-8">
              Visiter l’atelier
            </LienFleche>
          </div>
        </div>

        {/* Vidéos et photos */}
        <div className="grid grid-cols-2 gap-4 lg:col-span-8 lg:gap-6">
          <motion.div style={{ y: y1 } as never} className="space-y-4 lg:space-y-6">
            <Video
              nom="atelier-1"
              titre="Une journée à l’atelier Mood Store"
              legende="Une journée à l’atelier — livraison, montage et pose."
            />
            <div className="relative aspect-square overflow-hidden bg-sable">
              <Image
                src={images[1]}
                alt="Détail de finition"
                fill
                sizes="(max-width: 1024px) 45vw, 30vw"
                className="object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            style={{ y: y2 } as never}
            className="space-y-4 pt-10 lg:space-y-6 lg:pt-16"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-sable">
              <Image
                src={images[0]}
                alt="L’atelier Mood Store"
                fill
                sizes="(max-width: 1024px) 45vw, 30vw"
                className="object-cover"
              />
            </div>
            <Video
              nom="atelier-2"
              titre="L’équipe au travail"
              legende="L’équipe au travail sur une pièce sur mesure."
            />
          </motion.div>
        </div>
      </Conteneur>
    </section>
  );
}
