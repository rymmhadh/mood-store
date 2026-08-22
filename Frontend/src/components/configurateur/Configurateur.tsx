'use client';

import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { IconeChevron, IconeFermer, IconeWhatsApp } from '@/components/icons';
import { LogoMood } from '@/components/ui/LogoMood';
import { Silhouette } from './Silhouette';
import { Curseur } from './Curseur';
import { Pastille } from './Pastille';
import {
  configurationInitiale,
  estimer,
  FINITIONS,
  MODELES,
  modeleParId,
  PIETEMENTS,
  REVETEMENTS_CONFIG,
  STRUCTURES,
  type Configuration,
  type TypePiece,
} from '@/data/configurateur';
import { matiereParId } from '@/data/matieres';
import { prixFr } from '@/data/catalogue';
import { lienWhatsApp } from '@/data/site';
import { DUREE, EASE_DOUX } from '@/lib/motion';
import { cn } from '@/lib/cn';

const CLE_STOCKAGE = 'mood-configuration';

const ETAPES = [
  'La pièce',
  'Les dimensions',
  'La structure',
  'Le revêtement',
  'Le piètement',
  'Les finitions',
] as const;

/**
 * Configurateur sur mesure.
 *
 * Six écrans, une question par écran. L'aperçu reste visible en permanence :
 * chaque choix se voit immédiatement, ce qui transforme un formulaire en
 * exercice de conception.
 *
 * La configuration est conservée en `localStorage` : un visiteur qui revient
 * reprend là où il s'était arrêté (§9.5).
 */
