import type { Metadata } from 'next';
import { Conteneur } from '@/components/ui/Conteneur';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { FilAriane } from '@/components/ui/FilAriane';
import { Bouton } from '@/components/ui/Bouton';
import { TuileInspiration } from '@/components/inspirations/TuileInspiration';
import { PRODUITS } from '@/data/catalogue';

export const metadata: Metadata = {
  title: 'Inspirations',
  description: 'Des intérieurs pensés dans le moindre détail : la sélection Mood Store, en images.',
  alternates: { canonical: '/inspirations' },
};

/** Fait varier la hauteur des tuiles pour un rythme de grille plus vivant, sans librairie de masonry. */
const RATIOS = ['aspect-[4/5]', 'aspect-square', 'aspect-[3/4]', 'aspect-[4/5]', 'aspect-square'];

export default function PageInspirations() {
  return (
    <div className="bg-craie">
      <Conteneur className="pt-8 pb-4 lg:pt-10">
        <FilAriane miettes={[{ libelle: 'Accueil', href: '/' }, { libelle: 'Inspirations' }]} />
      </Conteneur>

      <Conteneur className="py-10 text-center lg:py-14">
        <Eyebrow className="mb-4 justify-center">{`${PRODUITS.length} pièces`}</Eyebrow>
        <h1 className="text-[2rem] font-light tracking-[0.02em] uppercase lg:text-[2.5rem]">
          Inspirations
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-lead text-fumee">
          Des intérieurs pensés dans le moindre détail — la sélection Mood Store, à parcourir et à
          garder de côté.
        </p>
      </Conteneur>

      <Conteneur className="pb-20 lg:pb-28">
        <div className="columns-2 gap-2 sm:columns-3 lg:columns-4">
          {PRODUITS.map((produit, i) => (
            <div key={produit.slug} className="mb-2 break-inside-avoid">
              <TuileInspiration
                produit={produit}
                ratio={RATIOS[i % RATIOS.length]}
                prioritaire={i < 4}
              />
            </div>
          ))}
        </div>
      </Conteneur>

      <Conteneur className="flex flex-col items-center gap-5 border-t border-sable/50 py-20 text-center lg:py-28">
        <h2 className="max-w-lg text-h2">Une pièce vous plaît ?</h2>
        <p className="max-w-md text-lead text-fumee">
          Ajoutez-la à votre moodboard en cliquant sur le cœur, ou parcourez l’ensemble de nos
          collections.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-5">
          <Bouton href="/collections">Voir les collections</Bouton>
          <Bouton href="/compte/moodboards" variante="secondaire">
            Mon moodboard
          </Bouton>
        </div>
      </Conteneur>
    </div>
  );
}
