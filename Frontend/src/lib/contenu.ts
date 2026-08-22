import { ATELIER_IMAGES, HERO, type DiapoHero } from '@/data/home';
import { COMPTES_INSTAGRAM } from '@/data/site';
import { donnees } from './api';

/**
 * Contenu de la page d'accueil, tel que le back-office l'a configuré.
 *
 * Même repli qu'ailleurs sur le site : l'API absente ou vide ne doit jamais
 * faire tomber l'accueil, elle le fait retomber sur le contenu d'origine.
 */
const REVALIDATION = 300;
const ETIQUETTE = ['accueil'];

/** Ordre par défaut si l'API n'a jamais été configurée. */
export const CLES_SECTIONS_DEFAUT = [
  'hero',
  'metiers',
  'rail-collections',
  'sur-mesure',
  'avant-apres',
  'realisations',
  'atelier',
  'showrooms',
  'temoignages',
  'journal',
  'instagram',
];

export interface MediaAccueil {
  section: string;
  emplacement: string;
  url: string;
  alt: string;
  titre: string | null;
  texte: string | null;
  lien: string | null;
  ordre: number;
}

export async function chargerSectionsAccueil(): Promise<string[]> {
  try {
    const liste = await donnees<{ cle: string }[]>('/api/accueil/sections', {
      revalidate: REVALIDATION,
      tags: ETIQUETTE,
    });
    if (liste.length > 0) return liste.map((s) => s.cle);
  } catch {
    // API injoignable — on garde l'ordre d'origine.
  }
  return CLES_SECTIONS_DEFAUT;
}

async function chargerMediasAccueilBruts(): Promise<MediaAccueil[]> {
  try {
    return await donnees<MediaAccueil[]>('/api/accueil/medias', {
      revalidate: REVALIDATION,
      tags: ETIQUETTE,
    });
  } catch {
    return [];
  }
}

/** Diapositives du Hero, dans l'ordre. Repli sur les quatre d'origine. */
export async function chargerDiaposHero(medias: MediaAccueil[]): Promise<DiapoHero[]> {
  const diapos = medias
    .filter((m) => m.section === 'hero')
    .sort((a, b) => a.ordre - b.ordre)
    .map((m) => ({ image: m.url, titre: m.titre ?? '', ligne: m.texte ?? '', href: m.lien ?? '/' }));
  return diapos.length > 0 ? diapos : HERO;
}

/** Photos de l'atelier. Repli sur les deux d'origine s'il en manque. */
export function photosAtelier(medias: MediaAccueil[]): string[] {
  const photos = medias
    .filter((m) => m.section === 'atelier')
    .sort((a, b) => a.ordre - b.ordre)
    .map((m) => m.url);
  return photos.length >= 2 ? photos : [...ATELIER_IMAGES];
}

/** Fond du bloc sur-mesure. */
export function fondSurMesure(medias: MediaAccueil[]): string {
  return medias.find((m) => m.section === 'sur-mesure')?.url ?? '/images/home/surmesure.webp';
}

/**
 * Photos des comptes Instagram, dans le même ordre que `COMPTES_INSTAGRAM` —
 * seule l'image change ; le reste (pseudo, abonnés, texte) reste éditorial.
 */
export function photosInstagram(medias: MediaAccueil[]): string[] {
  const photos = medias.filter((m) => m.section === 'instagram').sort((a, b) => a.ordre - b.ordre);
  return COMPTES_INSTAGRAM.map((compte, i) => photos[i]?.url ?? compte.image);
}

export const chargerMediasAccueil = chargerMediasAccueilBruts;
