'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Cadre, Section, Texte } from '@/components/admin/Champs';
import { EnTetePage } from '@/components/admin/EnTetePage';
import { api, ErreurApi } from '@/lib/api';
import { cn } from '@/lib/cn';
import type {
  CategorieAdmin,
  CollectionAdmin,
  ColorisAdmin,
  MatiereAdmin,
  RevetementAdmin,
  StyleAdmin,
  UniversAdmin,
} from '@/types/admin-catalogue';

interface Props {
  univers: UniversAdmin[];
  collections: CollectionAdmin[];
  matieres: MatiereAdmin[];
  styles: StyleAdmin[];
  coloris: ColorisAdmin[];
  revetements: RevetementAdmin[];
}

/** Message d'une exception d'API, en clair. */
function messageErreur(e: unknown): string {
  if (e instanceof ErreurApi) return e.message;
  return 'L’API est injoignable. Vérifiez qu’elle est démarrée, puis réessayez.';
}

const boutonAjouter =
  'inline-flex h-10 items-center border border-encre bg-blanc px-4 text-[13px] libelle-action transition-colors hover:bg-encre hover:text-craie disabled:opacity-45';
const boutonSupprimer = 'text-[12px] text-pierre underline decoration-dotted hover:text-encre';
const ligne = 'flex flex-wrap items-center gap-3 border-b border-sable/40 py-3 last:border-b-0';

/**
 * Catégories, collections et nuanciers.
 *
 * Ce que le formulaire d'une pièce propose comme options — quelle catégorie,
 * quelle collection, quelles matières, quels styles, quels coloris, quels
 * revêtements — vient d'ici plutôt que d'être écrit en dur. Ajouter une
 * couleur au nuancier la rend immédiatement disponible sur toutes les fiches,
 * sans toucher au code.
 *
 * Chaque suppression est refusée par l'API tant qu'une pièce s'en sert
 * encore : le message renvoyé explique combien, plutôt que d'échouer sans
 * un mot.
 */
export function GestionAttributs({ univers, collections, matieres, styles, coloris, revetements }: Props) {
  const router = useRouter();
  const rafraichir = () => router.refresh();

  return (
    <>
      <EnTetePage
        titre="Catégories et nuanciers"
        soustitre="Ce qui alimente les listes du formulaire d’une pièce."
        retour={{ libelle: 'Catalogue', href: '/admin/catalogue' }}
      />

      <div className="flex flex-col gap-6 px-6 py-8 lg:px-10 lg:py-10">
        <SectionCategories univers={univers} onChange={rafraichir} />

        <SectionCollections collections={collections} onChange={rafraichir} />

        <div className="grid gap-6 lg:grid-cols-2">
          <SectionSimple
            titre="Matières"
            aide="Les étiquettes de matière proposées sur chaque fiche."
            chemin="/api/admin/matieres"
            items={matieres}
            onChange={rafraichir}
          />
          <SectionSimple
            titre="Styles"
            aide="Les étiquettes de style proposées sur chaque fiche."
            chemin="/api/admin/styles"
            items={styles}
            onChange={rafraichir}
          />
        </div>

        <SectionCouleur
          titre="Coloris"
          aide="Le nuancier de couleurs proposé sur chaque fiche."
          chemin="/api/admin/coloris"
          items={coloris}
          avecFamille={false}
          onChange={rafraichir}
        />

        <SectionCouleur
          titre="Revêtements proposés"
          aide="Les tissus et cuirs proposés sur chaque fiche, avec leur entretien."
          chemin="/api/admin/revetements"
          items={revetements}
          avecFamille
          onChange={rafraichir}
        />
      </div>
    </>
  );
}

/* ── Catégories ──────────────────────────────────────────────────────── */

