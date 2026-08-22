/**
 * Nuancier de l'atelier.
 *
 * `image` pointe vers un plan rapproché réel de la matière. Les entrées sans
 * image affichent une pastille de couleur : c'est volontaire et honnête —
 * mieux vaut un aplat qu'une photo qui ne montre pas la bonne matière.
 * Ces références attendent la séance photo matières.
 */

export type FamilleMatiere = 'Tissus' | 'Cuirs' | 'Bois' | 'Pierres' | 'Métaux';

export interface MatiereNuancier {
  id: string;
  nom: string;
  famille: FamilleMatiere;
  hex: string;
  image?: string;
  origine: string;
  proprietes: string[];
  entretien: string;
  /** Disponible à l'envoi postal gratuit. */
  echantillon: boolean;
}

const m = (id: string) => `/images/matieres/${id}.webp`;

export const NUANCIER: MatiereNuancier[] = [
  /* ── Tissus ────────────────────────────────────────────────────────── */
  {
    id: 'boucle-ecru',
    nom: 'Bouclé Écru',
    famille: 'Tissus',
    hex: '#EFE9DF',
    image: m('boucle-ecru'),
    origine: 'Tissage européen — 82 % polyester, 18 % coton',
    proprietes: ['Martindale 45 000 tours', 'Anti-boulochage', 'Déhoussable'],
    entretien: 'Aspiration douce à l’embout brosse. Nettoyage à sec uniquement.',
    echantillon: true,
  },
  {
    id: 'boucle-sable',
    nom: 'Bouclé Sable',
    famille: 'Tissus',
    hex: '#D9CBB6',
    image: m('boucle-sable'),
    origine: 'Tissage européen — 82 % polyester, 18 % coton',
    proprietes: ['Martindale 45 000 tours', 'Anti-boulochage', 'Déhoussable'],
    entretien: 'Aspiration douce à l’embout brosse. Nettoyage à sec uniquement.',
    echantillon: true,
  },
  {
    id: 'lin-naturel',
    nom: 'Lin lavé Naturel',
    famille: 'Tissus',
    hex: '#E2DACB',
    image: m('lin-naturel'),
    origine: 'Lin européen lavé — 100 % lin',
    proprietes: ['Martindale 30 000 tours', 'Se patine à l’usage', 'Housses lavables 30°'],
    entretien: 'Lavage en machine à 30°, séchage à plat. Le froissé fait partie de la matière.',
    echantillon: true,
  },
  {
    id: 'velours-olive',
    nom: 'Velours Olive',
    famille: 'Tissus',
    hex: '#5A6350',
    image: m('velours-olive'),
    origine: 'Velours ras — 100 % polyester recyclé',
    proprietes: ['Martindale 60 000 tours', 'Traitement anti-taches', 'Sens du poil marqué'],
    entretien: 'Brossage régulier dans le sens du poil. Tache : tamponner, ne pas frotter.',
    echantillon: true,
  },
  {
    id: 'velours-terracotta',
    nom: 'Velours Terracotta',
    famille: 'Tissus',
    hex: '#B05C3B',
    image: m('velours-terracotta'),
    origine: 'Velours ras — 100 % polyester recyclé',
    proprietes: ['Martindale 60 000 tours', 'Traitement anti-taches', 'Sens du poil marqué'],
    entretien: 'Brossage régulier dans le sens du poil. Tache : tamponner, ne pas frotter.',
    echantillon: true,
  },
  {
    id: 'technique-gris',
    nom: 'Tissu technique Gris',
    famille: 'Tissus',
    hex: '#9A9A96',
    origine: 'Tissu outdoor teint dans la masse',
    proprietes: ['Martindale 80 000 tours', 'Résistant UV', 'Déperlant'],
    entretien: 'Éponge humide et savon neutre. Séchage à l’air libre.',
    echantillon: true,
  },

  /* ── Cuirs ─────────────────────────────────────────────────────────── */
  {
    id: 'cuir-cognac',
    nom: 'Cuir pleine fleur Cognac',
    famille: 'Cuirs',
    hex: '#8A5A34',
    origine: 'Tannage végétal — pleine fleur, 1,4 mm',
    proprietes: ['Se patine avec le temps', 'Grain naturel apparent', 'Épaisseur 1,4 mm'],
    entretien: 'Lait nourrissant deux fois par an. Éviter l’exposition directe au soleil.',
    echantillon: true,
  },
  {
    id: 'cuir-encre',
    nom: 'Cuir pleine fleur Noir',
    famille: 'Cuirs',
    hex: '#1A1A1A',
    image: m('cuir-encre'),
    origine: 'Tannage végétal — pleine fleur, 1,4 mm',
    proprietes: ['Finition mate', 'Grain fin', 'Épaisseur 1,4 mm'],
    entretien: 'Lait nourrissant deux fois par an. Éviter l’exposition directe au soleil.',
    echantillon: true,
  },

  /* ── Bois ──────────────────────────────────────────────────────────── */
  {
    id: 'chene',
    nom: 'Chêne massif',
    famille: 'Bois',
    hex: '#C09A6B',
    image: m('chene'),
    origine: 'Chêne européen, séchage lent',
    proprietes: ['Finition huilée ou vernie mate', 'Veinage clair', 'Réparable par ponçage'],
    entretien: 'Huile d’entretien une fois par an sur les finitions huilées.',
    echantillon: true,
  },
  {
    id: 'noyer',
    nom: 'Noyer',
    famille: 'Bois',
    hex: '#6B4A32',
    image: m('noyer'),
    origine: 'Placage de noyer sur panneau ou massif',
    proprietes: ['Veinage prononcé', 'Fonce légèrement avec le temps', 'Finition mate'],
    entretien: 'Chiffon doux. Éviter les produits siliconés.',
    echantillon: true,
  },
  {
    id: 'laque-noire',
    nom: 'Laque noire mate',
    famille: 'Bois',
    hex: '#141414',
    image: m('laque-noire'),
    origine: 'Laque polyuréthane, huit couches poncées',
    proprietes: ['Absorbe la lumière', 'Surface lisse sans grain', 'Retouchable en atelier'],
    entretien: 'Chiffon microfibre légèrement humide. Aucun produit abrasif.',
    echantillon: true,
  },

  /* ── Pierres ───────────────────────────────────────────────────────── */
  {
    id: 'marbre-noir',
    nom: 'Marbre Marquina',
    famille: 'Pierres',
    hex: '#1C1C1E',
    image: m('marbre-noir'),
    origine: 'Marbre noir veiné de blanc, épaisseur 20 mm',
    proprietes: ['Chants adoucis à la main', 'Veinage unique par plateau', 'Traitement anti-taches'],
    entretien: 'Savon neutre. Essuyer immédiatement les liquides acides.',
    echantillon: false,
  },
  {
    id: 'marbre-clair',
    nom: 'Marbre Crema',
    famille: 'Pierres',
    hex: '#E4D8C4',
    image: m('marbre-clair'),
    origine: 'Marbre beige, épaisseur 20 mm',
    proprietes: ['Veinage doux', 'Plateau validé sur photo avant découpe', 'Traitement anti-taches'],
    entretien: 'Savon neutre. Essuyer immédiatement les liquides acides.',
    echantillon: false,
  },

  /* ── Métaux ────────────────────────────────────────────────────────── */
  {
    id: 'metal-noir',
    nom: 'Acier laqué noir',
    famille: 'Métaux',
    hex: '#141414',
    image: m('metal-noir'),
    origine: 'Acier thermolaqué époxy, finition mate',
    proprietes: ['Soudures meulées invisibles', 'Anti-corrosion', 'Retouchable'],
    entretien: 'Chiffon doux. Aucun produit abrasif.',
    echantillon: true,
  },
  {
    id: 'laiton',
    nom: 'Laiton brossé',
    famille: 'Métaux',
    hex: '#A88B52',
    origine: 'Laiton massif brossé, vernis de protection',
    proprietes: ['Patine naturelle sans vernis, sur demande', 'Brossage directionnel'],
    entretien: 'Chiffon sec. Produit spécifique laiton si patine souhaitée.',
    echantillon: true,
  },
];

export const FAMILLES_MATIERE: FamilleMatiere[] = ['Tissus', 'Cuirs', 'Bois', 'Pierres', 'Métaux'];

export const matiereParId = (id: string) => NUANCIER.find((x) => x.id === id);
