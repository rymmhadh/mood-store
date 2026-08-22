import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from '../catalogue/entites/media.entite';
import { MediasControleur } from './medias.controleur';
import { MediasService } from './medias.service';

@Module({
  imports: [TypeOrmModule.forFeature([Media])],
  controllers: [MediasControleur],
  providers: [MediasService],
  exports: [MediasService],
})
export class MediasModule {}
