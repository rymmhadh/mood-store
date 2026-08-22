import type { Metadata } from 'next';
import { Conteneur } from '@/components/ui/Conteneur';
import { FilAriane } from '@/components/ui/FilAriane';
import { PriseRendezVous } from '@/components/showroom/PriseRendezVous';
import { showroomParSlug } from '@/data/showrooms';

export const metadata: Metadata = {
  title: 'Prendre rendez-vous en showroom',
  description:
    'Réservez un créneau avec un conseiller Mood Store à Tunis ou à Sousse. Les échantillons sont préparés avant votre arrivée.',
  alternates: { canonical: '/showroom/rendez-vous' },
};

interface Props {
  searchParams: Promise<{ showroom?: string }>;
}

export default async function PageRendezVous({ searchParams }: Props) {
  const { showroom } = await searchParams;
  const initial = showroom && showroomParSlug(showroom) ? showroom : undefined;

  return (
    <>
      <Conteneur className="pt-8 pb-4 lg:pt-10">
        <FilAriane
          miettes={[
            { libelle: 'Accueil', href: '/' },
            { libelle: 'Showrooms', href: '/showroom' },
            { libelle: 'Prendre rendez-vous' },
          ]}
        />
        <h1 className="mt-8 text-h1">Prendre rendez-vous</h1>
        <p className="mt-5 max-w-2xl text-lead leading-relaxed text-fumee">
          Un conseiller vous consacre le temps nécessaire, et les échantillons qui vous
          intéressent sont sortis avant votre arrivée. Comptez de 15 minutes à 1 h 30 selon le
          motif de votre visite.
        </p>
      </Conteneur>

      <PriseRendezVous showroomInitial={initial} />
    </>
  );
}
