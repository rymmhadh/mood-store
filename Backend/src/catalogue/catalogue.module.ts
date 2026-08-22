import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributsAdminControleur } from './attributs-admin.controleur';
import { AttributsPublicControleur } from './attributs-public.controleur';
import { AttributsService } from './attributs.service';
import { Categorie } from './entites/categorie.entite';
import { Coloris } from './entites/coloris.entite';
import { Collection } from './entites/collection.entite';
import { Dimension } from './entites/dimension.entite';
import { Matiere } from './entites/matiere.entite';
import { Media } from './entites/media.entite';
import { Produit } from './entites/produit.entite';
import { Revetement } from './entites/revetement.entite';
import { Style } from './entites/style.entite';
import { ProduitsAdminControleur } from './produits-admin.controleur';
import { ProduitsControleur } from './produits.controleur';
import { ProduitsService } from './produits.service';
import { TaxonomieService } from './taxonomie.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Produit,
      Categorie,
      Collection,
      Media,
      Dimension,
      Matiere,
      Style,
      Coloris,
      Revetement,
    ]),
  ],
  controllers: [
    ProduitsControleur,
    ProduitsAdminControleur,
    AttributsAdminControleur,
    AttributsPublicControleur,
  ],
  providers: [ProduitsService, TaxonomieService, AttributsService],
  exports: [ProduitsService, TaxonomieService, AttributsService],
})
export class CatalogueModule {}
