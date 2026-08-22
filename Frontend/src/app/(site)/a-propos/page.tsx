import type { Metadata } from 'next';
import Image from 'next/image';
import { Bouton } from '@/components/ui/Bouton';
import { CompteurAnime } from '@/components/ui/CompteurAnime';
import { Conteneur } from '@/components/ui/Conteneur';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { FilAriane } from '@/components/ui/FilAriane';
import { Revelation, RevelationTexte } from '@/components/ui/Revelation';
import { IconeInstagram } from '@/components/icons';
import { ATELIER_IMAGES } from '@/data/home';
import { COMPTES_INSTAGRAM, SITE } from '@/data/site';

export const metadata: Metadata = {
  title: 'À propos — Mood Store',
  description:
    "Depuis 2018, Mood Store dessine et fabrique du mobilier sur mesure à Tunis et Sousse, sous la direction de sa fondatrice Meriam Mhadhbi.",
  alternates: { canonical: '/a-propos' },
};

type Chiffre =
  | { libelle: string; valeur: number; suffixe?: string }
  /** Valeur déjà formatée (ex. « 12,5 k ») : affichée telle quelle, sans compteur animé. */
  | { libelle: string; texte: string };

const CHIFFRES: Chiffre[] = [
  { valeur: SITE.depuis, libelle: 'Depuis' },
  { valeur: 340, libelle: 'Projets livrés' },
  { valeur: 2, libelle: 'Showrooms' },
  { texte: SITE.abonnes, libelle: 'Abonnés Instagram' },
];

export default function PageAPropos() {
  const fondatrice = COMPTES_INSTAGRAM.find((c) => c.role === 'Fondatrice et designer')!;

  return (
    <div className="bg-craie">
      <Conteneur className="pt-8 pb-4 lg:pt-10">
        <FilAriane miettes={[{ libelle: 'Accueil', href: '/' }, { libelle: 'À propos' }]} />
      </Conteneur>

      <Conteneur className="py-10 text-center lg:py-16">
        <Eyebrow className="mb-4 justify-center">{SITE.nom}</Eyebrow>
        <h1 className="mx-auto max-w-3xl text-[2rem] font-light tracking-[0.01em] lg:text-[2.75rem]">
          <RevelationTexte>{SITE.signature}</RevelationTexte>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lead text-fumee">
          {SITE.bailine} — du dessin d'une pièce unique à l'aménagement complet d'un
          intérieur, à Tunis comme à Sousse.
        </p>
      </Conteneur>

      {/* Chiffres */}
      <Conteneur className="grid grid-cols-2 gap-8 border-y border-sable/50 py-10 lg:grid-cols-4 lg:py-14">
        {CHIFFRES.map((c) => (
          <div key={c.libelle} className="text-center">
            <p className="text-h1 font-light text-encre">
              {'texte' in c ? c.texte : <CompteurAnime valeur={c.valeur} suffixe={c.suffixe ?? ''} />}
            </p>
            <p className="mt-2 text-[13px] text-pierre">{c.libelle}</p>
          </div>
        ))}
      </Conteneur>

      {/* La fondatrice */}
      <Conteneur className="grid gap-12 py-20 lg:grid-cols-12 lg:gap-16 lg:py-28">
        <Revelation className="lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden bg-boucle">
            <Image
              src={fondatrice.image}
              alt={fondatrice.nom}
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover"
            />
          </div>
        </Revelation>

        <Revelation className="flex flex-col justify-center lg:col-span-7" index={1}>
          <Eyebrow className="mb-4 text-encre">La fondatrice</Eyebrow>
          <h2 className="text-h2">{fondatrice.nom}</h2>
          <p className="mt-6 text-lead text-fumee">
            Mood Store est né en {SITE.depuis} de l'envie de dessiner du mobilier qui
            ressemble vraiment aux gens qui l'habitent — plutôt que d'importer des
            collections pensées ailleurs. Chaque pièce sur mesure part d'une conversation :
            l'espace, les usages, les matières qui plaisent, et se dessine à partir de là.
          </p>
          <p className="mt-4 text-lead text-fumee">
            L'atelier a grandi avec les deux showrooms, à Tunis et à Sousse, sans jamais
            quitter cette logique : peu de références, mais chacune pensée pour durer.
          </p>
          <a
            href={fondatrice.url}
            target="_blank"
            rel="noopener noreferrer"
            className="lien-souligne mt-8 inline-flex items-center gap-2 self-start text-[15px]"
          >
            <IconeInstagram className="size-4" strokeWidth={1.5} />
            {fondatrice.handle}
          </a>
        </Revelation>
      </Conteneur>

      {/* Atelier */}
      <div className="bg-blanc py-20 lg:py-28">
        <Conteneur>
          <div className="mb-12 text-center">
            <Eyebrow className="mb-4 justify-center">L'atelier</Eyebrow>
            <h2 className="mx-auto max-w-xl text-h2">Le savoir-faire derrière chaque pièce</h2>
            <p className="mx-auto mt-4 max-w-lg text-lead text-fumee">
              Structure, garnissage, tapisserie et finitions : tout se fabrique et se
              contrôle sur place, pièce par pièce.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {ATELIER_IMAGES.map((src, i) => (
              <Revelation key={src} index={i} className="relative aspect-[3/4] overflow-hidden bg-galerie">
                <Image
                  src={src}
                  alt="L'atelier Mood Store"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </Revelation>
            ))}
          </div>
        </Conteneur>
      </div>

      <Conteneur className="flex flex-col items-center gap-5 py-20 text-center lg:py-28">
        <h2 className="max-w-lg text-h2">Une idée de projet ?</h2>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-5">
          <Bouton href="/sur-mesure/projet">Déposer un projet</Bouton>
          <Bouton href="/showroom" variante="secondaire">
            Visiter un showroom
          </Bouton>
        </div>
      </Conteneur>
    </div>
  );
}
