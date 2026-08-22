import type { Article, Realisation, Showroom, Temoignage } from '@/types';
import { PRODUITS } from './catalogue';
import { SHOWROOMS_COMPLETS } from './showrooms';

/**
 * Contenu de la page d'accueil.
 *
 * Les pièces mises en avant sont tirées du catalogue : une seule source de
 * vérité produit pour tout le site. Les visuels d'ambiance, eux, sont propres
 * à l'accueil et rangés dans `/images/home/`.
 */

export interface DiapoHero {
  image: string;
  titre: string;
  ligne: string;
  href: string;
}

export const HERO: DiapoHero[] = [
  {
    image: '/images/hero/1.webp',
    titre: 'Sillage',
    ligne: 'Canapé courbe, composition sur mesure',
    href: '/produit/sillage',
  },
  {
    image: '/images/hero/2.webp',
    titre: 'Horizon',
    ligne: 'Canapé d’angle, collection Lin',
    href: '/produit/horizon',
  },
  {
    image: '/images/hero/3.webp',
    titre: 'Perle',
    ligne: 'Table de repas et chaises bouclées',
    href: '/produit/perle',
  },
  {
    image: '/images/hero/4.webp',
    titre: 'Onde',
    ligne: 'Canapé courbe, collection Courbe',
    href: '/produit/onde',
  },
];

export interface Metier {
  titre: string;
  ligne: string;
  image: string;
  href: string;
  cta: string;
}

export const METIERS: Metier[] = [
  {
    titre: 'Meuble sur mesure',
    ligne: 'Chaque pièce dessinée pour votre espace.',
    image: '/images/home/metier-1.webp',
    href: '/sur-mesure/configurateur',
    cta: 'Configurer une pièce',
  },
  {
    titre: "Architecture d'intérieur",
    ligne: "De l'esquisse à la remise des clés.",
    image: '/images/home/metier-2.webp',
    href: '/realisations',
    cta: 'Voir nos réalisations',
  },
  {
    titre: 'Décoration & objets',
    ligne: 'Les détails qui font une maison.',
    image: '/images/home/metier-3.webp',
    href: '/collections/objets',
    cta: 'Découvrir',
  },
];

/** Sélection mise en avant sur l'accueil, puisée dans le catalogue. */
export const PRODUITS_VEDETTE = [
  'bulle',
  'sillage',
  'onde',
  'onyx',
  'trait',
  'mouton',
  'perle',
  'nuage',
]
  .map((slug) => PRODUITS.find((p) => p.slug === slug))
  .filter((p): p is (typeof PRODUITS)[number] => Boolean(p));

export const REALISATIONS: Realisation[] = [
  {
    slug: 'villa-la-marsa',
    titre: 'Villa contemporaine',
    typologie: 'Villa',
    ville: 'La Marsa',
    surface: 340,
    annee: 2026,
    image: '/images/home/real-1.webp',
  },
  {
    slug: 'appartement-lac-2',
    titre: 'Appartement Lac 2',
    typologie: 'Appartement',
    ville: 'Tunis',
    surface: 180,
    annee: 2025,
    image: '/images/home/real-2.webp',
  },
  {
    slug: 'duplex-sousse',
    titre: 'Duplex bord de mer',
    typologie: 'Duplex',
    ville: 'Sousse',
    surface: 220,
    annee: 2025,
    image: '/images/home/real-3.webp',
  },
];

export const ATELIER_IMAGES = [
  '/images/home/atelier-1.webp',
  '/images/home/atelier-2.webp',
  '/images/home/atelier-3.webp',
  '/images/home/atelier-4.webp',
] as const;

/** Vue simplifiée des showrooms pour l'accueil — source dans `showrooms.ts`. */
export const SHOWROOMS: Showroom[] = SHOWROOMS_COMPLETS.map((s) => ({
  slug: s.slug,
  nom: s.nom,
  ville: s.ville,
  adresse: s.adresse,
  telephone: s.telephone,
  horaires: 'Lun – Sam · 9h – 19h',
  image: s.image,
  maps: `https://www.openstreetmap.org/?mlat=${s.latitude}&mlon=${s.longitude}#map=17/${s.latitude}/${s.longitude}`,
}));

export const TEMOIGNAGES: Temoignage[] = [
  {
    citation:
      "Nous avions un salon impossible à meubler. Ils ont dessiné le canapé autour de la pièce, pas l'inverse.",
    auteur: 'Nadia B.',
    ville: 'La Marsa',
    projet: 'Salon sur mesure',
    image: '/images/home/real-1.webp',
  },
  {
    citation:
      "Six semaines annoncées, six semaines tenues. Et des photos de l'atelier à chaque étape.",
    auteur: 'Karim S.',
    ville: 'Tunis',
    projet: 'Chambre parentale et dressing',
    image: '/images/home/real-2.webp',
  },
  {
    citation:
      'Le résultat dépasse les rendus. La qualité des tissus se voit et se sent immédiatement.',
    auteur: 'Leïla M.',
    ville: 'Sousse',
    projet: 'Aménagement complet',
    image: '/images/home/real-3.webp',
  },
];

export const ARTICLES: Article[] = [
  {
    slug: 'choisir-son-canape',
    titre: 'Comment choisir son canapé quand la pièce est étroite',
    categorie: 'Guide',
    date: '2026-07-18',
    lecture: 6,
    image: '/images/home/journal-1.webp',
  },
  {
    slug: 'boucle-matiere',
    titre: 'Le bouclé : pourquoi cette matière ne quitte plus nos intérieurs',
    categorie: 'Matières',
    date: '2026-06-30',
    lecture: 4,
    image: '/images/home/journal-2.webp',
  },
  {
    slug: 'hauteur-table-repas',
    titre: 'Quelle hauteur et quelle longueur pour une table de repas',
    categorie: 'Guide',
    date: '2026-06-12',
    lecture: 5,
    image: '/images/home/journal-3.webp',
  },
];

export const AVANT_APRES = {
  avant: '/images/home/avant.webp',
  apres: '/images/home/apres.webp',
  projet: 'Chambre parentale — Appartement Lac 2, Tunis',
  duree: '5 semaines de chantier',
  href: '/realisations/appartement-lac-2',
} as const;
