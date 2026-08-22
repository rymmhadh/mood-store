'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { EnTetePage } from '@/components/admin/EnTetePage';
import { Liste, Texte } from '@/components/admin/Champs';
import { IconeRecherche } from '@/components/icons';
import { api, ErreurApi, type MetaApi } from '@/lib/api';
import { nombreFr } from '@/lib/tableauBord';
import {
  LIBELLE_STATUT,
  type CategorieAdmin,
  type PieceAdmin,
  type StatsCatalogue,
  type StatutPiece,
} from '@/types/admin-catalogue';
import { cn } from '@/lib/cn';

interface Props {
  initial: PieceAdmin[];
  meta: MetaApi | null;
  categories: CategorieAdmin[];
  stats: StatsCatalogue | null;
  /** L'API n'a pas répondu au rendu serveur. */
  horsLigne: boolean;
}

const PAR_PAGE = 24;

/**
 * Liste du catalogue (§19.4.1).
 *
 * Les colonnes affichées sont celles qui servent à décider : la photo, parce
 * qu'on reconnaît une pièce à son image et pas à son nom ; le statut, parce
 * que c'est la question qu'on se pose en arrivant ; les vues et les demandes,
 * parce que c'est ce qui dit si une fiche fonctionne.
 *
 * Le filtrage se fait côté serveur, pas dans le navigateur : le catalogue est
 * appelé à grossir, et charger mille fiches pour en afficher vingt-quatre
 * serait un choix qu'on paierait plus tard.
 */
