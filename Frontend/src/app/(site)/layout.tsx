import type { Metadata } from 'next';
import { EnTete } from '@/components/layout/EnTete';
import { PiedDePage } from '@/components/layout/PiedDePage';
import { BarreMobile } from '@/components/layout/BarreMobile';
import { DefilementDoux } from '@/components/layout/DefilementDoux';
import { SITE } from '@/data/site';

const URL_SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://moodstore.tn';

export const metadata: Metadata = {
  keywords: [
    'meuble sur mesure Tunis',
    'architecte d’intérieur Tunis',
    'dressing sur mesure Tunisie',
    'canapé sur mesure',
    'showroom meuble La Soukra',
    'décoration intérieure Tunisie',
  ],
  openGraph: {
    type: 'website',
    locale: 'fr_TN',
    url: URL_SITE,
    siteName: SITE.nom,
    title: 'Mood Store, l’art du sur-mesure',
    description: 'Mobilier sur mesure et architecture d’intérieur. Tunis & Sousse.',
    images: [{ url: '/images/hero/1.webp', width: 2560, height: 1440 }],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
};

/** Données structurées : améliore la présence locale sur Google (§23.2). */
const donneesStructurees = {
  '@context': 'https://schema.org',
  '@type': 'FurnitureStore',
  name: SITE.nom,
  description:
    'Mobilier sur mesure et architecture d’intérieur. Fabrication artisanale à Tunis depuis 2018.',
  url: URL_SITE,
  telephone: SITE.telephone,
  image: `${URL_SITE}/images/logo-mood.png`,
  sameAs: [SITE.instagram],
  address: [
    {
      '@type': 'PostalAddress',
      streetAddress: 'La Soukra',
      addressLocality: 'Ariana',
      addressCountry: 'TN',
    },
    {
      '@type': 'PostalAddress',
      streetAddress: 'Slim Centre',
      addressLocality: 'Sousse',
      addressCountry: 'TN',
    },
  ],
  openingHours: 'Mo-Sa 09:00-19:00',
};

/** Habillage du site public. Le back-office ne passe pas par ici. */
export default function LayoutSite({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:bg-encre focus:px-5 focus:py-3 focus:text-craie"
      >
        Aller au contenu
      </a>

      <DefilementDoux />
      <EnTete />

      <main id="contenu" className="pt-[var(--header-h)]">
        {children}
      </main>

      <PiedDePage />
      <BarreMobile />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(donneesStructurees) }}
      />
    </>
  );
}
