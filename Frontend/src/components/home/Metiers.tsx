'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { METIERS } from '@/data/home';
import { cn } from '@/lib/cn';

/**
 * Les trois métiers (§6 section 2).
 * Au survol d'une colonne, les deux autres se désaturent et s'assombrissent :
 * effet de mise au point, signature Poliform.
 */
export function Metiers() {
  const [survole, setSurvole] = useState<number | null>(null);

  return (
    <section aria-label="Nos trois métiers" className="grid lg:grid-cols-3">
      {METIERS.map((metier, i) => {
        const estAttenue = survole !== null && survole !== i;

        return (
          <Link
            key={metier.titre}
            href={metier.href}
            onMouseEnter={() => setSurvole(i)}
            onMouseLeave={() => setSurvole(null)}
            onFocus={() => setSurvole(i)}
            onBlur={() => setSurvole(null)}
            className="group relative block h-[60vh] overflow-hidden bg-encre lg:h-[70vh]"
          >
            <Image
              src={metier.image}
              alt={metier.titre}
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className={cn(
                'object-cover transition-all duration-[800ms] ease-[var(--ease-doux)]',
                'group-hover:scale-105',
                estAttenue && 'scale-100 opacity-45 saturate-[0.4]',
              )}
            />

            <div
              className={cn(
                'absolute inset-0 bg-gradient-to-t from-encre/80 via-encre/25 to-transparent',
                'transition-opacity duration-500',
                estAttenue && 'opacity-90',
              )}
            />

            <div className="absolute inset-x-0 bottom-0 p-8 lg:p-10">
              <h2 className="text-h3 font-light text-craie transition-transform duration-500 ease-[var(--ease-doux)] group-hover:-translate-y-2">
                {metier.titre}
              </h2>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-craie/75">
                {metier.ligne}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 libelle-action text-craie">
                <span aria-hidden className="transition-transform duration-500 ease-[var(--ease-doux)] group-hover:translate-x-1">
                  ›
                </span>
                <span className="lien-souligne">{metier.cta}</span>
                <span className="text-bronze">+</span>
              </span>
            </div>
          </Link>
        );
      })}
    </section>
  );
}
