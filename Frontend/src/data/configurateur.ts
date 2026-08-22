/**
 * Modèle du configurateur sur mesure.
 *
 * Le prix n'est jamais ferme : on renvoie une fourchette (§9.3 du cahier des
 * charges). Elle qualifie le prospect sans engager l'atelier, et évite les
 * demandes hors budget qui font perdre du temps aux deux parties.
 *
 * Le calcul repose sur une base par typologie, proportionnelle au volume
 * développé, majorée par les coefficients de matière et de finition.
 */

export type TypePiece =
  | 'canape'
  | 'fauteuil'
  | 'table'
  | 'chaise'
  | 'dressing'
  | 'bibliotheque'
  | 'tete-de-lit'
  | 'meuble-tv';

export interface Bornes {
  min: number;
  max: number;
  defaut: number;
  pas: number;
}

export interface ModelePiece {
  id: TypePiece;
  nom: string;
  description: string;
  /** Prix plancher, pièce la plus petite en matière d'entrée de gamme. */
  base: number;
  /** Coût au décimètre cube développé. */
  coefVolume: number;
  largeur: Bornes;
  profondeur: Bornes;
  hauteur: Bornes;
  /** Familles de revêtement proposées ; vide = pièce non tapissée. */
  revetements: boolean;
  delaiJours: number;
}

export const MODELES: ModelePiece[] = [
  {
    id: 'canape',
    nom: 'Canapé',
    description: 'Droit, d’angle ou courbe, en modules ou d’un seul tenant.',
    base: 3200,
    coefVolume: 0.62,
    largeur: { min: 160, max: 480, defaut: 260, pas: 5 },
    profondeur: { min: 85, max: 210, defaut: 100, pas: 5 },
    hauteur: { min: 60, max: 95, defaut: 72, pas: 1 },
    revetements: true,
    delaiJours: 45,
  },
  {
    id: 'fauteuil',
    nom: 'Fauteuil',
    description: 'Assise individuelle, avec ou sans accoudoirs.',
    base: 1450,
    coefVolume: 0.55,
    largeur: { min: 60, max: 120, defaut: 80, pas: 2 },
    profondeur: { min: 60, max: 110, defaut: 82, pas: 2 },
    hauteur: { min: 60, max: 110, defaut: 76, pas: 1 },
    revetements: true,
    delaiJours: 32,
  },
  {
    id: 'chaise',
    nom: 'Chaise',
    description: 'Assise de repas, coque garnie ou dossier ajouré.',
    base: 480,
    coefVolume: 0.45,
    largeur: { min: 40, max: 70, defaut: 52, pas: 1 },
    profondeur: { min: 42, max: 70, defaut: 55, pas: 1 },
    hauteur: { min: 70, max: 105, defaut: 78, pas: 1 },
    revetements: true,
    delaiJours: 28,
  },
  {
    id: 'table',
    nom: 'Table de repas',
    description: 'Ronde, ovale ou rectangulaire, sur fût ou piètement.',
    base: 2400,
    coefVolume: 0.38,
    largeur: { min: 100, max: 340, defaut: 200, pas: 5 },
    profondeur: { min: 80, max: 140, defaut: 100, pas: 5 },
    hauteur: { min: 72, max: 78, defaut: 75, pas: 1 },
    revetements: false,
    delaiJours: 42,
  },
  {
    id: 'dressing',
    nom: 'Dressing',
    description: 'Toute hauteur, aménagement intérieur et éclairage intégré.',
    base: 3800,
    coefVolume: 0.30,
    largeur: { min: 120, max: 500, defaut: 260, pas: 10 },
    profondeur: { min: 45, max: 70, defaut: 60, pas: 5 },
    hauteur: { min: 200, max: 300, defaut: 250, pas: 5 },
    revetements: false,
    delaiJours: 55,
  },
  {
    id: 'bibliotheque',
    nom: 'Bibliothèque',
    description: 'Composition murale, niches ouvertes et parties fermées.',
    base: 2900,
    coefVolume: 0.34,
    largeur: { min: 100, max: 600, defaut: 280, pas: 10 },
    profondeur: { min: 28, max: 55, defaut: 38, pas: 2 },
    hauteur: { min: 120, max: 300, defaut: 240, pas: 5 },
    revetements: false,
    delaiJours: 50,
  },
  {
    id: 'tete-de-lit',
    nom: 'Tête de lit',
    description: 'Capitonnée, cannelée ou lisse, pleine hauteur ou basse.',
    base: 1600,
    coefVolume: 0.70,
    largeur: { min: 140, max: 320, defaut: 200, pas: 5 },
    profondeur: { min: 8, max: 20, defaut: 12, pas: 1 },
    hauteur: { min: 60, max: 160, defaut: 120, pas: 5 },
    revetements: true,
    delaiJours: 38,
  },
  {
    id: 'meuble-tv',
    nom: 'Meuble TV',
    description: 'Suspendu ou posé, avec passe-câbles et éclairage.',
    base: 1900,
    coefVolume: 0.36,
    largeur: { min: 100, max: 400, defaut: 220, pas: 10 },
    profondeur: { min: 30, max: 55, defaut: 42, pas: 2 },
    hauteur: { min: 30, max: 70, defaut: 45, pas: 1 },
    revetements: false,
    delaiJours: 40,
  },
];