export function Configurateur() {
  const [etape, setEtape] = useState(0);
  const [config, setConfig] = useState<Configuration>(() => configurationInitiale('canape'));
  const [repriseProposee, setRepriseProposee] = useState(false);

  const modele = modeleParId(config.type);
  const devis = useMemo(() => estimer(config), [config]);

  /* Reprise de session */
  useEffect(() => {
    const brut = localStorage.getItem(CLE_STOCKAGE);
    if (brut) setRepriseProposee(true);
  }, []);

  useEffect(() => {
    localStorage.setItem(CLE_STOCKAGE, JSON.stringify(config));
  }, [config]);

  const maj = (partiel: Partial<Configuration>) => setConfig((c) => ({ ...c, ...partiel }));

  const changerType = (type: TypePiece) => {
    setConfig(configurationInitiale(type));
    setEtape(1);
  };

  const basculerFinition = (id: string) =>
    setConfig((c) => ({
      ...c,
      finitions: c.finitions.includes(id)
        ? c.finitions.filter((f) => f !== id)
        : [...c.finitions, id],
    }));

  const couleur = (id: string) => matiereParId(id)?.hex ?? '#C9BCA9';
  const recapitulatif = [
    modele.nom,
    `${config.largeur} × ${config.profondeur} × ${config.hauteur} cm`,
    matiereParId(config.structure)?.nom,
    modele.revetements ? matiereParId(config.revetement)?.nom : null,
    PIETEMENTS.find((p) => p.id === config.pietement)?.nom,
    ...config.finitions.map((f) => FINITIONS.find((x) => x.id === f)?.nom),
  ]
    .filter(Boolean)
    .join(' · ');

  const dernier = etape === ETAPES.length;

  return (
    <div className="flex min-h-svh flex-col bg-craie">
      {/* ── Barre d'étapes ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 border-b border-sable/60 bg-craie/97 backdrop-blur-md">
        <div className="conteneur flex h-20 items-center justify-between gap-6">
          <LogoMood taille={44} sansSurvol />

          <ol className="hidden flex-1 items-center justify-center gap-2 lg:flex">
            {ETAPES.map((nom, i) => (
              <li key={nom} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEtape(i)}
                  disabled={i > etape}
                  className={cn(
                    'text-[13px] transition-colors disabled:cursor-not-allowed',
                    i === etape ? 'text-encre' : i < etape ? 'text-fumee hover:text-encre' : 'text-sable',
                  )}
                >
                  <span className="tabular-nums">0{i + 1}</span> {nom}
                </button>
                {i < ETAPES.length - 1 && (
                  <span
                    aria-hidden
                    className={cn('h-px w-8 transition-colors', i < etape ? 'bg-bronze' : 'bg-sable/60')}
                  />
                )}
              </li>
            ))}
          </ol>

          <Link
            href="/sur-mesure"
            aria-label="Quitter le configurateur"
            className="bouton-icone -mr-3"
          >
            <IconeFermer className="size-5" strokeWidth={1.6} />
          </Link>
        </div>

        {/* Progression, sur mobile */}
        <div className="h-px w-full bg-sable/40 lg:hidden">
          <div
            className="h-px bg-bronze transition-[width] duration-500 ease-[var(--ease-doux)]"
            style={{ width: `${((etape + 1) / (ETAPES.length + 1)) * 100}%` }}
          />
        </div>
      </header>

      <div className="grid flex-1 lg:grid-cols-[1fr_30rem] xl:grid-cols-[1fr_34rem]">
        {/* ── Aperçu ────────────────────────────────────────────────── */}
        <section
          aria-label="Aperçu de votre pièce"
          className="relative flex min-h-[22rem] items-center justify-center bg-galerie p-8 lg:sticky lg:top-20 lg:h-[calc(100svh-5rem)]"
        >
          <div className="w-full max-w-3xl">
            <Silhouette
              config={config}
              couleurStructure={couleur(config.structure)}
              couleurRevetement={couleur(config.revetement)}
              couleurPietement={
                config.pietement === 'socle'
                  ? couleur(modele.revetements ? config.revetement : config.structure)
                  : couleur(config.pietement === 'bois-tourne' ? 'chene' : config.pietement)
              }
            />
          </div>

          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-[12px] text-pierre">
            Élévation de face à l’échelle · schéma de proportions, non contractuel
          </p>
        </section>

        {/* ── Panneau d'options ─────────────────────────────────────── */}
        <section className="border-t border-sable/60 lg:border-t-0 lg:border-l">
          <div className="px-[var(--marge-laterale)] py-10 lg:px-12 lg:py-14">
            <AnimatePresence mode="wait">
              <motion.div
                key={etape}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: DUREE.rapide, ease: EASE_DOUX }}
              >
                {etape === 0 && (
                  <Etape titre="Quelle pièce souhaitez-vous créer ?" numero={1}>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {MODELES.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => changerType(m.id)}
                          aria-pressed={config.type === m.id}
                          className={cn(
                            'border p-5 text-left transition-all duration-300',
                            config.type === m.id
                              ? 'border-encre bg-galerie'
                              : 'border-sable/60 hover:border-encre/50',
                          )}
                        >
                          <span className="block text-[17px]">{m.nom}</span>
                          <span className="mt-1.5 block text-[13px] leading-relaxed text-pierre">
                            {m.description}
                          </span>
                        </button>
                      ))}
                    </div>
                  </Etape>
                )}

                {etape === 1 && (
                  <Etape titre="Quelles dimensions ?" numero={2}>
                    <div className="space-y-9">
                      <Curseur
                        libelle="Largeur"
                        bornes={modele.largeur}
                        valeur={config.largeur}
                        onChange={(largeur) => maj({ largeur })}
                      />
                      <Curseur
                        libelle="Profondeur"
                        bornes={modele.profondeur}
                        valeur={config.profondeur}
                        onChange={(profondeur) => maj({ profondeur })}
                      />
                      <Curseur
                        libelle="Hauteur"
                        bornes={modele.hauteur}
                        valeur={config.hauteur}
                        onChange={(hauteur) => maj({ hauteur })}
                      />
                    </div>
                    <p className="mt-8 border-t border-sable/60 pt-6 text-[13px] leading-relaxed text-pierre">
                      Le dessin est à l’échelle : la silhouette mesure 170 cm. Si votre pièce
                      impose une cote au millimètre, indiquez-la dans la demande de devis.
                    </p>
                  </Etape>
                )}

                {etape === 2 && (
                  <Etape titre="Quelle structure ?" numero={3}>
                    <div className="space-y-2">
                      {STRUCTURES.map((o) => (
                        <Pastille
                          key={o.id}
                          option={o}
                          actif={config.structure === o.id}
                          onClick={() => maj({ structure: o.id })}
                        />
                      ))}
                    </div>
                  </Etape>
                )}

                {etape === 3 && (
                  <Etape titre="Quel revêtement ?" numero={4}>
                    {modele.revetements ? (
                      <div className="space-y-2">
                        {REVETEMENTS_CONFIG.map((o) => (
                          <Pastille
                            key={o.id}
                            option={o}
                            actif={config.revetement === o.id}
                            onClick={() => maj({ revetement: o.id })}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-[15px] leading-relaxed text-fumee">
                        Cette typologie n’est pas tapissée : la finition est déterminée par la
                        structure choisie à l’étape précédente.
                      </p>
                    )}
                  </Etape>
                )}

                {etape === 4 && (
                  <Etape titre="Quel piètement ?" numero={5}>
                    <div className="space-y-2">
                      {PIETEMENTS.map((o) => (
                        <Pastille
                          key={o.id}
                          option={o}
                          actif={config.pietement === o.id}
                          onClick={() => maj({ pietement: o.id })}
                        />
                      ))}
                    </div>
                  </Etape>
                )}

                {etape === 5 && (
                  <Etape titre="Quelles finitions ?" numero={6}>
                    <p className="mb-6 text-[13px] text-pierre">
                      Plusieurs choix possibles. Chaque finition allonge le délai de deux jours.
                    </p>
                    <div className="space-y-2">
                      {FINITIONS.map((o) => (
                        <button
                          key={o.id}
                          type="button"
                          onClick={() => basculerFinition(o.id)}
                          aria-pressed={config.finitions.includes(o.id)}
                          className={cn(
                            'flex w-full items-start gap-4 border p-4 text-left transition-all duration-300',
                            config.finitions.includes(o.id)
                              ? 'border-encre bg-galerie'
                              : 'border-sable/60 hover:border-encre/50',
                          )}
                        >
                          <span
                            className={cn(
                              'mt-0.5 flex size-[18px] shrink-0 items-center justify-center border transition-colors',
                              config.finitions.includes(o.id)
                                ? 'border-encre bg-encre'
                                : 'border-sable',
                            )}
                          >
                            {config.finitions.includes(o.id) && (
                              <svg viewBox="0 0 12 12" className="size-3 text-craie" aria-hidden>
                                <path
                                  d="M2.5 6.2 4.8 8.5 9.5 3.8"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.6"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </span>
                          <span>
                            <span className="block text-[15px]">{o.nom}</span>
                            {o.detail && (
                              <span className="mt-0.5 block text-[13px] text-pierre">{o.detail}</span>
                            )}
                          </span>
                        </button>
                      ))}
                    </div>
                  </Etape>
                )}

                {dernier && (
                  <Etape titre="Votre pièce" numero={0}>
                    <dl className="divide-y divide-sable/50 border-y border-sable/50">
                      {[
                        ['Typologie', modele.nom, 0],
                        ['Dimensions', `${config.largeur} × ${config.profondeur} × ${config.hauteur} cm`, 1],
                        ['Structure', matiereParId(config.structure)?.nom ?? '—', 2],
                        ...(modele.revetements
                          ? ([['Revêtement', matiereParId(config.revetement)?.nom ?? '—', 3]] as const)
                          : []),
                        ['Piètement', PIETEMENTS.find((p) => p.id === config.pietement)?.nom ?? '—', 4],
                        [
                          'Finitions',
                          config.finitions.length
                            ? config.finitions
                                .map((f) => FINITIONS.find((x) => x.id === f)?.nom)
                                .join(', ')
                            : 'Aucune',
                          5,
                        ],
                      ].map(([cle, valeur, cible]) => (
                        <div key={String(cle)} className="flex items-baseline justify-between gap-6 py-4">
                          <dt className="text-[13px] text-pierre">{cle}</dt>
                          <dd className="flex items-baseline gap-4 text-right text-[15px]">
                            {valeur}
                            <button
                              type="button"
                              onClick={() => setEtape(Number(cible))}
                              className="lien-souligne text-[13px] text-pierre"
                            >
                              Modifier
                            </button>
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <div className="mt-8 bg-galerie p-7">
                      <p className="eyebrow text-pierre">Estimation</p>
                      <p className="mt-3 text-[28px] leading-none font-light">
                        {prixFr.format(devis.min)} – {prixFr.format(devis.max)} DT
                      </p>
                      <p className="mt-4 text-[13px] leading-relaxed text-pierre">
                        Fourchette indicative, livraison et montage inclus dans le Grand Tunis.
                        Le prix ferme est arrêté au devis, après relevé des cotes.
                        <br />
                        Délai estimé : {devis.delai} jours ouvrés.
                      </p>
                    </div>

                    <div className="mt-8 space-y-3">
                      <Link
                        href="/contact"
                        className="flex h-16 w-full items-center justify-center bg-encre text-[15px] text-craie transition-colors hover:bg-fumee"
                      >
                        Demander mon devis détaillé
                      </Link>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <a
                          href={lienWhatsApp(
                            `Bonjour, voici ma configuration : ${recapitulatif}. Estimation affichée : ${prixFr.format(devis.min)} – ${prixFr.format(devis.max)} DT.`,
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-14 items-center justify-center gap-2.5 border border-sable libelle-action transition-colors hover:border-encre"
                        >
                          <IconeWhatsApp className="size-4" strokeWidth={1.5} />
                          Envoyer sur WhatsApp
                        </a>
                        <Link
                          href="/showroom/rendez-vous"
                          className="flex h-14 items-center justify-center border border-encre libelle-action transition-colors hover:bg-encre hover:text-craie"
                        >
                          En parler au showroom
                        </Link>
                      </div>
                    </div>
                  </Etape>
                )}
              </motion.div>
            </AnimatePresence>

            {/* ── Navigation ──────────────────────────────────────── */}
            <div className="mt-10 flex items-center justify-between gap-4 border-t border-sable/60 pt-6">
              <button
                type="button"
                onClick={() => setEtape((e) => Math.max(0, e - 1))}
                disabled={etape === 0}
                className="group flex items-center gap-2 text-[15px] text-fumee transition-opacity hover:opacity-60 disabled:invisible"
              >
                <IconeChevron className="size-4 rotate-180" strokeWidth={1.5} />
                Retour
              </button>

              <div className="flex items-center gap-6">
                {!dernier && (
                  <p className="hidden text-right text-[13px] text-pierre sm:block">
                    Estimation
                    <span className="ml-2 text-[15px] text-encre tabular-nums">
                      {prixFr.format(devis.min)} – {prixFr.format(devis.max)} DT
                    </span>
                  </p>
                )}

                {!dernier && (
                  <button
                    type="button"
                    onClick={() => setEtape((e) => e + 1)}
                    className="flex h-13 items-center gap-3 bg-encre px-8 py-4 libelle-action text-craie transition-colors hover:bg-fumee"
                  >
                    {etape === ETAPES.length - 1 ? 'Voir le récapitulatif' : 'Continuer'}
                    <IconeChevron className="size-4" strokeWidth={1.6} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Reprise de la configuration précédente */}
      <AnimatePresence>
        {repriseProposee && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: DUREE.base, ease: EASE_DOUX }}
            className="fixed bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-5 border border-sable bg-craie px-6 py-4 shadow-[0_20px_50px_-24px_rgba(10,10,10,0.45)]"
          >
            <p className="text-[14px] text-fumee">Reprendre votre configuration précédente ?</p>
            <button
              type="button"
              onClick={() => {
                const brut = localStorage.getItem(CLE_STOCKAGE);
                if (brut) {
                  try {
                    setConfig(JSON.parse(brut) as Configuration);
                    setEtape(ETAPES.length);
                  } catch {
                    /* configuration illisible : on ignore */
                  }
                }
                setRepriseProposee(false);
              }}
              className="text-[14px] whitespace-nowrap text-encre underline underline-offset-4"
            >
              Reprendre
            </button>
            <button
              type="button"
              onClick={() => setRepriseProposee(false)}
              aria-label="Ignorer"
              className="text-pierre transition-colors hover:text-encre"
            >
              <IconeFermer className="size-4" strokeWidth={1.6} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Etape({
  titre,
  numero,
  children,
}: {
  titre: string;
  numero: number;
  children: React.ReactNode;
}) {
  return (
    <div>
      {numero > 0 && <p className="eyebrow mb-4 text-encre">Étape 0{numero} sur 06</p>}
      <h1 className="mb-8 text-[26px] leading-tight font-light xl:text-[30px]">{titre}</h1>
      {children}
    </div>
  );
}
