import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ZodPipe } from '../commun/validation.pipe';
import { AttributsService } from './attributs.service';
import {
  creerColorisSchema,
  creerMatiereSchema,
  creerRevetementSchema,
  creerStyleSchema,
  modifierColorisSchema,
  modifierMatiereSchema,
  modifierRevetementSchema,
  modifierStyleSchema,
  type CreerColoris,
  type CreerMatiere,
  type CreerRevetement,
  type CreerStyle,
  type ModifierColoris,
  type ModifierMatiere,
  type ModifierRevetement,
  type ModifierStyle,
} from './dto/attributs.schemas';

/**
 * Nuanciers du back-office : matières, styles, coloris, revêtements.
 *
 * Quatre listes courtes, quatre fois le même CRUD. Un seul contrôleur plutôt
 * que quatre : les routes se lisent d'un coup d'œil, et le formulaire de
 * pièce n'a que ces quatre adresses à connaître.
 */
@Controller('api/admin')
export class AttributsAdminControleur {
  constructor(private readonly attributs: AttributsService) {}

  @Get('matieres')
  matieres() {
    return this.attributs.listerMatieres();
  }

  @Post('matieres')
  creerMatiere(@Body(new ZodPipe(creerMatiereSchema)) donnees: CreerMatiere) {
    return this.attributs.creerMatiere(donnees);
  }

  @Patch('matieres/:id')
  modifierMatiere(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodPipe(modifierMatiereSchema)) donnees: ModifierMatiere,
  ) {
    return this.attributs.modifierMatiere(id, donnees);
  }

  @Delete('matieres/:id')
  @HttpCode(200)
  async supprimerMatiere(@Param('id', ParseUUIDPipe) id: string) {
    await this.attributs.supprimerMatiere(id);
    return { supprime: true };
  }

  @Get('styles')
  styles() {
    return this.attributs.listerStyles();
  }

  @Post('styles')
  creerStyle(@Body(new ZodPipe(creerStyleSchema)) donnees: CreerStyle) {
    return this.attributs.creerStyle(donnees);
  }

  @Patch('styles/:id')
  modifierStyle(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodPipe(modifierStyleSchema)) donnees: ModifierStyle,
  ) {
    return this.attributs.modifierStyle(id, donnees);
  }

  @Delete('styles/:id')
  @HttpCode(200)
  async supprimerStyle(@Param('id', ParseUUIDPipe) id: string) {
    await this.attributs.supprimerStyle(id);
    return { supprime: true };
  }

  @Get('coloris')
  coloris() {
    return this.attributs.listerColoris();
  }

  @Post('coloris')
  creerColoris(@Body(new ZodPipe(creerColorisSchema)) donnees: CreerColoris) {
    return this.attributs.creerColoris(donnees);
  }

  @Patch('coloris/:id')
  modifierColoris(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodPipe(modifierColorisSchema)) donnees: ModifierColoris,
  ) {
    return this.attributs.modifierColoris(id, donnees);
  }

  @Delete('coloris/:id')
  @HttpCode(200)
  async supprimerColoris(@Param('id', ParseUUIDPipe) id: string) {
    await this.attributs.supprimerColoris(id);
    return { supprime: true };
  }

  @Get('revetements')
  revetements() {
    return this.attributs.listerRevetements();
  }

  @Post('revetements')
  creerRevetement(@Body(new ZodPipe(creerRevetementSchema)) donnees: CreerRevetement) {
    return this.attributs.creerRevetement(donnees);
  }

  @Patch('revetements/:id')
  modifierRevetement(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodPipe(modifierRevetementSchema)) donnees: ModifierRevetement,
  ) {
    return this.attributs.modifierRevetement(id, donnees);
  }

  @Delete('revetements/:id')
  @HttpCode(200)
  async supprimerRevetement(@Param('id', ParseUUIDPipe) id: string) {
    await this.attributs.supprimerRevetement(id);
    return { supprime: true };
  }
}
