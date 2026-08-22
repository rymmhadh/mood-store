import type { Metadata } from 'next';
import { Conteneur } from '@/components/ui/Conteneur';
import { FilAriane } from '@/components/ui/FilAriane';
import { Nuancier } from '@/components/surmesure/Nuancier';
import { FormulaireEchantillons } from '@/components/surmesure/FormulaireEchantillons';

export const metadata: Metadata = {
  title: 'Nos matières et finitions, tissus, cuirs, bois, pierres',
  description:
    'Le nuancier de l’atelier Mood Store : bouclé, lin, velours, cuirs pleine fleur, chêne, noyer, laque, marbre et laiton. Échantillons envoyés gratuitement.',
  alternates: { canonical: '/sur-mesure/matieres' },
};

export default function PageMatieres() {
  return (
    <>
      <Conteneur className="pt-8 pb-10 lg:pt-10 lg:pb-14">
        <FilAriane
          miettes={[
            { libelle: 'Accueil', href: '/' },
            { libelle: 'Sur mesure', href: '/sur-mesure' },
            { libelle: 'Nos matières' },
          ]}
        />
        <h1 className="mt-8 text-h1">Nos matières</h1>
        <p className="mt-5 max-w-3xl text-lead leading-relaxed text-fumee">
          Toutes nos pièces se déclinent dans l’ensemble de ce nuancier. Une photo ne rend ni la
          main d’un tissu ni la profondeur d’une laque : demandez les échantillons, nous les
          envoyons gratuitement.
        </p>
      </Conteneur>

      <Nuancier />
      <FormulaireEchantillons />
    </>
  );
}
