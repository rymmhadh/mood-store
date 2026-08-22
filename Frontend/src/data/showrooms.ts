/**
 * Showrooms — source unique de vérité.
 *
 * Horaires stockés en minutes depuis minuit : cela permet de calculer
 * « ouvert maintenant » et de générer les créneaux de rendez-vous sans
 * reparser des chaînes de caractères.
 */

export interface Plage {
  ouverture: number;
  fermeture: number;
}

export interface Conseiller {
  prenom: string;
  role: string;
}

export interface ShowroomComplet {
  slug: string;
  nom: string;
  ville: string;
  adresse: string;
  adresseComplete: string;
  latitude: number;
  longitude: number;
  telephone: string;
  image: string;
  /** Index 0 = lundi … 6 = dimanche. `null` = fermé. */
  horaires: (Plage | null)[];
  acces: string[];
  conseillers: Conseiller[];
  collections: string[];
}

const h = (ouverture: number, fermeture: number): Plage => ({ ouverture, fermeture });

export const SHOWROOMS_COMPLETS: ShowroomComplet[] = [
  {
    slug: 'tunis',
    nom: 'Showroom La Soukra',
    ville: 'Tunis',
    adresse: 'La Soukra, Ariana — Tunis',
    adresseComplete: 'Route de La Soukra, Ariana 2036, Tunisie',
    latitude: 36.8925,
    longitude: 10.2064,
    telephone: '+216 51 953 889',
    image: '/images/home/showroom-1.webp',
    horaires: [
      h(9 * 60, 19 * 60),
      h(9 * 60, 19 * 60),
      h(9 * 60, 19 * 60),
      h(9 * 60, 19 * 60),
      h(9 * 60, 19 * 60),
      h(9 * 60, 19 * 60),
      null,
    ],
    acces: [
      'Stationnement gratuit devant le showroom',
      'Accès de plain-pied, sans marche',
      'À 15 minutes de l’aéroport Tunis-Carthage',
    ],
    conseillers: [
      { prenom: 'Meriam', role: 'Fondatrice — projets d’architecture' },
      { prenom: 'Sarra', role: 'Conseillère mobilier et sur-mesure' },
      { prenom: 'Yassine', role: 'Métreur et suivi de chantier' },
    ],
    collections: ['Bouclé', 'Lin', 'Courbe', 'Onyx', 'Signature'],
  },
  {
    slug: 'sousse',
    nom: 'Showroom Slim Centre',
    ville: 'Sousse',
    adresse: 'Slim Centre — Sousse',
    adresseComplete: 'Slim Centre, Sousse 4000, Tunisie',
    latitude: 35.8256,
    longitude: 10.6084,
    telephone: '+216 51 953 889',
    image: '/images/home/showroom-2.webp',
    horaires: [
      h(9 * 60, 19 * 60),
      h(9 * 60, 19 * 60),
      h(9 * 60, 19 * 60),
      h(9 * 60, 19 * 60),
      h(9 * 60, 19 * 60),
      h(9 * 60, 18 * 60),
      null,
    ],
    acces: [
      'Parking du centre commercial',
      'Accès par ascenseur',
      'À 5 minutes de la médina',
    ],
    conseillers: [
      { prenom: 'Amine', role: 'Responsable showroom' },
      { prenom: 'Ines', role: 'Conseillère mobilier' },
    ],
    collections: ['Bouclé', 'Courbe', 'Onyx', 'Nuit'],
  },
];

export const JOURS = [
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
  'Dimanche',
] as const;

export const heureFr = (minutes: number) => {
  const heures = Math.floor(minutes / 60);
  const reste = minutes % 60;
  return reste === 0 ? `${heures}h` : `${heures}h${String(reste).padStart(2, '0')}`;
};

export const showroomParSlug = (slug: string) =>
  SHOWROOMS_COMPLETS.find((s) => s.slug === slug);

/** Index du jour dans notre semaine, qui commence le lundi. */
export const indexJour = (d: Date) => (d.getDay() + 6) % 7;

export function estOuvert(showroom: ShowroomComplet, maintenant = new Date()) {
  const plage = showroom.horaires[indexJour(maintenant)];
  if (!plage) return false;
  const minutes = maintenant.getHours() * 60 + maintenant.getMinutes();
  return minutes >= plage.ouverture && minutes < plage.fermeture;
}
