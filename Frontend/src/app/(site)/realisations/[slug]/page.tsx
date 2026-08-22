import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Bouton } from '@/components/ui/Bouton';
import { Conteneur } from '@/components/ui/Conteneur';
import { FilAriane } from '@/components/ui/FilAriane';
import { REALISATIONS } from '@/data/home';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return REALISATIONS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const projet = REALISATIONS.find((r) => r.slug === slug);
  if (!projet) return {};

  return {
    title: `${projet.titre}, ${projet.ville}, Réalisations`,
    description: `${projet.typologie} à ${projet.ville}${projet.surface ? `, ${projet.surface} m²` : ''}, livré en ${projet.annee}.`,
    alternates: { canonical: `/realisations/${slug}` },
    openGraph: { images: [{ url: projet.image }] },
  };
}

export default async function PageRealisation({ params }: Props) {
  const { slug } = await params;
  const projet = REALISATIONS.find((r) => r.slug === slug);
  if (!projet) notFound();

  const autres = REALISATIONS.filter((r) => r.slug !== slug);

  return (
    <article className="bg-craie">
      <Conteneur className="pt-8 pb-4 lg:pt-10">
        <FilAriane
          miettes={[
            { libelle: 'Accueil', href: '/' },
            { libelle: 'Réalisations', href: '/realisations' },
            { libelle: projet.titre },
          ]}
        />
      </Conteneur>

      <Conteneur className="max-w-3xl py-8 text-center lg:py-10">
        <p className="eyebrow text-encre">
          {projet.typologie} — {projet.ville}
        </p>
        <h1 className="mt-4 text-[2rem] font-light tracking-[0.01em] lg:text-[2.75rem]">
          {projet.titre}
        </h1>
        <p className="mt-4 text-sm text-pierre">
          {projet.surface ? `${projet.surface} m² · ` : ''}Livré en {projet.annee}
        </p>
      </Conteneur>

      <Conteneur className="pb-4">
        <div className="relative aspect-[16/10] overflow-hidden bg-boucle lg:aspect-[21/9]">
          <Image
            src={projet.image}
            alt={`${projet.titre} — ${projet.ville}`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </Conteneur>

      <Conteneur className="max-w-2xl py-10 text-center lg:py-14">
        <p className="text-lead text-fumee">
          {projet.typologie === 'Villa' || projet.typologie === 'Duplex'
            ? `Un accompagnement complet, de l'esquisse à la remise des clés : plan d'aménagement, sélection des matières, fabrication sur mesure des pièces maîtresses et intégration du mobilier de collection.`
            : `Un aménagement pensé pièce par pièce, entre mobilier de collection et pièces sur mesure dessinées pour l'espace disponible.`}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
          <Bouton href="/sur-mesure/projet">Déposer un projet similaire</Bouton>
        </div>
      </Conteneur>

      {autres.length > 0 && (
        <Conteneur className="border-t border-sable/50 py-14 lg:py-20">
          <p className="eyebrow mb-8 text-pierre">D'autres projets</p>
          <div className="grid gap-10 sm:grid-cols-2">
            {autres.map((p) => (
              <a key={p.slug} href={`/realisations/${p.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-boucle">
                  <Image
                    src={p.image}
                    alt={p.titre}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-doux)] group-hover:scale-105"
                  />
                </div>
                <h2 className="mt-4 text-h3 font-light">
                  <span className="lien-souligne">{p.titre}</span>
                </h2>
                <p className="mt-1 text-sm text-pierre">
                  {p.typologie} — {p.ville}
                </p>
              </a>
            ))}
          </div>
        </Conteneur>
      )}
    </article>
  );
}
