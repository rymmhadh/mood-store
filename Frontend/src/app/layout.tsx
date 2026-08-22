import type { Metadata, Viewport } from 'next';
import { jost } from '@/lib/fonts';
import './globals.css';

const URL_SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://moodstore.tn';

/**
 * Racine de l'application.
 *
 * Volontairement réduite à `<html>`, `<body>`, la police et les tokens : le
 * site public et le back-office ne partagent aucun habillage. Chacun apporte
 * le sien depuis son propre segment :
 *   · `app/(site)/layout.tsx`  → en-tête, pied de page, barre mobile, JSON-LD
 *   · `app/admin/layout.tsx`   → rail des modules, barre d'outils
 * Le groupe `(site)` n'ajoute rien à l'URL : `/`, `/collections/...` sont
 * inchangés.
 */
export const metadata: Metadata = {
  metadataBase: new URL(URL_SITE),
  title: {
    default: 'Mood Store, meuble sur mesure et architecture d’intérieur | Tunis & Sousse',
    template: '%s | Mood Store',
  },
  description:
    'Mood Store dessine et fabrique un mobilier entièrement sur mesure et signe des projets complets d’architecture d’intérieur. Showrooms à La Soukra (Tunis) et à Sousse.',
};

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={jost.variable} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
