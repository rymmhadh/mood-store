import { Controller, Get } from '@nestjs/common';
import { AttributsService } from './attributs.service';

/**
 * Lecture publique des nuanciers.
 *
 * Le site en a besoin pour afficher le nom et la couleur des coloris et
 * revêtements d'une fiche, sans dépendre d'une copie figée côté front.
 */
@Controller('api')
export class AttributsPublicControleur {
  constructor(private readonly attributs: AttributsService) {}

  @Get('matieres')
  matieres() {
    return this.attributs.listerMatieres();
  }

  @Get('styles')
  styles() {
    return this.attributs.listerStyles();
  }

  @Get('coloris')
  coloris() {
    return this.attributs.listerColoris();
  }

  @Get('revetements')
  revetements() {
    return this.attributs.listerRevetements();
  }
}
