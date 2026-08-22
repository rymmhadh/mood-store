'use client';

import { useEffect } from 'react';

/** Exécute une action à l'appui d'une touche (Échap pour fermer un panneau). */
export function useTouche(touche: string, action: () => void, actif = true) {
  useEffect(() => {
    if (!actif) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === touche) action();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [touche, action, actif]);
}
