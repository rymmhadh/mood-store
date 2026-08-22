'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { LienFleche } from '@/components/ui/LienFleche';
import { HERO as HERO_DEFAUT, type DiapoHero } from '@/data/home';
import { DUREE, EASE_DOUX } from '@/lib/motion';
import { cn } from '@/lib/cn';

const INTERVALLE = 7000;

/**
 * Hero — séquence de plans fixes en fondu croisé, chacun animé en Ken Burns.
 *
 * Aucune vidéo : c'est la technique décrite au §4.1 du cahier des charges.
 * Quatre images WebP (~1,2 Mo au total) produisent l'effet d'un plan de
 * caméra, là où une vidéo équivalente pèserait 15 Mo.
 */
export function Hero({ diapos: HERO = HERO_DEFAUT }: { diapos?: DiapoHero[] } = {}) {
  const [actif, setActif] = useState(0);
  const [anime, setAnime] = useState(true);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setAnime(false);
      return;
    }

    const timer = setInterval(() => {
      setActif((i) => (i + 1) % HERO.length);
    }, INTERVALLE);

    return () => clearInterval(timer);
  }, []);

  const diapo = HERO[actif];

  return (
    <section
      aria-label="Collections en vedette"
      className="relative h-[calc(100svh-var(--header-h))] min-h-[34rem] w-full overflow-hidden bg-encre"
    >
      {/* Plans fixes superposés */}
      {HERO.map((d, i) => (
        <div
          key={d.image}
          aria-hidden={i !== actif}
          className={cn(
            'absolute inset-0 transition-opacity duration-[1200ms] ease-[var(--ease-doux)]',
            i === actif ? 'opacity-100' : 'opacity-0',
          )}
        >
          <div className={cn('relative size-full', anime && i === actif && 'animate-kenburns')}>
            <Image
              src={d.image}
              alt={`${d.titre} — ${d.ligne}`}
              fill
              priority={i === 0}
              sizes="100vw"
              quality={88}
              className="object-cover"
            />
          </div>
        </div>
      ))}

      {/* Voile de lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-r from-encre/60 via-encre/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-encre/50 to-transparent" />

      {/* Bloc éditorial */}
      <div className="conteneur relative flex h-full flex-col justify-center pb-24 lg:justify-start lg:pt-[16vh]">
        <motion.div
          key={diapo.titre}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DUREE.ample, ease: EASE_DOUX }}
          className="max-w-xl"
        >
          <h1 className="text-[2.75rem] leading-[1.05] font-extralight text-craie lg:text-[4rem]">
            {diapo.titre}
          </h1>
          <p className="mt-2 text-lg font-light text-craie/80">{diapo.ligne}</p>
          <LienFleche href={diapo.href} clair className="mt-5">
            en savoir
          </LienFleche>
        </motion.div>
      </div>

      {/* Indicateurs de diapositive */}
      <div className="absolute right-[var(--marge-laterale)] bottom-10 flex items-center gap-2">
        {HERO.map((d, i) => (
          <button
            key={d.image}
            type="button"
            onClick={() => setActif(i)}
            aria-label={`Voir ${d.titre}`}
            aria-current={i === actif}
            className={cn(
              'h-px transition-all duration-500 ease-[var(--ease-doux)]',
              i === actif ? 'w-12 bg-craie' : 'w-6 bg-craie/40 hover:bg-craie/70',
            )}
          />
        ))}
      </div>

      {/* Indicateur de défilement */}
      <div className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 lg:flex">
        <span className="eyebrow text-craie/60">Défiler</span>
        <span className="relative block h-10 w-px overflow-hidden bg-craie/25">
          <motion.span
            className="absolute inset-x-0 top-0 block h-4 bg-craie"
            animate={{ y: ['-100%', '250%'] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </div>
    </section>
  );
}
