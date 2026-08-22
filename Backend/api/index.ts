import 'reflect-metadata';
import multipart from '@fastify/multipart';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import type { IncomingMessage, ServerResponse } from 'node:http';

/**
 * Point d'entrée serverless (Vercel Functions), distinct de `src/main.ts`
 * (développement local, serveur qui tourne en continu).
 *
 * Importé depuis `dist/`, pas depuis `src/` : le bundler de Vercel pour les
 * fonctions (`@vercel/node`, basé sur esbuild) ne sait pas émettre les
 * métadonnées de décorateur (`emitDecoratorMetadata`) dont Nest a besoin
 * pour résoudre l'injection de dépendances — esbuild transpile sans
 * vérifier les types, et cette émission en dépend. Le compilateur officiel
 * de Nest (`nest build`, lancé par le Build Command du projet Vercel — voir
 * vercel.json / package.json) les émet correctement ; ce fichier se contente
 * donc de démarrer l'application déjà compilée.
 *
 * `require` plutôt qu'un `import` : la cible n'existe qu'après `nest build`
 * (dossier `dist/`, absent avant le premier build), et un `import` statique
 * empêcherait ce fichier lui-même de compiler avant que `dist/` existe.
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { AppModule } = require('../dist/app.module.js');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { TAILLE_MAX } = require('../dist/medias/medias.service.js');

let appPromise: Promise<NestFastifyApplication> | null = null;

async function demarrer(): Promise<NestFastifyApplication> {
  const application = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ bodyLimit: TAILLE_MAX + 1024 * 1024 }),
    { bufferLogs: false },
  );

  const origines = (process.env.ORIGINES_AUTORISEES ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  application.enableCors({
    origin: origines.length > 0 ? origines : false,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  await application.register(multipart, {
    limits: { fileSize: TAILLE_MAX, files: 10 },
  });

  // `init()`, jamais `listen()` : une fonction Vercel ne possède pas de
  // port à écouter, Vercel lui transmet directement chaque requête.
  await application.init();
  return application;
}

/**
 * Une fonction Vercel réutilise volontiers la même instance entre deux
 * requêtes rapprochées (« instance chaude ») : ne reconstruire
 * l'application Nest — et donc la connexion à la base — qu'une fois par
 * instance, pas à chaque requête.
 */
function obtenirApplication(): Promise<NestFastifyApplication> {
  if (!appPromise) appPromise = demarrer();
  return appPromise;
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const application = await obtenirApplication();
  const instance = application.getHttpAdapter().getInstance();
  await instance.ready();
  instance.server.emit('request', req, res);
}
