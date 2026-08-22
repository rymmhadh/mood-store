'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Bascule, Cadre, Liste, Puce, Section, Texte, Zone } from '@/components/admin/Champs';
import { EnTetePage } from '@/components/admin/EnTetePage';
import { DepotPhotos } from './DepotPhotos';
import { api, ErreurApi } from '@/lib/api';
import type {
  CategorieAdmin,
  CollectionAdmin,
  ColorisAdmin,
  CorpsPiece,
  MatiereAdmin,
  MediaAdmin,
  PieceAdmin,
  RevetementAdmin,
  StatutPiece,
  StyleAdmin,
} from '@/types/admin-catalogue';
import { cn } from '@/lib/cn';

interface Props {
  categories: CategorieAdmin[];
  collections: CollectionAdmin[];
  matieres: MatiereAdmin[];
  styles: StyleAdmin[];
  coloris: ColorisAdmin[];
  revetements: RevetementAdmin[];
  /** Absent = création. */
  piece?: PieceAdmin;
}

interface Etat {
  nom: string;
  type: string;
  categorieId: string;
  categorieIdsSecondaires: string[];
  collectionIds: string[];
  chapo: string;
  description: string;
  prix: string;
  prixSurDemande: boolean;
  nouveaute: boolean;
  miseEnAvant: boolean;
  delaiJours: string;
  demontable: boolean;
  structure: string;
  garnissage: string;
  pietement: string;
  designer: string;
  matieres: string[];
  styles: string[];
  colorisIds: string[];
  revetementIds: string[];
}

function etatInitial(piece?: PieceAdmin): Etat {
  return {
    nom: piece?.nom ?? '',
    type: piece?.type ?? '',
    categorieId: piece?.categorieId ?? '',
    categorieIdsSecondaires: piece?.categorieIdsSecondaires ?? [],
    collectionIds: piece?.collectionIds ?? [],
    chapo: piece?.chapo ?? '',
    description: (piece?.description ?? []).join('\n\n'),
    prix: piece?.prix !== undefined && piece.prix !== null ? String(piece.prix) : '',
    prixSurDemande: piece?.prixSurDemande ?? false,
    nouveaute: piece?.nouveaute ?? false,
    miseEnAvant: piece?.miseEnAvant ?? false,
    delaiJours: String(piece?.delaiJours ?? 21),
    demontable: piece?.demontable ?? false,
    structure: piece?.structure ?? '',
    garnissage: piece?.garnissage ?? '',
    pietement: piece?.pietement ?? '',
    designer: piece?.designer ?? 'Atelier Mood Store',
    matieres: piece?.matieres ?? [],
    styles: piece?.styles ?? [],
    colorisIds: piece?.colorisIds ?? [],
    revetementIds: piece?.revetementIds ?? [],
  };
}

const basculer = (liste: string[], valeur: string) =>
  liste.includes(valeur) ? liste.filter((v) => v !== valeur) : [...liste, valeur];

/**
 * Ajouter ou modifier une pièce du catalogue.
 *
 * ── Un écran, pas huit onglets ──────────────────────────────────────────
 * Le §19.4.2 décrit un formulaire en huit onglets. Il est fait pour une
 * équipe qui saisit des fiches à la chaîne. Ici, l'atelier ajoute quelques
 * pièces par mois : une seule page, ordonnée du plus important au plus
 * accessoire, se remplit plus vite et se relit d'un regard avant publication.
 * Les onglets Variantes, Relations et SEO restent à construire le jour où le
 * catalogue le justifiera.
 *
 * ── Brouillon d'abord ───────────────────────────────────────────────────
 * Les deux boutons sont distincts et n'ont pas le même poids. « Enregistrer
 * en brouillon » accepte une fiche incomplète ; « Publier » exige une photo,
 * une accroche et un prix — les trois choses sans lesquelles une fiche ne
 * vend pas. Le refus vient de l'API, pas d'ici : la règle est écrite une
 * seule fois, du bon côté.
 */
