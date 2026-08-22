import { Controller, Get } from '@nestjs/common';
import { ContenuService } from './contenu.service';

/** Lecture publique : ce que la page d'accueil affiche réellement. */
@Controller('api/accueil')
export class ContenuPublicControleur {
  constructor(private readonly contenu: ContenuService) {}

  @Get('sections')
  sections() {
    return this.contenu.listerSectionsVisibles();
  }

  @Get('medias')
  medias() {
    return this.contenu.listerTousLesMedias();
  }
}
