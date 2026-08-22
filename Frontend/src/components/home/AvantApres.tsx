import Link from 'next/link';
import { Conteneur } from '@/components/ui/Conteneur';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { LienFleche } from '@/components/ui/LienFleche';
import { Video } from '@/components/media/Video';
import { AVANT_APRES } from '@/data/home';

/**
 * Avant / après — section immersive.
 *
 * La vidéo remplace le comparateur à glissière : c'est le tournage réel du
 * chantier, il montre ce qu'aucun montage de deux photos ne peut montrer —
 * la pièce vide, puis la même pièce livrée, dans la continuité.
 *
 * Elle est en mode `ambiance` : muette, en boucle, et elle se lance seule
 * quand elle entre dans le champ. Aucun son ne surprend le visiteur.
 *
 * Texte en prose plutôt qu'en liste numérotée : le reste du site raconte,
 * il n'énumère pas. Les chiffres et les filets de séparation appartiennent
 * aux pages techniques, pas à une section de présentation.
 */
export function AvantApres() {
  return (
    <section aria-label="Avant et après" className="bg-encre py-24 text-craie lg:py-32">
      <Conteneur className="grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="mx-auto w-full max-w-[24rem] lg:col-span-5 lg:mx-0">
          <Video
            nom="avant-apres"
            titre="Avant et après — Appartement Lac 2, Tunis"
            mode="ambiance"
          />
        </div>

        <div className="lg:col-span-7">
          <Eyebrow className="mb-6 text-craie">Architecture d’intérieur</Eyebrow>

          <h2 className="text-h2 max-w-lg text-craie">La même pièce. Deux vies.</h2>

          <div className="mt-8 max-w-xl space-y-6 text-craie/75">
            <p className="leading-relaxed">
              Ce film suit un chantier du sol brut jusqu’à la remise des clés. Rien n’y est
              simulé : tout ce que vous voyez a été relevé, dessiné, fabriqué à l’atelier,
              puis posé par notre équipe.
            </p>
            <p className="leading-relaxed">
              Nous venons relever les cotes chez vous, y compris les contraintes d’accès que
              personne ne pense à mesurer. Vous recevez les plans et un devis ferme sous dix
              jours. La fabrication démarre à votre validation, et ce sont les mêmes personnes
              qui montent les pièces à l’atelier qui viennent les installer.
            </p>
          </div>

          <div className="mt-11 flex flex-wrap items-center gap-8">
            <Link
              href="/sur-mesure/projet"
              className="flex h-14 items-center bg-craie px-8 libelle-action text-encre transition-colors hover:bg-sable"
            >
              Décrire mon projet
            </Link>
            <LienFleche href="/realisations" clair>
              Toutes nos réalisations
            </LienFleche>
          </div>

          <p className="mt-10 text-[13px] text-craie/45">
            {AVANT_APRES.projet} · {AVANT_APRES.duree}
          </p>
        </div>
      </Conteneur>
    </section>
  );
}
