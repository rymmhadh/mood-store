import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categorie } from '../catalogue/entites/categorie.entite';
import { Coloris } from '../catalogue/entites/coloris.entite';
import { Collection } from '../catalogue/entites/collection.entite';
import { Dimension } from '../catalogue/entites/dimension.entite';
import { Matiere } from '../catalogue/entites/matiere.entite';
import { Media } from '../catalogue/entites/media.entite';
import { Produit } from '../catalogue/entites/produit.entite';
import { Revetement } from '../catalogue/entites/revetement.entite';
import { Style } from '../catalogue/entites/style.entite';
import { AmorceService } from './amorce.service';

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
  providers: [AmorceService],
})
export class AmorceModule {}
