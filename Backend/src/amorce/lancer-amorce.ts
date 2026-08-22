import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../app.module';
import { AmorceService } from './amorce.service';

/**
 * Amorçage manuel : `npm run amorcer`.
 *
 * Utile pour remplir une base qu'on vient de vider, sans redémarrer l'API.
 * Le service refuse de son côté si des produits existent déjà.
 */
async function lancer() {
  const contexte = await NestFactory.createApplicationContext(AppModule, { logger: ['log', 'error'] });
  await contexte.get(AmorceService).amorcer();
  await contexte.close();
  new Logger('Amorce').log('Terminé.');
}

void lancer();
