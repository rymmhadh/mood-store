import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContenuAdminControleur } from './contenu-admin.controleur';
import { ContenuPublicControleur } from './contenu-public.controleur';
import { ContenuService } from './contenu.service';
import { MediaAccueil } from './entites/media-accueil.entite';
import { SectionAccueil } from './entites/section-accueil.entite';

@Module({
  imports: [TypeOrmModule.forFeature([SectionAccueil, MediaAccueil])],
  controllers: [ContenuAdminControleur, ContenuPublicControleur],
  providers: [ContenuService],
  exports: [ContenuService],
})
export class ContenuModule {}
