'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  IconeCoeur,
  IconeCompte,
  IconeMenu,
  IconeRecherche,
} from '@/components/icons';
import { Conteneur } from '@/components/ui/Conteneur';
import { LogoMood } from '@/components/ui/LogoMood';
import { MegaMenu } from './MegaMenu';
import { MenuLateral } from './MenuLateral';
import { Recherche } from './Recherche';
import { useEnTeteAncre } from '@/hooks/useEnTeteAncre';
import { cn } from '@/lib/cn';

/** Épaisseur de trait des icônes de navigation — franche, assortie au gras du texte. */
const TRAIT_ICONE = 1.85;

/**
 * En-tête principal.
 *
 * Structure sur deux niveaux, à la manière des grandes maisons de mobilier
 * (Roche Bobois, Poliform, Molteni&C) :
 *
 *   ┌──────────────────────────────────── 36 px ──┐
 *   │                                    ♡    ☺   │   rangée utilitaire
 *   ├─────────────────────────────────────────────┤
 *   │  ☰ MENU   ⌕ RECHERCHER   ●LOGO●   PRODUITS  │   76 px
 *   └──────────────────────── 112 px au total ────┘
 *
 * La rangée utilitaire est calée sur la hauteur exacte des boutons icônes
 * (36 px, largeur de cible maintenue à 44 px) : il ne subsiste aucun espace
 * mort entre les icônes et la ligne de navigation.
 *
 * Le logo reste le point focal : 68 px de diamètre, centré optiquement par
 * une grille à trois colonnes égales, agrandi de 8 % au survol.
 *
 * Au défilement, la rangée utilitaire se replie, la navigation se compacte
 * à 64 px et le logo à 50 px. À la descente, l'en-tête se rétracte
 * entièrement ; il revient dès la remontée.
 */
export function EnTete() {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [rechercheOuverte, setRechercheOuverte] = useState(false);
  const [megaOuvert, setMegaOuvert] = useState(false);
  const { ancre, cache } = useEnTeteAncre();
  const chemin = usePathname();

  const fermerTout = useCallback(() => {
    setMenuOuvert(false);
    setRechercheOuverte(false);
    setMegaOuvert(false);
  }, []);

  // Raccourci clavier Ctrl/Cmd + K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setRechercheOuverte((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Le méga-menu se referme dès que l'en-tête se rétracte
  useEffect(() => {
    if (cache) setMegaOuvert(false);
  }, [cache]);

  const dansCollections = chemin.startsWith('/collections');
  const dansShowroom = chemin.startsWith('/showroom');

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-80 bg-craie/98 backdrop-blur-md',
          'transition-transform duration-500 ease-[var(--ease-doux)]',
          cache && !megaOuvert ? '-translate-y-full' : 'translate-y-0',
          ancre ? 'border-b border-sable/45' : 'border-b border-transparent',
        )}
        onMouseLeave={() => setMegaOuvert(false)}
      >
        {/* ── Rangée utilitaire ─────────────────────────────────────────── */}
        <Conteneur
          className={cn(
            'hidden items-center justify-end overflow-hidden lg:flex',
            'transition-[height,opacity] duration-500 ease-[var(--ease-doux)]',
            ancre ? 'h-0 opacity-0' : 'h-[var(--nav-utilitaire-h)] opacity-100',
          )}
        >
          <Link
            href="/compte/moodboards"
            aria-label="Mes favoris et moodboards"
            className="bouton-icone-compact"
          >
            <IconeCoeur className="size-[25px]" strokeWidth={TRAIT_ICONE} />
          </Link>
          <Link href="/compte" aria-label="Mon compte" className="bouton-icone-compact -mr-2.5">
            <IconeCompte className="size-[25px]" strokeWidth={TRAIT_ICONE} />
          </Link>
        </Conteneur>

        {/* ── Navigation principale ─────────────────────────────────────── */}
        <Conteneur
          className={cn(
            'grid grid-cols-[1fr_auto_1fr] items-center',
            'transition-[height] duration-500 ease-[var(--ease-doux)]',
            ancre
              ? 'h-[3.75rem] [--logo-taille:2.5rem] lg:h-[4rem] lg:[--logo-taille:3.125rem]'
              : 'h-[var(--nav-h)]',
          )}
        >
          {/* Gauche — Menu et Recherche */}
          <div className="flex items-center gap-6 md:gap-10 xl:gap-14">
            <button
              type="button"
              onClick={() => setMenuOuvert(true)}
              aria-label="Ouvrir le menu"
              aria-expanded={menuOuvert}
              className="group flex items-center gap-3.5 text-nav font-semibold tracking-[0.08em] text-fumee uppercase transition-colors duration-300 hover:text-encre"
            >
              <IconeMenu
                className="size-[26px] transition-transform duration-300 ease-[var(--ease-doux)] group-hover:scale-110"
                strokeWidth={TRAIT_ICONE}
              />
              <span className="hidden sm:inline">Menu</span>
            </button>

            <button
              type="button"
              onClick={() => setRechercheOuverte(true)}
              aria-label="Rechercher"
              className="group hidden items-center gap-3.5 text-nav font-semibold tracking-[0.08em] text-fumee uppercase transition-colors duration-300 hover:text-encre sm:flex"
            >
              <IconeRecherche
                className="size-[26px] transition-transform duration-300 ease-[var(--ease-doux)] group-hover:scale-110"
                strokeWidth={TRAIT_ICONE}
              />
              <span className="hidden md:inline">Rechercher</span>
            </button>
          </div>

          {/* Centre — logo, point focal de la navigation */}
          <LogoMood className="justify-self-center px-4" />

          {/* Droite — Produits et Showrooms */}
          <div className="flex items-center justify-end gap-6 md:gap-10 xl:gap-14">
            <button
              type="button"
              onClick={() => setMegaOuvert((v) => !v)}
              onMouseEnter={() => setMegaOuvert(true)}
              aria-expanded={megaOuvert}
              aria-controls="mega-menu-produits"
              data-actif={megaOuvert || dansCollections}
              className="lien-nav hidden text-nav lg:block"
            >
              Produits
            </button>

            <Link
              href="/showroom"
              data-actif={dansShowroom}
              className="lien-nav hidden text-nav lg:block"
            >
              Showrooms
            </Link>

            {/* Icônes compactes — mobile et tablette uniquement */}
            <button
              type="button"
              onClick={() => setRechercheOuverte(true)}
              aria-label="Rechercher"
              className="bouton-icone sm:hidden"
            >
              <IconeRecherche className="size-[26px]" strokeWidth={TRAIT_ICONE} />
            </button>

            <Link
              href="/compte/moodboards"
              aria-label="Mes favoris"
              className="bouton-icone -mr-3 lg:hidden"
            >
              <IconeCoeur className="size-[26px]" strokeWidth={TRAIT_ICONE} />
            </Link>
          </div>
        </Conteneur>

        <div id="mega-menu-produits">
          <MegaMenu ouvert={megaOuvert} onFermer={() => setMegaOuvert(false)} />
        </div>
      </header>

      <MenuLateral ouvert={menuOuvert} onFermer={fermerTout} />
      <Recherche ouvert={rechercheOuverte} onFermer={fermerTout} />
    </>
  );
}
