import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { Repository } from 'typeorm';
import { enregistrerFichier, telechargerDepuisUrl, TYPES_IMAGE_ACCEPTES } from '../commun/image';
import { versSlug } from '../commun/slug';
import { Media } from '../catalogue/entites/media.entite';

/** Formats acceptés au téléversement. */
const TYPES_ACCEPTES = TYPES_IMAGE_ACCEPTES;

/** 25 Mo : un fichier d'appareil photo passe, un fichier RAW non. */
export const TAILLE_MAX = 25 * 1024 * 1024;

/** Largeur maximale du dérivé servi. Au-delà, aucun écran n'y gagne. */
const LARGEUR_MAX = 2560;

/** Seuil d'alerte du §19.4.2 : en dessous, la photo ne tiendra pas en plein écran. */
export const LARGEUR_MINIMALE = 2000;

interface DeriveTraite {
  base: string;
  extensionMaster: string;
  derive: { data: Buffer; info: { width: number; height: number } };
  vignette: Buffer;
  largeurOrigine: number;
}

@Injectable()
export class MediasService {
  private readonly journal = new Logger('Médias');

  constructor(
    @InjectRepository(Media) private readonly medias: Repository<Media>,
    private readonly config: ConfigService,
  ) {}

  /**
   * Téléverse une photographie et en fabrique les dérivés à partir d'un
   * fichier reçu directement dans le corps de la requête.
   *
   * Sur Vercel, une fonction refuse tout corps de plus de 4,5 Mo : ce
   * chemin ne convient donc qu'aux petits fichiers (tests, environnements
   * hors Vercel). Le back-office, lui, passe systématiquement par
   * `depuisBlobExistant` (§20.1), qui ne connaît pas cette limite.
   */
  async televerser(
    fichier: Buffer,
    nomOrigine: string,
    typeDeclare: string,
    alt = '',
  ): Promise<{ media: Media; avertissement: string | null }> {
    const traite = await this.traiter(fichier, nomOrigine, typeDeclare);

    const [urlMaster, url] = await Promise.all([
      enregistrerFichier(
        'catalogue',
        `${traite.base}.master.${traite.extensionMaster}`,
        fichier,
        typeDeclare || 'application/octet-stream',
      ),
      enregistrerFichier('catalogue', `${traite.base}.webp`, traite.derive.data, 'image/webp'),
    ]);

    return this.enregistrer({ url, urlMaster, traite, alt });
  }

  /**
   * Traite une photographie déjà envoyée dans Vercel Blob par le
   * navigateur (téléversement direct client → Blob, hors du corps d'une
   * fonction Vercel). C'est le chemin utilisé par le back-office en
   * production : le fichier original, potentiellement volumineux, ne
   * transite jamais par la fonction — seule son URL le fait. Cette URL
   * sert directement de « master » : inutile de la réenregistrer.
   */
  async depuisBlobExistant(
    urlOriginal: string,
    nomOrigine: string,
    typeDeclare: string,
    alt = '',
  ): Promise<{ media: Media; avertissement: string | null }> {
    const fichier = await telechargerDepuisUrl(urlOriginal, nomOrigine);
    const traite = await this.traiter(fichier, nomOrigine, typeDeclare);

    const url = await enregistrerFichier('catalogue', `${traite.base}.webp`, traite.derive.data, 'image/webp');

    return this.enregistrer({ url, urlMaster: urlOriginal, traite, alt });
  }

  /**
   * Vérifie et fabrique les dérivés (WebP 2560 px + vignette LQIP) d'une
   * photographie, sans encore rien enregistrer nulle part.
   */
  private async traiter(fichier: Buffer, nomOrigine: string, typeDeclare: string): Promise<DeriveTraite> {
    if (fichier.length === 0) throw new BadRequestException('Le fichier reçu est vide.');
    if (fichier.length > TAILLE_MAX) {
      throw new BadRequestException(
        `« ${nomOrigine} » dépasse ${Math.round(TAILLE_MAX / 1024 / 1024)} Mo.`,
      );
    }
    if (typeDeclare && !TYPES_ACCEPTES.includes(typeDeclare)) {
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
    const extensionMaster = (metadonnees.format ?? 'bin').replace('jpeg', 'jpg');

    // `rotate()` sans argument applique l'orientation EXIF. Sans lui, les
    // photos prises au téléphone sortent couchées.
    const derive = await image
      .rotate()
      .resize({ width: Math.min(largeurOrigine, LARGEUR_MAX), withoutEnlargement: true })
      .webp({ quality: 88 })
      .toBuffer({ resolveWithObject: true });

    const vignette = await sharp(fichier)
      .rotate()
      .resize({ width: 20 })
      .webp({ quality: 40 })
      .toBuffer();

    return { base, extensionMaster, derive, vignette, largeurOrigine };
  }

  private async enregistrer(params: {
    url: string;
    urlMaster: string;
    traite: DeriveTraite;
    alt: string;
  }): Promise<{ media: Media; avertissement: string | null }> {
    const { url, urlMaster, traite, alt } = params;

    const media = await this.medias.save(
      this.medias.create({
        url,
        urlMaster,
        largeur: traite.derive.info.width,
        hauteur: traite.derive.info.height,
        alt: alt.trim(),
        role: 'situation',
        lqip: `data:image/webp;base64,${traite.vignette.toString('base64')}`,
        ordre: 0,
      }),
    );

    this.journal.log(`Photographie reçue : ${media.id}`);

    return {
      media,
      avertissement:
        traite.largeurOrigine < LARGEUR_MINIMALE
          ? `Cette image fait ${traite.largeurOrigine} px de large. En dessous de ${LARGEUR_MINIMALE} px, elle sera floue en plein écran.`
          : null,
    };
  }

  async modifier(
    id: string,
    champs: { alt?: string; legende?: string | null; role?: Media['role'] },
  ): Promise<Media> {
    const media = await this.medias.findOneBy({ id });
    if (!media) throw new NotFoundException('Cette photographie n’existe pas.');

    if (champs.alt !== undefined) media.alt = champs.alt;
    if (champs.legende !== undefined) media.legende = champs.legende;
    if (champs.role !== undefined) media.role = champs.role;

    return this.medias.save(media);
  }

  /**
   * Détache une photographie de sa pièce.
   *
   * Le fichier n'est pas effacé du disque : la même photo peut illustrer une
   * réalisation ou un article du journal, et une suppression en cascade
   * laisserait des cadres vides ailleurs sur le site. Le ménage des fichiers
   * réellement orphelins est une tâche d'entretien séparée.
   */
  async detacher(id: string): Promise<void> {
    const resultat = await this.medias.update({ id }, { produitId: null });
    if (!resultat.affected) throw new NotFoundException('Cette photographie n’existe pas.');
  }

  urlPublique(chemin: string): string {
    // Une photographie stockée dans Vercel Blob porte déjà son adresse
    // complète : la préfixer avec URL_PUBLIQUE la casserait.
    if (/^https?:\/\//i.test(chemin)) return chemin;

    const racine = (this.config.get<string>('URL_PUBLIQUE') ?? 'http://localhost:4000').replace(
      /\/+$/,
      '',
    );
    return `${racine}${chemin}`;
  }
}
