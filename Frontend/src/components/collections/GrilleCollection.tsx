'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Conteneur } from '@/components/ui/Conteneur';
import { CarteCatalogue } from './CarteCatalogue';
import { FILTRES_VIDES, nombreFiltres, PanneauFiltres, type Filtres } from './PanneauFiltres';
import { IconeChevron, IconeFermer } from '@/components/icons';
import type { Coloris, ProduitCatalogue } from '@/data/catalogue';
import { cn } from '@/lib/cn';

type Tri = 'pertinence' | 'nouveautes' | 'prix-croissant' | 'prix-decroissant' | 'nom';

const TRIS: { valeur: Tri; libelle: string }[] = [
  { valeur: 'pertinence', libelle: 'Pertinence' },
  { valeur: 'nouveautes', libelle: 'Nouveautés' },
  { valeur: 'prix-croissant', libelle: 'Prix croissant' },
  { valeur: 'prix-decroissant', libelle: 'Prix décroissant' },
  { valeur: 'nom', libelle: 'Nom A → Z' },
];

/** Un produit « prix sur demande » est classé en fin de tri par prix. */
const prixTri = (p: ProduitCatalogue) => p.prix ?? Number.MAX_SAFE_INTEGER;

interface Props {
  produits: ProduitCatalogue[];
  matieres: string[];
  styles: string[];
  coloris: Coloris[];
}

/**
 * Grille de catalogue avec barre d'outils.
 *
 * Le filtrage est fait côté client sur le jeu complet de la famille : les
 * volumes le permettent et la réponse est instantanée. Au branchement de
 * l'API, ce composant passera les filtres en paramètres de requête et la
 * pagination arrivera par curseur.
 */