/* ── Options ─────────────────────────────────────────────────────────── */

export interface Option {
  id: string;
  nom: string;
  /** Multiplicateur appliqué au prix estimé. */
  coef: number;
  detail?: string;
}

/** Structures disponibles, avec l'identifiant de matière du nuancier. */
export const STRUCTURES: Option[] = [
  { id: 'chene', nom: 'Chêne massif', coef: 1.0, detail: 'Finition huilée ou vernie mate' },
  { id: 'noyer', nom: 'Noyer', coef: 1.18, detail: 'Placage ou massif, veinage prononcé' },
  { id: 'laque-noire', nom: 'Laque noire mate', coef: 1.12, detail: 'Huit couches poncées' },
  { id: 'metal-noir', nom: 'Acier laqué noir', coef: 1.06, detail: 'Soudures meulées invisibles' },
  { id: 'marbre-clair', nom: 'Marbre Crema', coef: 1.55, detail: 'Plateaux uniquement' },
  { id: 'marbre-noir', nom: 'Marbre Marquina', coef: 1.62, detail: 'Plateaux uniquement' },
];

export const REVETEMENTS_CONFIG: Option[] = [
  { id: 'boucle-ecru', nom: 'Bouclé Écru', coef: 1.0 },
  { id: 'boucle-sable', nom: 'Bouclé Sable', coef: 1.0 },
  { id: 'lin-naturel', nom: 'Lin lavé Naturel', coef: 1.08, detail: 'Housses déhoussables' },
  { id: 'velours-olive', nom: 'Velours Olive', coef: 1.15 },
  { id: 'velours-terracotta', nom: 'Velours Terracotta', coef: 1.15 },
  { id: 'technique-gris', nom: 'Tissu technique Gris', coef: 1.05, detail: 'Résistant, déperlant' },
  { id: 'cuir-cognac', nom: 'Cuir pleine fleur Cognac', coef: 1.75 },
  { id: 'cuir-encre', nom: 'Cuir pleine fleur Noir', coef: 1.75 },
];

export const PIETEMENTS: Option[] = [
  { id: 'socle', nom: 'Socle plein tapissé', coef: 1.0 },
  { id: 'bois-tourne', nom: 'Bois massif tourné', coef: 1.05 },
  { id: 'metal-noir', nom: 'Métal noir fuselé', coef: 1.04 },
  { id: 'laiton', nom: 'Laiton brossé', coef: 1.14 },
];

export const FINITIONS: Option[] = [
  { id: 'capitonnage', nom: 'Capitonnage', coef: 1.09, detail: 'Piqûres régulières, montage à la main' },
  { id: 'cannelures', nom: 'Cannelures verticales', coef: 1.07, detail: 'Nervures cousues' },
  { id: 'surpiqure', nom: 'Surpiqûre contrastée', coef: 1.03, detail: 'Fil ton sur ton ou contrasté' },
  { id: 'led', nom: 'Éclairage LED intégré', coef: 1.11, detail: 'Ruban 2700 K, variateur inclus' },
  { id: 'dehoussable', nom: 'Housses déhoussables', coef: 1.06, detail: 'Lavables à 30°' },
];

/* ── État et calcul ──────────────────────────────────────────────────── */

export interface Configuration {
  type: TypePiece;
  largeur: number;
  profondeur: number;
  hauteur: number;
  structure: string;
  revetement: string;
  pietement: string;
  finitions: string[];
}

export function configurationInitiale(type: TypePiece): Configuration {
  const m = MODELES.find((x) => x.id === type)!;
  return {
    type,
    largeur: m.largeur.defaut,
    profondeur: m.profondeur.defaut,
    hauteur: m.hauteur.defaut,
    structure: 'chene',
    revetement: m.revetements ? 'boucle-ecru' : '',
    pietement: 'socle',
    finitions: [],
  };
}

const coef = (liste: Option[], id: string) => liste.find((o) => o.id === id)?.coef ?? 1;

/**
 * Estimation en fourchette.
 *
 * Volume développé en décimètres cubes × coefficient de typologie, plus la
 * base, le tout majoré par les coefficients de matière et de finition.
 * L'amplitude de ±11 % couvre les écarts de découpe, de métrage réel de
 * tissu et de complexité de pose.
 */
export function estimer(c: Configuration): { min: number; max: number; delai: number } {
  const modele = MODELES.find((m) => m.id === c.type)!;
  const volumeDm3 = (c.largeur / 10) * (c.profondeur / 10) * (c.hauteur / 10);

  let prix = modele.base + volumeDm3 * modele.coefVolume;
  prix *= coef(STRUCTURES, c.structure);
  if (modele.revetements && c.revetement) prix *= coef(REVETEMENTS_CONFIG, c.revetement);
  prix *= coef(PIETEMENTS, c.pietement);
  for (const f of c.finitions) prix *= coef(FINITIONS, f);

  const arrondi = (v: number) => Math.round(v / 50) * 50;
  const delaiSupp = c.finitions.length * 2;

  return {
    min: arrondi(prix * 0.89),
    max: arrondi(prix * 1.11),
    delai: modele.delaiJours + delaiSupp,
  };
}

export const modeleParId = (id: TypePiece) => MODELES.find((m) => m.id === id)!;
