'use client';

import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Conteneur } from '@/components/ui/Conteneur';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { TEMOIGNAGES } from '@/data/home';
import { DUREE, EASE_DOUX } from '@/lib/motion';
import { cn } from '@/lib/cn';

/** Témoignages (§6 section 9). Toujours nommés : jamais d'avis anonyme. */
export function Temoignages() {
  const [actif, setActif] = useState(0);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    if (pause) return;

    const timer = setInterval(() => {
      setActif((i) => (i + 1) % TEMOIGNAGES.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [pause]);

  const t = TEMOIGNAGES[actif];

  return (
    <section
      aria-label="Témoignages clients"
      onMouseEnter={() => setPause(true)}
      onMouseLeave={() => setPause(false)}
      className="bg-encre py-24 text-craie lg:py-32"
    >
      <Conteneur className="grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <div className="relative aspect-[4/3] overflow-hidden bg-encre-doux">
            <AnimatePresence mode="wait">
              <motion.div
                key={t.auteur}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DUREE.ample, ease: EASE_DOUX }}
                className="absolute inset-0"
              >
                <Image
                  src={t.image}
                  alt={`Projet de ${t.auteur}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="relative lg:col-span-7">
          <span
            aria-hidden
            className="pointer-events-none absolute -top-16 -left-2 text-[10rem] leading-none text-sable/10 select-none"
          >
            “
          </span>

          <Eyebrow className="mb-6 text-bronze">Ils nous ont fait confiance</Eyebrow>

          <AnimatePresence mode="wait">
            <motion.blockquote
              key={t.auteur}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: DUREE.base, ease: EASE_DOUX }}
            >
              <p className="text-h3 font-light text-craie lg:text-[1.75rem] lg:leading-[1.4]">
                {t.citation}
              </p>
              <footer className="mt-6 text-sm text-pierre">
                <span className="text-craie">{t.auteur}</span> — {t.ville} · {t.projet}
              </footer>
            </motion.blockquote>
          </AnimatePresence>

          <div className="mt-10 flex items-center gap-2">
            {TEMOIGNAGES.map((item, i) => (
              <button
                key={item.auteur}
                type="button"
                onClick={() => setActif(i)}
                aria-label={`Témoignage de ${item.auteur}`}
                aria-current={i === actif}
                className={cn(
                  'h-px transition-all duration-500 ease-[var(--ease-doux)]',
                  i === actif ? 'w-12 bg-craie' : 'w-6 bg-craie/30 hover:bg-craie/60',
                )}
              />
            ))}
          </div>
        </div>
      </Conteneur>
    </section>
  );
}
