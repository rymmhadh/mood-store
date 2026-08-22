import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { put } from '@vercel/blob';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import { versSlug } from './slug';

export const TYPES_IMAGE_ACCEPTES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/tiff'];

/** 25 Mo : un fichier d'appareil photo passe, un fichier RAW non. */
export const TAILLE_IMAGE_MAX = 25 * 1024 * 1024;

const LARGEUR_IMAGE_MAX = 2560;

/** Seuil d'alerte : en dessous, la photo ne tiendra pas en plein écran. */
export const LARGEUR_IMAGE_MINIMALE = 2000;

export interface DeriveImage {
  urlWebp: string;
  largeur: number;
  hauteur: number;
  lqip: string;
  avertissement: string | null;
}

/**
 * Enregistre un fichier dans le stockage des médias.
 *
 * En local, le disque : simple, pas de compte à créer pour développer. Sur
 * Vercel, le système de fichiers d'une fonction est en lecture seule (hors
 * `/tmp`, qui ne survit pas à la requête) — rien écrit là ne persiste d'une
 * requête à l'autre. Dès qu'un jeton Vercel Blob est présent (il l'est
 * automatiquement une fois le store connecté au projet, §20.1), c'est lui
 * qui prend le relais. Le reste du code ne connaît pas la différence : il
 * reçoit une URL, relative en local, absolue sur Vercel — `urlPublique` et
 * `absolu` (medias.service.ts / contenu.service.ts) savent déjà distinguer
 * les deux.
 */
export async function enregistrerFichier(
  dossierRelatif: string,
  nomFichier: string,
  contenu: Buffer,
  typeMime: string,
): Promise<string> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`${dossierRelatif}/${nomFichier}`, contenu, {
      access: 'public',
      contentType: typeMime,
      addRandomSuffix: false,
    });
    return blob.url;
  }

  if (process.env.VERCEL) {
    throw new InternalServerErrorException(
      "Le stockage des photographies (Vercel Blob) n'est pas encore configuré pour ce projet : connectez un store Blob, puis réessayez.",
    );
  }

  const dossier = join(process.cwd(), 'media', dossierRelatif);
  await mkdir(dossier, { recursive: true });
  await writeFile(join(dossier, nomFichier), contenu);
  return `/media/${dossierRelatif}/${nomFichier}`;
}

/**
 * Récupère un fichier déjà envoyé dans Vercel Blob par le navigateur
 * (téléversement direct depuis le client, §20.1 — nécessaire au-delà de
 * 4,5 Mo, la limite du corps d'une requête vers une fonction Vercel) pour
 * lui appliquer le même traitement qu'un fichier reçu classiquement dans le
 * corps d'une requête.
 */
export async function telechargerDepuisUrl(url: string, nomOrigine: string): Promise<Buffer> {
  let reponse: Response;
  try {
    reponse = await fetch(url);
  } catch {
    throw new BadRequestException(`« ${nomOrigine} » n'a pas pu être récupéré après l'envoi.`);
  }
  if (!reponse.ok) {
    throw new BadRequestException(`« ${nomOrigine} » n'a pas pu être récupéré après l'envoi.`);
  }

  const buffer = Buffer.from(await reponse.arrayBuffer());
  if (buffer.length > TAILLE_IMAGE_MAX) {
    throw new BadRequestException(
      `« ${nomOrigine} » dépasse ${Math.round(TAILLE_IMAGE_MAX / 1024 / 1024)} Mo.`,
    );
  }
  return buffer;
}

/**
 * Valide, redimensionne et enregistre une image téléversée.
 *
 * Même contrôle de format et de poids sur le **contenu** du fichier, même
 * dérivé WebP à 2560 px, même vignette floue en LQIP, quelle que soit la
 * provenance du buffer (corps de requête ou récupéré depuis Vercel Blob).
 * Seul le dossier de destination change — ce module sert aussi le contenu
 * de l'accueil, qui n'a pas besoin de conserver le fichier d'origine.
 */
export async function traiterImage(
  dossierRelatif: string,
  fichier: Buffer,
  nomOrigine: string,
  typeDeclare: string,
): Promise<DeriveImage> {
  if (fichier.length === 0) throw new BadRequestException('Le fichier reçu est vide.');
  if (fichier.length > TAILLE_IMAGE_MAX) {
    throw new BadRequestException(
      `« ${nomOrigine} » dépasse ${Math.round(TAILLE_IMAGE_MAX / 1024 / 1024)} Mo.`,
    );
  }
  if (typeDeclare && !TYPES_IMAGE_ACCEPTES.includes(typeDeclare)) {
    throw new BadRequestException('Formats acceptés : JPEG, PNG, WebP, AVIF, TIFF.');
  }

  let image: sharp.Sharp;
  let metadonnees: sharp.Metadata;
  try {
    image = sharp(fichier, { failOn: 'error' });
    metadonnees = await image.metadata();
  } catch {
    throw new BadRequestException(
      `« ${nomOrigine} » n’est pas une image lisible. Réenregistrez-la en JPEG ou en PNG.`,
    );
  }

  const largeurOrigine = metadonnees.width ?? 0;
  const hauteurOrigine = metadonnees.height ?? 0;
  if (largeurOrigine === 0 || hauteurOrigine === 0) {
    throw new BadRequestException(`« ${nomOrigine} » n’est pas une image lisible.`);
  }

  const base = `${versSlug(nomOrigine.replace(/\.[^.]+$/, '')) || 'photo'}-${randomUUID().slice(0, 8)}`;

  const derive = await image
    .rotate()
    .resize({ width: Math.min(largeurOrigine, LARGEUR_IMAGE_MAX), withoutEnlargement: true })
    .webp({ quality: 88 })
    .toBuffer({ resolveWithObject: true });

  const vignette = await sharp(fichier)
    .rotate()
    .resize({ width: 20 })
    .webp({ quality: 40 })
    .toBuffer();

  const urlWebp = await enregistrerFichier(dossierRelatif, `${base}.webp`, derive.data, 'image/webp');

  return {
    urlWebp,
    largeur: derive.info.width,
    hauteur: derive.info.height,
    lqip: `data:image/webp;base64,${vignette.toString('base64')}`,
    avertissement:
      largeurOrigine < LARGEUR_IMAGE_MINIMALE
        ? `Cette image fait ${largeurOrigine} px de large. En dessous de ${LARGEUR_IMAGE_MINIMALE} px, elle sera floue en plein écran.`
        : null,
  };
}