function SectionCategories({ univers, onChange }: { univers: UniversAdmin[]; onChange: () => void }) {
  const [erreur, setErreur] = useState<string | null>(null);
  const [nouvelUnivers, setNouvelUnivers] = useState('');
  const [nouvelleFamille, setNouvelleFamille] = useState<Record<string, string>>({});
  const [renommage, setRenommage] = useState<{ id: string; nom: string } | null>(null);
  const [enCours, setEnCours] = useState(false);

  async function creerUnivers() {
    if (!nouvelUnivers.trim()) return;
    setErreur(null);
    setEnCours(true);
    try {
      await api('/api/admin/categories', { method: 'POST', body: { nom: nouvelUnivers.trim(), parentId: null } });
      setNouvelUnivers('');
      onChange();
    } catch (e) {
      setErreur(messageErreur(e));
    } finally {
      setEnCours(false);
    }
  }

  async function creerFamille(universId: string) {
    const nom = (nouvelleFamille[universId] ?? '').trim();
    if (!nom) return;
    setErreur(null);
    setEnCours(true);
    try {
      await api('/api/admin/categories', { method: 'POST', body: { nom, parentId: universId } });
      setNouvelleFamille((v) => ({ ...v, [universId]: '' }));
      onChange();
    } catch (e) {
      setErreur(messageErreur(e));
    } finally {
      setEnCours(false);
    }
  }

  async function renommer(id: string, nom: string) {
    setErreur(null);
    try {
      await api(`/api/admin/categories/${id}`, { method: 'PATCH', body: { nom } });
      setRenommage(null);
      onChange();
    } catch (e) {
      setErreur(messageErreur(e));
    }
  }

  async function supprimer(id: string) {
    setErreur(null);
    try {
      await api(`/api/admin/categories/${id}`, { method: 'DELETE' });
      onChange();
    } catch (e) {
      setErreur(messageErreur(e));
    }
  }

  return (
    <Section
      titre="Catégories"
      aide="Un univers (« Salon », « Chambre »…) réunit des typologies (« Canapés », « Dressings »…). Seules les typologies ont une page sur le site."
    >
      {erreur && (
        <p role="alert" className="border border-bronze bg-blanc px-4 py-3 text-[13px] text-fumee">
          {erreur}
        </p>
      )}

      <div className="flex flex-col gap-5">
        {univers.map((u) => (
          <div key={u.id} className="border border-sable/40 px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              {renommage?.id === u.id ? (
                <ChampRenommage
                  valeur={renommage.nom}
                  onValeur={(nom) => setRenommage({ id: u.id, nom })}
                  onValider={() => void renommer(u.id, renommage.nom)}
                  onAnnuler={() => setRenommage(null)}
                />
              ) : (
                <p className="text-[15px]">{u.nom}</p>
              )}
              <div className="flex items-center gap-3">
                {renommage?.id !== u.id && (
                  <button type="button" className={boutonSupprimer} onClick={() => setRenommage({ id: u.id, nom: u.nom })}>
                    Renommer
                  </button>
                )}
                <button type="button" className={boutonSupprimer} onClick={() => void supprimer(u.id)}>
                  Supprimer
                </button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 pl-2">
              {u.familles.map((f) =>
                renommage?.id === f.id ? (
                  <ChampRenommage
                    key={f.id}
                    valeur={renommage.nom}
                    onValeur={(nom) => setRenommage({ id: f.id, nom })}
                    onValider={() => void renommer(f.id, renommage.nom)}
                    onAnnuler={() => setRenommage(null)}
                  />
                ) : (
                  <span key={f.id} className="inline-flex items-center gap-2 border border-trait bg-blanc px-3 py-1.5 text-[13px]">
                    {f.nom}
                    <button type="button" className="text-pierre hover:text-encre" onClick={() => setRenommage({ id: f.id, nom: f.nom })} aria-label={`Renommer ${f.nom}`}>
                      ✎
                    </button>
                    <button type="button" className="text-pierre hover:text-encre" onClick={() => void supprimer(f.id)} aria-label={`Supprimer ${f.nom}`}>
                      ×
                    </button>
                  </span>
                ),
              )}
            </div>

            <div className="mt-3 flex max-w-sm items-center gap-2 pl-2">
              <Texte
                value={nouvelleFamille[u.id] ?? ''}
                onChange={(e) => setNouvelleFamille((v) => ({ ...v, [u.id]: e.target.value }))}
                placeholder="Nouvelle typologie…"
                className="h-9 text-[13px]"
              />
              <button type="button" disabled={enCours} className={boutonAjouter} onClick={() => void creerFamille(u.id)}>
                Ajouter
              </button>
            </div>
          </div>
        ))}
      </div>

      <Cadre libelle="Nouvel univers" aide="Un rayon de tête, comme « Salon » ou « Chambre ».">
        <div className="flex max-w-sm items-center gap-2">
          <Texte
            value={nouvelUnivers}
            onChange={(e) => setNouvelUnivers(e.target.value)}
            placeholder="Salle à manger"
          />
          <button type="button" disabled={enCours} className={boutonAjouter} onClick={() => void creerUnivers()}>
            Ajouter
          </button>
        </div>
      </Cadre>
    </Section>
  );
}

