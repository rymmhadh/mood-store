import type { Media } from '../entites/media.entite';
import type { Produit, StatutProduit } from '../entites/produit.entite';

/**
 * Forme publique d'une pièce.
 *
 * Elle reproduit **exactement** l'interface `ProduitCatalogue` du front
 * (`src/data/catalogue.ts`). C'est délibéré : le site public a été écrit sur
 * ce contrat avant que l'API existe, et il ne doit pas changer d'une ligne
 * quand la source des données change.
 */
export interface ProduitPublicDto {
  slug: string;
  type: string;
  nom: string;
  collection: string;
  designer: string;
  chapo: string;
  description: string[];
  familles: string[];
  images: string[];
  prix?: number;
  prixSurDemande?: boolean;
  nouveaute?: boolean;
  dimensions: {
    nom: string;
    largeur: number;
    hauteur: number;
    profondeur: number;
    surcout?: number;
  }[];
  colorisIds: string[];
  revetementIds: string[];
  matieres: string[];
  styles: string[];
  structure: string;
  garnissage?: string;
  pietement: string;
  delaiJours: number;
  demontable: boolean;
}

export interface MediaDto {
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

/** Ce que voit le back-office : la forme publique, plus la gestion. */
export interface ProduitAdminDto extends ProduitPublicDto {
  id: string;
  reference: string;
  statut: StatutProduit;
  miseEnAvant: boolean;
  vues: number;
  categorieId: string | null;
  categorieNom: string | null;
  categorieIdsSecondaires: string[];
  collectionIds: string[];
  medias: MediaDto[];
  motAtelier: string | null;
  prixPro: number | null;
  seoTitre: string | null;
  seoDescription: string | null;
  creeLe: string;
  modifieLe: string;
}

const nombre = (v: string | null): number | null => (v === null ? null : Number(v));

/**
 * Catégories dans lesquelles la pièce apparaît : la principale d'abord, puis
 * les secondaires. La principale en tête est ce qui fixe le fil d'Ariane.
 */
function famillesDe(p: Produit): string[] {
  const slugs = [
    ...(p.categorie ? [p.categorie.slug] : []),
    ...(p.categoriesSecondaires ?? []).map((c) => c.slug),
  ];
  return [...new Set(slugs)];
}

function versMediaDto(m: Media): MediaDto {
  return {
    id: m.id,
    url: m.url,
    largeur: m.largeur,
    hauteur: m.hauteur,
    alt: m.alt,
    legende: m.legende,
    role: m.role,
    lqip: m.lqip,
    ordre: m.ordre,
  };
}

const parOrdre = <T extends { ordre: number }>(liste: T[] | undefined) =>
  [...(liste ?? [])].sort((a, b) => a.ordre - b.ordre);

export function versProduitPublic(p: Produit, urlPublique: string): ProduitPublicDto {
  const prix = nombre(p.prix);

  return {
    slug: p.slug,
    type: p.type,
    nom: p.nom,
    collection: p.collections?.[0]?.nom ?? '',
    designer: p.designer,
    chapo: p.chapo,
    description: p.description ?? [],
    familles: famillesDe(p),
    images: parOrdre(p.medias).map((m) => absolu(m.url, urlPublique)),
    ...(prix !== null && !p.prixSurDemande ? { prix } : {}),
    ...(p.prixSurDemande ? { prixSurDemande: true } : {}),
    ...(p.nouveaute ? { nouveaute: true } : {}),
    dimensions: parOrdre(p.dimensions).map((d) => ({
      nom: d.nom,
      largeur: d.largeur,
      hauteur: d.hauteur,
      profondeur: d.profondeur,
      ...(d.surcout ? { surcout: d.surcout } : {}),
    })),
    colorisIds: p.colorisIds ?? [],
    revetementIds: p.revetementIds ?? [],
    matieres: p.matieres ?? [],
    styles: p.styles ?? [],
    structure: p.structure,
    ...(p.garnissage ? { garnissage: p.garnissage } : {}),
    pietement: p.pietement,
    delaiJours: p.delaiJours,
    demontable: p.demontable,
  };
}

export function versProduitAdmin(p: Produit, urlPublique: string): ProduitAdminDto {
  return {
    ...versProduitPublic(p, urlPublique),
    id: p.id,
    reference: p.reference,
    statut: p.statut,
    miseEnAvant: p.miseEnAvant,
    vues: p.vues,
    categorieId: p.categorieId,
    categorieNom: p.categorie?.nom ?? null,
    categorieIdsSecondaires: (p.categoriesSecondaires ?? []).map((c) => c.id),
    collectionIds: (p.collections ?? []).map((c) => c.id),
    medias: parOrdre(p.medias).map((m) => ({
      ...versMediaDto(m),
      url: absolu(m.url, urlPublique),
    })),
    motAtelier: p.motAtelier,
    prixPro: nombre(p.prixPro),
    seoTitre: p.seoTitre,
    seoDescription: p.seoDescription,
    creeLe: p.creeLe?.toISOString() ?? '',
    modifieLe: p.modifieLe?.toISOString() ?? '',
  };
}

/**
 * Rend absolus les chemins servis par l'API.
 *
 * Deux origines cohabitent, et c'est voulu :
 *   · `/media/...`  — photographies téléversées, servies par cette API. Elles
 *     reçoivent le préfixe : le front tourne sur un autre port, et demain sur
 *     un autre domaine ou un CDN. Les chemins étant stockés relatifs, cette
 *     bascule ne demandera aucune migration de données.
 *   · `/images/...` — visuels historiques, versionnés dans `public/` du front
 *     et servis par lui. Les préfixer casserait le site.
 *
 * Une URL déjà absolue est rendue telle quelle.
 */
function absolu(chemin: string, urlPublique: string): string {
  if (/^https?:/i.test(chemin)) return chemin;
  if (!chemin.startsWith('/media/')) return chemin;
  return `${urlPublique.replace(/\/+$/, '')}${chemin}`;
}
