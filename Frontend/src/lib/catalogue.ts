import {
  COLORIS,
  FAMILLES,
  MATIERES,
  PRODUITS,
  REVETEMENTS,
  STYLES,
  type Coloris,
  type Famille,
  type ProduitCatalogue,
  type Revetement,
} from '@/data/catalogue';
import { donnees } from './api';

/**
 * Accès au catalogue depuis le site public.
 *
 * ── Le repli n'est pas de la paresse ────────────────────────────────────
 * Chaque lecture tente l'API, et retombe sur le catalogue figé dans
 * `src/data/catalogue.ts` si elle échoue. Trois raisons :
 *
 *   · le site doit se construire même quand l'API est arrêtée — un `next build`
 *     qui échoue parce qu'une base de données n'est pas démarrée bloquerait
 *     tout déploiement ;
 *   · en production, une API momentanément indisponible doit dégrader le site,
 *     pas l'éteindre. Un visiteur venu d'Instagram voit le catalogue de
 *     référence plutôt qu'une page d'erreur ;
 *   · pendant la reprise, les deux sources cohabitent sans que rien ne casse.
 *
 * Le jour où l'API sera seule dépositaire du catalogue, il suffira de retirer
 * les `catch` — le reste du site ignore l'existence de ce repli.
 */

/** Le catalogue bouge peu ; cinq minutes suffisent (§22.3). */
const REVALIDATION = 300;
const ETIQUETTE = ['catalogue'];

export async function chargerFamilles(): Promise<Famille[]> {
  try {
    const liste = await donnees<Famille[]>('/api/categories', {
      revalidate: REVALIDATION,
      tags: ETIQUETTE,
    });
    if (liste.length > 0) return liste;
  } catch {
    // API injoignable — on sert le catalogue de référence.
  }
  return FAMILLES;
}

export async function chargerFamille(slug: string): Promise<Famille | undefined> {
  return (await chargerFamilles()).find((f) => f.slug === slug);
}

interface ColorisApi {
  slug: string;
  nom: string;
  hex: string;
}

interface RevetementApi {
  slug: string;
  nom: string;
  famille: string;
  hex: string;
  entretien: string;
}

/**
 * Nuancier de coloris — la même API que le formulaire de pièce alimente.
 *
 * L'API expose un `id` technique et un `slug` stable ; le site, comme le
 * reste du catalogue, ne connaît que le second — c'est lui qui est écrit
 * dans `produits.colorisIds`.
 */
export async function chargerColoris(): Promise<Coloris[]> {
  try {
    const liste = await donnees<ColorisApi[]>('/api/coloris', { revalidate: REVALIDATION, tags: ETIQUETTE });
    if (liste.length > 0) return liste.map((c) => ({ id: c.slug, nom: c.nom, hex: c.hex }));
  } catch {
    // API injoignable — on sert le nuancier de référence.
  }
  return COLORIS;
}

/** Nuancier de revêtements. */
export async function chargerRevetements(): Promise<Revetement[]> {
  try {
    const liste = await donnees<RevetementApi[]>('/api/revetements', { revalidate: REVALIDATION, tags: ETIQUETTE });
    if (liste.length > 0) {
      return liste.map((r) => ({
        id: r.slug,
        nom: r.nom,
        famille: r.famille,
        hex: r.hex,
        entretien: r.entretien,
      }));
    }
  } catch {
    // idem
  }
  return REVETEMENTS;
}

/** Étiquettes de matière proposées par le filtre du catalogue. */
export async function chargerMatieres(): Promise<string[]> {
  try {
    const liste = await donnees<{ nom: string }[]>('/api/matieres', { revalidate: REVALIDATION, tags: ETIQUETTE });
    if (liste.length > 0) return liste.map((m) => m.nom);
  } catch {
    // idem
  }
  return [...MATIERES];
}

/** Étiquettes de style proposées par le filtre du catalogue. */
export async function chargerStyles(): Promise<string[]> {
  try {
    const liste = await donnees<{ nom: string }[]>('/api/styles', { revalidate: REVALIDATION, tags: ETIQUETTE });
    if (liste.length > 0) return liste.map((s) => s.nom);
  } catch {
    // idem
  }
  return [...STYLES];
}

export async function chargerProduits(famille?: string): Promise<ProduitCatalogue[]> {
  try {
    const chemin = famille
      ? `/api/produits?famille=${encodeURIComponent(famille)}`
      : '/api/produits';
    const liste = await donnees<ProduitCatalogue[]>(chemin, {
      revalidate: REVALIDATION,
      tags: ETIQUETTE,
    });
    if (liste.length > 0) return liste;
  } catch {
    // idem
  }
  return famille ? PRODUITS.filter((p) => p.familles.includes(famille)) : PRODUITS;
}

export async function chargerProduit(slug: string): Promise<ProduitCatalogue | undefined> {
  try {
    return await donnees<ProduitCatalogue>(`/api/produits/${encodeURIComponent(slug)}`, {
      revalidate: REVALIDATION,
      tags: ETIQUETTE,
    });
  } catch {
    return PRODUITS.find((p) => p.slug === slug);
  }
}

/**
 * Pièces de la même collection, hors la pièce courante.
 *
 * La version d'origine vivait dans `data/catalogue.ts` et travaillait sur le
 * tableau figé ; elle doit désormais voir toutes les pièces publiées.
 */
export async function chargerMemeCollection(
  produit: ProduitCatalogue,
  limite = 4,
): Promise<ProduitCatalogue[]> {
  const toutes = await chargerProduits();
  return toutes
    .filter((p) => p.collection === produit.collection && p.slug !== produit.slug)
    .slice(0, limite);
}
