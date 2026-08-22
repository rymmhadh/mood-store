import { Controller, Get, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { ProduitsService } from './produits.service';
import { TaxonomieService } from './taxonomie.service';

/**
 * Endpoints publics du catalogue (§22.1).
 *
 * Aucune authentification, aucune donnée de gestion : seules les pièces
 * publiées sortent d'ici.
 */
@Controller('api')
export class ProduitsControleur {
  constructor(
    private readonly produits: ProduitsService,
    private readonly taxonomie: TaxonomieService,
  ) {}

  @Get('categories')
  categories() {
    return this.taxonomie.familles();
  }

  @Get('categories/arbre')
  arbre() {
    return this.taxonomie.arbre();
  }

  @Get('collections')
  collections() {
    return this.taxonomie.listerCollections();
  }

  @Get('produits')
  lister(@Query('famille') famille?: string) {
    return this.produits.listerPubliques(famille);
  }

  @Get('produits/:slug')
  async detail(@Param('slug') slug: string) {
    const produit = await this.produits.trouverPublic(slug);
    if (!produit) throw new NotFoundException('Cette pièce n’est pas disponible.');
    return produit;
  }

  /**
   * Enregistre une consultation de fiche.
   *
   * Appelé par le front après affichage, et non pendant le rendu : une page
   * rendue par le serveur peut l'être pour un robot, pour un préchargement ou
   * pour reconstruire un cache — aucun de ces cas n'est une visite.
   */
  @Post('produits/:slug/vue')
  async vue(@Param('slug') slug: string) {
    await this.produits.incrementerVues(slug);
    return { enregistre: true };
  }
}
