import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Conteneur } from '@/components/ui/Conteneur';
import { CompteurAnime } from '@/components/ui/CompteurAnime';
import { FilAriane } from '@/components/ui/FilAriane';
import { REALISATIONS } from '@/data/home';
import { SITE } from '@/data/site';

export const metadata: Metadata = {
  title: 'Nos réalisations',
  description: 'Des espaces livrés par Mood Store à Tunis, La Marsa et Sousse — pas des rendus.',
  alternates: { canonical: '/realisations' },
};

export default function PageRealisations() {
  return (
    <div className="bg-craie">
      <Conteneur className="pt-8 pb-4 lg:pt-10">
        <FilAriane miettes={[{ libelle: 'Accueil', href: '/' }, { libelle: 'Réalisations' }]} />
      </Conteneur>

      <Conteneur className="py-10 text-center lg:py-16">
        <h1 className="text-[2rem] font-light tracking-[0.02em] uppercase lg:text-[2.5rem]">
          Nos réalisations
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lead text-fumee">
          Des espaces livrés, pas des rendus. Chaque projet mêle pièces de collection et
          mobilier sur mesure, dessiné pour le lieu.
        </p>
        <p className="mt-6 text-h3 font-light text-encre">
          <CompteurAnime valeur={340} suffixe=" projets livrés" /> depuis {SITE.depuis}
        </p>
      </Conteneur>

      <Conteneur className="grid gap-10 pb-24 sm:grid-cols-2 lg:grid-cols-3 lg:pb-32">
        {REALISATIONS.map((projet) => (
          <Link key={projet.slug} href={`/realisations/${projet.slug}`} className="group block">
            <div className="relative aspect-[4/5] overflow-hidden bg-boucle">
              <Image
                src={projet.image}
                alt={`${projet.titre} — ${projet.ville}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-doux)] group-hover:scale-[1.04]"
              />
              <span className="eyebrow absolute bottom-0 left-0 translate-y-full bg-craie px-4 py-3 text-encre transition-transform duration-500 ease-[var(--ease-doux)] group-hover:translate-y-0">
                Voir le projet
              </span>
            </div>
            <div className="mt-5">
              <h2 className="text-h3 font-light">
                <span className="lien-souligne">{projet.titre}</span>
              </h2>
              <p className="mt-1.5 text-sm text-pierre">
                {projet.typologie} — {projet.ville}
                {projet.surface ? ` · ${projet.surface} m²` : ''} · {projet.annee}
              </p>
            </div>
          </Link>
        ))}
      </Conteneur>
    </div>
  );
}
