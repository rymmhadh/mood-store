/** Constantes de marque et coordonnées. Source unique de vérité. */

export const SITE = {
  nom: 'Mood Store',
  bailine: "L'art du sur-mesure",
  signature: 'Une maison avec âme.',
  depuis: 2018,
  telephone: '+216 51 953 889',
  telephoneBrut: '21651953889',
  email: 'contact@moodstore.tn',
  instagram: 'https://www.instagram.com/mood_store_tips_and_tricks/',
  instagramHandle: '@mood_store_tips_and_tricks',
  abonnes: '12,5 k',
} as const;

export interface CompteInstagram {
  handle: string;
  url: string;
  nom: string;
  role: string;
  abonnes: string;
  publications: string;
  image: string;
  /** Compte certifié par Instagram. */
  certifie?: boolean;
  /** Le visuel est sombre : on y superpose le logo plutôt qu'un portrait. */
  logo?: boolean;
  texte: string;
}

/**
 * Les deux comptes de la maison.
 *
 * Celui de la fondatrice pèse quatre fois celui de la marque : c'est son
 * visage qui fait entrer les gens. Le site doit donc l'assumer et diriger
 * vers les deux, pas seulement vers le compte officiel.
 */
export const COMPTES_INSTAGRAM: CompteInstagram[] = [
  {
    handle: '@meriam__mhadhbi',
    url: 'https://www.instagram.com/meriam__mhadhbi/',
    nom: 'Meriam Mhadhbi',
    role: 'Fondatrice et designer',
    abonnes: '50,6 k',
    publications: '459',
    image: '/images/home/insta-meriam.webp',
    certifie: true,
    texte:
      'Elle dessine chaque pièce, suit les chantiers et raconte les coulisses de l’atelier. C’est le compte à suivre pour voir les projets avant tout le monde.',
  },
  {
    handle: '@mood_store_tips_and_tricks',
    url: 'https://www.instagram.com/mood_store_tips_and_tricks/',
    nom: 'Mood Store',
    role: 'Le compte de la maison',
    abonnes: '12,5 k',
    publications: '56',
    image: '/images/home/insta-moodstore.webp',
    logo: true,
    texte:
      'Les nouveautés, les collections, les réalisations livrées et les rendez-vous en showroom à Tunis et à Sousse.',
  },
];

/** Ouvre une conversation WhatsApp pré-remplie (cf. §18.11). */
export function lienWhatsApp(message: string): string {
  return `https://wa.me/${SITE.telephoneBrut}?text=${encodeURIComponent(message)}`;
}
