'use client';

import { useCallback, useMemo, useState, useTransition } from 'react';
import type { Alerte, DonneesTableauDeBord, Periode } from '@/types/admin';
import type { StatsCatalogue } from '@/types/admin-catalogue';
import { Alertes } from './Alertes';
import { BandeauIndicateurs } from './BandeauIndicateurs';
import { EnTetePage } from './EnTetePage';
import { SelecteurPeriode, jourEnToutesLettres } from './EnTeteAdmin';
import { FluxActivite } from './FluxActivite';
import { Panneau } from './Panneau';
import { BarresClassees } from './graphiques/BarresClassees';
import { CarteGouvernorats } from './graphiques/CarteGouvernorats';
import { CourbeTrafic } from './graphiques/CourbeTrafic';
import { EcartTransformation } from './graphiques/EcartTransformation';
import { Entonnoir } from './graphiques/Entonnoir';
import { PartSources } from './graphiques/PartSources';
import { cn } from '@/lib/cn';

/**
 * Module 1 du back-office — tableau de bord (§19.3).
 *
 * Le premier jeu de données arrive déjà rendu par le serveur : l'écran est
 * lisible avant même que le JavaScript ait démarré. Les changements de période
 * passent ensuite par `GET /api/admin/tableau-de-bord`, ce qui valide dès
 * maintenant le contrat que le back NestJS devra respecter.
 */
interface Props {
  initial: DonneesTableauDeBord;
  /**
   * Compteurs réels du catalogue, lus dans PostgreSQL.
   *
   * Le reste de l'écran travaille encore sur des séries simulées — le
   * back-office n'enregistre pas encore les visites ni les demandes. Les
   * alertes du catalogue, elles, portent sur des données existantes : elles
   * sont donc branchées pour de bon, et remplacent les valeurs simulées.
   */
  statsCatalogue: StatsCatalogue | null;
}

