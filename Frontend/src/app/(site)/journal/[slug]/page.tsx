import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Conteneur } from '@/components/ui/Conteneur';
import { FilAriane } from '@/components/ui/FilAriane';
import { LienFleche } from '@/components/ui/LienFleche';
import { ARTICLES } from '@/data/home';
import { CONTENU_ARTICLES } from '@/data/journal-contenu';

interface Props {
  params: Promise<{ slug: string }>;
}

const dateFr = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  const contenu = CONTENU_ARTICLES[slug];
  if (!article || !contenu) return {};

  return {
    title: `${article.titre}, Journal`,
    description: contenu.chapo,
    alternates: { canonical: `/journal/${slug}` },
    openGraph: { images: [{ url: article.image }] },
  };
}

export default async function PageArticle({ params }: Props) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  const contenu = CONTENU_ARTICLES[slug];
  if (!article || !contenu) notFound();

  const autres = ARTICLES.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <article className="bg-craie">
      <Conteneur className="pt-8 pb-4 lg:pt-10">
        <FilAriane
          miettes={[
            { libelle: 'Accueil', href: '/' },
            { libelle: 'Journal', href: '/journal' },
            { libelle: article.titre },
          ]}
        />
      </Conteneur>

      <Conteneur className="max-w-3xl py-8 text-center lg:py-10">
        <p className="eyebrow text-encre">{article.categorie}</p>
        <h1 className="mt-4 text-[2rem] font-light tracking-[0.01em] lg:text-[2.75rem]">
          {article.titre}
        </h1>
        <p className="mt-4 text-sm text-pierre">
          {dateFr.format(new Date(article.date))} · {article.lecture} min de lecture
        </p>
      </Conteneur>

      <Conteneur className="pb-4">
        <div className="relative aspect-[16/9] overflow-hidden bg-boucle lg:aspect-[21/9]">
          <Image
            src={article.image}
            alt={article.titre}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </Conteneur>

      <Conteneur className="max-w-2xl py-10 lg:py-14">
        <p className="text-lead text-fumee">{contenu.chapo}</p>

        <div className="mt-10 space-y-10">
          {contenu.corps.map((section, i) => (
            <div key={section.titre ?? i}>
              {section.titre && <h2 className="text-h3 font-light">{section.titre}</h2>}
              <div className={section.titre ? 'mt-4 space-y-4' : 'space-y-4'}>
                {section.paragraphes.map((p, j) => (
                  <p key={j} className="text-[16px] leading-relaxed text-fumee">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Conteneur>

      {autres.length > 0 && (
        <Conteneur className="border-t border-sable/50 py-14 lg:py-20">
          <p className="eyebrow mb-6 text-pierre">À lire aussi</p>
          <div className="flex flex-col gap-4">
            {autres.map((a) => (
              <LienFleche key={a.slug} href={`/journal/${a.slug}`}>
                {a.titre}
              </LienFleche>
            ))}
          </div>
        </Conteneur>
      )}
    </article>
  );
}
