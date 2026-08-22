import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { ZodPipe } from '../commun/validation.pipe';
import { modifierMediaSchema } from '../catalogue/dto/schemas';
import { MediasService, TAILLE_MAX } from './medias.service';

/**
 * Téléversement des photographies (§22.2).
 *
 * Le corps est lu en `multipart` directement depuis Fastify plutôt qu'à
 * travers un intercepteur : on veut la main sur la limite de taille et sur le
 * message d'erreur, qui est affiché tel quel dans le back-office.
 */
@Controller('api/admin/medias')
export class MediasControleur {
  constructor(private readonly medias: MediasService) {}

  @Post('upload')
  async televerser(@Req() requete: FastifyRequest) {
    if (!requete.isMultipart()) {
      throw new BadRequestException('Envoyez le fichier en multipart/form-data.');
    }

    const recus: unknown[] = [];
    const avertissements: string[] = [];

    for await (const partie of requete.parts({ limits: { fileSize: TAILLE_MAX, files: 10 } })) {
      if (partie.type !== 'file') continue;

      const contenu = await partie.toBuffer();
      if (partie.file.truncated) {
        throw new BadRequestException(
          `« ${partie.filename} » dépasse ${Math.round(TAILLE_MAX / 1024 / 1024)} Mo.`,
        );
      }

      const { media, avertissement } = await this.medias.televerser(
        contenu,
        partie.filename ?? 'photo',
        partie.mimetype ?? '',
      );

      if (avertissement) avertissements.push(avertissement);

      recus.push({
        id: media.id,
        url: this.medias.urlPublique(media.url),
        largeur: media.largeur,
        hauteur: media.hauteur,
        alt: media.alt,
        legende: media.legende,
        role: media.role,
        lqip: media.lqip,
        ordre: media.ordre,
      });
    }

    if (recus.length === 0) throw new BadRequestException('Aucun fichier reçu.');

    return { medias: recus, avertissements };
  }

  /**
   * Traite une photographie déjà envoyée dans Vercel Blob par le
   * navigateur (§20.1). C'est le chemin qu'utilise le back-office en
   * production : au-delà de 4,5 Mo, une fonction Vercel refuse le corps
   * d'une requête, donc le fichier ne transite jamais par l'API — seule son
   * URL le fait, dans un corps JSON minuscule.
   */
  @Post('depuis-blob')
  async depuisBlob(
    @Body()
    corps: {
      url?: string;
      nomOriginal?: string;
      typeDeclare?: string;
      alt?: string;
    },
  ) {
    if (!corps?.url || !corps.nomOriginal) {
      throw new BadRequestException('Indiquez l’URL et le nom du fichier envoyé.');
    }

    const { media, avertissement } = await this.medias.depuisBlobExistant(
      corps.url,
      corps.nomOriginal,
      corps.typeDeclare ?? '',
      corps.alt ?? '',
    );

    return {
      id: media.id,
      url: this.medias.urlPublique(media.url),
      largeur: media.largeur,
      hauteur: media.hauteur,
      alt: media.alt,
      legende: media.legende,
      role: media.role,
      lqip: media.lqip,
      ordre: media.ordre,
      avertissement,
    };
  }

  @Patch(':id')
  async modifier(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodPipe(modifierMediaSchema)) champs: { alt?: string; legende?: string | null },
  ) {
    const media = await this.medias.modifier(id, champs);
    return { id: media.id, alt: media.alt, legende: media.legende, role: media.role };
  }

  @Delete(':id')
  async detacher(@Param('id', ParseUUIDPipe) id: string) {
    await this.medias.detacher(id);
    return { detache: true };
  }
}
