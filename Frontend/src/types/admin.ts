/**
 * Back-office — modèle du tableau de bord (cahier des charges §19.3).
 *
 * Ces types décrivent **exactement** la charge utile renvoyée par
 * `GET /api/admin/tableau-de-bord` et `GET /api/admin/activite`. Le jour où
 * ces routes iront chercher les vraies données dans PostgreSQL plutôt que
 * dans le générateur de démonstration, aucun composant n'aura à bouger.
 */

/** Fenêtre d'observation. Le tableau de bord n'en propose pas d'autre. */
export type Periode = '7j' | '30j' | '90j';

export const PERIODES: { id: Periode; libelle: string; jours: number }[] = [
  { id: '7j', libelle: '7 jours', jours: 7 },
  { id: '30j', libelle: '30 jours', jours: 30 },
  { id: '90j', libelle: '90 jours', jours: 90 },
];

export const joursDe = (p: Periode) => PERIODES.find((x) => x.id === p)!.jours;

/* ── Bandeau supérieur : les six indicateurs du jour ──────────────────── */

export interface Indicateur {
  id: string;
  libelle: string;
  /** Valeur principale, déjà mise en forme (« 4 », « 12 400 DT »). */
  valeur: string;
  /** Deux ou trois précisions affichées sous la valeur. */
  details: { libelle: string; valeur: string }[];
  /** Écart en % avec la période précédente. `null` = non comparable. */
  variation: number | null;
  /**
   * Sens vertueux de la variation. Sur « devis sans réponse » une hausse est
   * une mauvaise nouvelle : sans ce drapeau, le back-office féliciterait
   * l'atelier de ne pas répondre à ses clients.
   */
  hausseSouhaitee: boolean;
  /** Module vers lequel l'indicateur renvoie. */
  href: string;
}

/* ── Graphiques ───────────────────────────────────────────────────────── */

/** Un jour de la courbe de trafic. `date` au format ISO (AAAA-MM-JJ). */
export interface PointTrafic {
  date: string;
  visiteurs: number;
  demandes: number;
  /** Publication Instagram ce jour-là : explique les pics. */
  publication?: string;
}

export interface EtapeEntonnoir {
  id: string;
  libelle: string;
  /** Nombre de sessions parvenues à cette étape. */
  valeur: number;
  aide: string;
}

export interface MesureProduit {
  slug: string;
  nom: string;
  type: string;
  collection: string;
  vues: number;
  demandes: number;
}

export interface PartSource {
  id: string;
  libelle: string;
  visiteurs: number;
}

export interface MesureGouvernorat {
  code: string;
  nom: string;
  latitude: number;
  longitude: number;
  visiteurs: number;
}

export interface RechercheVide {
  terme: string;
  occurrences: number;
}

/* ── Colonne latérale ─────────────────────────────────────────────────── */

export type CanalEvenement =
  | 'devis'
  | 'rendez-vous'
  | 'configuration'
  | 'message'
  | 'echantillon';

export interface Evenement {
  id: string;
  canal: CanalEvenement;
  objet: string;
  ville: string;
  /** ISO complet. Le libellé relatif est calculé côté client (voir §hydratation). */
  horodatage: string;
  href: string;
}

export type Gravite = 'critique' | 'attention' | 'information';

export interface Alerte {
  id: string;
  gravite: Gravite;
  libelle: string;
  nombre: number;
  href: string;
}

/* ── Charge utile complète ────────────────────────────────────────────── */

export interface DonneesTableauDeBord {
  periode: Periode;
  /** ISO. Sert d'horloge de référence à tout l'écran. */
  genereLe: string;
  indicateurs: Indicateur[];
  trafic: PointTrafic[];
  entonnoir: EtapeEntonnoir[];
  produits: MesureProduit[];
  sources: PartSource[];
  gouvernorats: MesureGouvernorat[];
  recherchesVides: RechercheVide[];
  alertes: Alerte[];
  evenements: Evenement[];
}
