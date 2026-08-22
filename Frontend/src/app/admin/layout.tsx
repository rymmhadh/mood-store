import type { Metadata } from 'next';
import { RailModules } from '@/components/admin/RailModules';

/**
 * Habillage du back-office.
 *
 * Aucun en-tête ni pied de page du site : ce sont deux applications qui
 * partagent seulement les tokens de design. Le groupe `(site)` porte le
 * chrome public, ce segment porte le sien.
 */
export const metadata: Metadata = {
  title: { default: 'Administration', template: '%s | Administration Mood Store' },
  // Un back-office n'a rien à faire dans un index de moteur de recherche.
  robots: { index: false, follow: false, nocache: true },
};

export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-craie">
      <a
        href="#tableau"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:bg-encre focus:px-5 focus:py-3 focus:text-craie"
      >
        Aller au contenu
      </a>

      <RailModules />

      <div className="lg:pl-[var(--rail-admin)]">{children}</div>
    </div>
  );
}
