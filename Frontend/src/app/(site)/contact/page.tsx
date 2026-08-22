import type { Metadata } from 'next';
import Link from 'next/link';
import { Accordeon } from '@/components/ui/Accordeon';
import { Carte } from '@/components/ui/Carte';
import { Conteneur } from '@/components/ui/Conteneur';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { FilAriane } from '@/components/ui/FilAriane';
import { FormulaireContact } from '@/components/contact/FormulaireContact';
import { TitreBloc } from '@/components/surmesure/Champ';
import { IconeInstagram, IconeLieu, IconeWhatsApp } from '@/components/icons';
import { SHOWROOMS_COMPLETS, heureFr, JOURS } from '@/data/showrooms';
import { SITE, lienWhatsApp } from '@/data/site';

export const metadata: Metadata = {
  title: 'Contact — Mood Store Tunis & Sousse',
  description:
    'Écrivez-nous, appelez-nous au 51 953 889 ou passez au showroom de La Soukra ou de Sousse. Réponse sous 24 heures ouvrées.',
  alternates: { canonical: '/contact' },
};

const QUESTIONS = [
  {
    titre: 'Sous quel délai répondez-vous ?',
    contenu:
      'Sous 24 heures ouvrées pour un message, sous 48 heures pour un devis chiffré. Par téléphone et sur WhatsApp, quelqu’un répond pendant les horaires du showroom.',
  },
  {
    titre: 'Faut-il prendre rendez-vous pour venir ?',
    contenu:
      'Non, les showrooms sont ouverts librement. Mais pour un projet sur mesure ou un aménagement complet, le rendez-vous garantit qu’un conseiller vous consacre le temps nécessaire et que les échantillons soient sortis.',
  },
  {
    titre: 'Livrez-vous partout en Tunisie ?',
    contenu:
      'Livraison et montage sont inclus dans le Grand Tunis et le Sahel. Ailleurs, un forfait de déplacement est chiffré au devis selon le volume et les conditions d’accès.',
  },
  {
    titre: 'Comment se passe un service après-vente ?',
    contenu:
      'Envoyez-nous une photo par WhatsApp avec votre numéro de commande. L’atelier assure la réfection à vie : regarnissage, retapissage, remise en teinte. La garantie couvre deux ans la structure et les mécanismes.',
  },
];

export default function PageContact() {
  const tunis = SHOWROOMS_COMPLETS[0];

  return (
    /* Fond blanc sur toute la page : un formulaire se remplit sur du blanc.
       Le crème reste la couleur des pages éditoriales. */
    <div className="bg-blanc">
      <Conteneur className="pt-8 pb-4 lg:pt-10">
        <FilAriane miettes={[{ libelle: 'Accueil', href: '/' }, { libelle: 'Contact' }]} />
      </Conteneur>

      <Conteneur className="py-10 text-center lg:py-14">
        <h1 className="text-[2rem] font-light tracking-[0.02em] uppercase lg:text-[2.5rem]">
          Nous contacter
        </h1>
      </Conteneur>

      <Conteneur className="grid gap-14 pb-24 lg:grid-cols-12 lg:gap-20">
        {/* Formulaire */}
        <div className="lg:col-span-7">
          <FormulaireContact />
        </div>

        {/* Accès directs */}
        <aside className="lg:col-span-5">
          <TitreBloc className="lg:text-right">Vous pouvez aussi nous joindre</TitreBloc>

          <div className="mt-8 space-y-5">
            <div className="border border-trait p-7">
              <p className="text-[16px] font-bold">Par téléphone</p>
              <a
                href={`tel:${SITE.telephoneBrut}`}
                className="lien-souligne mt-3 inline-block text-[22px]"
              >
                {SITE.telephone}
              </a>
              <p className="mt-3 text-[14px] text-pierre">Du lundi au samedi, 9h – 19h</p>
            </div>

            <div className="border border-trait p-7">
              <p className="text-[16px] font-bold">Sur WhatsApp</p>
              <a
                href={lienWhatsApp('Bonjour, je vous contacte depuis votre site.')}
                target="_blank"
                rel="noopener noreferrer"
                className="lien-souligne mt-3 inline-flex items-center gap-2 text-[15px]"
              >
                <IconeWhatsApp className="size-4" strokeWidth={1.5} />
                Ouvrir une conversation
              </a>
              <p className="mt-3 text-[14px] text-pierre">
                Le plus rapide pour une photo ou une question courte.
              </p>
            </div>

            <div className="border border-trait p-7">
              <p className="text-[16px] font-bold">Par e-mail</p>
              <a href={`mailto:${SITE.email}`} className="lien-souligne mt-3 inline-block text-[15px]">
                {SITE.email}
              </a>
              <p className="mt-3 text-[14px] text-pierre">Réponse sous 24 heures ouvrées.</p>
            </div>

            <div className="border border-trait p-7">
              <p className="text-[16px] font-bold">Sur Instagram</p>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="lien-souligne mt-3 inline-flex items-center gap-2 text-[15px]"
              >
                <IconeInstagram className="size-4" strokeWidth={1.5} />
                {SITE.instagramHandle}
              </a>
              <p className="mt-3 text-[14px] text-pierre">{SITE.abonnes} abonnés</p>
            </div>

            {/* Showrooms */}
            {SHOWROOMS_COMPLETS.map((s) => (
              <div key={s.slug} className="border border-trait p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[16px] font-bold">{s.nom}</p>
                    <p className="mt-2 flex items-start gap-2 text-[15px] text-fumee">
                      <IconeLieu className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} />
                      {s.adresseComplete}
                    </p>
                  </div>
                  <Link href={`/showroom/${s.slug}`} className="lien-souligne shrink-0 text-[14px]">
                    Voir
                  </Link>
                </div>

                <dl className="mt-5 space-y-1 text-[14px]">
                  {s.horaires.map((plage, i) => (
                    <div key={JOURS[i]} className="flex justify-between gap-4">
                      <dt className="text-pierre">{JOURS[i]}</dt>
                      <dd className={plage ? 'text-fumee' : 'text-pierre'}>
                        {plage ? `${heureFr(plage.ouverture)} – ${heureFr(plage.fermeture)}` : 'Fermé'}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </aside>
      </Conteneur>

      <Carte
        latitude={tunis.latitude}
        longitude={tunis.longitude}
        titre={tunis.nom}
        className="h-[24rem] w-full bg-galerie lg:h-[30rem]"
      />

      <Conteneur className="grid gap-14 py-24 lg:grid-cols-12 lg:py-32">
        <div className="lg:col-span-4">
          <Eyebrow className="mb-4 text-encre">Questions fréquentes</Eyebrow>
          <h2 className="text-h2">Avant de nous écrire</h2>
        </div>
        <div className="lg:col-span-8">
          <Accordeon panneaux={QUESTIONS} ouvertParDefaut={0} />
        </div>
      </Conteneur>
    </div>
  );
}
