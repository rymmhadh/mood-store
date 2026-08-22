'use client';

import { upload } from '@vercel/blob/client';
import Image from 'next/image';
import { useRef, useState, type DragEvent } from 'react';
import { IconeFermer, IconeGlisser } from '@/components/icons';
import { api, ErreurApi } from '@/lib/api';
import type { MediaAdmin } from '@/types/admin-catalogue';
import { cn } from '@/lib/cn';

interface Props {
  medias: MediaAdmin[];
  onChange: (medias: MediaAdmin[]) => void;
  erreur?: string;
}

const TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/tiff'];
const TAILLE_MAX = 25 * 1024 * 1024;

/**
 * Dépôt et mise en ordre des photographies (§19.4.2).
 *
 * ── Ce que l'ordre veut dire ────────────────────────────────────────────
 * La première vignette est la photo principale : celle de la grille, du
 * partage sur les réseaux, du résultat Google. Elle est donc marquée, et se
 * déplace par glissement — pas par un menu « définir comme principale » qu'il
 * faudrait aller chercher.
 *
 * ── Pourquoi le texte alternatif est en évidence ────────────────────────
 * Le cahier des charges le rend obligatoire. Le laisser dans un panneau
 * secondaire garantirait qu'il ne soit jamais rempli : il est ici sous chaque
 * vignette, avec un rappel visible tant qu'il manque.
 *
 * ── Pourquoi l'envoi passe par Vercel Blob (§20.1) ──────────────────────
 * Chaque fichier va d'abord directement du navigateur vers Vercel Blob
 * (`upload`), puis seule son URL est envoyée à l'API. Un envoi classique au
 * travers de l'API se heurterait, une fois déployé sur Vercel, à la limite
 * de 4,5 Mo qu'une fonction impose au corps d'une requête — bien en dessous
 * d'une photo de 25 Mo. En développement local, ce chemin fonctionne à
 * l'identique (aucune limite de 4,5 Mo côté serveur Node classique, mais un
 * seul chemin à maintenir plutôt que deux).
 */