/* ── Collections ─────────────────────────────────────────────────────── */

function SectionCollections({ collections, onChange }: { collections: CollectionAdmin[]; onChange: () => void }) {
  const [erreur, setErreur] = useState<string | null>(null);
  const [nom, setNom] = useState('');
  const [renommage, setRenommage] = useState<{ id: string; nom: string } | null>(null);
  const [enCours, setEnCours] = useState(false);

  async function creer() {
    if (!nom.trim()) return;
    setErreur(null);
    setEnCours(true);
    try {
      await api('/api/admin/collections', { method: 'POST', body: { nom: nom.trim() } });
      setNom('');
      onChange();
    } catch (e) {
      setErreur(messageErreur(e));
    } finally {
      setEnCours(false);
    }
  }

  async function renommer(id: string, valeur: string) {
    setErreur(null);
    try {
      await api(`/api/admin/collections/${id}`, { method: 'PATCH', body: { nom: valeur } });
      setRenommage(null);
      onChange();
    } catch (e) {
      setErreur(messageErreur(e));
    }
  }

  async function supprimer(id: string) {
    setErreur(null);
    try {
      await api(`/api/admin/collections/${id}`, { method: 'DELETE' });
      onChange();
    } catch (e) {
      setErreur(messageErreur(e));
    }
  }

  return (
    <Section titre="Collections" aide="Les lignes de la maison, transversales aux catégories.">
      {erreur && (
        <p role="alert" className="border border-bronze bg-blanc px-4 py-3 text-[13px] text-fumee">
          {erreur}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {collections.map((c) =>
          renommage?.id === c.id ? (
            <ChampRenommage
              key={c.id}
              valeur={renommage.nom}
              onValeur={(v) => setRenommage({ id: c.id, nom: v })}
              onValider={() => void renommer(c.id, renommage.nom)}
              onAnnuler={() => setRenommage(null)}
            />
          ) : (
            <span key={c.id} className="inline-flex items-center gap-2 border border-trait bg-blanc px-3 py-1.5 text-[13px]">
              {c.nom}
              <button type="button" className="text-pierre hover:text-encre" onClick={() => setRenommage({ id: c.id, nom: c.nom })} aria-label={`Renommer ${c.nom}`}>
                ✎
              </button>
              <button type="button" className="text-pierre hover:text-encre" onClick={() => void supprimer(c.id)} aria-label={`Supprimer ${c.nom}`}>
                ×
              </button>
            </span>
          ),
        )}
      </div>

      <div className="flex max-w-sm items-center gap-2">
        <Texte value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nouvelle collection…" className="h-9 text-[13px]" />
        <button type="button" disabled={enCours} className={boutonAjouter} onClick={() => void creer()}>
          Ajouter
        </button>
      </div>
    </Section>
  );
}

/* ── Listes simples (matières, styles) ──────────────────────────────── */

function SectionSimple({
  titre,
  aide,
  chemin,
  items,
  onChange,
}: {
  titre: string;
  aide: string;
  chemin: string;
  items: (MatiereAdmin | StyleAdmin)[];
  onChange: () => void;
}) {
  const [erreur, setErreur] = useState<string | null>(null);
  const [nom, setNom] = useState('');
  const [renommage, setRenommage] = useState<{ id: string; nom: string } | null>(null);
  const [enCours, setEnCours] = useState(false);

  async function creer() {
    if (!nom.trim()) return;
    setErreur(null);
    setEnCours(true);
    try {
      await api(chemin, { method: 'POST', body: { nom: nom.trim(), ordre: items.length } });
      setNom('');
      onChange();
    } catch (e) {
      setErreur(messageErreur(e));
    } finally {
      setEnCours(false);
    }
  }

  async function renommer(id: string, valeur: string) {
    setErreur(null);
    try {
      await api(`${chemin}/${id}`, { method: 'PATCH', body: { nom: valeur } });
      setRenommage(null);
      onChange();
    } catch (e) {
      setErreur(messageErreur(e));
    }
  }

  async function supprimer(id: string) {
    setErreur(null);
    try {
      await api(`${chemin}/${id}`, { method: 'DELETE' });
      onChange();
    } catch (e) {
      setErreur(messageErreur(e));
    }
  }

  return (
    <Section titre={titre} aide={aide}>
      {erreur && (
        <p role="alert" className="border border-bronze bg-blanc px-4 py-3 text-[13px] text-fumee">
          {erreur}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {items.map((it) =>
          renommage?.id === it.id ? (
            <ChampRenommage
              key={it.id}
              valeur={renommage.nom}
              onValeur={(v) => setRenommage({ id: it.id, nom: v })}
              onValider={() => void renommer(it.id, renommage.nom)}
              onAnnuler={() => setRenommage(null)}
            />
          ) : (
            <span key={it.id} className="inline-flex items-center gap-2 border border-trait bg-blanc px-3 py-1.5 text-[13px]">
              {it.nom}
              <button type="button" className="text-pierre hover:text-encre" onClick={() => setRenommage({ id: it.id, nom: it.nom })} aria-label={`Renommer ${it.nom}`}>
                ✎
              </button>
              <button type="button" className="text-pierre hover:text-encre" onClick={() => void supprimer(it.id)} aria-label={`Supprimer ${it.nom}`}>
                ×
              </button>
            </span>
          ),
        )}
      </div>

      <div className="flex max-w-sm items-center gap-2">
        <Texte value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nouvelle étiquette…" className="h-9 text-[13px]" />
        <button type="button" disabled={enCours} className={boutonAjouter} onClick={() => void creer()}>
          Ajouter
        </button>
      </div>
    </Section>
  );
}

/* ── Nuanciers (coloris, revêtements) ───────────────────────────────── */

interface FormNuance {
  nom: string;
  hex: string;
  famille: string;
  entretien: string;
}

const NUANCE_VIDE: FormNuance = { nom: '', hex: '#B7AA98', famille: '', entretien: '' };

function SectionCouleur({
  titre,
  aide,
  chemin,
  items,
  avecFamille,
  onChange,
}: {
  titre: string;
  aide: string;
  chemin: string;
  items: (ColorisAdmin | RevetementAdmin)[];
  avecFamille: boolean;
  onChange: () => void;
}) {
  const [erreur, setErreur] = useState<string | null>(null);
  const [form, setForm] = useState<FormNuance>(NUANCE_VIDE);
  const [edition, setEdition] = useState<{ id: string; hex: string } | null>(null);
  const [enCours, setEnCours] = useState(false);

  async function creer() {
    if (!form.nom.trim()) return;
    if (avecFamille && !form.famille.trim()) {
      setErreur('Indiquez la famille du revêtement — « Bouclé », « Velours », « Cuir »…');
      return;
    }
    setErreur(null);
    setEnCours(true);
    try {
      await api(chemin, {
        method: 'POST',
        body: avecFamille
          ? { nom: form.nom.trim(), hex: form.hex, famille: form.famille.trim(), entretien: form.entretien.trim(), ordre: items.length }
          : { nom: form.nom.trim(), hex: form.hex, ordre: items.length },
      });
      setForm(NUANCE_VIDE);
      onChange();
    } catch (e) {
      setErreur(messageErreur(e));
    } finally {
      setEnCours(false);
    }
  }

  async function modifierCouleur(id: string, hex: string) {
    setErreur(null);
    try {
      await api(`${chemin}/${id}`, { method: 'PATCH', body: { hex } });
      setEdition(null);
      onChange();
    } catch (e) {
      setErreur(messageErreur(e));
    }
  }

  async function supprimer(id: string) {
    setErreur(null);
    try {
      await api(`${chemin}/${id}`, { method: 'DELETE' });
      onChange();
    } catch (e) {
      setErreur(messageErreur(e));
    }
  }

  return (
    <Section titre={titre} aide={aide}>
      {erreur && (
        <p role="alert" className="border border-bronze bg-blanc px-4 py-3 text-[13px] text-fumee">
          {erreur}
        </p>
      )}

      <div className="flex flex-col">
        {items.map((it) => (
          <div key={it.id} className={ligne}>
            {edition?.id === it.id ? (
              <input
                type="color"
                value={edition.hex}
                onChange={(e) => setEdition({ id: it.id, hex: e.target.value })}
                onBlur={() => void modifierCouleur(it.id, edition.hex)}
                className="size-8 shrink-0 cursor-pointer border border-encre/15"
              />
            ) : (
              <button
                type="button"
                aria-label={`Changer la couleur de ${it.nom}`}
                onClick={() => setEdition({ id: it.id, hex: it.hex })}
                className="size-8 shrink-0 border border-encre/15"
                style={{ background: it.hex }}
              />
            )}
            <span className="min-w-32 text-[14px]">{it.nom}</span>
            {avecFamille && 'famille' in it && (
              <span className="text-[12px] text-pierre">{it.famille}</span>
            )}
            {avecFamille && 'entretien' in it && it.entretien && (
              <span className="flex-1 truncate text-[12px] text-pierre">{it.entretien}</span>
            )}
            <button type="button" className={cn(boutonSupprimer, 'ml-auto')} onClick={() => void supprimer(it.id)}>
              Supprimer
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <Cadre libelle="Couleur" className="w-auto">
          <input
            type="color"
            value={form.hex}
            onChange={(e) => setForm((f) => ({ ...f, hex: e.target.value }))}
            className="size-12 cursor-pointer border border-trait"
          />
        </Cadre>
        <Cadre libelle="Nom" className="w-48">
          <Texte value={form.nom} onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))} placeholder="Vert sauge" />
        </Cadre>
        {avecFamille && (
          <>
            <Cadre libelle="Famille" className="w-40">
              <Texte value={form.famille} onChange={(e) => setForm((f) => ({ ...f, famille: e.target.value }))} placeholder="Velours" />
            </Cadre>
            <Cadre libelle="Entretien" className="w-64">
              <Texte
                value={form.entretien}
                onChange={(e) => setForm((f) => ({ ...f, entretien: e.target.value }))}
                placeholder="Brossage dans le sens du poil"
              />
            </Cadre>
          </>
        )}
        <button type="button" disabled={enCours} className={boutonAjouter} onClick={() => void creer()}>
          Ajouter
        </button>
      </div>
    </Section>
  );
}

/* ── Renommage inline ────────────────────────────────────────────────── */

function ChampRenommage({
  valeur,
  onValeur,
  onValider,
  onAnnuler,
}: {
  valeur: string;
  onValeur: (v: string) => void;
  onValider: () => void;
  onAnnuler: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Texte
        autoFocus
        value={valeur}
        onChange={(e) => onValeur(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onValider();
          if (e.key === 'Escape') onAnnuler();
        }}
        className="h-9 w-44 text-[13px]"
      />
      <button type="button" className={boutonSupprimer} onClick={onValider}>
        Valider
      </button>
      <button type="button" className={boutonSupprimer} onClick={onAnnuler}>
        Annuler
      </button>
    </div>
  );
}
