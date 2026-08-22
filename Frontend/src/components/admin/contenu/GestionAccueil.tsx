'use client';

import { upload } from '@vercel/blob/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { Cadre, Section, Texte } from '@/components/admin/Champs';
import { EnTetePage } from '@/components/admin/EnTetePage';
import { api, ErreurApi } from '@/lib/api';
import { cn } from '@/lib/cn';
import type { MediaAccueilAdmin, SectionAccueilAdmin } from '@/types/admin-contenu';

interface Props {
  sections: SectionAccueilAdmin[];
  mediasParSection: Record<string, MediaAccueilAdmin[]>;
}

const TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/tiff'];
const TAILLE_MAX = 25 * 1024 * 1024;

function messageErreur(e: unknown): string {
  if (e instanceof ErreurApi) return e.message;
  return 'L’API est injoignable. Vérifiez qu’elle est démarrée, puis réessayez.';
}

/**
 * Contenu de la page d'accueil (§19.5.1).
 *
 * Deux écrans en un : l'ordre et la visibilité des sections en haut, les
 * photographies des sections qui en ont en dessous. Une section masquée ici
 * disparaît de l'accueil au prochain chargement — sans redéploiement.
 */
export function GestionAccueil({ sections, mediasParSection }: Props) {
  const router = useRouter();
  const rafraichir = () => router.refresh();

  const sectionsPhotos = sections.filter((s) => s.cle in mediasParSection);

  return (
    <>
      <EnTetePage
        titre="Contenu de l’accueil"
        soustitre="Les sections de la page d’accueil, leurs photos, et l’ordre dans lequel elles s’affichent."
        retour={{ libelle: 'Tableau de bord', href: '/admin' }}
      />

      <div className="flex flex-col gap-6 px-6 py-8 lg:px-10 lg:py-10">
        <SectionOrdre sections={sections} onChange={rafraichir} />

        {sectionsPhotos.map((s) => (
          <SectionPhotos
            key={s.cle}
            section={s.cle}
            titre={s.nom}
            medias={mediasParSection[s.cle] ?? []}
            avecTexte={s.cle === 'hero'}
            onChange={rafraichir}
          />
        ))}
      </div>
    </>
  );
}

/* ── Ordre et visibilité ─────────────────────────────────────────────── */

