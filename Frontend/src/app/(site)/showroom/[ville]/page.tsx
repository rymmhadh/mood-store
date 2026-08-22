import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Carte } from '@/components/ui/Carte';
import { Conteneur } from '@/components/ui/Conteneur';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { FilAriane } from '@/components/ui/FilAriane';
import { IconeLieu, IconeWhatsApp } from '@/components/icons';
import { heureFr, JOURS, SHOWROOMS_COMPLETS, showroomParSlug } from '@/data/showrooms';
import { PRODUITS } from '@/data/catalogue';
import { CarteCatalogue } from '@/components/collections/CarteCatalogue';
import { lienWhatsApp, SITE } from '@/data/site';

interface Props {
  params: Promise<{ ville: string }>;
}

export function generateStaticParams() {
  return SHOWROOMS_COMPLETS.map((s) => ({ ville: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ville } = await params;
  const s = showroomParSlug(ville);
  if (!s) return {};

  return {
    title: `${s.nom} — meuble sur mesure à ${s.ville}`,
    description: `Notre showroom de ${s.ville} : ${s.adresseComplete}. Ouvert du lundi au samedi. Prise de rendez-vous en ligne.`,
    alternates: { canonical: `/showroom/${s.slug}` },
  };
}

export default async function PageShowroom({ params }: Props) {
  const { ville } = await params;
  const showroom = showroomParSlug(ville);
  if (!showroom) notFound();

  const exposees = PRODUITS.filter((p) => showroom.collections.includes(p.collection)).slice(0, 3);

  /** Fiche d'établissement : c'est ce qui alimente la recherche locale. */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FurnitureStore',
    name: `Mood Store — ${showroom.nom}`,
    image: showroom.image,
    telephone: showroom.telephone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: showroom.adresse,
      addressLocality: showroom.ville,
      addressCountry: 'TN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: showroom.latitude,
      longitude: showroom.longitude,
    },
    openingHoursSpecification: showroom.horaires
      .map((plage, i) =>
        plage
          ? {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: JOURS[i],
              opens: heureFr(plage.ouverture),
              closes: heureFr(plage.fermeture),
            }
          : null,
      )
      .filter(Boolean),
  };

  return (
    <>
      {/* Hero */}
      <section className="relative h-[55svh] min-h-[22rem] w-full overflow-hidden bg-encre">
        <Image
          src={showroom.image}
          alt={showroom.nom}
          fill
          priority
          quality={92}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-encre/80 via-encre/20 to-transparent" />
        <Conteneur className="absolute inset-x-0 bottom-0 pb-10">
          <Eyebrow className="text-craie">{showroom.ville}</Eyebrow>
          <h1 className="mt-3 text-h1 text-craie">{showroom.nom}</h1>
        </Conteneur>
      </section>

      <Conteneur className="py-6">
        <FilAriane
          miettes={[
            { libelle: 'Accueil', href: '/' },
            { libelle: 'Showrooms', href: '/showroom' },
            { libelle: showroom.ville },
          ]}
        />
      </Conteneur>

      {/* Informations pratiques */}
      <Conteneur className="grid gap-14 pb-20 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Eyebrow className="mb-6 text-encre">Informations pratiques</Eyebrow>

          <p className="flex items-start gap-3 text-[17px] leading-relaxed">
            <IconeLieu className="mt-1 size-5 shrink-0 text-bronze" strokeWidth={1.5} />
            {showroom.adresseComplete}
          </p>

          <dl className="mt-8 space-y-1.5 border-t border-sable/60 pt-8 text-[15px]">
            {showroom.horaires.map((plage, i) => (
              <div key={JOURS[i]} className="flex justify-between gap-4">
                <dt className="text-pierre">{JOURS[i]}</dt>
                <dd className={plage ? 'text-fumee' : 'text-pierre'}>
                  {plage ? `${heureFr(plage.ouverture)} – ${heureFr(plage.fermeture)}` : 'Fermé'}
                </dd>
              </div>
            ))}
          </dl>

          <ul className="mt-8 space-y-2 border-t border-sable/60 pt-8 text-[15px] text-fumee">
            {showroom.acces.map((a) => (
              <li key={a} className="flex gap-3">
                <span aria-hidden className="mt-2.5 size-1 shrink-0 rounded-full bg-bronze" />
                {a}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link
              href={`/showroom/rendez-vous?showroom=${showroom.slug}`}
              className="flex h-14 items-center bg-encre px-8 libelle-action text-craie transition-colors hover:bg-fumee"
            >
              Prendre rendez-vous
            </Link>
            <a
              href={lienWhatsApp(`Bonjour, je souhaite passer au showroom de ${showroom.ville}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="lien-souligne inline-flex items-center gap-2 libelle-action text-fumee"
            >
              <IconeWhatsApp className="size-4" strokeWidth={1.5} />
              WhatsApp
            </a>
            <a href={`tel:${SITE.telephoneBrut}`} className="lien-souligne libelle-action text-fumee">
              {showroom.telephone}
            </a>
          </div>
        </div>

        <div className="lg:col-span-7">
          <Carte
            latitude={showroom.latitude}
            longitude={showroom.longitude}
            titre={showroom.nom}
            className="aspect-[4/3] w-full bg-galerie"
          />
        </div>
      </Conteneur>

      {/* L'équipe */}
      <section className="bg-galerie py-20">
        <Conteneur>
          <Eyebrow className="mb-4 text-encre">L’équipe sur place</Eyebrow>
          <h2 className="mb-10 max-w-xl text-h2">Vous serez reçu par quelqu’un</h2>

          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {showroom.conseillers.map((c) => (
              <li key={c.prenom} className="border-t border-sable pt-5">
                <p className="text-[19px]">{c.prenom}</p>
                <p className="mt-1.5 text-[15px] text-pierre">{c.role}</p>
              </li>
            ))}
          </ul>
        </Conteneur>
      </section>

      {/* Collections exposées */}
      {exposees.length > 0 && (
        <section className="py-20 lg:py-24">
          <Conteneur>
            <Eyebrow className="mb-4 text-encre">Exposé sur place</Eyebrow>
            <h2 className="mb-10 max-w-xl text-h2">
              Les collections {showroom.collections.slice(0, 3).join(', ')} et d’autres
            </h2>
            <div className="grid gap-2 md:grid-cols-3">
              {exposees.map((p) => (
                <CarteCatalogue key={p.slug} produit={p} />
              ))}
            </div>
          </Conteneur>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
