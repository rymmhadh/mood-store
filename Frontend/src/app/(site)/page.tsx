import { Fragment, type ReactNode } from 'react';
import {
  Atelier,
  AvantApres,
  Hero,
  Instagram,
  Journal,
  Metiers,
  RailCollections,
  Realisations,
  Showrooms,
  SurMesure,
  Temoignages,
} from '@/components/home';
import {
  chargerDiaposHero,
  chargerMediasAccueil,
  chargerSectionsAccueil,
  fondSurMesure,
  photosAtelier,
  photosInstagram,
} from '@/lib/contenu';

export const revalidate = 300;

/**
 * Page d'accueil Mood Store.
 *
 * L'ordre des sections suit la progression émotionnelle décrite au §1.3 :
 * saisissement → curiosité → désir → confiance → projection → engagement.
 * C'est l'ordre d'origine, et le repli si l'API est indisponible.
 *
 * Chaque section peut désormais être masquée ou réordonnée depuis le
 * back-office (module « Contenu », §19.5.1) — cette page ne fait plus que
 * lire cette configuration et injecter les bonnes photos dans les sections
 * qui en dépendent.
 */
export default async function Accueil() {
  const [cles, medias] = await Promise.all([chargerSectionsAccueil(), chargerMediasAccueil()]);
  const diapos = await chargerDiaposHero(medias);

  const sections: Record<string, ReactNode> = {
    hero: <Hero diapos={diapos} />,
    metiers: <Metiers />,
    'rail-collections': <RailCollections />,
    'sur-mesure': <SurMesure image={fondSurMesure(medias)} />,
    'avant-apres': <AvantApres />,
    realisations: <Realisations />,
    atelier: <Atelier images={photosAtelier(medias)} />,
    showrooms: <Showrooms />,
    temoignages: <Temoignages />,
    journal: <Journal />,
    instagram: <Instagram photos={photosInstagram(medias)} />,
  };

  return (
    <>
      {cles.map((cle) => (
        <Fragment key={cle}>{sections[cle] ?? null}</Fragment>
      ))}
    </>
  );
}
