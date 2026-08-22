'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Conteneur } from '@/components/ui/Conteneur';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { LienFleche } from '@/components/ui/LienFleche';
import { Revelation, RevelationTexte } from '@/components/ui/Revelation';
import { REALISATIONS } from '@/data/home';
import type { Realisation } from '@/types';

function Carte({ projet, grand = false }: { projet: Realisation; grand?: boolean }) {
  return (
    <Link href={`/realisations/${projet.slug}`} className="group block">
      <div className={`relative overflow-hidden bg-boucle ${grand ? 'aspect-[4/5]' : 'aspect-[4/3]'}`}>
        <Image
          src={projet.image}
          alt={`${projet.titre} — ${projet.ville}`}
          fill
          sizes={grand ? '(max-width: 1024px) 100vw, 55vw' : '(max-width: 1024px) 100vw, 38vw'}
          className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-doux)] group-hover:scale-[1.04]"
        />
        <span className="eyebrow absolute bottom-0 left-0 translate-y-full bg-craie px-4 py-3 text-encre transition-transform duration-500 ease-[var(--ease-doux)] group-hover:translate-y-0">
          Voir le projet
        </span>
      </div>

      <div className="mt-5">
        <h3 className="text-h3 font-light">
          <span className="lien-souligne">{projet.titre}</span>
        </h3>
        <p className="mt-1.5 text-sm text-pierre">
          {projet.typologie} — {projet.ville}
          {projet.surface ? ` · ${projet.surface} m²` : ''} · {projet.annee}
        </p>
      </div>
    </Link>
  );
}

/**
 * Réalisations récentes (§6 section 5).
 * Disposition éditoriale asymétrique : la colonne de droite défile légèrement
 * plus vite que celle de gauche — rythme de magazine d'architecture.
 */
export function Realisations() {
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ['start end', 'end start'],
  });

  const yDroite = useTransform(scrollYProgress, [0, 1], ['6%', '-6%']);

  const [premier, ...autres] = REALISATIONS;

  return (
    <section ref={section} aria-label="Nos réalisations" className="bg-craie py-24 lg:py-32">
      <Conteneur>
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow className="mb-4">Nos réalisations</Eyebrow>
            <h2 className="text-h2 max-w-xl">
              <RevelationTexte>Des espaces livrés, pas des rendus</RevelationTexte>
            </h2>
          </div>
          <LienFleche href="/realisations">Voir les 340 réalisations</LienFleche>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
          <Revelation className="lg:col-span-7">
            <Carte projet={premier} grand />
          </Revelation>

          <motion.div style={{ y: yDroite }} className="grid gap-10 lg:col-span-5 lg:pt-20">
            {autres.map((projet, i) => (
              <Revelation key={projet.slug} index={i + 1}>
                <Carte projet={projet} />
              </Revelation>
            ))}
          </motion.div>
        </div>
      </Conteneur>
    </section>
  );
}
