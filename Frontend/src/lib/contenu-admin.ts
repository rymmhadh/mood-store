import { api, donnees } from './api';
import type { MediaAccueilAdmin, SectionAccueilAdmin } from '@/types/admin-contenu';

/** Lectures serveur du module Contenu — voir la note de `catalogue-admin.ts`. */
const SANS_CACHE = { cache: 'no-store' as const };

export const chargerSectionsAccueilAdmin = () =>
  donnees<SectionAccueilAdmin[]>('/api/admin/accueil/sections', SANS_CACHE);

export const chargerMediasAccueilAdmin = (section: string) =>
  donnees<MediaAccueilAdmin[]>(`/api/admin/accueil/medias?section=${encodeURIComponent(section)}`, SANS_CACHE);

export { api };
export async function essayer<T>(promesse: Promise<T>): Promise<T | null> {
  try {
    return await promesse;
  } catch {
    return null;
  }
}
