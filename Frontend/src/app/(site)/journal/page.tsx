import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Conteneur } from '@/components/ui/Conteneur';
import { FilAriane } from '@/components/ui/FilAriane';
import { ARTICLES } from '@/data/home';

export const metadata: Metadata = {
  title: 'Journal, conseils et inspirations',
  description:
    'Guides d’achat, matières et entretien : les conseils de Mood Store pour bien choisir et faire durer votre mobilier.',
  alternates: { canonical: '/journal' },
};

const dateFr = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

export default function PageJournal() {
  const articles = [...ARTICLES].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="bg-craie">
      <Conteneur className="pt-8 pb-4 lg:pt-10">
        <FilAriane miettes={[{ libelle: 'Accueil', href: '/' }, { libelle: 'Journal' }]} />
      </Conteneur>

      <Conteneur className="py-10 text-center lg:py-14">
        <h1 className="text-[2rem] font-light tracking-[0.02em] uppercase lg:text-[2.5rem]">
          Journal
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-lead text-fumee">
          Guides d’achat, matières et entretien — de quoi choisir et faire durer chaque pièce.
        </p>
      </Conteneur>

      <Conteneur className="grid gap-10 pb-24 sm:grid-cols-2 lg:grid-cols-3 lg:pb-32">
        {articles.map((article) => (
          <Link key={article.slug} href={`/journal/${article.slug}`} className="group block">
            <div className="relative aspect-[3/2] overflow-hidden bg-boucle">
              <Image
                src={article.image}
                alt={article.titre}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-doux)] group-hover:scale-105"
              />
            </div>
            <p className="eyebrow mt-5 text-encre">{article.categorie}</p>
            <h2 className="mt-2 text-h3 font-light">
              <span className="lien-souligne">{article.titre}</span>
            </h2>
            <p className="mt-2 text-sm text-pierre">
              {dateFr.format(new Date(article.date))} · {article.lecture} min de lecture
            </p>
          </Link>
        ))}
      </Conteneur>
    </div>
  );
}
