import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ReponseAvecMeta } from '../commun/enveloppe.intercepteur';
import { ZodPipe } from '../commun/validation.pipe';
import {
  creerCategorieSchema,
  creerCollectionSchema,
  modifierCategorieSchema,
  modifierCollectionSchema,
  type CreerCategorie,
  type CreerCollection,
  type ModifierCategorie,
  type ModifierCollection,
} from './dto/attributs.schemas';
import {
  creerProduitSchema,
  filtrerProduitsSchema,
  modifierProduitSchema,
  type CreerProduit,
  type FiltrerProduits,
  type ModifierProduit,
} from './dto/schemas';
import { ProduitsService } from './produits.service';
import { TaxonomieService } from './taxonomie.service';

/**
 * Endpoints du back-office (§22.2).
 *
 * À FAIRE avant mise en ligne : poser ici la garde de session et de rôle
 * (§19.2 — « Gestionnaire catalogue » au minimum). Tant qu'elle n'existe pas,
 * l'API ne doit pas être exposée hors du réseau local.
 */
@Controller('api/admin')
export class ProduitsAdminControleur {
  constructor(
    private readonly produits: ProduitsService,
    private readonly taxonomie: TaxonomieService,
  ) {}

  @Get('produits')
  async lister(@Query(new ZodPipe(filtrerProduitsSchema)) filtres: FiltrerProduits) {
    const { produits, total } = await this.produits.lister(filtres);
    return new ReponseAvecMeta(produits, {
      total,
      page: filtres.page,
      parPage: filtres.parPage,
      pages: Math.max(1, Math.ceil(total / filtres.parPage)),
    });
  }

  @Get('produits/:id')
  trouver(@Param('id', ParseUUIDPipe) id: string) {
    return this.produits.trouver(id);
  }

  @Post('produits')
  creer(@Body(new ZodPipe(creerProduitSchema)) donnees: CreerProduit) {
    return this.produits.creer(donnees);
  }

  @Patch('produits/:id')
  modifier(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodPipe(modifierProduitSchema)) donnees: ModifierProduit,
  ) {
    return this.produits.modifier(id, donnees);
  }

  @Delete('produits/:id')
  @HttpCode(200)
  async supprimer(@Param('id', ParseUUIDPipe) id: string) {
    await this.produits.mettreALaCorbeille(id);
    return { supprime: true, message: 'Pièce déplacée dans la corbeille. Restaurable 30 jours.' };
  }

  @Post('produits/:id/restaurer')
  restaurer(@Param('id', ParseUUIDPipe) id: string) {
    return this.produits.restaurer(id);
  }

  /** Alimente le bandeau et les alertes du tableau de bord (§19.3). */
  @Get('stats/catalogue')
  statistiques() {
    return this.produits.statistiques();
  }

  /* ── Catégories ──────────────────────────────────────────────────────── */

  @Get('categories')
  categories() {
    return this.taxonomie.familles();
  }

  @Get('categories/arbre')
  arbre() {
    return this.taxonomie.arbre();
  }

  @Post('categories')
  creerCategorie(@Body(new ZodPipe(creerCategorieSchema)) donnees: CreerCategorie) {
    return this.taxonomie.creerCategorie(donnees);
  }

  @Patch('categories/:id')
  modifierCategorie(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodPipe(modifierCategorieSchema)) donnees: ModifierCategorie,
  ) {
    return this.taxonomie.modifierCategorie(id, donnees);
  }

  @Delete('categories/:id')
  @HttpCode(200)
  async supprimerCategorie(@Param('id', ParseUUIDPipe) id: string) {
    await this.taxonomie.supprimerCategorie(id);
    return { supprime: true };
  }

  /* ── Collections ─────────────────────────────────────────────────────── */

  @Get('collections')
  collections() {
    return this.taxonomie.listerCollections();
  }

  @Post('collections')
  creerCollection(@Body(new ZodPipe(creerCollectionSchema)) donnees: CreerCollection) {
    return this.taxonomie.creerCollection(donnees);
  }

  @Patch('collections/:id')
  modifierCollection(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodPipe(modifierCollectionSchema)) donnees: ModifierCollection,
  ) {
    return this.taxonomie.modifierCollection(id, donnees);
  }

  @Delete('collections/:id')
  @HttpCode(200)
  async supprimerCollection(@Param('id', ParseUUIDPipe) id: string) {
    await this.taxonomie.supprimerCollection(id);
    return { supprime: true };
  }
}
