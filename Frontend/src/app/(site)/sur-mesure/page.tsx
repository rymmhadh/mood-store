import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Accordeon } from '@/components/ui/Accordeon';
import { Bouton } from '@/components/ui/Bouton';
import { Conteneur } from '@/components/ui/Conteneur';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { LienFleche } from '@/components/ui/LienFleche';
import { Revelation, RevelationTexte } from '@/components/ui/Revelation';
import { MODELES } from '@/data/configurateur';
import { NUANCIER } from '@/data/matieres';
import { PRODUITS } from '@/data/catalogue';
import { CarteCatalogue } from '@/components/collections/CarteCatalogue';

export const metadata: Metadata = {
  title: 'Meuble sur mesure à Tunis, l’art du sur-mesure',
  description:
    'Mood Store dessine et fabrique votre mobilier aux dimensions exactes de votre espace : canapés, dressings, bibliothèques, tables, têtes de lit. Atelier à Tunis, délai de 4 à 8 semaines.',
  alternates: { canonical: '/sur-mesure' },
};

const ETAPES = [
  {
    titre: 'La rencontre',
    duree: 'Jour 1',
    texte:
      'En showroom ou chez vous. Nous relevons les cotes, écoutons l’usage réel de la pièce et fixons une enveloppe budgétaire. Aucun dessin n’est lancé avant cette étape.',
    attendu: 'Vos plans si vous en avez, sinon des photos suffisent.',
  },
  {
    titre: 'La conception',
    duree: '5 à 10 jours',
    texte:
      'Nous dessinons la pièce, en élévation et en plan, avec les cotes définitives. Vous recevez un devis ferme et un rendu de proportion.',
    attendu: 'Vos retours sur le dessin. Deux allers-retours sont inclus.',
  },
  {
    titre: 'Le choix des matières',
    duree: '1 séance',
    texte:
      'Vous manipulez les échantillons réels, en lumière du jour et en lumière artificielle. Nous envoyons aussi les échantillons chez vous, gratuitement.',
    attendu: 'La validation du revêtement, de la structure et des finitions.',
  },
  {
    titre: 'La fabrication',
    duree: '4 à 8 semaines',
    texte:
      'La pièce est montée à l’atelier. Vous recevez des photos à chaque étape clé : structure montée, garnissage, tapisserie.',
    attendu: 'Un acompte de 40 % au lancement.',
  },
  {
    titre: 'La livraison',
    duree: '1 journée',
    texte:
      'Livraison, montage sur place et évacuation des emballages. Nous vérifions ensemble avant de repartir.',
    attendu: 'Le solde à la réception.',
  },
];

const QUESTIONS = [
  {
    titre: 'Quel est le budget minimum pour une pièce sur mesure ?',
    contenu:
      'Une assise d’appoint démarre autour de 900 DT, un canapé sur mesure autour de 3 500 DT, un dressing complet autour de 4 500 DT. Le configurateur donne une fourchette immédiate selon vos dimensions et vos matières.',
  },
  {
    titre: 'Quel délai faut-il prévoir ?',
    contenu:
      'De 3 semaines pour une assise simple à 8 semaines pour une composition murale ou un dressing. Le délai annoncé au devis est ferme : nous préférons annoncer large et tenir.',
  },
  {
    titre: 'Intervenez-vous en dehors du Grand Tunis ?',
    contenu:
      'Oui. Livraison et montage sont inclus dans le Grand Tunis et le Sahel. Ailleurs en Tunisie, un forfait de déplacement est chiffré au devis, selon le volume et les conditions d’accès.',
  },
  {
    titre: 'Peut-on modifier le projet en cours de route ?',
    contenu:
      'Avant le lancement en fabrication, oui, sans frais. Après, une modification de dimensions ou de revêtement implique une refabrication partielle, chiffrée au cas par cas.',
  },
  {
    titre: 'Que se passe-t-il si la pièce ne rentre pas ?',
    contenu:
      'Cela n’arrive pas, parce que nous relevons nous-mêmes les cotes d’accès — porte, cage d’escalier, ascenseur — avant de lancer la fabrication. Les grandes pièces sont conçues démontables.',
  },
  {
    titre: 'Quelle garantie sur une pièce sur mesure ?',
    contenu:
      'Deux ans sur la structure et les mécanismes. Au-delà, l’atelier assure la réfection à vie : regarnissage, retapissage, remise en teinte.',
  },
];