export function GrilleCollection({ produits, matieres, styles, coloris }: Props) {
  const [filtresOuverts, setFiltresOuverts] = useState(false);
  const [triOuvert, setTriOuvert] = useState(false);
  const [filtres, setFiltres] = useState<Filtres>(FILTRES_VIDES);
  const [tri, setTri] = useState<Tri>('pertinence');

  const resultats = useMemo(() => {
    const filtres_ = produits.filter((p) => {
      const okMatiere =
        filtres.matieres.length === 0 || filtres.matieres.some((m) => p.matieres.includes(m));
      const okCouleur =
        filtres.couleurs.length === 0 || filtres.couleurs.some((c) => p.colorisIds.includes(c));
      const okStyle =
        filtres.styles.length === 0 || filtres.styles.some((s) => p.styles.includes(s));
      return okMatiere && okCouleur && okStyle;
    });

    const trie = [...filtres_];
    switch (tri) {
      case 'nouveautes':
        trie.sort((a, b) => Number(b.nouveaute ?? false) - Number(a.nouveaute ?? false));
        break;
      case 'prix-croissant':
        trie.sort((a, b) => prixTri(a) - prixTri(b));
        break;
      case 'prix-decroissant':
        trie.sort((a, b) => prixTri(b) - prixTri(a));
        break;
      case 'nom':
        trie.sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
        break;
    }
    return trie;
  }, [produits, filtres, tri]);

  const actifs = nombreFiltres(filtres);

  return (
    <>
      {/* ── Barre d'outils ──────────────────────────────────────────── */}
      <Conteneur className="flex flex-wrap items-center gap-x-10 gap-y-4 border-b border-sable/60 py-6">
        <button
          type="button"
          onClick={() => setFiltresOuverts(true)}
          className="group flex items-center gap-3 text-[17px] transition-opacity hover:opacity-60"
        >
          Filtrer
          <svg viewBox="0 0 20 20" className="size-5" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
            <path d="M3 6h9M15 6h2M3 14h4M10 14h7" />
            <circle cx="13.5" cy="6" r="1.6" />
            <circle cx="8.5" cy="14" r="1.6" />
          </svg>
          {actifs > 0 && (
            <span className="flex size-6 items-center justify-center rounded-full bg-encre text-[12px] text-craie">
              {actifs}
            </span>
          )}
        </button>

        {/* Tri */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setTriOuvert((v) => !v)}
            aria-expanded={triOuvert}
            className="flex items-center gap-3 text-[17px] transition-opacity hover:opacity-60"
          >
            {TRIS.find((t) => t.valeur === tri)!.libelle}
            <IconeChevron
              className={cn('size-4 rotate-90 transition-transform duration-300', triOuvert && '-rotate-90')}
              strokeWidth={1.5}
            />
          </button>

          {triOuvert && (
            <>
              <button
                type="button"
                aria-hidden
                tabIndex={-1}
                onClick={() => setTriOuvert(false)}
                className="fixed inset-0 z-10 cursor-default"
              />
              <ul className="absolute top-full left-0 z-20 mt-3 min-w-[15rem] border border-sable/60 bg-craie py-2 shadow-[0_20px_50px_-24px_rgba(10,10,10,0.4)]">
                {TRIS.map((t) => (
                  <li key={t.valeur}>
                    <button
                      type="button"
                      onClick={() => {
                        setTri(t.valeur);
                        setTriOuvert(false);
                      }}
                      className={cn(
                        'block w-full px-5 py-2.5 text-left text-[15px] transition-colors hover:bg-galerie',
                        t.valeur === tri ? 'text-encre' : 'text-pierre',
                      )}
                    >
                      {t.libelle}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <p className="ml-auto text-[17px] text-fumee">
          {resultats.length} produit{resultats.length > 1 ? 's' : ''}
        </p>
      </Conteneur>

      {/* Filtres actifs, supprimables un à un */}
      {actifs > 0 && (
        <Conteneur className="flex flex-wrap items-center gap-2 pt-5">
          {(
            [
              ...filtres.matieres.map((v) => ({ groupe: 'matieres' as const, valeur: v, libelle: v })),
              ...filtres.couleurs.map((v) => ({
                groupe: 'couleurs' as const,
                valeur: v,
                libelle: coloris.find((c) => c.id === v)?.nom ?? v,
              })),
              ...filtres.styles.map((v) => ({ groupe: 'styles' as const, valeur: v, libelle: v })),
            ]
          ).map((puce) => (
            <button
              key={`${puce.groupe}-${puce.valeur}`}
              type="button"
              onClick={() =>
                setFiltres({
                  ...filtres,
                  [puce.groupe]: filtres[puce.groupe].filter((v) => v !== puce.valeur),
                })
              }
              className="flex items-center gap-2 border border-sable px-4 py-2 text-[13px] text-fumee transition-colors hover:border-encre hover:text-encre"
            >
              {puce.libelle}
              <IconeFermer className="size-3.5" strokeWidth={1.6} />
            </button>
          ))}
          <button
            type="button"
            onClick={() => setFiltres(FILTRES_VIDES)}
            className="lien-souligne ml-2 text-[13px] text-pierre"
          >
            Tout effacer
          </button>
        </Conteneur>
      )}

      {/* ── Grille ──────────────────────────────────────────────────── */}
      <Conteneur className="py-8 lg:py-10">
        {resultats.length > 0 ? (
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {resultats.map((p, i) => (
              <CarteCatalogue key={p.slug} produit={p} coloris={coloris} prioritaire={i < 3} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[22rem] flex-col items-center justify-center bg-galerie px-8 py-20 text-center">
            <p className="max-w-md text-h3 font-light">
              Aucune pièce ne correspond à ces critères — mais nous pouvons la fabriquer.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
              <Link
                href="/sur-mesure/configurateur"
                className="inline-flex h-14 items-center bg-encre px-8 libelle-action text-craie transition-colors hover:bg-fumee"
              >
                Ouvrir le configurateur
              </Link>
              <button
                type="button"
                onClick={() => setFiltres(FILTRES_VIDES)}
                className="lien-souligne libelle-action"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        )}
      </Conteneur>

      <PanneauFiltres
        ouvert={filtresOuverts}
        filtres={filtres}
        resultats={resultats.length}
        matieres={matieres}
        styles={styles}
        coloris={coloris}
        onChange={setFiltres}
        onFermer={() => setFiltresOuverts(false)}
      />
    </>
  );
}
