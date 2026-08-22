import { api, donnees } from './api';
import type {
  CategorieAdmin,
  CollectionAdmin,
  ColorisAdmin,
  MatiereAdmin,
  PieceAdmin,
  RevetementAdmin,
  StatsCatalogue,
  StyleAdmin,
  UniversAdmin,
} from '@/types/admin-catalogue';
import type { MetaApi } from './api';

/**
 * Lectures serveur du module Catalogue.
 *
 * Aucun cache : le back-office doit montrer l'état réel de la base, pas une
 * copie de trente secondes. Une fiche qu'on vient d'enregistrer et qui
 * réapparaît dans son état précédent détruit la confiance dans l'outil.
 *
 * Contrairement au site public, il n'y a pas de repli sur des données figées :
 * un back-office qui afficherait un catalogue fantôme alors que l'API est
 * tombée ferait bien pire que de l'annoncer. L'erreur est donc remontée, et
 * l'écran l'affiche.
 */
const SANS_CACHE = { cache: 'no-store' as const };

export async function chargerPieces(recherche?: string): Promise<{
  pieces: PieceAdmin[];
  meta: MetaApi | null;
}> {
  const requete = new URLSearchParams({ page: '1', parPage: '24', tri: 'recent' });
  if (recherche) requete.set('recherche', recherche);

  const { data, meta } = await api<PieceAdmin[]>(`/api/admin/produits?${requete}`, SANS_CACHE);
  return { pieces: data, meta };
}

export const chargerPiece = (id: string) =>
  donnees<PieceAdmin>(`/api/admin/produits/${id}`, SANS_CACHE);

export const chargerCategoriesAdmin = () =>
  donnees<CategorieAdmin[]>('/api/admin/categories', SANS_CACHE);

export const chargerCollectionsAdmin = () =>
  donnees<CollectionAdmin[]>('/api/admin/collections', SANS_CACHE);

export const chargerStatsCatalogue = () =>
  donnees<StatsCatalogue>('/api/admin/stats/catalogue', SANS_CACHE);

export const chargerArbreAdmin = () =>
  donnees<UniversAdmin[]>('/api/admin/categories/arbre', SANS_CACHE);

export const chargerMatieresAdmin = () =>
  donnees<MatiereAdmin[]>('/api/admin/matieres', SANS_CACHE);

export const chargerStylesAdmin = () =>
  donnees<StyleAdmin[]>('/api/admin/styles', SANS_CACHE);

export const chargerColorisAdmin = () =>
  donnees<ColorisAdmin[]>('/api/admin/coloris', SANS_CACHE);

export const chargerRevetementsAdmin = () =>
  donnees<RevetementAdmin[]>('/api/admin/revetements', SANS_CACHE);

/** Version tolérante : rend `null` plutôt que de faire échouer la page. */
export async function essayer<T>(promesse: Promise<T>): Promise<T | null> {
  try {
    return await promesse;
  } catch {
    return null;
  }
}
