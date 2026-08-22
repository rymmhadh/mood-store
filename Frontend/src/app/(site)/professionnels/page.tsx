import type { Metadata } from 'next';
import { Bouton } from '@/components/ui/Bouton';
import { Conteneur } from '@/components/ui/Conteneur';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { FilAriane } from '@/components/ui/FilAriane';
import { Revelation } from '@/components/ui/Revelation';
import { lienWhatsApp } from '@/data/site';

export const metadata: Metadata = {
  title: 'Espace professionnel — Architectes, décorateurs, hôtels | Mood Store',
  description:
    'Tarification professionnelle, fichiers techniques et échantillons gratuits pour les architectes, décorateurs, hôtels, restaurants, bureaux et promoteurs.',
  alternates: { canonical: '/professionnels' },
};

const MESSAGE_WHATSAPP =
  'Bonjour, je vous contacte au sujet de l’espace professionnel Mood Store.';

const POUR_QUI = [
  {
    titre: 'Architectes',
    ligne: 'Fiches techniques, délais fiables et un point de contact unique pour vos prescriptions.',
  },
  {
    titre: 'Décorateurs',
    ligne: 'Un nuancier complet et des pièces sur mesure pour habiller chaque projet.',
  },
  {
    titre: 'Hôtels',
    ligne: 'Des volumes de commande importants, fabriqués selon votre planning de chantier.',
  },
  {
    titre: 'Restaurants',
    ligne: 'Un mobilier pensé pour l’usage intensif, dans les matières de votre choix.',
  },
  {
    titre: 'Bureaux',
    ligne: 'Aménagement d’espaces de travail, du poste individuel aux salles de réunion.',
  },
  {
    titre: 'Promoteurs',
    ligne: 'Équipement des espaces communs et des logements témoins, en série ou à l’unité.',
  },
];

const AVANTAGES = [
  'Tarification professionnelle sur l’ensemble du catalogue',
  'Accès aux fichiers techniques : plans, blocs 3D et fiches matières',
  'Échantillons envoyés gracieusement pour vos prescriptions',
  'Un interlocuteur dédié pour le suivi de vos projets',
  'Délais de fabrication prioritaires',
  'Showroom privatisable pour vos rendez-vous clients',
];

const ETAPES = [
  {
    numero: '01',
    titre: 'Vous nous contactez',
    texte: 'Par WhatsApp ou par e-mail, en précisant votre secteur d’activité et vos besoins.',
  },
  {
    numero: '02',
    titre: 'Nous échangeons',
    texte: 'Un conseiller qualifie votre demande et vous présente les conditions professionnelles.',
  },
  {
    numero: '03',
    titre: 'Vous commandez au tarif pro',
    texte: 'Accès à la tarification professionnelle, aux fichiers techniques et aux échantillons.',
  },
];

export default function PageProfessionnels() {
  return (
    <div className="bg-craie">
      <Conteneur className="pt-8 pb-4 lg:pt-10">
        <FilAriane miettes={[{ libelle: 'Accueil', href: '/' }, { libelle: 'Professionnels' }]} />
      </Conteneur>

      {/* Hero sombre */}
      <div className="bg-encre">
        <Conteneur className="flex flex-col items-center gap-6 py-24 text-center text-craie lg:py-32">
          <Eyebrow className="justify-center text-craie/60">Espace professionnel</Eyebrow>
          <h1 className="max-w-2xl text-[2rem] font-light tracking-[0.01em] lg:text-[2.75rem]">
            Nous travaillons avec ceux qui dessinent.
          </h1>
          <p className="max-w-lg text-lead text-craie/75">
            Architectes, décorateurs, hôtels, restaurants, bureaux, promoteurs : un accompagnement
            dédié pour vos commandes récurrentes et vos projets d’envergure.
          </p>
          <Bouton href={lienWhatsApp(MESSAGE_WHATSAPP)} externe variante="inverse" className="mt-2">
            Demander un accès professionnel
          </Bouton>
        </Conteneur>
      </div>

      {/* Pour qui */}
      <Conteneur className="py-20 lg:py-28">
        <div className="mb-12 text-center">
          <Eyebrow className="mb-4 justify-center">Pour qui</Eyebrow>
          <h2 className="mx-auto max-w-lg text-h2">Un espace pensé pour vos métiers</h2>
        </div>

        <div className="grid gap-px overflow-hidden border border-sable/50 bg-sable/50 sm:grid-cols-2 lg:grid-cols-3">
          {POUR_QUI.map((item, i) => (
            <Revelation key={item.titre} index={i} className="bg-craie p-8">
              <p className="text-h3 font-light">{item.titre}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-fumee">{item.ligne}</p>
            </Revelation>
          ))}
        </div>
      </Conteneur>

      {/* Avantages */}
      <div className="bg-blanc py-20 lg:py-28">
        <Conteneur className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Eyebrow className="mb-4 text-encre">Les avantages</Eyebrow>
            <h2 className="text-h2">Ce que change le statut professionnel</h2>
          </div>
          <div className="lg:col-span-8">
            <ul className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
              {AVANTAGES.map((avantage) => (
                <li key={avantage} className="flex gap-3 text-[16px] leading-relaxed text-fumee">
                  <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-bronze" />
                  {avantage}
                </li>
              ))}
            </ul>
          </div>
        </Conteneur>
      </div>

      {/* Comment ça marche */}
      <Conteneur className="py-20 lg:py-28">
        <div className="mb-12 text-center">
          <Eyebrow className="mb-4 justify-center">Comment ça marche</Eyebrow>
          <h2 className="mx-auto max-w-lg text-h2">Trois étapes, sans complication</h2>
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          {ETAPES.map((etape, i) => (
            <Revelation key={etape.numero} index={i} className="text-center sm:text-left">
              <p className="text-[13px] text-bronze">{etape.numero}</p>
              <p className="mt-3 text-h3 font-light">{etape.titre}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-fumee">{etape.texte}</p>
            </Revelation>
          ))}
        </div>
      </Conteneur>

      {/* CTA final */}
      <Conteneur className="flex flex-col items-center gap-5 border-t border-sable/50 py-20 text-center lg:py-28">
        <h2 className="max-w-lg text-h2">Prêt à collaborer avec nous ?</h2>
        <p className="max-w-md text-lead text-fumee">
          Écrivez-nous en précisant votre secteur d’activité : nous revenons vers vous rapidement.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-5">
          <Bouton href={lienWhatsApp(MESSAGE_WHATSAPP)} externe>
            Demander un accès professionnel
          </Bouton>
          <Bouton href="/contact" variante="secondaire">
            Nous écrire
          </Bouton>
        </div>
      </Conteneur>
    </div>
  );
}