export function TableauDeBord({ initial, statsCatalogue }: Props) {
  const [donnees, setDonnees] = useState(initial);
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, demarrer] = useTransition();

  const charger = useCallback((periode: Periode) => {
    demarrer(async () => {
      try {
        const reponse = await fetch(`/api/admin/tableau-de-bord?periode=${periode}`, {
          cache: 'no-store',
        });
        if (!reponse.ok) throw new Error(String(reponse.status));
        setDonnees(await reponse.json());
        setErreur(null);
      } catch {
        setErreur(
          'Les chiffres n’ont pas pu être rechargés. Ceux affichés datent du dernier chargement réussi.',
        );
      }
    });
  }, []);

  /**
   * Alertes du catalogue, recalculées sur les vrais compteurs.
   *
   * On remplace la valeur simulée plutôt que d'ajouter une ligne : deux
   * alertes « pièces sans photographie » côte à côte, l'une inventée et
   * l'autre exacte, rendraient les deux inutilisables.
   */
  const alertes = useMemo<Alerte[]>(() => {
    if (!statsCatalogue) return donnees.alertes;

    const liste = donnees.alertes
      .filter((a) => a.id !== 'produits-sans-photo')
      .concat(
        statsCatalogue.sansPhoto > 0
          ? [
              {
                id: 'produits-sans-photo',
                gravite: 'attention' as const,
                libelle: 'Pièces du catalogue sans photographie',
                nombre: statsCatalogue.sansPhoto,
                href: '/admin/catalogue?filtre=sans-photo',
              },
            ]
          : [],
        statsCatalogue.sansTexteAlternatif > 0
          ? [
              {
                id: 'sans-alt',
                gravite: 'information' as const,
                libelle: 'Photographies sans texte alternatif',
                nombre: statsCatalogue.sansTexteAlternatif,
                href: '/admin/catalogue',
              },
            ]
          : [],
        statsCatalogue.brouillons > 0
          ? [
              {
                id: 'brouillons',
                gravite: 'information' as const,
                libelle: 'Fiches en brouillon, jamais publiées',
                nombre: statsCatalogue.brouillons,
                href: '/admin/catalogue?statut=brouillon',
              },
            ]
          : [],
      );

    const rang = { critique: 0, attention: 1, information: 2 };
    return liste.sort((a, b) => rang[a.gravite] - rang[b.gravite]);
  }, [donnees.alertes, statsCatalogue]);

  const { plusVues, plusDemandees } = useMemo(
    () => ({
      plusVues: [...donnees.produits]
        .sort((a, b) => b.vues - a.vues)
        .slice(0, 10)
        .map((p) => ({ cle: p.slug, libelle: p.nom, detail: p.type, valeur: p.vues })),
      plusDemandees: [...donnees.produits]
        .sort((a, b) => b.demandes - a.demandes)
        .slice(0, 10)
        .map((p) => ({ cle: p.slug, libelle: p.nom, detail: p.type, valeur: p.demandes })),
    }),
    [donnees.produits],
  );

  return (
    <>
      <EnTetePage
        titre="Tableau de bord"
        soustitre={`${jourEnToutesLettres(donnees.genereLe)} — vue d’ensemble de la maison`}
        actions={
          <SelecteurPeriode
            periode={donnees.periode}
            onPeriode={charger}
            chargement={chargement}
            onRafraichir={() => charger(donnees.periode)}
          />
        }
      />

      <div
        id="tableau"
        className={cn(
          'px-6 py-8 lg:px-10 lg:py-10',
          'transition-opacity duration-500 ease-[var(--ease-doux)]',
          chargement && 'opacity-55',
        )}
      >
        {erreur && (
          <p
            role="alert"
            className="mb-8 border border-bronze bg-blanc px-5 py-4 text-[14px] text-fumee"
          >
            {erreur}
          </p>
        )}

        <BandeauIndicateurs indicateurs={donnees.indicateurs} />

        <div className="mt-8 grid items-start gap-6 2xl:grid-cols-[minmax(0,1fr)_21rem]">
          <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2">
            <Panneau
              titre="Trafic et demandes de devis"
              aide="Les repères marquent les jours de publication Instagram : l’effet d’une parution se lit sur les deux cadres à la fois."
              className="lg:col-span-2"
            >
              <CourbeTrafic points={donnees.trafic} />
            </Panneau>

            <Panneau
              titre="Entonnoir de conversion"
              aide="À chaque étape, la part des visiteurs qui poursuit — et celle qui s’arrête."
              className="lg:col-span-2"
            >
              <Entonnoir etapes={donnees.entonnoir} />
            </Panneau>

            <Panneau titre="Les pièces les plus vues" aide="Fiches produit ouvertes sur la période.">
              <BarresClassees
                lignes={plusVues}
                unite="Vues"
                legendeTableau="Voir le classement en chiffres"
              />
            </Panneau>

            <Panneau
              titre="Les pièces les plus demandées"
              aide="Demandes de devis reçues sur la période."
            >
              <BarresClassees
                lignes={plusDemandees}
                unite="Demandes"
                legendeTableau="Voir le classement en chiffres"
              />
            </Panneau>

            <Panneau
              titre="Ce qui est regardé, ce qui est demandé"
              aide="Une pièce très consultée mais rarement demandée a un problème de prix, de photographie ou de description. C’est l’écart, et non les deux classements pris séparément, qui le révèle."
              className="lg:col-span-2"
            >
              <EcartTransformation produits={donnees.produits} />
            </Panneau>

            <Panneau titre="Provenance des visiteurs" aide="Audience par gouvernorat.">
              <CarteGouvernorats gouvernorats={donnees.gouvernorats} />
            </Panneau>

            <Panneau
              titre="Sources d’acquisition"
              aide="Par quel chemin les visiteurs arrivent sur le site."
            >
              <PartSources sources={donnees.sources} />
            </Panneau>

            <Panneau
              titre="Recherches sans résultat"
              aide="Ce que les visiteurs cherchent et que le site ne propose pas encore. La demande non satisfaite, écrite par les clients eux-mêmes."
              className="lg:col-span-2"
            >
              <BarresClassees
                lignes={donnees.recherchesVides.map((r) => ({
                  cle: r.terme,
                  libelle: r.terme,
                  valeur: r.occurrences,
                }))}
                unite="Recherches"
                legendeTableau="Voir les termes en chiffres"
              />
            </Panneau>
          </div>

          <aside className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2 2xl:sticky 2xl:top-28 2xl:grid-cols-1">
            <Panneau
              titre="Activité en direct"
              extra={
                <span className="flex items-center gap-2">
                  <span className="size-1.5 animate-pulse rounded-full bg-bronze" aria-hidden />
                  en continu
                </span>
              }
            >
              <FluxActivite initial={donnees.evenements} />
            </Panneau>

            <Panneau titre="À traiter">
              <Alertes alertes={alertes} />
            </Panneau>
          </aside>
        </div>

        <p className="mt-10 max-w-3xl text-[12px] leading-relaxed text-pierre">
          Les compteurs du catalogue — pièces, brouillons, photographies manquantes — viennent de
          PostgreSQL via <code>GET /api/admin/stats/catalogue</code>. Le trafic, l’entonnoir et les
          demandes sont encore simulés par <code>src/lib/tableauBord.ts</code>, à la forme exacte
          des réponses attendues : leur branchement ne touchera pas à ces écrans.
        </p>
      </div>
    </>
  );
}
