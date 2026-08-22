'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { CanalEvenement, Evenement } from '@/types/admin';
import {
  IconeCalendrier,
  IconeCurseurs,
  IconeDemandes,
  IconeEchantillon,
} from '@/components/icons/admin';
import { IconeCoeur } from '@/components/icons';
import { ilYa } from '@/lib/tableauBord';

/** Rafraîchissement du flux. Assez lent pour ne pas peser, assez vif pour vivre. */
const INTERVALLE = 45_000;

const CANAUX: Record<CanalEvenement, { libelle: string; icone: typeof IconeDemandes }> = {
  devis: { libelle: 'Devis', icone: IconeDemandes },
  'rendez-vous': { libelle: 'Rendez-vous', icone: IconeCalendrier },
  configuration: { libelle: 'Configuration', icone: IconeCurseurs },
  message: { libelle: 'Message', icone: IconeCoeur },
  echantillon: { libelle: 'Échantillons', icone: IconeEchantillon },
};

/**
 * Activité en direct.
 *
 * Le flux se recharge tout seul toutes les 45 secondes, et les durées
 * affichées sont recalculées toutes les 30 secondes : un panneau « en direct »
 * qui affiche « il y a 4 min » pendant un quart d'heure ment.
 */
export function FluxActivite({ initial }: { initial: Evenement[] }) {
  const [evenements, setEvenements] = useState(initial);
  const [maintenant, setMaintenant] = useState(() => Date.now());

  useEffect(() => setEvenements(initial), [initial]);

  useEffect(() => {
    const horloge = setInterval(() => setMaintenant(Date.now()), 30_000);
    return () => clearInterval(horloge);
  }, []);

  useEffect(() => {
    const controleur = new AbortController();

    const recharger = async () => {
      try {
        const reponse = await fetch('/api/admin/activite?nombre=12', {
          signal: controleur.signal,
          cache: 'no-store',
        });
        if (!reponse.ok) return;
        const donnees: { evenements: Evenement[] } = await reponse.json();
        setEvenements(donnees.evenements);
      } catch {
        // Réseau coupé : on garde la dernière liste connue plutôt que de vider
        // l'écran. Le prochain battement retentera.
      }
    };

    const battement = setInterval(recharger, INTERVALLE);
    return () => {
      controleur.abort();
      clearInterval(battement);
    };
  }, []);

  return (
    <ol className="flex flex-col">
      {evenements.map((evenement) => {
        const canal = CANAUX[evenement.canal];
        const Icone = canal.icone;

        return (
          <li key={evenement.id} className="border-b border-sable/35 last:border-0">
            <Link
              href={evenement.href}
              className="flex items-start gap-3 py-3.5 transition-colors duration-300 hover:text-bronze"
            >
              <Icone className="mt-0.5 size-4 shrink-0 text-pierre" />
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] leading-snug">{evenement.objet}</span>
                <span className="mt-1 block text-[12px] text-pierre">
                  {evenement.ville} ·{' '}
                  {/* L'horloge du serveur et celle du navigateur ne sont jamais
                      exactement alignées : la durée relative est le seul endroit
                      de l'écran où un écart d'hydratation est normal. */}
                  <time dateTime={evenement.horodatage} suppressHydrationWarning>
                    {ilYa(evenement.horodatage, maintenant)}
                  </time>
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