export default function PageSurMesure() {
  const surMesure = PRODUITS.filter((p) => p.prixSurDemande).slice(0, 3);
  const apercuMatieres = NUANCIER.filter((m) => m.image).slice(0, 6);

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[80svh] items-center overflow-hidden bg-encre">
        <Image
          src="/images/home/surmesure.webp"
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-encre via-encre/60 to-encre/30" />

        <Conteneur className="relative">
          <Eyebrow className="mb-6 text-bronze">Le sur-mesure</Eyebrow>
          <h1 className="max-w-3xl text-[2.5rem] leading-[1.08] font-extralight text-craie lg:text-[4rem]">
            <RevelationTexte>Le sur-mesure n’est pas un luxe.</RevelationTexte>
            <RevelationTexte index={1}>C’est une méthode.</RevelationTexte>
          </h1>
          <p className="mt-8 max-w-xl text-lead leading-relaxed text-craie/80">
            Nous ne vendons pas un catalogue à faire entrer dans votre maison. Nous partons de
            votre pièce, de ses cotes et de son usage, puis nous dessinons ce qui manque.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Bouton href="/sur-mesure/configurateur" variante="inverse">
              Ouvrir le configurateur
            </Bouton>
            <LienFleche href="/sur-mesure/projet" clair>
              Déposer un projet
            </LienFleche>
          </div>
        </Conteneur>
      </section>

      {/* ── Pourquoi ──────────────────────────────────────────────────── */}
      <section className="bg-craie py-24 lg:py-32">
        <Conteneur>
          <div className="grid gap-12 lg:grid-cols-3">
            {[
              {
                titre: 'L’espace exact',
                texte:
                  'Un canapé de série fait 240 cm. Votre mur en fait 267. Le sur-mesure supprime les 27 cm perdus et les décalages qui sautent aux yeux pendant dix ans.',
              },
              {
                titre: 'La matière choisie',
                texte:
                  'Vous ne composez pas parmi trois coloris imposés, mais dans l’ensemble de notre nuancier — et vous touchez les échantillons avant de décider.',
              },
              {
                titre: 'La pièce unique',
                texte:
                  'Chaque commande est montée à la main, à l’atelier. Personne d’autre n’aura exactement la vôtre, et nous savons la réparer dix ans plus tard.',
              },
            ].map((bloc, i) => (
              <Revelation key={bloc.titre} index={i}>
                <span className="text-[13px] text-bronze tabular-nums">0{i + 1}</span>
                <span aria-hidden className="mt-4 mb-6 block h-px w-full bg-sable/70" />
                <h2 className="text-h3 font-light">{bloc.titre}</h2>
                <p className="mt-4 leading-relaxed text-fumee">{bloc.texte}</p>
              </Revelation>
            ))}
          </div>
        </Conteneur>
      </section>

      {/* ── Les 5 étapes ──────────────────────────────────────────────── */}
      <section className="bg-boucle py-24 lg:py-32">
        <Conteneur>
          <Eyebrow className="mb-4 text-fumee">La méthode</Eyebrow>
          <h2 className="max-w-2xl text-h2">
            <RevelationTexte>Cinq étapes, aucune surprise</RevelationTexte>
          </h2>

          <ol className="mt-16 border-t border-sable/70">
            {ETAPES.map((etape, i) => (
              <li key={etape.titre} className="grid gap-6 border-b border-sable/70 py-10 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-1">
                  <span className="text-[13px] text-bronze tabular-nums">0{i + 1}</span>
                </div>
                <div className="lg:col-span-3">
                  <h3 className="text-h3 font-light">{etape.titre}</h3>
                  <p className="mt-2 text-[13px] text-pierre">{etape.duree}</p>
                </div>
                <p className="leading-relaxed text-fumee lg:col-span-5">{etape.texte}</p>
                <p className="text-[13px] leading-relaxed text-pierre lg:col-span-3">
                  <span className="text-fumee">Ce que nous attendons de vous</span>
                  <br />
                  {etape.attendu}
                </p>
              </li>
            ))}
          </ol>
        </Conteneur>
      </section>

      {/* ── Ce que nous fabriquons ────────────────────────────────────── */}
      <section className="bg-craie py-24 lg:py-32">
        <Conteneur>
          <Eyebrow className="mb-4">Ce que nous fabriquons</Eyebrow>
          <h2 className="mb-14 max-w-2xl text-h2">
            <RevelationTexte>Huit typologies, une seule méthode</RevelationTexte>
          </h2>

          <div className="grid gap-px bg-sable/50 sm:grid-cols-2 lg:grid-cols-4">
            {MODELES.map((m) => (
              <Link
                key={m.id}
                href="/sur-mesure/configurateur"
                className="group bg-craie p-8 transition-colors duration-500 hover:bg-galerie"
              >
                <h3 className="text-h3 font-light">{m.nom}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-pierre">{m.description}</p>
                <span className="mt-6 inline-block text-[13px] text-bronze transition-transform duration-500 ease-[var(--ease-doux)] group-hover:translate-x-1">
                  Configurer →
                </span>
              </Link>
            ))}
          </div>
        </Conteneur>
      </section>

      {/* ── Matières ──────────────────────────────────────────────────── */}
      <section className="bg-craie pb-24 lg:pb-32">
        <Conteneur>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow className="mb-4">Le nuancier</Eyebrow>
              <h2 className="max-w-xl text-h2">
                <RevelationTexte>Touchez avant de décider</RevelationTexte>
              </h2>
            </div>
            <LienFleche href="/sur-mesure/matieres">Voir toutes les matières</LienFleche>
          </div>

          <div className="grid grid-cols-3 gap-2 lg:grid-cols-6">
            {apercuMatieres.map((m) => (
              <Link
                key={m.id}
                href={`/sur-mesure/matieres#${m.id}`}
                className="group relative aspect-square overflow-hidden bg-galerie"
              >
                <Image
                  src={m.image!}
                  alt={m.nom}
                  fill
                  sizes="(max-width: 1024px) 30vw, 15vw"
                  className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-doux)] group-hover:scale-110"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-encre/75 to-transparent p-3 text-[12px] text-craie">
                  {m.nom}
                </span>
              </Link>
            ))}
          </div>
        </Conteneur>
      </section>

      {/* ── Réalisations sur mesure ───────────────────────────────────── */}
      <section className="bg-galerie py-24 lg:py-32">
        <Conteneur>
          <Eyebrow className="mb-4">Pièces réalisées</Eyebrow>
          <h2 className="mb-14 max-w-2xl text-h2">
            <RevelationTexte>Toutes ont commencé par un relevé de cotes</RevelationTexte>
          </h2>
          <div className="grid gap-2 md:grid-cols-3">
            {surMesure.map((p) => (
              <div key={p.slug} className="bg-craie">
                <CarteCatalogue produit={p} />
              </div>
            ))}
          </div>
        </Conteneur>
      </section>

      {/* ── Questions fréquentes ──────────────────────────────────────── */}
      <section className="bg-craie py-24 lg:py-32">
        <Conteneur className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow className="mb-4">Questions fréquentes</Eyebrow>
            <h2 className="text-h2">
              <RevelationTexte>Ce qu’on nous demande</RevelationTexte>
            </h2>
          </div>
          <div className="lg:col-span-8">
            <Accordeon panneaux={QUESTIONS} ouvertParDefaut={0} />
          </div>
        </Conteneur>
      </section>

      {/* ── Appel final ───────────────────────────────────────────────── */}
      <section className="bg-encre py-24 text-center text-craie lg:py-32">
        <Conteneur>
          <h2 className="mx-auto max-w-2xl text-h1 font-extralight">
            <RevelationTexte>Parlons de votre pièce.</RevelationTexte>
          </h2>
          <p className="mx-auto mt-6 max-w-lg leading-relaxed text-craie/75">
            Commencez par le configurateur pour cadrer le budget, ou déposez directement votre
            projet avec vos plans.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            <Bouton href="/sur-mesure/configurateur" variante="inverse">
              Ouvrir le configurateur
            </Bouton>
            <Bouton href="/sur-mesure/projet" variante="secondaire" className="border-craie text-craie hover:bg-craie hover:text-encre">
              Déposer mon projet
            </Bouton>
          </div>
        </Conteneur>
      </section>
    </>
  );
}