export function FormulairePiece({
  categories,
  collections,
  matieres,
  styles,
  coloris,
  revetements,
  piece,
}: Props) {
  const router = useRouter();
  const creation = !piece;

  const [etat, setEtat] = useState<Etat>(() => etatInitial(piece));
  const [medias, setMedias] = useState<MediaAdmin[]>(piece?.medias ?? []);
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState<StatutPiece | null>(null);

  const maj = (champs: Partial<Etat>) => setEtat((e) => ({ ...e, ...champs }));

  /** Catégories groupées par univers : la liste déroulante devient lisible. */
  const parUnivers = useMemo(() => {
    const groupes = new Map<string, CategorieAdmin[]>();
    for (const c of categories) {
      const liste = groupes.get(c.parent) ?? [];
      liste.push(c);
      groupes.set(c.parent, liste);
    }
    return [...groupes.entries()];
  }, [categories]);

  function corps(statut: StatutPiece): CorpsPiece {
    const prix = etat.prix.trim().replace(',', '.');

    return {
      nom: etat.nom.trim(),
      type: etat.type.trim(),
      categorieId: etat.categorieId,
      categorieIdsSecondaires: etat.categorieIdsSecondaires,
      collectionIds: etat.collectionIds,
      chapo: etat.chapo.trim(),
      // Un paragraphe par bloc séparé d'une ligne vide : c'est ainsi que les
      // descriptions se rédigent, et c'est la forme attendue par la fiche.
      description: etat.description
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean),
      prix: etat.prixSurDemande || prix === '' ? null : Number(prix),
      prixSurDemande: etat.prixSurDemande,
      statut,
      nouveaute: etat.nouveaute,
      miseEnAvant: etat.miseEnAvant,
      delaiJours: Number(etat.delaiJours) || 0,
      demontable: etat.demontable,
      structure: etat.structure.trim(),
      garnissage: etat.garnissage.trim() || null,
      pietement: etat.pietement.trim(),
      matieres: etat.matieres,
      styles: etat.styles,
      colorisIds: etat.colorisIds,
      revetementIds: etat.revetementIds,
      mediaIds: medias.map((m) => m.id),
      designer: etat.designer.trim() || 'Atelier Mood Store',
    };
  }

  async function enregistrer(statut: StatutPiece) {
    setErreurs({});
    setMessage(null);
    setEnvoi(statut);

    try {
      const { data } = await api<PieceAdmin>(
        creation ? '/api/admin/produits' : `/api/admin/produits/${piece.id}`,
        { method: creation ? 'POST' : 'PATCH', body: corps(statut) },
      );

      // Le site public met le catalogue en cache cinq minutes. On le purge
      // tout de suite, sinon une pièce tout juste publiée resterait invisible
      // et l'on croirait l'enregistrement raté.
      await fetch('/api/revalidation', { method: 'POST' }).catch(() => {});

      router.push(`/admin/catalogue?enregistre=${encodeURIComponent(data.nom)}`);
      router.refresh();
    } catch (e) {
      if (e instanceof ErreurApi) {
        setErreurs(e.champs ?? {});
        setMessage(
          e.champs
            ? 'Quelques champs demandent votre attention — ils sont signalés ci-dessous.'
            : e.message,
        );
      } else {
        setMessage('L’API est injoignable. Vérifiez qu’elle est démarrée, puis réessayez.');
      }
      // Ramener l'utilisateur en haut : les messages sont là.
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setEnvoi(null);
    }
  }

  const restants = 280 - etat.chapo.length;

  return (
    <>
      <EnTetePage
        titre={creation ? 'Ajouter une pièce' : etat.nom || piece.nom}
        soustitre={
          creation
            ? 'Elle restera invisible sur le site tant que vous ne l’aurez pas publiée.'
            : `Référence ${piece.reference} · ${piece.vues} vue${piece.vues > 1 ? 's' : ''}`
        }
        retour={{ libelle: 'Catalogue', href: '/admin/catalogue' }}
        actions={
          <>
            {!creation && piece.statut === 'publie' && (
              <a
                href={`/produit/${piece.slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center border border-trait bg-blanc px-5 libelle-action text-fumee transition-colors hover:border-encre hover:text-encre"
              >
                Voir sur le site
              </a>
            )}
            <button
              type="button"
              onClick={() => void enregistrer('brouillon')}
              disabled={envoi !== null}
              className="inline-flex h-11 items-center border border-encre bg-blanc px-5 libelle-action transition-colors hover:bg-encre hover:text-craie disabled:opacity-45"
            >
              {envoi === 'brouillon' ? 'Enregistrement…' : 'Enregistrer en brouillon'}
            </button>
            <button
              type="button"
              onClick={() => void enregistrer('publie')}
              disabled={envoi !== null}
              className="inline-flex h-11 items-center bg-encre px-6 libelle-action text-craie transition-colors hover:bg-fumee disabled:opacity-45"
            >
              {envoi === 'publie' ? 'Publication…' : 'Publier'}
            </button>
          </>
        }
      />

      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col gap-6 px-6 py-8 lg:px-10 lg:py-10"
      >
        {message && (
          <p role="alert" className="border border-bronze bg-blanc px-5 py-4 text-[14px] text-fumee">
            {message}
          </p>
        )}

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="flex min-w-0 flex-col gap-6">
            <Section
              titre="L’essentiel"
              aide="Le nom et la typologie apparaissent ensemble sur la fiche : « Fauteuil pivotant » au-dessus, « Brume » en dessous."
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <Cadre libelle="Nom de la pièce" obligatoire pour="nom" erreur={erreurs.nom}>
                  <Texte
                    id="nom"
                    value={etat.nom}
                    onChange={(e) => maj({ nom: e.target.value })}
                    placeholder="Brume"
                    erreur={Boolean(erreurs.nom)}
                  />
                </Cadre>

                <Cadre
                  libelle="Typologie"
                  obligatoire
                  pour="type"
                  erreur={erreurs.type}
                  aide="Ce qu’est la pièce, en clair."
                >
                  <Texte
                    id="type"
                    value={etat.type}
                    onChange={(e) => maj({ type: e.target.value })}
                    placeholder="Fauteuil pivotant"
                    erreur={Boolean(erreurs.type)}
                  />
                </Cadre>
              </div>

              <Cadre
                libelle="Catégorie"
                obligatoire
                pour="categorie"
                erreur={erreurs.categorieId}
                aide="La page du site où la pièce apparaîtra en premier."
              >
                <Liste
                  id="categorie"
                  value={etat.categorieId}
                  onChange={(e) => maj({ categorieId: e.target.value })}
                  erreur={Boolean(erreurs.categorieId)}
                >
                  <option value="">Choisir une catégorie…</option>
                  {parUnivers.map(([univers, liste]) => (
                    <optgroup key={univers} label={univers}>
                      {liste.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nom}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </Liste>
              </Cadre>

              <Cadre
                libelle="Aussi visible dans"
                aide="Facultatif. Une pièce peut légitimement appartenir à deux rayons — un pouf qui est aussi un objet de décoration."
              >
                <div className="flex flex-wrap gap-2">
                  {categories
                    .filter((c) => c.id !== etat.categorieId)
                    .map((c) => (
                      <Puce
                        key={c.id}
                        actif={etat.categorieIdsSecondaires.includes(c.id)}
                        onClick={() =>
                          maj({
                            categorieIdsSecondaires: basculer(etat.categorieIdsSecondaires, c.id),
                          })
                        }
                      >
                        {c.nom}
                      </Puce>
                    ))}
                </div>
              </Cadre>

              <Cadre
                libelle="Collection"
                aide="La ligne à laquelle la pièce appartient. Elle s’affiche sur la fiche et rassemble les pièces entre elles."
              >
                <div className="flex flex-wrap gap-2">
                  {collections.map((c) => (
                    <Puce
                      key={c.id}
                      actif={etat.collectionIds.includes(c.id)}
                      onClick={() => maj({ collectionIds: basculer(etat.collectionIds, c.id) })}
                    >
                      {c.nom}
                    </Puce>
                  ))}
                </div>
              </Cadre>
            </Section>

            <Section
              titre="Photographies"
              aide="La première image est la principale : c’est elle qu’on voit dans la grille, sur Google et au partage."
            >
              <DepotPhotos medias={medias} onChange={setMedias} erreur={erreurs.mediaIds} />
            </Section>

            <Section titre="Texte de la fiche">
              <Cadre
                libelle="Accroche"
                obligatoire
                pour="chapo"
                erreur={erreurs.chapo}
                aide={`Une phrase sous le nom, reprise par Google. ${restants} caractère${
                  Math.abs(restants) > 1 ? 's' : ''
                } restant${Math.abs(restants) > 1 ? 's' : ''}.`}
              >
                <Zone
                  id="chapo"
                  rows={2}
                  maxLength={280}
                  value={etat.chapo}
                  onChange={(e) => maj({ chapo: e.target.value })}
                  placeholder="Une coque enveloppante montée sur pied tournant en bois massif."
                  erreur={Boolean(erreurs.chapo)}
                />
              </Cadre>

              <Cadre
                libelle="Description"
                pour="description"
                aide="Séparez les paragraphes par une ligne vide. Deux ou trois suffisent : au-delà de trois lignes, on ne lit plus."
              >
                <Zone
                  id="description"
                  rows={8}
                  value={etat.description}
                  onChange={(e) => maj({ description: e.target.value })}
                  placeholder={'Brume referme l’assise autour du dos.\n\nLe pied pivote sur un roulement silencieux.'}
                />
              </Cadre>
            </Section>

            <Section
              titre="Matières et style"
              aide="Ces étiquettes alimentent les filtres du site. Une pièce sans étiquette n’apparaît dans aucun filtre."
            >
              <Cadre
                libelle="Matières"
                aide={matieres.length === 0 ? 'Aucune matière enregistrée — ajoutez-en depuis « Catégories et nuanciers ».' : undefined}
              >
                <div className="flex flex-wrap gap-2">
                  {matieres.map((m) => (
                    <Puce
                      key={m.id}
                      actif={etat.matieres.includes(m.nom)}
                      onClick={() => maj({ matieres: basculer(etat.matieres, m.nom) })}
                    >
                      {m.nom}
                    </Puce>
                  ))}
                </div>
              </Cadre>

              <Cadre
                libelle="Styles"
                aide={styles.length === 0 ? 'Aucun style enregistré — ajoutez-en depuis « Catégories et nuanciers ».' : undefined}
              >
                <div className="flex flex-wrap gap-2">
                  {styles.map((s) => (
                    <Puce
                      key={s.id}
                      actif={etat.styles.includes(s.nom)}
                      onClick={() => maj({ styles: basculer(etat.styles, s.nom) })}
                    >
                      {s.nom}
                    </Puce>
                  ))}
                </div>
              </Cadre>

              <Cadre
                libelle="Coloris disponibles"
                aide={coloris.length === 0 ? 'Aucun coloris enregistré — ajoutez-en depuis « Catégories et nuanciers ».' : undefined}
              >
                <div className="flex flex-wrap gap-2">
                  {coloris.map((c) => (
                    <Puce
                      key={c.id}
                      couleur={c.hex}
                      actif={etat.colorisIds.includes(c.slug)}
                      onClick={() => maj({ colorisIds: basculer(etat.colorisIds, c.slug) })}
                    >
                      {c.nom}
                    </Puce>
                  ))}
                </div>
              </Cadre>

              <Cadre
                libelle="Revêtements proposés"
                aide={revetements.length === 0 ? 'Aucun revêtement enregistré — ajoutez-en depuis « Catégories et nuanciers ».' : undefined}
              >
                <div className="flex flex-wrap gap-2">
                  {revetements.map((r) => (
                    <Puce
                      key={r.id}
                      couleur={r.hex}
                      actif={etat.revetementIds.includes(r.slug)}
                      onClick={() => maj({ revetementIds: basculer(etat.revetementIds, r.slug) })}
                    >
                      {r.nom}
                    </Puce>
                  ))}
                </div>
              </Cadre>
            </Section>

            <Section titre="Fabrication">
              <div className="grid gap-6 sm:grid-cols-2">
                <Cadre libelle="Structure" pour="structure">
                  <Texte
                    id="structure"
                    value={etat.structure}
                    onChange={(e) => maj({ structure: e.target.value })}
                    placeholder="Hêtre massif"
                  />
                </Cadre>
                <Cadre libelle="Piètement" pour="pietement">
                  <Texte
                    id="pietement"
                    value={etat.pietement}
                    onChange={(e) => maj({ pietement: e.target.value })}
                    placeholder="Chêne tourné"
                  />
                </Cadre>
                <Cadre libelle="Garnissage" pour="garnissage">
                  <Texte
                    id="garnissage"
                    value={etat.garnissage}
                    onChange={(e) => maj({ garnissage: e.target.value })}
                    placeholder="Mousse haute résilience 35 kg/m³"
                  />
                </Cadre>
                <Cadre
                  libelle="Délai de fabrication"
                  pour="delai"
                  aide="En jours. Affiché tel quel sur la fiche."
                  erreur={erreurs.delaiJours}
                >
                  <Texte
                    id="delai"
                    type="number"
                    min={0}
                    max={365}
                    value={etat.delaiJours}
                    onChange={(e) => maj({ delaiJours: e.target.value })}
                    erreur={Boolean(erreurs.delaiJours)}
                  />
                </Cadre>
              </div>

              <Bascule
                actif={etat.demontable}
                libelle="Pièce démontable"
                aide="À cocher si elle passe dans un escalier une fois démontée."
                onChange={(demontable) => maj({ demontable })}
              />
            </Section>
          </div>

          {/* ── Colonne de droite : prix et mise en avant ────────────── */}
          <aside className="flex min-w-0 flex-col gap-6 xl:sticky xl:top-28">
            <Section
              titre="Prix"
              aide="Sur le sur-mesure, le prix se demande plutôt qu’il ne s’affiche. Sur les pièces de catalogue et la décoration, il s’affiche normalement."
            >
              <Bascule
                actif={etat.prixSurDemande}
                libelle="Prix sur demande"
                aide="La fiche affichera « Prix sur demande » et invitera à un devis."
                onChange={(prixSurDemande) => maj({ prixSurDemande })}
              />

              {!etat.prixSurDemande && (
                <Cadre libelle="Prix public" obligatoire pour="prix" erreur={erreurs.prix}>
                  <div className="relative">
                    <Texte
                      id="prix"
                      type="number"
                      min={0}
                      step="1"
                      value={etat.prix}
                      onChange={(e) => maj({ prix: e.target.value })}
                      placeholder="2450"
                      erreur={Boolean(erreurs.prix)}
                      className="pr-14"
                    />
                    <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[14px] text-pierre">
                      DT
                    </span>
                  </div>
                </Cadre>
              )}
            </Section>

            <Section titre="Mise en avant">
              <Bascule
                actif={etat.nouveaute}
                libelle="Nouveauté"
                aide="Ajoute la mention « Nouveauté » et remonte la pièce dans le tri par nouveautés."
                onChange={(nouveaute) => maj({ nouveaute })}
              />
              <Bascule
                actif={etat.miseEnAvant}
                libelle="Mettre en avant"
                aide="La pièce passe en tête de sa catégorie et devient éligible à la page d’accueil."
                onChange={(miseEnAvant) => maj({ miseEnAvant })}
              />
              <Cadre libelle="Signature" pour="designer" aide="Affichée sous le nom, façon maison d’édition.">
                <Texte
                  id="designer"
                  value={etat.designer}
                  onChange={(e) => maj({ designer: e.target.value })}
                />
              </Cadre>
            </Section>

            {!creation && (
              <div className="border border-sable/50 bg-blanc px-6 py-5 text-[13px] leading-relaxed text-pierre">
                <p>
                  État actuel :{' '}
                  <span className={cn('text-encre', piece.statut === 'publie' && 'text-bronze')}>
                    {piece.statut === 'publie' ? 'en ligne' : 'brouillon'}
                  </span>
                </p>
                <p className="mt-1">
                  Modifiée le {new Date(piece.modifieLe).toLocaleDateString('fr-FR')}
                </p>
                <Link href="/admin/catalogue" className="lien-souligne mt-3 inline-block text-fumee">
                  Revenir sans enregistrer
                </Link>
              </div>
            )}
          </aside>
        </div>
      </form>
    </>
  );
}
