import Image from 'next/image';
import Link from 'next/link';
import { Conteneur } from '@/components/ui/Conteneur';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { LienFleche } from '@/components/ui/LienFleche';
import { Revelation, RevelationTexte } from '@/components/ui/Revelation';
import { ARTICLES } from '@/data/home';

const dateFr = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

/** Journal (§6 section 10) — moteur du référencement longue traîne. */
export function Journal() {
  return (
    <section aria-label="Journal" className="bg-craie py-24 lg:py-32">
      <Conteneur>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow className="mb-4">Journal</Eyebrow>
            <h2 className="text-h2 max-w-xl">
              <RevelationTexte>Inspirations et conseils</RevelationTexte>
            </h2>
          </div>
          <LienFleche href="/journal">Tout le journal</LienFleche>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          {ARTICLES.map((article, i) => (
            <Revelation key={article.slug} index={i}>
              <Link href={`/journal/${article.slug}`} className="group block">
                <div className="relative aspect-[3/2] overflow-hidden bg-boucle">
                  <Image
                    src={article.image}
                    alt={article.titre}
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-doux)] group-hover:scale-105"
                  />
                </div>

                <p className="eyebrow mt-5 text-encre">{article.categorie}</p>
                <h3 className="mt-2 text-h3 font-light">
                  <span className="lien-souligne">{article.titre}</span>
                </h3>
                <p className="mt-2 text-sm text-pierre">
                  {dateFr.format(new Date(article.date))} · {article.lecture} min de lecture
                </p>
              </Link>
            </Revelation>
          ))}
        </div>
      </Conteneur>
    </section>
  );
}
