import 'reflect-metadata';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { join } from 'node:path';
import { AppModule } from './app.module';
import { EnveloppeIntercepteur } from './commun/enveloppe.intercepteur';
import { FiltreExceptions } from './commun/filtre-exceptions';
import { TAILLE_MAX } from './medias/medias.service';

async function demarrer() {
  const application = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ bodyLimit: TAILLE_MAX + 1024 * 1024 }),
    { bufferLogs: false },
  );

  const origines = (process.env.ORIGINES_AUTORISEES ?? 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  application.enableCors({
    origin: origines,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  await application.register(multipart, {
    limits: { fileSize: TAILLE_MAX, files: 10 },
  });

  /**
   * Les photographies téléversées sont servies depuis le disque.
   *
   * En production, ce rôle revient à un CDN ou à un stockage objet (§20.1) ;
   * les chemins étant relatifs en base, la bascule ne demandera aucune
   * migration. `immutable` est sûr ici : chaque fichier porte un identifiant
   * unique dans son nom, il n'est jamais remplacé.
   */
  await application.register(fastifyStatic, {
    root: join(process.cwd(), 'media'),
    prefix: '/media/',
    decorateReply: false,
    cacheControl: true,
    maxAge: '365d',
    immutable: true,
  });

  application.useGlobalInterceptors(new EnveloppeIntercepteur());
  application.useGlobalFilters(new FiltreExceptions());

  const port = Number(process.env.PORT ?? 4000);
  await application.listen(port, '0.0.0.0');

  new Logger('Mood Store').log(`API à l’écoute sur http://localhost:${port}`);
}

void demarrer();
