import type { GroupeNav, LienNav, VignetteMenu } from '@/types';

/** Colonnes du méga-menu « Produits ». */
export const MENU_PRODUITS: GroupeNav[] = [
  {
    titre: 'Salon',
    liens: [
      { libelle: 'Canapés', href: '/collections/canapes' },
      { libelle: 'Fauteuils', href: '/collections/fauteuils' },
      { libelle: 'Poufs et tabourets', href: '/collections/poufs' },
      { libelle: 'Tables basses', href: '/collections/tables-basses' },
      { libelle: 'Meubles TV', href: '/collections/consoles' },
      { libelle: 'Bibliothèques et compositions', href: '/collections/bibliotheques' },
      { libelle: "Consoles et meubles d’appoint", href: '/collections/consoles' },
    ],
  },
  {
    titre: 'Salle à manger',
    liens: [
      { libelle: 'Tables de repas', href: '/collections/tables' },
      { libelle: 'Chaises, tabourets et bancs', href: '/collections/chaises' },
      { libelle: 'Buffets, colonnes, vaisseliers', href: '/collections/buffets' },
    ],
  },
  {
    titre: 'Chambre',
    liens: [
      { libelle: 'Lits et têtes de lit', href: '/collections/lits' },
      { libelle: 'Dressings et armoires', href: '/collections/dressings' },
      { libelle: 'Commodes et chevets', href: '/collections/commodes' },
    ],
  },
  {
    titre: 'Décoration',
    liens: [
      { libelle: 'Luminaires', href: '/collections/luminaires' },
      { libelle: 'Coussins & textile', href: '/collections/textile' },
      { libelle: 'Tapis', href: '/collections/tapis' },
      { libelle: 'Objets de décoration', href: '/collections/objets' },
      { libelle: 'Miroirs', href: '/collections/miroirs' },
    ],
  },
  {
    titre: 'Sur mesure',
    liens: [
      { libelle: 'Le configurateur', href: '/sur-mesure/configurateur' },
      { libelle: 'Nos matières et finitions', href: '/sur-mesure/matieres' },
      { libelle: 'Déposer un projet', href: '/sur-mesure/projet' },
    ],
  },
  {
    titre: 'Professionnels',
    liens: [
      { libelle: 'Architectes et décorateurs', href: '/professionnels' },
      { libelle: 'Hôtels et restaurants', href: '/professionnels' },
      { libelle: 'Bureaux et promoteurs', href: '/professionnels' },
    ],
  },
];

/**
 * Cartes éditoriales du méga-menu.
 * Visuels recadrés en portrait allongé et étalonnés (§4.4) : ce ne sont pas
 * des photos de catalogue mais des plans rapprochés sur la matière.
 *
 * Les noms de lignes tiennent en 6 caractères : c'est ce qui permet de les
 * afficher en 34 px semi-gras sur une carte de 200 px sans repli de ligne.
 * Au-delà de 7 caractères, il faut redescendre la taille du titre.
 */
export const VIGNETTES_MENU: VignetteMenu[] = [
  {
    titre: 'Bouclé',
    sousTitre: 'Collection 2026',
    image: '/images/menu/1.webp',
    href: '/collections/canapes',
  },
  {
    titre: 'Courbe',
    sousTitre: 'Nouveautés',
    image: '/images/menu/2.webp',
    href: '/collections/canapes',
  },
  {
    titre: 'Onyx',
    sousTitre: 'Salle à manger',
    image: '/images/menu/3.webp',
    href: '/collections/tables',
  },
  {
    titre: 'Mouton',
    sousTitre: 'Pièce signature',
    image: '/images/menu/4.webp',
    href: '/collections/objets',
  },
];

/** Liens principaux de l'en-tête (droite). */
export const NAV_PRINCIPALE: LienNav[] = [
  { libelle: 'Produits', href: '/collections' },
  { libelle: 'Showrooms', href: '/showroom' },
];

/** Liens du menu latéral (bouton « Menu »). */
export const MENU_LATERAL: GroupeNav[] = [
  {
    titre: 'La maison',
    liens: [
      { libelle: 'Notre histoire', href: '/a-propos' },
      { libelle: "L'atelier et le savoir-faire", href: '/a-propos#atelier' },
      { libelle: 'Nos showrooms', href: '/showroom' },
      { libelle: 'Nous contacter', href: '/contact' },
    ],
  },
  {
    titre: 'Créer',
    liens: [
      { libelle: 'Le sur-mesure', href: '/sur-mesure' },
      { libelle: 'Le configurateur', href: '/sur-mesure/configurateur' },
      { libelle: 'Déposer un projet', href: '/sur-mesure/projet' },
      { libelle: 'Nos matières', href: '/sur-mesure/matieres' },
    ],
  },
  {
    titre: 'Découvrir',
    liens: [
      { libelle: 'Collections', href: '/collections' },
      { libelle: 'Inspirations', href: '/inspirations' },
      { libelle: 'Réalisations', href: '/realisations' },
      { libelle: 'Journal', href: '/journal' },
    ],
  },
  {
    titre: 'Services',
    liens: [
      { libelle: 'Espace professionnel', href: '/professionnels' },
      { libelle: 'Prendre rendez-vous', href: '/showroom/rendez-vous' },
      { libelle: 'Recevoir des échantillons', href: '/sur-mesure/matieres#echantillons' },
      { libelle: 'Livraison et montage', href: '/contact#livraison' },
    ],
  },
];

/** Colonnes du pied de page. */
export const FOOTER_COLONNES: GroupeNav[] = [
  {
    titre: 'Collections',
    liens: [
      { libelle: 'Salon', href: '/collections/canapes' },
      { libelle: 'Salle à manger', href: '/collections/tables' },
      { libelle: 'Chambres', href: '/collections/lits' },
      { libelle: 'Décoration', href: '/collections/objets' },
    ],
  },
  {
    titre: 'La maison',
    liens: [
      { libelle: 'Notre histoire', href: '/a-propos' },
      { libelle: "L'atelier", href: '/a-propos#atelier' },
      { libelle: 'Nos engagements', href: '/a-propos#engagements' },
      { libelle: 'Journal', href: '/journal' },
    ],
  },
  {
    titre: 'Services',
    liens: [
      { libelle: 'Sur mesure', href: '/sur-mesure' },
      { libelle: "Architecture d'intérieur", href: '/realisations' },
      { libelle: 'Espace professionnel', href: '/professionnels' },
      { libelle: 'Guide d’entretien', href: '/journal/entretien' },
      { libelle: 'Livraison et montage', href: '/contact#livraison' },
    ],
  },
  {
    titre: 'Nous joindre',
    liens: [
      { libelle: 'Prendre rendez-vous', href: '/showroom/rendez-vous' },
      { libelle: 'Demander un devis', href: '/contact' },
      { libelle: 'Showroom Tunis', href: '/showroom/tunis' },
      { libelle: 'Showroom Sousse', href: '/showroom/sousse' },
    ],
  },
];

export const FOOTER_LEGAL: LienNav[] = [
  { libelle: 'Contact', href: '/contact' },
  { libelle: 'Tous les showrooms', href: '/showroom' },
  { libelle: 'Politique de confidentialité', href: '/politique-confidentialite' },
  { libelle: 'Paramétrer les cookies', href: '#cookies' },
  { libelle: 'Mentions légales et CGV', href: '/mentions-legales' },
  { libelle: 'Accessibilité', href: '/accessibilite' },
];