export function DepotPhotos({ medias, onChange, erreur }: Props) {
  const champ = useRef<HTMLInputElement>(null);
  const [survol, setSurvol] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [glisse, setGlisse] = useState<number | null>(null);

  async function televerser(fichiers: FileList | File[] | null) {
    if (!fichiers || fichiers.length === 0) return;

    const retenus: File[] = [];
    const refus: string[] = [];

    for (const fichier of Array.from(fichiers)) {
      if (!TYPES.includes(fichier.type)) {
        refus.push(`« ${fichier.name} » : formats acceptés JPEG, PNG, WebP, AVIF, TIFF.`);
      } else if (fichier.size > TAILLE_MAX) {
        refus.push(`« ${fichier.name} » dépasse 25 Mo.`);
      } else {
        retenus.push(fichier);
      }
    }

    setMessages(refus);
    if (retenus.length === 0) return;

    setEnvoi(true);
    const recus: MediaAdmin[] = [];
    const suite: string[] = [...refus];

    try {
      // Séquentiel plutôt qu'en parallèle : plusieurs gros fichiers envoyés
      // à la fois, c'est la connexion de l'atelier qui plie, pas l'API.
      for (const fichier of retenus) {
        try {
          const blob = await upload(fichier.name, fichier, {
            access: 'public',
            handleUploadUrl: '/api/admin/medias/jeton',
          });

          const { data } = await api<MediaAdmin & { avertissement: string | null }>(
            '/api/admin/medias/depuis-blob',
            {
              method: 'POST',
              body: { url: blob.url, nomOriginal: fichier.name, typeDeclare: fichier.type },
            },
          );

          recus.push(data);
          if (data.avertissement) suite.push(data.avertissement);
        } catch (e) {
          suite.push(
            `« ${fichier.name} » : ${e instanceof ErreurApi ? e.message : 'le téléversement a échoué.'}`,
          );
        }
      }
    } finally {
      if (recus.length) onChange([...medias, ...recus]);
      setMessages(suite);
      setEnvoi(false);
      if (champ.current) champ.current.value = '';
    }
  }

  function deplacer(depuis: number, vers: number) {
    if (depuis === vers) return;
    const suite = [...medias];
    const [element] = suite.splice(depuis, 1);
    suite.splice(vers, 0, element);
    onChange(suite);
  }

  function retirer(id: string) {
    onChange(medias.filter((m) => m.id !== id));
  }

  function majAlt(id: string, alt: string) {
    onChange(medias.map((m) => (m.id === id ? { ...m, alt } : m)));
    // Enregistré au fil de la frappe côté API : une photo peut servir ailleurs,
    // son texte alternatif ne doit pas dépendre de l'enregistrement de la fiche.
    void api(`/api/admin/medias/${id}`, { method: 'PATCH', body: { alt } }).catch(() => {});
  }

  return (
    <div className="flex flex-col gap-5">
      <div
        onDragOver={(e: DragEvent) => {
          e.preventDefault();
          setSurvol(true);
        }}
        onDragLeave={() => setSurvol(false)}
        onDrop={(e: DragEvent) => {
          e.preventDefault();
          setSurvol(false);
          void televerser(e.dataTransfer.files);
        }}
        className={cn(
          'flex flex-col items-center border border-dashed px-6 py-10 text-center',
          'transition-colors duration-300 ease-[var(--ease-doux)]',
          survol ? 'border-encre bg-galerie' : erreur ? 'border-bronze bg-blanc' : 'border-trait bg-blanc',
        )}
      >
        <p className="text-[15px]">
          {envoi ? 'Téléversement en cours…' : 'Glissez vos photographies ici'}
        </p>
        <p className="mt-1.5 max-w-md text-[12px] leading-relaxed text-pierre">
          JPEG, PNG, WebP ou TIFF, 25 Mo maximum. Au moins 2000 px de large : en dessous, la photo
          sera floue en plein écran.
        </p>

        <button
          type="button"
          onClick={() => champ.current?.click()}
          disabled={envoi}
          className="mt-5 inline-flex h-11 items-center border border-encre px-6 libelle-action transition-colors hover:bg-encre hover:text-craie disabled:opacity-45"
        >
          Choisir des fichiers
        </button>

        <input
          ref={champ}
          type="file"
          accept={TYPES.join(',')}
          multiple
          onChange={(e) => void televerser(e.target.files)}
          className="sr-only"
        />
      </div>

      {messages.length > 0 && (
        <ul className="flex flex-col gap-1.5 border border-bronze bg-blanc px-5 py-4">
          {messages.map((m, i) => (
            <li key={i} className="text-[13px] leading-relaxed text-fumee">
              {m}
            </li>
          ))}
        </ul>
      )}

      {erreur && <p className="text-[12px] text-encre">↳ {erreur}</p>}

      {medias.length > 0 && (
        <ol className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {medias.map((media, index) => (
            <li
              key={media.id}
              draggable
              onDragStart={() => setGlisse(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (glisse !== null) deplacer(glisse, index);
                setGlisse(null);
              }}
              onDragEnd={() => setGlisse(null)}
              className={cn(
                'flex flex-col border border-sable/50 bg-blanc',
                glisse === index && 'opacity-40',
              )}
            >
              <div className="relative aspect-4/5 bg-galerie">
                <Image
                  src={media.url}
                  alt={media.alt || 'Photographie sans texte alternatif'}
                  fill
                  sizes="(max-width: 640px) 50vw, 260px"
                  className="object-cover"
                  {...(media.lqip ? { placeholder: 'blur' as const, blurDataURL: media.lqip } : {})}
                />

                {index === 0 && (
                  <span className="absolute top-0 left-0 bg-encre px-2.5 py-1 text-[10px] tracking-[0.12em] text-craie uppercase">
                    Principale
                  </span>
                )}

                <span
                  aria-hidden
                  className="absolute top-1 right-9 cursor-grab p-1.5 text-craie mix-blend-difference"
                  title="Glisser pour réordonner"
                >
                  <IconeGlisser className="size-4" />
                </span>

                <button
                  type="button"
                  onClick={() => retirer(media.id)}
                  aria-label={`Retirer la photographie ${index + 1}`}
                  className="absolute top-1 right-1 p-1.5 text-craie mix-blend-difference transition-transform hover:scale-110"
                >
                  <IconeFermer className="size-4" />
                </button>
              </div>

              <div className="flex flex-col gap-1.5 p-3">
                <input
                  value={media.alt}
                  onChange={(e) => majAlt(media.id, e.target.value)}
                  placeholder="Décrire la photo…"
                  aria-label={`Texte alternatif de la photographie ${index + 1}`}
                  className={cn(
                    'h-9 w-full border bg-blanc px-2.5 text-[12px] focus:outline-none focus-visible:border-encre',
                    media.alt.trim() ? 'border-trait' : 'border-bronze',
                  )}
                />
                <p className="text-[11px] text-pierre">
                  {media.alt.trim()
                    ? `${media.largeur} × ${media.hauteur} px`
                    : 'Texte alternatif manquant'}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