export function ListeProduits({ initial, meta, categories, stats, horsLigne }: Props) {
  const router = useRouter();
  const parametres = useSearchParams();

  const [pieces, setPieces] = useState(initial);
  const [total, setTotal] = useState(Number(meta?.total ?? initial.length));
  const [page, setPage] = useState(1);
  const [recherche, setRecherche] = useState('');
  const [categorie, setCategorie] = useState('');
  const [statut, setStatut] = useState<'' | StatutPiece>('');
  const [erreur, setErreur] = useState<string | null>(
    horsLigne ? 'L’API n’a pas répondu. Démarrez-la (`npm run dev` dans Backend) puis rechargez.' : null,
  );
  const [chargement, demarrer] = useTransition();

  const enregistre = parametres.get('enregistre');

  const charger = useCallback(
    (options?: { page?: number; recherche?: string; categorie?: string; statut?: string }) => {
      const requete = new URLSearchParams({
        page: String(options?.page ?? 1),
        parPage: String(PAR_PAGE),
        tri: 'recent',
      });
      const q = options?.recherche ?? recherche;
      const c = options?.categorie ?? categorie;
      const s = options?.statut ?? statut;
      if (q) requete.set('recherche', q);
      if (c) requete.set('categorie', c);
      if (s) requete.set('statut', s);

      demarrer(async () => {
        try {
          const { data, meta: m } = await api<PieceAdmin[]>(`/api/admin/produits?${requete}`);
          setPieces(data);
          setTotal(Number(m?.total ?? data.length));
          setPage(options?.page ?? 1);
          setErreur(null);
        } catch (e) {
          setErreur(
            e instanceof ErreurApi ? e.message : 'L’API est injoignable. Vérifiez qu’elle tourne.',
          );
        }
      });
    },
    [recherche, categorie, statut],
  );

  /** Recherche différée : on n'interroge pas l'API à chaque touche. */
  useEffect(() => {
    const minuteur = setTimeout(() => {
      if (recherche !== '') charger({ recherche, page: 1 });
      else charger({ recherche: '', page: 1 });
    }, 350);
    return () => clearTimeout(minuteur);
    // `charger` est stable pour un même jeu de filtres ; l'inclure relancerait
    // la requête en boucle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recherche]);

  async function supprimer(piece: PieceAdmin) {
    if (
      !window.confirm(
        `Déplacer « ${piece.nom} » dans la corbeille ?\n\nElle disparaîtra du site et restera restaurable trente jours.`,
      )
    ) {
      return;
    }

    try {
      await api(`/api/admin/produits/${piece.id}`, { method: 'DELETE' });
      charger({ page });
      router.refresh();
    } catch (e) {
      setErreur(e instanceof ErreurApi ? e.message : 'La suppression a échoué.');
    }
  }

  const pages = Math.max(1, Math.ceil(total / PAR_PAGE));

  return (
    <>
      <EnTetePage
        titre="Catalogue"
        soustitre={
          stats
            ? `${nombreFr(stats.total)} pièce${stats.total > 1 ? 's' : ''} · ${nombreFr(stats.publies)} en ligne · ${nombreFr(stats.brouillons)} en brouillon`
            : 'Les pièces vendues et exposées sur le site'
        }
        retour={{ libelle: 'Tableau de bord', href: '/admin' }}
        actions={
          <>
            <Link
              href="/admin/catalogue/attributs"
              className="inline-flex h-11 items-center border border-trait bg-blanc px-5 libelle-action text-fumee transition-colors hover:border-encre hover:text-encre"
            >
              Catégories et nuanciers
            </Link>
            <Link
              href="/admin/catalogue/nouvelle"
              className="inline-flex h-11 items-center bg-encre px-6 libelle-action text-craie transition-colors hover:bg-fumee"
            >
              Ajouter une pièce
            </Link>
          </>
        }
      />

      <div className="px-6 py-8 lg:px-10 lg:py-10">
        {enregistre && (
          <p className="mb-6 border border-sable bg-blanc px-5 py-4 text-[14px] text-fumee">
            « {enregistre} » a été enregistrée.
          </p>
        )}

        {erreur && (
          <p role="alert" className="mb-6 border border-bronze bg-blanc px-5 py-4 text-[14px] text-fumee">
            {erreur}
          </p>
        )}

        {/* Filtres, sur une seule rangée au-dessus de la liste */}
        <div className="mb-6 flex flex-wrap items-end gap-4">
          <div className="relative min-w-64 flex-1">
            <IconeRecherche className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-pierre" />
            <Texte
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Rechercher un nom, une référence…"
              aria-label="Rechercher dans le catalogue"
              className="pl-11"
            />
          </div>

          <Liste
            value={categorie}
            onChange={(e) => {
              setCategorie(e.target.value);
              charger({ categorie: e.target.value, page: 1 });
            }}
            aria-label="Filtrer par catégorie"
            className="w-56"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.nom}
              </option>
            ))}
          </Liste>

          <Liste
            value={statut}
            onChange={(e) => {
              const v = e.target.value as '' | StatutPiece;
              setStatut(v);
              charger({ statut: v, page: 1 });
            }}
            aria-label="Filtrer par état"
            className="w-44"
          >
            <option value="">Tous les états</option>
            <option value="publie">En ligne</option>
            <option value="brouillon">Brouillon</option>
            <option value="archive">Archivée</option>
          </Liste>
        </div>

        {pieces.length === 0 ? (
          <div className="flex flex-col items-center border border-sable/50 bg-blanc px-8 py-24 text-center">
            <p className="text-h3 font-light">Aucune pièce ne correspond</p>
            <p className="mt-3 max-w-md text-[14px] leading-relaxed text-pierre">
              {recherche || categorie || statut
                ? 'Élargissez la recherche, ou retirez un filtre.'
                : 'Le catalogue est vide. Ajoutez votre première pièce pour la voir apparaître sur le site.'}
            </p>
            <Link
              href="/admin/catalogue/nouvelle"
              className="mt-8 inline-flex h-12 items-center bg-encre px-7 libelle-action text-craie transition-colors hover:bg-fumee"
            >
              Ajouter une pièce
            </Link>
          </div>
        ) : (
          <ul
            className={cn(
              'flex flex-col border border-sable/50 bg-blanc transition-opacity duration-300',
              chargement && 'opacity-55',
            )}
          >
            {pieces.map((piece) => (
              <li key={piece.id} className="border-b border-sable/35 last:border-0">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-3 px-5 py-4">
                  <div className="relative size-16 shrink-0 overflow-hidden bg-galerie">
                    {piece.images[0] ? (
                      <Image
                        src={piece.images[0]}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex size-full items-center justify-center text-[10px] text-pierre">
                        sans
                        <br />
                        photo
                      </span>
                    )}
                  </div>

                  <div className="min-w-48 flex-1">
                    <Link
                      href={`/admin/catalogue/${piece.id}`}
                      className="lien-souligne text-[15px]"
                    >
                      {piece.nom}
                    </Link>
                    <p className="mt-0.5 text-[12px] text-pierre">
                      {piece.type}
                      {piece.categorieNom ? ` · ${piece.categorieNom}` : ''} · {piece.reference}
                    </p>
                  </div>

                  <p className="chiffres w-28 text-[14px]">
                    {piece.prixSurDemande
                      ? <span className="text-[13px] text-pierre">Sur demande</span>
                      : piece.prix !== undefined
                        ? `${nombreFr(piece.prix)} DT`
                        : '—'}
                  </p>

                  <p className="w-24 text-[13px]">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5',
                        piece.statut === 'publie' ? 'text-encre' : 'text-pierre',
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          'size-2 rounded-full',
                          piece.statut === 'publie'
                            ? 'bg-bronze'
                            : 'border border-pierre bg-transparent',
                        )}
                      />
                      {LIBELLE_STATUT[piece.statut]}
                    </span>
                  </p>

                  <p className="chiffres w-20 text-[13px] text-pierre">
                    {nombreFr(piece.vues)} vue{piece.vues > 1 ? 's' : ''}
                  </p>

                  <div className="flex items-center gap-4 text-[13px]">
                    <Link href={`/admin/catalogue/${piece.id}`} className="lien-souligne text-fumee">
                      Modifier
                    </Link>
                    <button
                      type="button"
                      onClick={() => void supprimer(piece)}
                      className="lien-souligne text-pierre transition-colors hover:text-encre"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {pages > 1 && (
          <nav className="mt-6 flex items-center justify-between" aria-label="Pagination">
            <p className="text-[13px] text-pierre">
              Page {page} sur {pages} — {nombreFr(total)} pièces
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                disabled={page <= 1 || chargement}
                onClick={() => charger({ page: page - 1 })}
                className="inline-flex h-11 items-center border border-trait bg-blanc px-5 libelle-action transition-colors hover:border-encre disabled:opacity-40"
              >
                Précédent
              </button>
              <button
                type="button"
                disabled={page >= pages || chargement}
                onClick={() => charger({ page: page + 1 })}
                className="inline-flex h-11 items-center border border-trait bg-blanc px-5 libelle-action transition-colors hover:border-encre disabled:opacity-40"
              >
                Suivant
              </button>
            </div>
          </nav>
        )}
      </div>
    </>
  );
}
