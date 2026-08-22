import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { TAILLE_IMAGE_MAX, telechargerDepuisUrl, traiterImage } from '../commun/image';
import { ZodPipe } from '../commun/validation.pipe';
import { ContenuService } from './contenu.service';
import {
  modifierMediaAccueilSchema,
  modifierSectionSchema,
  reordonnerSchema,
  type ModifierMediaAccueil,
  type ModifierSection,
  type Reordonner,
} from './dto/contenu.schemas';

/**
 * Gestion du contenu de l'accueil (§19.5.1).
 *
 * À FAIRE avant mise en ligne, comme le reste de `api/admin` : poser la
 * garde de session et de rôle (§19.2).
 */
@Controller('api/admin/accueil')
export class ContenuAdminControleur {
  constructor(private readonly contenu: ContenuService) {}

  @Get('sections')
  sections() {
    return this.contenu.listerSections();
  }

  @Patch('sections/:id')
  modifierSection(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodPipe(modifierSectionSchema)) donnees: ModifierSection,
  ) {
    return this.contenu.modifierSection(id, donnees);
  }

  @Post('sections/ordre')
  reordonnerSections(@Body(new ZodPipe(reordonnerSchema)) { ids }: Reordonner) {
    return this.contenu.reordonnerSections(ids);
  }

  @Get('medias')
  medias(@Query('section') section: string) {
    if (!section) throw new BadRequestException('Indiquez une section.');
    return this.contenu.listerMedias(section);
  }

  /**
   * Téléversement direct : contrairement au catalogue, une photo d'accueil
   * n'a pas de fiche à laquelle s'attacher après coup — l'envoi crée la
   * ligne tout de suite, à la fin de la section visée.
   *
   * Réservé aux petits fichiers (voir la limite de corps d'une fonction
   * Vercel) : le back-office utilise `medias/depuis-blob` en production.
   */
  @Post('medias/upload')
  async televerser(@Query('section') section: string, @Req() requete: FastifyRequest) {
    if (!section) throw new BadRequestException('Indiquez une section.');
    if (!requete.isMultipart()) {
      throw new BadRequestException('Envoyez le fichier en multipart/form-data.');
    }

    for await (const partie of requete.parts({ limits: { fileSize: TAILLE_IMAGE_MAX, files: 1 } })) {
      if (partie.type !== 'file') continue;

      const contenu = await partie.toBuffer();
      if (partie.file.truncated) {
        throw new BadRequestException(
          `« ${partie.filename} » dépasse ${Math.round(TAILLE_IMAGE_MAX / 1024 / 1024)} Mo.`,
        );
      }

      const derive = await traiterImage(
        'accueil',
        contenu,
        partie.filename ?? 'photo',
        partie.mimetype ?? '',
      );

      const media = await this.contenu.ajouterMedia(section, {
        url: derive.urlWebp,
        alt: '',
      });

      return {
        id: media.id,
        section: media.section,
        url: this.contenu.urlPublique(media.url),
        largeur: derive.largeur,
        hauteur: derive.hauteur,
        ordre: media.ordre,
        avertissement: derive.avertissement,
      };
    }

    throw new BadRequestException('Aucun fichier reçu.');
  }

  /**
   * Variante de `medias/upload` pour une photo déjà envoyée dans Vercel
   * Blob par le navigateur (§20.1) — le chemin utilisé en production.
   */
  @Post('medias/depuis-blob')
  async televerserDepuisBlob(
    @Query('section') section: string,
    @Body() corps: { url?: string; nomOriginal?: string },
  ) {
    if (!section) throw new BadRequestException('Indiquez une section.');
    if (!corps?.url || !corps.nomOriginal) {
      throw new BadRequestException('Indiquez l’URL et le nom du fichier envoyé.');
    }

    const fichier = await telechargerDepuisUrl(corps.url, corps.nomOriginal);
    const derive = await traiterImage('accueil', fichier, corps.nomOriginal, '');

    const media = await this.contenu.ajouterMedia(section, {
      url: derive.urlWebp,
      alt: '',
    });

    return {
      id: media.id,
      section: media.section,
      url: this.contenu.urlPublique(media.url),
      largeur: derive.largeur,
      hauteur: derive.hauteur,
      ordre: media.ordre,
      avertissement: derive.avertissement,
    };
  }

  @Patch('medias/:id')
  modifierMedia(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodPipe(modifierMediaAccueilSchema)) donnees: ModifierMediaAccueil,
  ) {
    return this.contenu.modifierMedia(id, donnees);
  }

  @Delete('medias/:id')
  async supprimerMedia(@Param('id', ParseUUIDPipe) id: string) {
    await this.contenu.supprimerMedia(id);
    return { supprime: true };
  }

  @Post('medias/ordre')
  reordonnerMedias(@Body() corps: { section: string; ids: string[] }) {
    if (!corps?.section || !Array.isArray(corps.ids)) {
      throw new BadRequestException('Indiquez la section et l’ordre des identifiants.');
    }
    return this.contenu.reordonnerMedias(corps.section, corps.ids);
  }
}
