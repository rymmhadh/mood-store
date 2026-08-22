import type { ReactNode } from 'react';
import { Conteneur } from '@/components/ui/Conteneur';
import { FilAriane } from '@/components/ui/FilAriane';
import { SHOWROOMS_COMPLETS } from '@/data/showrooms';
import { SITE } from '@/data/site';

interface Props {
  titre: string;
  intro: string;
  children?: ReactNode;
}

/**
 * Gabarit commun aux trois pages légales.
 *
 * Contenu volontairement provisoire (§ décision produit) : plutôt qu'un 404
 * ou qu'un texte juridique inventé, une page honnête qui donne déjà les
 * coordonnées réelles de la maison et annonce ce qui manque. À remplacer par
 * les textes définitifs (RNE, CGV complètes, politique de cookies détaillée…)
 * dès qu'ils sont disponibles.
 */
export function PageLegale({ titre, intro, children }: Props) {
  return (
    <div className="bg-blanc">
      <Conteneur className="pt-8 pb-4 lg:pt-10">
        <FilAriane miettes={[{ libelle: 'Accueil', href: '/' }, { libelle: titre }]} />
      </Conteneur>

      <Conteneur className="max-w-3xl py-10 lg:py-14">
        <h1 className="text-[2rem] font-light tracking-[0.02em] uppercase lg:text-[2.5rem]">
          {titre}
        </h1>

        <div className="mt-4 border-l-2 border-bronze/60 bg-galerie py-4 pr-6 pl-5 text-[15px] text-fumee">
          Page en cours de rédaction. Le texte définitif remplacera cette version
          provisoire prochainement.
        </div>

        <p className="mt-8 text-lead text-fumee">{intro}</p>

        {children}

        <div className="mt-14 border-t border-sable/50 pt-8">
          <p className="text-[15px] font-bold">{SITE.nom}</p>
          <p className="mt-2 text-[15px] text-fumee">
            {SHOWROOMS_COMPLETS.map((s) => s.adresseComplete).join(' · ')}
          </p>
          <p className="mt-1 text-[15px] text-fumee">
            {SITE.telephone} · {SITE.email}
          </p>
        </div>
      </Conteneur>
    </div>
  );
}
