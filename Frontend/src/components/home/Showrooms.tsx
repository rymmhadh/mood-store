import Image from 'next/image';
import Link from 'next/link';
import { IconeLieu } from '@/components/icons';
import { Conteneur } from '@/components/ui/Conteneur';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { RevelationTexte } from '@/components/ui/Revelation';
import { SHOWROOMS } from '@/data/home';

/** Nos showrooms (§6 section 8). */
export function Showrooms() {
  return (
    <section aria-label="Nos showrooms" className="bg-craie py-24 lg:py-32">
      <Conteneur className="mb-12">
        <Eyebrow className="mb-4">Nos showrooms</Eyebrow>
        <h2 className="text-h2 max-w-xl">
          <RevelationTexte>Venez toucher la matière</RevelationTexte>
        </h2>
      </Conteneur>

      <Conteneur className="grid gap-6 lg:grid-cols-2">
        {SHOWROOMS.map((showroom) => (
          <article key={showroom.slug} className="group relative h-[26rem] overflow-hidden bg-encre lg:h-[32rem]">
            <Image
              src={showroom.image}
              alt={showroom.nom}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-doux)] group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-encre/85 via-encre/30 to-transparent transition-opacity duration-500 group-hover:from-encre/75" />

            <div className="absolute inset-x-0 bottom-0 p-8 lg:p-10">
              <p className="eyebrow text-craie">{showroom.ville}</p>
              <h3 className="mt-2 text-h3 font-light text-craie">{showroom.nom}</h3>

              <div className="mt-4 space-y-1 text-sm text-craie/75 transition-transform duration-500 ease-[var(--ease-doux)] lg:translate-y-3 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
                <p className="flex items-center gap-2">
                  <IconeLieu className="size-4 shrink-0" />
                  {showroom.adresse}
                </p>
                <p>{showroom.horaires}</p>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-6">
                <Link
                  href="/showroom/rendez-vous"
                  className="inline-flex h-12 items-center border border-craie px-6 libelle-action text-craie transition-colors hover:bg-craie hover:text-encre"
                >
                  Prendre rendez-vous
                </Link>
                <a
                  href={showroom.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lien-souligne libelle-action text-craie/80"
                >
                  Itinéraire
                </a>
              </div>
            </div>
          </article>
        ))}
      </Conteneur>
    </section>
  );
}
