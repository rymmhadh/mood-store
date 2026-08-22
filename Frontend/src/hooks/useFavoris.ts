'use client';

import { useCallback, useEffect, useState } from 'react';

const CLE_STOCKAGE = 'mood-store:favoris';
const EVENEMENT = 'mood-store:favoris-changement';

/** Juste assez pour afficher une carte dans /compte/moodboards sans nouvel appel réseau. */
export interface FavoriProduit {
  slug: string;
  type: string;
  nom: string;
  image: string;
}

function lireStockage(): FavoriProduit[] {
  try {
    const brut = localStorage.getItem(CLE_STOCKAGE);
    return brut ? (JSON.parse(brut) as FavoriProduit[]) : [];
  } catch {
    return [];
  }
}

function ecrireStockage(favoris: FavoriProduit[]) {
  try {
    localStorage.setItem(CLE_STOCKAGE, JSON.stringify(favoris));
  } catch {
    // Navigation privée ou stockage plein : le cœur reste réactif dans l'onglet, sans persister.
  }
  // En dehors du try : même si l'écriture échoue, les cartes déjà montées
  // doivent refléter le choix pour la durée de l'onglet.
  window.dispatchEvent(new Event(EVENEMENT));
}

/**
 * Favoris ("moodboard") persistés dans le navigateur — pas de compte client
 * pour l'instant, donc pas de back-end : même logique que la reprise du
 * configurateur, déjà sauvegardée en `localStorage` (§18).
 *
 * Un événement `window` personnalisé garde toutes les cartes et la page
 * /compte/moodboards synchronisées dans le même onglet : l'événement natif
 * `storage` ne se déclenche que sur les *autres* onglets.
 */
export function useFavoris() {
  const [favoris, setFavoris] = useState<FavoriProduit[]>([]);
  const [pret, setPret] = useState(false);

  useEffect(() => {
    setFavoris(lireStockage());
    setPret(true);

    const surChangement = () => setFavoris(lireStockage());
    window.addEventListener(EVENEMENT, surChangement);
    window.addEventListener('storage', surChangement);
    return () => {
      window.removeEventListener(EVENEMENT, surChangement);
      window.removeEventListener('storage', surChangement);
    };
  }, []);

  const estFavori = useCallback(
    (slug: string) => favoris.some((f) => f.slug === slug),
    [favoris],
  );

  const basculer = useCallback((produit: FavoriProduit) => {
    const actuels = lireStockage();
    const existe = actuels.some((f) => f.slug === produit.slug);
    const suivants = existe
      ? actuels.filter((f) => f.slug !== produit.slug)
      : [...actuels, produit];
    ecrireStockage(suivants);
    setFavoris(suivants);
  }, []);

  const retirer = useCallback((slug: string) => {
    const suivants = lireStockage().filter((f) => f.slug !== slug);
    ecrireStockage(suivants);
    setFavoris(suivants);
  }, []);

  return { favoris, estFavori, basculer, retirer, pret };
}
