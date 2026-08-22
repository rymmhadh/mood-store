import type { Metadata } from 'next';
import { Conteneur } from '@/components/ui/Conteneur';
import { FilAriane } from '@/components/ui/FilAriane';
import { FormulaireProjet } from '@/components/surmesure/FormulaireProjet';

export const metadata: Metadata = {
  title: 'Déposer un projet sur mesure, architecte d’intérieur Tunis',
  description:
    'Envoyez vos plans et vos photos, décrivez votre projet : un conseiller Mood Store vous répond sous 48 heures avec une première étude.',
  alternates: { canonical: '/sur-mesure/projet' },
};

export default function PageProjet() {
  return (
    <>
      <Conteneur className="pt-8 pb-4 lg:pt-10">
        <FilAriane
          miettes={[
            { libelle: 'Accueil', href: '/' },
            { libelle: 'Sur mesure', href: '/sur-mesure' },
            { libelle: 'Déposer un projet' },
          ]}
        />
        <h1 className="mt-8 text-h1">Votre projet</h1>
        <p className="mt-5 max-w-2xl text-lead leading-relaxed text-fumee">
          Quatre questions, deux minutes. Un conseiller vous répond sous 48 heures ouvrées avec
          une première orientation et une fourchette budgétaire.
        </p>
      </Conteneur>

      <FormulaireProjet />
    </>
  );
}