function SectionOrdre({ sections, onChange }: { sections: SectionAccueilAdmin[]; onChange: () => void }) {
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, setEnCours] = useState(false);

  async function basculerVisible(s: SectionAccueilAdmin) {
    setErreur(null);
    try {
      await api(`/api/admin/accueil/sections/${s.id}`, { method: 'PATCH', body: { visible: !s.visible } });
      onChange();
    } catch (e) {
      setErreur(messageErreur(e));
    }
  }

  async function deplacer(index: number, sens: -1 | 1) {
    const voisin = index + sens;
    if (voisin < 0 || voisin >= sections.length) return;

    const suite = [...sections];
    [suite[index], suite[voisin]] = [suite[voisin], suite[index]];

    setErreur(null);
    setEnCours(true);
    try {
      await api('/api/admin/accueil/sections/ordre', { method: 'POST', body: { ids: suite.map((s) => s.id) } });
      onChange();
    } catch (e) {
      setErreur(messageErreur(e));
    } finally {
      setEnCours(false);
    }
  }

  return (
    <Section
      titre="Sections de l’accueil"
      aide="Une section désactivée disparaît du site. L’ordre ci-dessous est celui de la page."
    >
      {erreur && (
        <p role="alert" className="border border-bronze bg-blanc px-4 py-3 text-[13px] text-fumee">
          {erreur}
        </p>
      )}

      <div className="flex flex-col">
        {sections.map((s, i) => (
          <div key={s.id} className="flex items-center gap-4 border-b border-sable/40 py-3 last:border-b-0">
            <div className="flex flex-col">
              <button
                type="button"
                disabled={enCours || i === 0}
                onClick={() => void deplacer(i, -1)}
                aria-label={`Monter ${s.nom}`}
                className="text-pierre hover:text-encre disabled:opacity-25"
              >
                ▲
              </button>
              <button
                type="button"
                disabled={enCours || i === sections.length - 1}
                onClick={() => void deplacer(i, 1)}
                aria-label={`Descendre ${s.nom}`}
                className="text-pierre hover:text-encre disabled:opacity-25"
              >
                ▼
              </button>
            </div>

            <span className={cn('flex-1 text-[15px]', !s.visible && 'text-pierre line-through')}>{s.nom}</span>

            <label className="flex cursor-pointer items-center gap-2 text-[13px] text-fumee">
              <input
                type="checkbox"
                checked={s.visible}
                onChange={() => void basculerVisible(s)}
                className="size-5 accent-[var(--color-encre)]"
              />
              Visible
            </label>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ── Photographies d'une section ─────────────────────────────────────── */

function SectionPhotos({
  section,
  titre,
  medias,
  avecTexte,
  onChange,
}: {
  section: string;
  titre: string;
  medias: MediaAccueilAdmin[];
  avecTexte: boolean;
  onChange: () => void;
}) {
  const champ = useRef<HTMLInputElement>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  /**
   * Le fichier part d'abord directement du navigateur vers Vercel Blob
   * (§20.1), puis seule son URL est envoyée à l'API : un envoi classique
   * au travers de l'API se heurterait, une fois déployé sur Vercel, à la
   * limite de 4,5 Mo qu'une fonction impose au corps d'une requête.
   */
  async function televerser(fichiers: FileList | null) {
    if (!fichiers || fichiers.length === 0) return;
    const fichier = fichiers[0];

    if (!TYPES.includes(fichier.type)) {
      setErreur(`« ${fichier.name} » : formats acceptés JPEG, PNG, WebP, AVIF, TIFF.`);
      return;
    }
    if (fichier.size > TAILLE_MAX) {
      setErreur(`« ${fichier.name} » dépasse 25 Mo.`);
      return;
    }

    setErreur(null);
    setEnvoi(true);
    try {
      const blob = await upload(fichier.name, fichier, {
        access: 'public',
        handleUploadUrl: '/api/admin/medias/jeton',
      });

      const { data } = await api<{ avertissement: string | null }>(
        `/api/admin/accueil/medias/depuis-blob?section=${encodeURIComponent(section)}`,
        { method: 'POST', body: { url: blob.url, nomOriginal: fichier.name } },
      );
      if (data.avertissement) setErreur(data.avertissement);
      onChange();
    } catch (e) {
      setErreur(messageErreur(e));
    } finally {
      setEnvoi(false);
      if (champ.current) champ.current.value = '';
    }
  }

  async function supprimer(id: string) {
    setErreur(null);
    try {
      await api(`/api/admin/accueil/medias/${id}`, { method: 'DELETE' });
      onChange();
    } catch (e) {
      setErreur(messageErreur(e));
    }
  }

  async function deplacer(index: number, sens: -1 | 1) {
    const voisin = index + sens;
    if (voisin < 0 || voisin >= medias.length) return;
    const suite = [...medias];
    [suite[index], suite[voisin]] = [suite[voisin], suite[index]];
    setErreur(null);
    try {
      await api('/api/admin/accueil/medias/ordre', {
        method: 'POST',
        body: { section, ids: suite.map((m) => m.id) },
      });
      onChange();
    } catch (e) {
      setErreur(messageErreur(e));
    }
  }

  async function majChamp(id: string, champs: Partial<MediaAccueilAdmin>) {
    try {
      await api(`/api/admin/accueil/medias/${id}`, { method: 'PATCH', body: champs });
    } catch (e) {
      setErreur(messageErreur(e));
    }
  }

  return (
    <Section
      titre={titre}
      aide={
        avecTexte
          ? 'Chaque diapositive a sa photo, son titre, sa légende et le lien qu’elle ouvre.'
          : 'Glissez une nouvelle photo pour l’ajouter ; l’ordre ci-dessous est celui de la page.'
      }
    >
      {erreur && (
        <p role="alert" className="border border-bronze bg-blanc px-4 py-3 text-[13px] text-fumee">
          {erreur}
        </p>
      )}

      <div className={cn('grid gap-5', avecTexte ? 'grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-4')}>
        {medias.map((m, i) => (
          <div key={m.id} className="flex flex-col gap-3 border border-sable/40 bg-blanc p-3">
            <div className={cn('flex gap-4', avecTexte ? 'flex-row items-start' : 'flex-col')}>
              <div className={cn('relative shrink-0 bg-galerie', avecTexte ? 'aspect-[4/3] w-48' : 'aspect-[4/3] w-full')}>
                <Image src={m.url} alt={m.alt || m.titre || 'Photo'} fill sizes="220px" className="object-cover" />
              </div>

              <div className="flex flex-1 flex-col gap-2">
                {avecTexte && (
                  <>
                    <Texte
                      defaultValue={m.titre ?? ''}
                      placeholder="Titre"
                      onBlur={(e) => void majChamp(m.id, { titre: e.target.value })}
                      className="h-9 text-[13px]"
                    />
                    <Texte
                      defaultValue={m.texte ?? ''}
                      placeholder="Légende"
                      onBlur={(e) => void majChamp(m.id, { texte: e.target.value })}
                      className="h-9 text-[13px]"
                    />
                    <Texte
                      defaultValue={m.lien ?? ''}
                      placeholder="Lien — /produit/sillage"
                      onBlur={(e) => void majChamp(m.id, { lien: e.target.value })}
                      className="h-9 text-[13px]"
                    />
                  </>
                )}
                <Texte
                  defaultValue={m.alt}
                  placeholder="Texte alternatif"
                  onBlur={(e) => void majChamp(m.id, { alt: e.target.value })}
                  className="h-9 text-[13px]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={i === 0}
                  onClick={() => void deplacer(i, -1)}
                  aria-label="Monter"
                  className="text-pierre hover:text-encre disabled:opacity-25"
                >
                  ◀
                </button>
                <button
                  type="button"
                  disabled={i === medias.length - 1}
                  onClick={() => void deplacer(i, 1)}
                  aria-label="Descendre"
                  className="text-pierre hover:text-encre disabled:opacity-25"
                >
                  ▶
                </button>
              </div>
              <button type="button" className="text-[12px] text-pierre underline decoration-dotted hover:text-encre" onClick={() => void supprimer(m.id)}>
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      <Cadre libelle="Ajouter une photo" aide="JPEG, PNG, WebP ou TIFF, 25 Mo maximum, au moins 2000 px de large.">
        <div className="flex items-center gap-3">
          <input
            ref={champ}
            type="file"
            accept={TYPES.join(',')}
            onChange={(e) => void televerser(e.target.files)}
            disabled={envoi}
            className="text-[13px]"
          />
          {envoi && <span className="text-[13px] text-pierre">Envoi…</span>}
        </div>
      </Cadre>
    </Section>
  );
}
