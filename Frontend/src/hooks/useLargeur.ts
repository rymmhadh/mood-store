'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

/**
 * Largeur mesurée d'un élément.
 *
 * Les graphiques sont tracés en pixels réels plutôt qu'avec un `viewBox`
 * élastique : sur un `viewBox` mis à l'échelle, les libellés d'axe rétrécissent
 * avec le dessin et deviennent illisibles en mobile — or le mobile est le vrai
 * site (§1.2). En mesurant, le texte garde sa taille à toutes les largeurs.
 *
 * La valeur initiale est volontairement identique au rendu serveur et au
 * premier rendu client : aucune divergence d'hydratation. La mesure réelle
 * arrive juste après, au montage.
 */
export function useLargeur<T extends HTMLElement>(
  defaut = 720,
): [RefObject<T | null>, number] {
  const ref = useRef<T>(null);
  const [largeur, setLargeur] = useState(defaut);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observateur = new ResizeObserver(([entree]) => {
      const mesure = entree.contentRect.width;
      if (mesure > 0) setLargeur(Math.round(mesure));
    });

    observateur.observe(element);
    return () => observateur.disconnect();
  }, []);

  return [ref, largeur];
}
