import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Conteneur } from '@/components/ui/Conteneur';
import { FilAriane } from '@/components/ui/FilAriane';
import { IconeLieu } from '@/components/icons';
import { heureFr, JOURS, SHOWROOMS_COMPLETS } from '@/data/showrooms';
import { SITE } from '@/data/site';

export const metadata: Metadata = {
  title: 'Nos showrooms — La Soukra (Tunis) et Sousse',
  description:
    'Découvrez nos collections et touchez les matières dans nos deux showrooms : La Soukra à Tunis et Slim Centre à Sousse. Ouvert du lundi au samedi.',
  alternates: { canonical: '/showroom' },
};

export default function PageShowrooms() {
  return (
    <>
      <Conteneur className="pt-8 pb-10 lg:pt-10 lg:pb-14">
        <FilAriane miettes={[{ libelle: 'Accueil', href: '/' }, { libelle: 'Showrooms' }]} />
        <h1 className="mt-8 text-h1">Nos showrooms</h1>
        <p className="mt-5 max-w-2xl text-lead leading-relaxed text-fumee">
          Une photo ne rend ni la main d’un tissu ni la profondeur d’une laque. Venez vous
          asseoir, toucher, comparer — c’est là que se décident les projets.
        </p>
      </Conteneur>

      <Conteneur className="grid gap-2 pb-24 lg:grid-cols-2">
        {SHOWROOMS_COMPLETS.map((s) => (
          <article key={s.slug} className="bg-galerie">
            <Link href={`/showroom/${s.slug}`} className="group block">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={s.image}
                  alt={s.nom}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-doux)] group-hover:scale-105"
                />
              </div>
            </Link>

            <div className="p-8 lg:p-10">
              <p className="eyebrow text-encre">{s.ville}</p>
              <h2 className="mt-3 text-h3">
                <Link href={`/showroom/${s.slug}`} className="lien-souligne">
                  {s.nom}
                </Link>
              </h2>

              <p className="mt-4 flex items-center gap-2 text-[15px] text-fumee">
                <IconeLieu className="size-4 shrink-0" strokeWidth={1.5} />
                {s.adresseComplete}
              </p>

              <dl className="mt-6 space-y-1 text-[14px]">
                {s.horaires.map((plage, i) => (
                  <div key={JOURS[i]} className="flex justify-between gap-4">
                    <dt className="text-pierre">{JOURS[i]}</dt>
                    <dd className={plage ? 'text-fumee' : 'text-pierre'}>
                      {plage ? `${heureFr(plage.ouverture)} – ${heureFr(plage.fermeture)}` : 'Fermé'}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 flex flex-wrap items-center gap-5">
                <Link
                  href={`/showroom/rendez-vous?showroom=${s.slug}`}
                  className="flex h-13 items-center bg-encre px-7 py-3.5 libelle-action text-craie transition-colors hover:bg-fumee"
                >
                  Prendre rendez-vous
                </Link>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${s.latitude}&mlon=${s.longitude}#map=17/${s.latitude}/${s.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lien-souligne libelle-action text-fumee"
                >
                  Itinéraire
                </a>
                <a href={`tel:${SITE.telephoneBrut}`} className="lien-souligne libelle-action text-fumee">
                  {s.telephone}
                </a>
              </div>
            </div>
          </article>
        ))}
      </Conteneur>
    </>
  );
}
