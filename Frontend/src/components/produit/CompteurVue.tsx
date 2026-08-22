'use client';

import { useEffect } from 'react';
import { URL_API } from '@/lib/api';

/**
 * Enregistre une consultation de fiche.
 *
 * ── Pourquoi côté navigateur, et pas au rendu ───────────────────────────
 * Compter dans le composant serveur serait plus simple et faux : une page est
 * rendue pour un robot d'indexation, pour un préchargement de lien, pour
 * reconstruire un cache expiré. Aucun de ces cas n'est une visite. Ici, le
 * compteur ne part qu'une fois la page réellement affichée dans un navigateur.
 *
 * ── Pourquoi une seule fois par session ─────────────────────────────────
 * `sessionStorage` retient les fiches déjà comptées : un aller-retour vers la
 * grille et un retour sur la même pièce ne doivent pas la faire monter deux
 * fois dans « les pièces les plus vues ». Le stockage disparaît à la fermeture
 * de l'onglet, ce qui est exactement la durée de vie voulue.
 *
 * L'échec est silencieux et sans conséquence : une statistique manquée ne
 * justifie ni message d'erreur ni ralentissement de la page.
 */
export function CompteurVue({ slug }: { slug: string }) {
  useEffect(() => {
    const cle = `vue:${slug}`;

    try {
      if (sessionStorage.getItem(cle)) return;
      sessionStorage.setItem(cle, '1');
    } catch {
      // Navigation privée, stockage refusé : on compte quand même.
    }

    const controleur = new AbortController();

    // `keepalive` : la requête part même si le visiteur quitte la page dans
    // la seconde qui suit.
    void fetch(`${URL_API}/api/produits/${encodeURIComponent(slug)}/vue`, {
      method: 'POST',
      signal: controleur.signal,
      keepalive: true,
    }).catch(() => {});

    return () => controleur.abort();
  }, [slug]);

  return null;
}
