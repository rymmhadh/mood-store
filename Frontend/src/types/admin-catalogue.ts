import type { ProduitCatalogue } from '@/data/catalogue';

/** Statuts d'une pièce, dans l'ordre du cycle de vie. */
export const STATUTS = ['brouillon', 'publie', 'archive'] as const;
export type StatutPiece = (typeof STATUTS)[number];

export const LIBELLE_STATUT: Record<StatutPiece, string> = {
  brouillon: 'Brouillon',
  publie: 'En ligne',
  archive: 'Archivée',
};

export interface MediaAdmin {
  id: string;
  url: string;
  largeur: number;
  hauteur: number;
  alt: string;
  legende: string | null;
  role: string;
  lqip: string;
  ordre: number;
}

/** Ce que renvoie `GET /api/admin/produits` : la forme publique, plus la gestion. */
export interface PieceAdmin extends ProduitCatalogue {
  id: string;
  reference: string;
  statut: StatutPiece;
  miseEnAvant: boolean;
  vues: number;
  categorieId: string | null;
  categorieNom: string | null;
  categorieIdsSecondaires: string[];
  collectionIds: string[];
  medias: MediaAdmin[];
  motAtelier: string | null;
  prixPro: number | null;
  seoTitre: string | null;
  seoDescription: string | null;
  creeLe: string;
  modifieLe: string;
}

export interface CategorieAdmin {
  id: string;
  slug: string;
  nom: string;
  parent: string;
  chapo: string;
}

export interface CollectionAdmin {
  id: string;
  slug: string;
  nom: string;
  recit: string | null;
}

export interface UniversAdmin {
  id: string;
  nom: string;
  slug: string;
  familles: CategorieAdmin[];
}

export interface MatiereAdmin {
  id: string;
  nom: string;
  ordre: number;
}

export interface StyleAdmin {
  id: string;
  nom: string;
  ordre: number;
}

export interface ColorisAdmin {
  id: string;
  slug: string;
  nom: string;
  hex: string;
  ordre: number;
}

export interface RevetementAdmin {
  id: string;
  slug: string;
  nom: string;
  famille: string;
  hex: string;
  entretien: string;
  ordre: number;
}

export interface StatsCatalogue {
  total: number;
  publies: number;
  brouillons: number;
  archives: number;
  sansPhoto: number;
  sansTexteAlternatif: number;
}

/** Corps envoyé à `POST` et `PATCH /api/admin/produits`. */
export interface CorpsPiece {
  nom: string;
  type: string;
  categorieId: string;
  categorieIdsSecondaires: string[];
  collectionIds: string[];
  chapo: string;
  description: string[];
  prix: number | null;
  prixSurDemande: boolean;
  statut: StatutPiece;
  nouveaute: boolean;
  miseEnAvant: boolean;
  delaiJours: number;
  demontable: boolean;
  structure: string;
  garnissage: string | null;
  pietement: string;
  matieres: string[];
  styles: string[];
  colorisIds: string[];
  revetementIds: string[];
  mediaIds: string[];
  designer: string;
}
