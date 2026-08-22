/**
 * Sections et photographies d'origine de l'accueil, à l'identique de ce qui
 * vivait en dur dans `Frontend/src/data/home.ts` et `data/site.ts`.
 */

export const SECTIONS_INITIALES = [
  { cle: 'hero', nom: 'Grande photo d’accueil' },
  { cle: 'metiers', nom: 'Nos trois métiers' },
  { cle: 'rail-collections', nom: 'Collections en vedette' },
  { cle: 'sur-mesure', nom: 'Le sur-mesure' },
  { cle: 'avant-apres', nom: 'Avant / après' },
  { cle: 'realisations', nom: 'Réalisations' },
  { cle: 'atelier', nom: 'L’atelier' },
  { cle: 'showrooms', nom: 'Showrooms' },
  { cle: 'temoignages', nom: 'Témoignages' },
  { cle: 'journal', nom: 'Le journal' },
  { cle: 'instagram', nom: 'Instagram' },
];

export const MEDIAS_INITIAUX = [
  {
    section: 'hero',
    emplacement: 'diapo',
    ordre: 0,
    url: '/images/hero/1.webp',
    titre: 'Sillage',
    texte: 'Canapé courbe, composition sur mesure',
    lien: '/produit/sillage',
  },
  {
    section: 'hero',
    emplacement: 'diapo',
    ordre: 1,
    url: '/images/hero/2.webp',
    titre: 'Horizon',
    texte: 'Canapé d’angle, collection Lin',
    lien: '/produit/horizon',
  },
  {
    section: 'hero',
    emplacement: 'diapo',
    ordre: 2,
    url: '/images/hero/3.webp',
    titre: 'Perle',
    texte: 'Table de repas et chaises bouclées',
    lien: '/produit/perle',
  },
  {
    section: 'hero',
    emplacement: 'diapo',
    ordre: 3,
    url: '/images/hero/4.webp',
    titre: 'Onde',
    texte: 'Canapé courbe, collection Courbe',
    lien: '/produit/onde',
  },
  {
    section: 'sur-mesure',
    emplacement: 'fond',
    ordre: 0,
    url: '/images/home/surmesure.webp',
    alt: 'Atelier Mood Store, fond du bloc sur-mesure',
  },
  {
    section: 'atelier',
    emplacement: 'photo',
    ordre: 0,
    url: '/images/home/atelier-1.webp',
    alt: 'L’atelier Mood Store',
  },
  {
    section: 'atelier',
    emplacement: 'photo',
    ordre: 1,
    url: '/images/home/atelier-2.webp',
    alt: 'Détail de finition',
  },
  {
    section: 'instagram',
    emplacement: 'compte',
    ordre: 0,
    url: '/images/home/insta-meriam.webp',
    titre: 'Meriam Mhadhbi',
    alt: 'Portrait de Meriam Mhadhbi',
  },
  {
    section: 'instagram',
    emplacement: 'compte',
    ordre: 1,
    url: '/images/home/insta-moodstore.webp',
    titre: 'Mood Store',
    alt: 'Showroom Mood Store',
  },
];
