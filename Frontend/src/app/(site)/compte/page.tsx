import type { Metadata } from 'next';
import { Bouton } from '@/components/ui/Bouton';
import { Conteneur } from '@/components/ui/Conteneur';
import { FilAriane } from '@/components/ui/FilAriane';
import { LienFleche } from '@/components/ui/LienFleche';
import { IconeCompte } from '@/components/icons';
import { lienWhatsApp } from '@/data/site';

export const metadata: Metadata = {
  title: 'Mon compte — Mood Store',
  description: "L'espace client Mood Store arrive bientôt.",
  robots: { index: false },
};

/**
 * Espace client — pas encore de connexion (§ pas de back-end d'authentification
 * pour l'instant). Plutôt qu'un 404, une page honnête qui explique où on en
 * est et qui redirige vers ce qui fonctionne déjà : les favoris enregistrés
 * dans le navigateur, ou une prise de contact directe.
 */
export default function PageCompte() {
  return (
    <div className="bg-blanc">
      <Conteneur className="pt-8 pb-4 lg:pt-10">
        <FilAriane miettes={[{ libelle: 'Accueil', href: '/' }, { libelle: 'Mon compte' }]} />
      </Conteneur>

      <Conteneur className="flex flex-col items-center px-6 py-20 text-center lg:py-28">
        <span className="flex size-16 items-center justify-center rounded-full bg-galerie text-encre">
          <IconeCompte className="size-7" strokeWidth={1.5} />
        </span>

        <h1 className="mt-8 text-[2rem] font-light tracking-[0.02em] uppercase lg:text-[2.5rem]">
          L'espace client arrive bientôt
        </h1>

        <p className="mt-5 max-w-lg text-lead text-fumee">
          Suivi de devis, historique de projets et échantillons demandés depuis un même
          espace : cette partie du site est en préparation. En attendant, deux choses
          fonctionnent déjà — vos pièces enregistrées, et une ligne directe avec l'atelier.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
          <Bouton href={lienWhatsApp('Bonjour, je vous contacte depuis votre site.')} externe>
            Nous écrire sur WhatsApp
          </Bouton>
          <LienFleche href="/compte/moodboards">Voir mes pièces enregistrées</LienFleche>
        </div>
      </Conteneur>
    </div>
  );
}
