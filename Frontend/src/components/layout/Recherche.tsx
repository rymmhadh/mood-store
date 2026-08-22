'use client';

import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { IconeFermer, IconeRecherche } from '@/components/icons';
import { PRODUITS } from '@/data/catalogue';
import { DUREE, EASE_DOUX } from '@/lib/motion';
import { useTouche } from '@/hooks/useTouche';
import { useVerrouScroll } from '@/hooks/useVerrouScroll';

interface Props {
  ouvert: boolean;
  onFermer: () => void;
}

const SUGGESTIONS = [
  'canapé bouclé',
  'dressing sur mesure',
  'table à manger bois',
  'tête de lit',
  'fauteuil beige',
];

/** Normalise pour une recherche insensible aux accents et à la casse (§17.3). */
const normaliser = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

/**
 * Superposition de recherche (Ctrl/Cmd + K).
 * Filtrage local pour la maquette ; sera remplacé par un appel Meilisearch
 * sur `/api/recherche` avec analyse d'intention (§17.3).
 */
export function Recherche({ ouvert, onFermer }: Props) {
  const [requete, setRequete] = useState('');
  const champ = useRef<HTMLInputElement>(null);

  useVerrouScroll(ouvert);
  useTouche('Escape', onFermer, ouvert);

  useEffect(() => {
    if (ouvert) {
      const t = setTimeout(() => champ.current?.focus(), 260);
      return () => clearTimeout(t);
    }
    setRequete('');
  }, [ouvert]);

  const resultats = useMemo(() => {
    const q = normaliser(requete.trim());
    if (q.length < 2) return [];

    const mots = q.split(/\s+/);
    return PRODUITS.filter((p) => {
      const champs = normaliser(`${p.nom} ${p.type} ${p.collection} ${p.matieres.join(' ')} ${p.styles.join(' ')}`);
      return mots.every((mot) => champs.includes(mot));
    }).slice(0, 6);
  }, [requete]);

  const aCherche = requete.trim().length >= 2;

  return (
    <AnimatePresence>
      {ouvert && (
        <motion.div
          key="recherche"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DUREE.rapide }}
          className="fixed inset-0 z-90 bg-craie/97 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-label="Recherche"
        >
          <div className="conteneur flex h-24 items-center justify-end">
            <button
              type="button"
              onClick={onFermer}
              aria-label="Fermer la recherche"
              className="flex items-center gap-3 libelle-action transition-opacity hover:opacity-60"
            >
              Fermer
              <IconeFermer className="size-5" />
            </button>
          </div>

          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: DUREE.base, ease: EASE_DOUX, delay: 0.08 }}
            className="conteneur"
          >
            <div className="flex items-center gap-4 border-b border-sable pb-6">
              <IconeRecherche className="size-7 shrink-0 text-pierre" />
              <input
                ref={champ}
                type="search"
                value={requete}
                onChange={(e) => setRequete(e.target.value)}
                placeholder="Que cherchez-vous ?"
                aria-label="Rechercher un produit"
                className="w-full bg-transparent text-2xl font-light outline-none placeholder:text-pierre/60 lg:text-4xl"
              />
            </div>

            {!aCherche && (
              <div className="mt-12 grid gap-12 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <p className="eyebrow mb-5 text-pierre">Recherches fréquentes</p>
                  <ul className="space-y-3">
                    {SUGGESTIONS.map((s) => (
                      <li key={s}>
                        <button
                          type="button"
                          onClick={() => setRequete(s)}
                          className="lien-souligne text-lg font-light text-fumee transition-colors hover:text-encre"
                        >
                          {s}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="lg:col-span-8">
                  <p className="eyebrow mb-5 text-pierre">Suggestions</p>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {PRODUITS.slice(0, 4).map((p) => (
                      <Link
                        key={p.slug}
                        href={`/produit/${p.slug}`}
                        onClick={onFermer}
                        className="group"
                      >
                        <div className="relative aspect-[4/5] overflow-hidden bg-boucle">
                          <Image
                            src={p.images[0]}
                            alt={p.nom}
                            fill
                            sizes="(max-width: 640px) 45vw, 18vw"
                            className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-doux)] group-hover:scale-105"
                          />
                        </div>
                        <p className="mt-3 text-[15px]">{p.nom}</p>
                        <p className="text-sm text-pierre">{p.type}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {aCherche && (
              <div className="mt-12">
                <p className="eyebrow mb-5 text-pierre">
                  {resultats.length} résultat{resultats.length > 1 ? 's' : ''}
                </p>

                {resultats.length > 0 ? (
                  <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
                    {resultats.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/produit/${p.slug}`}
                        onClick={onFermer}
                        className="group"
                      >
                        <div className="relative aspect-[4/5] overflow-hidden bg-boucle">
                          <Image
                            src={p.images[0]}
                            alt={p.nom}
                            fill
                            sizes="(max-width: 640px) 45vw, 15vw"
                            className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-doux)] group-hover:scale-105"
                          />
                        </div>
                        <p className="mt-3 text-[15px]">{p.nom}</p>
                        <p className="text-sm text-pierre">{p.type}</p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  /* Jamais de page vide : on redirige vers le sur-mesure (§17.3) */
                  <div className="max-w-xl">
                    <p className="text-h3 font-light">
                      Nous ne trouvons pas cette pièce — mais nous pouvons la fabriquer.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-4">
                      <Link
                        href="/sur-mesure/configurateur"
                        onClick={onFermer}
                        className="lien-souligne libelle-action"
                      >
                        Ouvrir le configurateur
                      </Link>
                      <Link
                        href="/contact"
                        onClick={onFermer}
                        className="lien-souligne libelle-action text-pierre"
                      >
                        Nous décrire votre besoin
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
