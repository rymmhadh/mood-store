import Image from 'next/image';
import { IconeInstagram } from '@/components/icons';
import { Conteneur } from '@/components/ui/Conteneur';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Revelation, RevelationTexte } from '@/components/ui/Revelation';
import { LogoMood } from '@/components/ui/LogoMood';
import { COMPTES_INSTAGRAM } from '@/data/site';

/**
 * Section Instagram.
 *
 * Deux comptes plutôt qu'un mur de vignettes : celui de la fondatrice, qui
 * pèse quatre fois celui de la marque, et celui de la maison. C'est son
 * visage qui fait entrer les gens — un bandeau de photos produit anonymes
 * ne dit rien de cela.
 */
export function Instagram({ photos }: { photos?: string[] } = {}) {
  return (
    <section
      aria-label="Nos comptes Instagram"
      className="border-t border-sable/50 bg-craie py-24 lg:py-32"
    >
      <Conteneur className="mb-14">
        <Eyebrow className="mb-4 text-encre">Sur Instagram</Eyebrow>
        <h2 className="max-w-2xl text-h2">
          <RevelationTexte>Suivez la maison et celle qui la dessine</RevelationTexte>
        </h2>
      </Conteneur>

      <Conteneur className="grid gap-2 lg:grid-cols-2">
        {COMPTES_INSTAGRAM.map((compte, i) => {
          const image = photos?.[i] ?? compte.image;
          return (
          <Revelation key={compte.handle} index={i}>
            <a
              href={compte.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-galerie"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-encre sm:aspect-[16/11] lg:aspect-[4/5]">
                <Image
                  src={image}
                  alt={compte.logo ? 'Showroom Mood Store' : `Portrait de ${compte.nom}`}
                  fill
                  quality={92}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-doux)] group-hover:scale-[1.04]"
                />

                {/* Le compte de la maison n'a pas de visage : on y pose le logo. */}
                {compte.logo && (
                  <span className="absolute inset-0 flex items-center justify-center bg-encre/45">
                    <LogoMood taille={150} lien={false} sansSurvol clair />
                  </span>
                )}

                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-encre/85 via-encre/10 to-transparent"
                />

                {/* Compteurs */}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-7 lg:p-9">
                  <div>
                    <p className="flex items-center gap-2 text-[19px] text-craie">
                      {compte.handle}
                      {compte.certifie && (
                        <svg viewBox="0 0 24 24" className="size-4 text-craie" aria-label="Compte certifié">
                          <path
                            fill="currentColor"
                            d="M12 1.6 14.3 4l3.2-.3.9 3.1 2.9 1.5-1.2 3 1.2 3-2.9 1.5-.9 3.1-3.2-.3L12 22.4 9.7 20l-3.2.3-.9-3.1L2.7 15.7l1.2-3-1.2-3 2.9-1.5.9-3.1 3.2.3z"
                          />
                          <path
                            d="m8.4 12 2.4 2.4 4.8-4.8"
                            fill="none"
                            stroke="var(--color-encre)"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </p>
                    <p className="mt-1.5 text-[15px] text-craie/70">
                      {compte.abonnes} abonnés · {compte.publications} publications
                    </p>
                  </div>

                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-craie/50 text-craie transition-colors duration-500 group-hover:border-craie group-hover:bg-craie group-hover:text-encre">
                    <IconeInstagram className="size-5" strokeWidth={1.5} />
                  </span>
                </div>
              </div>

              <div className="p-7 lg:p-9">
                <p className="eyebrow text-pierre">{compte.role}</p>
                <h3 className="mt-2.5 text-h3">{compte.nom}</h3>
                <p className="mt-4 max-w-md leading-relaxed text-fumee">{compte.texte}</p>

                <span className="mt-7 inline-flex h-13 items-center gap-3 bg-encre px-8 py-3.5 libelle-action text-craie transition-colors group-hover:bg-fumee">
                  <IconeInstagram className="size-4" strokeWidth={1.5} />
                  Suivre sur Instagram
                </span>
              </div>
            </a>
          </Revelation>
          );
        })}
      </Conteneur>
    </section>
  );
}
