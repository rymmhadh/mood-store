'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconeCatalogue,
  IconeClients,
  IconeContenu,
  IconeDemandes,
  IconeReglages,
  IconeStatistiques,
  IconeTableauBord,
} from '@/components/icons/admin';
import { LogoMood } from '@/components/ui/LogoMood';
import { cn } from '@/lib/cn';

type Icone = typeof IconeTableauBord;

interface Module {
  href: string;
  libelle: string;
  icone: Icone;
  /** Module décrit au cahier des charges mais pas encore développé. */
  aVenir?: boolean;
}

/** Les sept modules du §19, dans l'ordre du cahier des charges. */
const MODULES: Module[] = [
  { href: '/admin', libelle: 'Tableau de bord', icone: IconeTableauBord },
  { href: '/admin/catalogue', libelle: 'Catalogue', icone: IconeCatalogue },
  { href: '/admin/contenu', libelle: 'Contenu', icone: IconeContenu },
  { href: '/admin/demandes', libelle: 'Demandes', icone: IconeDemandes, aVenir: true },
  { href: '/admin/clients', libelle: 'Clients', icone: IconeClients, aVenir: true },
  { href: '/admin/statistiques', libelle: 'Statistiques', icone: IconeStatistiques, aVenir: true },
  { href: '/admin/reglages', libelle: 'Réglages', icone: IconeReglages, aVenir: true },
];

/**
 * Navigation du back-office.
 *
 * Fond encre contre contenu craie : la bascule de valeur suffit à signaler
 * qu'on a quitté le site public, sans introduire de couleur d'interface.
 *
 * Les six modules non développés restent visibles et désactivés plutôt que
 * masqués : l'atelier voit d'emblée le périmètre complet de son back-office,
 * et l'écran ne donne pas l'impression d'être amputé.
 */
export function RailModules() {
  const chemin = usePathname();

  return (
    <nav
      aria-label="Modules du back-office"
      className={cn(
        'bg-encre text-craie',
        'lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-[var(--rail-admin)] lg:flex lg:flex-col',
      )}
    >
      <div className="hidden items-center gap-3 border-b border-craie/12 px-6 py-6 lg:flex">
        <LogoMood taille={38} lien={false} sansSurvol clair />
        <span className="leading-tight">
          <span className="block text-[15px]">Mood Store</span>
          <span className="block text-[11px] tracking-[0.14em] text-craie/55 uppercase">
            Administration
          </span>
        </span>
      </div>

      <ul
        className={cn(
          'flex gap-1 overflow-x-auto px-3 py-2',
          '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          'lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-3 lg:py-5',
        )}
      >
        {MODULES.map(({ href, libelle, icone: Icone, aVenir }) => {
          // `/admin` ne doit pas s'allumer quand on est sur `/admin/catalogue` :
          // seul le module racine se compare strictement.
          const actif = href === '/admin' ? chemin === href : chemin.startsWith(href);
          const contenu = (
            <>
              <Icone className="size-5 shrink-0" />
              <span className="whitespace-nowrap">{libelle}</span>
              {aVenir && (
                <span className="ml-auto hidden text-[10px] tracking-[0.12em] text-craie/35 uppercase lg:inline">
                  à venir
                </span>
              )}
            </>
          );

          const classes = cn(
            'flex items-center gap-3 px-4 py-3 text-[14px] transition-colors duration-300 ease-[var(--ease-doux)]',
            actif ? 'bg-craie/12 text-craie' : 'text-craie/60',
            !aVenir && !actif && 'hover:bg-craie/8 hover:text-craie',
            aVenir && 'cursor-not-allowed text-craie/28',
          );

          return (
            <li key={href} className="shrink-0 lg:shrink">
              {aVenir ? (
                <span
                  className={classes}
                  aria-disabled="true"
                  title={`${libelle} — module décrit au cahier des charges, pas encore développé`}
                >
                  {contenu}
                </span>
              ) : (
                <Link href={href} className={classes} aria-current={actif ? 'page' : undefined}>
                  {contenu}
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-auto hidden border-t border-craie/12 px-6 py-5 text-[12px] leading-relaxed text-craie/45 lg:block">
        <p>Connectée en tant que</p>
        <p className="text-craie/80">Meriam Mhadhbi — Administratrice</p>
        <a href="/" className="lien-souligne mt-3 inline-block text-craie/60 hover:text-craie">
          Voir le site
        </a>
      </div>
    </nav>
  );
}
